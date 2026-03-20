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
  },
  vxlan_failover: {
    scenario: 'VXLAN Tunnel Failover',
    legacyImpact: 'Legacy VTEP implementations flush tunnel state on underlay failure, forcing full MAC/IP re-convergence. Hosts experience multi-second traffic loss while EVPN RT-2 routes are re-advertised and VXLAN tunnels re-established across all VTEPs.',
    aristaResilience: 'EOS preserves VTEP state via SysDB during underlay events. BGP Graceful Restart maintains EVPN routes while the underlay reconverges; VXLAN tunnel re-establishment is state-driven rather than flush-and-relearn. CloudVision replays the exact VTEP state timeline for forensics.',
    businessMetric: 'Cuts VXLAN failover from multi-second MAC re-convergence to sub-second state restoration. Critical for latency-sensitive workloads running over EVPN-VXLAN fabrics.',
    executiveSummary: 'VXLAN tunnel failures on EOS are state-restoration events, not full re-convergence events. SysDB preserves the overlay state during underlay disruption, eliminating the MAC flush-and-relearn cycle.',
    bulletPoints: [
      'SysDB-aware VTEP: tunnel state survives underlay flap without full EVPN withdrawal.',
      'BGP Graceful Restart keeps EVPN RT-2/RT-5 routes valid during reconvergence window.',
      'CloudVision timeline replay shows exact VTEP state changes for post-incident forensics.'
    ]
  },
  bgp_convergence_load: {
    scenario: 'Underlay BGP Convergence Under Load',
    legacyImpact: 'Under high traffic load, monolithic BGP daemons on legacy platforms compete with forwarding for CPU cycles. BGP session timers can expire during heavy traffic, causing false session resets that trigger route withdrawals, ECMP path loss, and fabric-wide churn — all while the link is physically up.',
    aristaResilience: 'EOS isolates the BGP agent in SysDB; forwarding CPU is separated from control-plane CPU. BFD operates at hardware speed, independent of BGP process load. Streaming telemetry via CloudVision detects ECMP asymmetry in real-time rather than waiting for counter polling cycles.',
    businessMetric: 'Eliminates false BGP session resets caused by control-plane CPU contention. Preserves ECMP path symmetry under live load — critical for AI fabric stability during active training jobs.',
    executiveSummary: 'BGP convergence on EOS is process-isolated. Control-plane events do not compete with forwarding under load, and ECMP asymmetry is detectable via streaming telemetry before it impacts application behavior.',
    bulletPoints: [
      'BGP agent runs in isolated SysDB process — no CPU competition with forwarding ASIC.',
      'BFD runs at hardware rate; session detection is not affected by software load.',
      'CloudVision streaming telemetry detects ECMP asymmetry in real time, not at poll intervals.'
    ]
  },
  cpu_saturation: {
    scenario: 'Control-Plane CPU Saturation',
    legacyImpact: 'Monolithic OSPF or BGP daemons can saturate the control-plane CPU during route churn, flooding events, or misconfiguration-triggered SPF storms. A saturated control-plane delays or drops protocol hellos, causing cascading adjacency resets that spread the churn to adjacent devices.',
    aristaResilience: 'EOS multi-agent architecture isolates each protocol into its own SysDB-connected process with configurable resource ceilings. A misbehaving OSPF agent cannot starve the BGP agent or the forwarding subsystem. CoPP (Control-Plane Policing) limits rate of exception traffic reaching the CPU. CloudVision detects CPU pressure trends before adjacency loss occurs.',
    businessMetric: 'Contains CPU saturation events to a single protocol agent, preventing cascade across the fabric. Reduces NOC escalations from "the switch is dead" to "one protocol agent was restarted."',
    executiveSummary: 'CPU saturation on EOS is contained by process isolation. The forwarding plane and unaffected protocol agents continue operating while the saturated agent is isolated, rate-limited, or restarted.',
    bulletPoints: [
      'Per-agent resource ceilings prevent one protocol from starving others (CoPP + process isolation).',
      'SysDB preserves state during agent restart — adjacencies rehydrate without full re-convergence.',
      'CloudVision CPU trend streaming detects saturation before adjacency timers expire.'
    ]
  },
  ai_congestion_collapse: {
    scenario: 'AI Fabric Congestion Collapse',
    legacyImpact: 'Legacy fabric designs without per-queue PFC containment propagate congestion backwards across the fabric. A single RoCE flow causing queue buildup on a spine link triggers PFC PAUSE frames that block all traffic in that priority class across the entire fabric — including unrelated storage and management traffic. Training job throughput collapses to near-zero while recovery takes minutes.',
    aristaResilience: 'Arista per-queue PFC containment limits pause propagation to the affected queue and port. ECN marks packets before queue overflow, enabling endpoint rate adaptation before PFC is triggered. LANZ provides sub-microsecond queue telemetry that identifies congestion origin before spread. DLB redirects flows away from congested paths in near-real-time.',
    businessMetric: 'Prevents PFC pause storms from collapsing entire AI training jobs. Reduces congestion events from job-halting minutes to sub-second queue recovery. LANZ forensics identify root-cause without requiring traffic replay.',
    executiveSummary: 'AI fabric congestion on Arista is contained, observable, and recoverable. Per-queue PFC isolation, ECN early warning, LANZ sub-microsecond telemetry, and DLB path adaptation operate as a coordinated system — not independent features.',
    bulletPoints: [
      'Per-queue PFC: pause propagation contained to the originating queue class, not the entire priority domain.',
      'ECN + DCQCN: endpoint rate adaptation begins before buffer overflow, reducing PFC reliance.',
      'LANZ forensics: sub-microsecond queue-depth recording identifies congestion origin and spread path.'
    ]
  }
};
