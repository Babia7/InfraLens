import { describe, it, expect } from 'vitest';
import { calculateStoragePlannerOutput } from '@/services/storagePlannerRules';

describe('storage planner rules', () => {
  it('selects deep buffer class for high oversubscription', () => {
    const output = calculateStoragePlannerOutput({
      designPreset: '2-4-3-200',
      portSpeed: '200G',
      hostCount: 32,
      protocol: 'NVMe-oF RoCE v2',
      oversubscription: '3:1',
      trafficMix: 'Balanced',
      latencyTier: 'Standard',
      redundancy: 'Dual-fabric'
    });

    expect(output.platform.model).toBe('7280R3');
    expect(output.validationFlags.some((flag) => flag.includes('Oversubscription'))).toBe(true);
  });

  it('selects low-latency class for moderate inputs', () => {
    const output = calculateStoragePlannerOutput({
      designPreset: '2-4-3-200',
      portSpeed: '200G',
      hostCount: 16,
      protocol: 'NVMe-TCP',
      oversubscription: '2:1',
      trafficMix: 'Balanced',
      latencyTier: 'Standard',
      redundancy: 'Dual-fabric'
    });

    expect(output.platform.model).toBe('7050X4');
  });

  it('flags mismatch between preset and port speed', () => {
    const output = calculateStoragePlannerOutput({
      designPreset: '2-4-3-200',
      portSpeed: '400G',
      hostCount: 16,
      protocol: 'NVMe-TCP',
      oversubscription: '2:1',
      trafficMix: 'Balanced',
      latencyTier: 'Standard',
      redundancy: 'Dual-fabric'
    });

    expect(output.validationFlags.some((flag) => flag.includes('Preset implies 200G'))).toBe(true);
  });
});
