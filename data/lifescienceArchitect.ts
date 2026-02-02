export type WorkloadId = 'genomics' | 'cryoem' | 'pathology';

export interface WorkloadProfile {
  id: WorkloadId;
  name: string;
  description: string;
  defaults: {
    instruments: number;
    distanceMeters: number;
    interfaceSpeedGbps: 10 | 25 | 100 | 400;
    hoursPerDay: number;
    redundancy: 'single' | 'dual';
  };
  baseGbpsPerInstrument: number;
  burstMultiplier: number;
  notes: string[];
}

export interface OpticRule {
  id: string;
  label: string;
  distanceMaxM: number;
  speeds: (10 | 25 | 100 | 400)[];
  breakout?: string;
}

export interface CalculationResult {
  workload: WorkloadProfile;
  totalGbps: number;
  burstGbps: number;
  recommendsDeepBuffers: boolean;
  optic: OpticRule;
  breakoutNote: string;
}

export const WORKLOADS: WorkloadProfile[] = [
  {
    id: 'genomics',
    name: 'Genomics',
    description: 'Sequencers pushing high-volume, steady flows; bursts when batching reads.',
    defaults: { instruments: 6, distanceMeters: 80, interfaceSpeedGbps: 25, hoursPerDay: 16, redundancy: 'dual' },
    baseGbpsPerInstrument: 1.2,
    burstMultiplier: 1.6,
    notes: ['Steady read pipelines; moderate burst.', 'Prefers dual links for maintenance windows.']
  },
  {
    id: 'cryoem',
    name: 'Cryo-EM',
    description: 'Large imaging payloads with short-term bursts; latency sensitive.',
    defaults: { instruments: 3, distanceMeters: 120, interfaceSpeedGbps: 100, hoursPerDay: 10, redundancy: 'dual' },
    baseGbpsPerInstrument: 8,
    burstMultiplier: 2.0,
    notes: ['Bursty writes; sensitive to jitter.', 'Deep buffers often recommended.']
  },
  {
    id: 'pathology',
    name: 'Digital Pathology',
    description: 'Slide scanners with peak bursts; relies on lossless transport for image integrity.',
    defaults: { instruments: 8, distanceMeters: 60, interfaceSpeedGbps: 25, hoursPerDay: 12, redundancy: 'single' },
    baseGbpsPerInstrument: 0.8,
    burstMultiplier: 1.8,
    notes: ['Spiky during ingest; steady during review.', 'MACsec common for compliance.']
  }
];

export const OPTIC_RULES: OpticRule[] = [
  { id: 'sr', label: 'SR (OM4/MMF)', distanceMaxM: 100, speeds: [10, 25, 100], breakout: '100G → 4x25G' },
  { id: 'dr', label: 'DR (MMF/LWDM)', distanceMaxM: 500, speeds: [100, 400], breakout: '400G → 4x100G (where supported)' },
  { id: 'lr', label: 'LR4 (SMF)', distanceMaxM: 10000, speeds: [25, 100, 400] }
];

export const REFERENCE_LINKS = [
  { title: 'ECN + Deep Buffer Tuning for AI/Imaging', summary: 'Baseline ECN thresholds and deep buffer considerations.' },
  { title: 'MACsec Validation Checklist', summary: 'Throughput, MTU, and latency validation before production enablement.' },
  { title: 'EVPN Segmentation for Clinical & Research', summary: 'Template for isolating regulated vs research workloads with Anycast GW.' }
];

export function calculateResult(
  workload: WorkloadProfile,
  instruments: number,
  distanceMeters: number,
  interfaceSpeedGbps: 10 | 25 | 100 | 400
): CalculationResult {
  const totalGbps = instruments * workload.baseGbpsPerInstrument;
  const burstGbps = totalGbps * workload.burstMultiplier;

  const recommendsDeepBuffers = burstGbps > 10 || workload.id === 'cryoem';

  const optic =
    OPTIC_RULES.find((o) => distanceMeters <= o.distanceMaxM && o.speeds.includes(interfaceSpeedGbps)) ||
    OPTIC_RULES[OPTIC_RULES.length - 1];

  const breakoutNote = optic.breakout
    ? `Safe breakouts: ${optic.breakout}. Ensure optics support breakout on chosen platform.`
    : 'No breakout guidance for this optic.';

  return {
    workload,
    totalGbps: Number(totalGbps.toFixed(2)),
    burstGbps: Number(burstGbps.toFixed(2)),
    recommendsDeepBuffers,
    optic,
    breakoutNote
  };
}
