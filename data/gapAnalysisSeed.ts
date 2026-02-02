import { GapAnalysisResult } from '@/types';

export const GAP_ANALYSIS_SEED: Record<string, GapAnalysisResult> = {
  upgrade: {
    scenario: 'Hitless ISSU binary swap',
    legacyImpact: 'Monolithic control-plane restart drains forwarding tables; convergence stalls during software swap. Manual rollback required if drift occurs.',
    aristaResilience: 'SysDB keeps forwarding state while agents restart; CloudVision pre/post snapshots plus auto-rollback guard change windows.',
    businessMetric: 'Reduces MTTR from hours to minutes; protects revenue during maintenance with controlled blast radius.',
    executiveSummary: 'Arista treats upgrades as rehearsed, reversible operations. State is preserved in SysDB, and change control enforces preflight, approval, and rollback.',
    bulletPoints: [
      'Preflight: MTU/underlay reachability, BGP/EVPN health, and resource headroom validated before ISSU.',
      'During swap: Forwarding plane pinned; agents restart against SysDB to avoid table flush.',
      'Recovery: Auto-rollback if KPIs regress; CV snapshots provide audit evidence.'
    ]
  },
  restart: {
    scenario: 'BGP Process Restart',
    legacyImpact: 'Process crash flushes adjacencies and routes; triggers route churn and micro-loops until reconvergence.',
    aristaResilience: 'Multi-agent + SysDB preserve RIB/FIB state. BGP restarts in place; dataplane and adjacencies rehydrate without traffic loss.',
    businessMetric: 'Cuts outage time from minutes to sub-second impact; fewer tickets and SLA credits.',
    executiveSummary: 'Control-plane restarts are treated as localized events. SysDB preserves state and prevents full fabric churn.',
    bulletPoints: [
      'State preserved: RIB/FIB remain programmed; peers re-establish without clearing hardware.',
      'Telemetry replay: CVaaS shows route stability before/after restart for auditability.',
      'Guardrails: CoPP and process isolation prevent cascades from a single crash.'
    ]
  },
  memory: {
    scenario: 'Management Memory Leak',
    legacyImpact: 'Runaway process consumes memory and starves control-plane, leading to sluggish CLI/API and eventual protocol drops.',
    aristaResilience: 'Process isolation with resource limits; leak contained to the offending agent while SysDB + dataplane continue forwarding.',
    businessMetric: 'Prevents brownouts and keeps automation responsive; avoids reactive reloads.',
    executiveSummary: 'Resource leaks are sandboxed. Infra continues to forward while the bad actor is restarted or throttled.',
    bulletPoints: [
      'Memory ceilings per agent; alerts before service impact.',
      'Hitless restart of the leaking agent; forwarding untouched.',
      'Forensics via CV snapshots + core capture without downtime.'
    ]
  },
  race: {
    scenario: 'Route Converge Race',
    legacyImpact: 'Uneven convergence causes transient blackholes/loops during failure or re-homing; hard to prove after the fact.',
    aristaResilience: 'Deterministic ECMP with EVPN/underlay symmetry; fast BFD + hold timers tuned. Snapshots and path-trace validate convergence.',
    businessMetric: 'Reduces post-change incidents and escalations; preserves application SLOs.',
    executiveSummary: 'Convergence is engineered and observable. BFD + symmetrical hashing plus replayable telemetry prove stability.',
    bulletPoints: [
      'BFD and hold timers harmonized for spine/leaf; avoids flaps.',
      'Path-trace + CV telemetry replay to prove symmetry and timing.',
      'CoPP profiles guard control-plane during churn.'
    ]
  }
};
