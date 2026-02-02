export type DesignPreset = '2-4-3-200' | '2-8-5-200' | '2-8-9-400';
export type PortSpeed = '200G' | '400G';
export type Oversubscription = '1:1' | '2:1' | '3:1';
export type TrafficMix = 'E-W heavy' | 'N-S heavy' | 'Balanced';
export type LatencyTier = 'Standard' | 'Ultra-low';
export type Redundancy = 'Dual-fabric' | 'Single-fabric';

export interface StoragePlannerInputs {
  designPreset: DesignPreset;
  portSpeed: PortSpeed;
  hostCount: number;
  protocol: string;
  oversubscription: Oversubscription;
  trafficMix: TrafficMix;
  latencyTier: LatencyTier;
  redundancy: Redundancy;
}

export interface StoragePlannerOutput {
  topology: string;
  platform: {
    model: string;
    rationale: string;
  };
  portPlan: {
    suCount: number;
    portSpeedGb: number;
    hostPortsPerNode: number;
    perHostBandwidthGb: number;
    totalHostBandwidthGb: number;
    leafPortsRequired: number;
    spineUplinksRequired: number;
    oversubscription: Oversubscription;
  };
  fabricSplit: string;
  losslessProfile: {
    pfc: string;
    ecn: string;
    mtu: string;
  };
  validationFlags: string[];
}

const presetBandwidthGb = (preset: DesignPreset) => {
  const parts = preset.split('-');
  return Number(parts[3]) || 200;
};

const oversubFactor = (oversubscription: Oversubscription) => {
  const left = oversubscription.split(':')[0];
  return Number(left) || 1;
};

const isRoce = (protocol: string) => protocol.toLowerCase().includes('roce');

export const calculateStoragePlannerOutput = (inputs: StoragePlannerInputs): StoragePlannerOutput => {
  const {
    designPreset,
    portSpeed,
    hostCount,
    protocol,
    oversubscription,
    trafficMix,
    latencyTier,
    redundancy
  } = inputs;

  const presetGb = presetBandwidthGb(designPreset);
  const portSpeedGb = portSpeed === '400G' ? 400 : 200;
  const suCount = Math.max(1, Math.ceil(hostCount / 4));
  const basePortsPerNode = redundancy === 'Dual-fabric' ? 2 : 1;
  const hostPortsPerNode = portSpeed === '200G' && latencyTier === 'Ultra-low' ? Math.max(2, basePortsPerNode) : basePortsPerNode;
  const perHostBandwidthGb = portSpeedGb * hostPortsPerNode;
  const totalHostBandwidthGb = perHostBandwidthGb * hostCount;
  const leafPortsRequired = hostCount * hostPortsPerNode;
  const uplinkFactor = oversubFactor(oversubscription);
  const spineUplinksRequired = Math.max(1, Math.ceil(leafPortsRequired / uplinkFactor));

  const deepBufferNeeded = uplinkFactor > 2 || trafficMix === 'N-S heavy' || latencyTier === 'Ultra-low';
  const platformModel = deepBufferNeeded ? '7280R3' : '7050X4';
  const platformRationale = deepBufferNeeded
    ? 'Deep buffer class recommended for higher oversubscription, bursty N-S patterns, or ultra-low latency targets.'
    : 'Low-latency class recommended for predictable flows and moderate oversubscription.';

  const topology = redundancy === 'Dual-fabric' ? 'Dual-leaf + spine' : 'Leaf-spine';
  const fabricSplit = trafficMix === 'Balanced'
    ? 'Balance E-W and N-S capacity; keep storage traffic mapped to the N-S profile.'
    : trafficMix === 'E-W heavy'
      ? 'Prioritize E-W bandwidth for compute-to-compute traffic; reserve N-S for storage ingress.'
      : 'Prioritize N-S bandwidth for storage and client traffic; keep E-W lean.';

  const losslessProfile = isRoce(protocol)
    ? {
        pfc: 'Enable PFC on storage traffic class.',
        ecn: 'Enable ECN with conservative thresholds for RoCE.',
        mtu: 'Set MTU 9000 end-to-end for lossless flows.'
      }
    : {
        pfc: 'PFC not required by default; evaluate only if congestion persists.',
        ecn: 'Enable ECN for congestion control.',
        mtu: 'Align MTU across hosts and switches (9000 preferred).'
      };

  const validationFlags: string[] = [];
  if (uplinkFactor > 2) {
    validationFlags.push('Oversubscription > 2:1; deep buffer recommended.');
  }
  if (presetGb !== portSpeedGb) {
    validationFlags.push(`Preset implies ${presetGb}G per host; confirm port speed choice.`);
  }
  if (trafficMix === 'N-S heavy' && redundancy === 'Single-fabric') {
    validationFlags.push('N-S heavy traffic on single fabric may reduce availability.');
  }
  if (hostPortsPerNode > 1 && redundancy === 'Single-fabric') {
    validationFlags.push('Multiple host ports on single fabric require LACP or host bonding validation.');
  }

  return {
    topology,
    platform: {
      model: platformModel,
      rationale: platformRationale
    },
    portPlan: {
      suCount,
      portSpeedGb,
      hostPortsPerNode,
      perHostBandwidthGb,
      totalHostBandwidthGb,
      leafPortsRequired,
      spineUplinksRequired,
      oversubscription
    },
    fabricSplit,
    losslessProfile,
    validationFlags
  };
};
