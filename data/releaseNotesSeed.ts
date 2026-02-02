import { DeconstructionResult } from '@/types';

export const releaseNotesSeed: DeconstructionResult = {
  version: 'EOS 4.32.1F (Sample Extract)',
  features: [
    {
      name: 'EVPN Multi-Homing Fast Failover',
      vertical: 'Enterprise / Financial',
      technicalSummary: 'Added enhanced DF election dampening with sub-second convergence on dual-homed server failures; integrates with MLAG health to avoid flaps during BFD churn.',
      businessValue: 'Keeps trading apps available during NIC/ToR faults; fewer session resets and reduced mean-time-to-recover for latency-sensitive workloads.'
    },
    {
      name: 'CloudVision Change Windows',
      vertical: 'Operations',
      technicalSummary: 'Introduced scheduled compliance runs with pre/post snapshots and guardrails; pipeline blocks risky commits based on diff heatmaps.',
      businessValue: 'Cuts change risk and rework during maintenance windows; provides auditable proof of intent vs. outcome for CAB reviews.'
    },
    {
      name: 'VXLAN Anycast Gateway at Scale',
      vertical: 'Campus / Segmentation',
      technicalSummary: 'Optimized ARP suppression with host mobility hints; improved control-plane policing for high churn VNI environments.',
      businessValue: 'Reduces flooding and improves roaming experience for campus/IoT users; lowers bandwidth waste and improves stability during large moves.'
    },
    {
      name: 'Adaptive QoS for AI/ML Fabrics',
      vertical: 'AI/ML',
      technicalSummary: 'Dynamic flow-aware scheduling for RDMA/AI flows; telemetry-driven ECN tuning and lossless lanes per job profile.',
      businessValue: 'Protects model training throughput and reduces stragglers; maximizes GPU utilization without manual QoS retuning each experiment.'
    }
  ]
};
