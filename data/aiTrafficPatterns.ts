// Vault source: 02 Knowledge/AI Infrastructure/Fabric Design/AI Traffic Pattern Atlas for Ethernet GPU Fabrics.md
// Vault source: 04 Synthesis/Frameworks/Congestion Isolation Strategies.md

export type FabricRisk = 'Critical' | 'High' | 'Medium' | 'Low';

export interface AITrafficPattern {
  id: string;
  name: string;
  category: 'Collective' | 'Parallel' | 'Storage' | 'Control';
  description: string;
  whereItShowsUp: string[];
  trafficSignature: string;
  fabricRisks: { risk: string; severity: FabricRisk }[];
  designResponses: {
    loadBalancing: string;
    bufferStrategy: string;
    ecnThresholds: string;
    topologyRequirements: string;
  };
  operationalWatchPoints: string[];
  seNote?: string;
}

export const AI_TRAFFIC_PATTERNS: AITrafficPattern[] = [
  {
    id: 'all-reduce',
    name: 'All-Reduce',
    category: 'Collective',
    description: 'Every GPU exchanges gradients or partial results and computes a combined result — typically a sum or average. This is the dominant pattern in synchronous distributed training.',
    whereItShowsUp: [
      'Data-parallel distributed training',
      'Synchronous gradient synchronization after each training step',
      'NCCL ring-based and tree-based collective operations'
    ],
    trafficSignature: 'Large, repeated, synchronized elephant flows. High east-west traffic across all GPUs simultaneously. Many long-lived flows running in lock-step. Synchronization means one slow path delays the entire job.',
    fabricRisks: [
      { risk: 'ECMP elephant-flow collisions on spine links', severity: 'Critical' },
      { risk: 'Persistent queue buildup on congested spine paths', severity: 'High' },
      { risk: 'PFC pause propagation if ECN thresholds are too high', severity: 'High' },
      { risk: 'Job completion time (JCT) sensitivity as GPU count scales', severity: 'High' }
    ],
    designResponses: {
      loadBalancing: 'DLB (Dynamic Load Balancing) on Strata leaf ASICs. CLB on spine with multi-agent routing for cross-spine balancing. ECMP alone is insufficient for synchronized elephant flows.',
      bufferStrategy: 'Deep shared buffer critical. Absorb synchronized bursts without triggering PFC at first queue pressure. Buffer = buying time for ECN to signal senders before backpressure propagates.',
      ecnThresholds: 'ECN mark early (20-30% of queue depth). DCQCN endpoint rate adaptation reduces flow rate before PFC is needed. PFC as last-resort backstop — not primary congestion response.',
      topologyRequirements: 'Low or no oversubscription (target 1:1). Clean leaf-spine symmetry. Rail alignment to keep intra-pod AllReduce within same leaf. High radix to reduce hop count and spine contention.'
    },
    operationalWatchPoints: [
      'Uneven uplink utilization across leaves and spines (ECMP collision indicator)',
      'ECN marking rates per-port (should be present but not saturating)',
      'PFC PAUSE frame counters (should be near-zero in well-tuned fabric)',
      'Queue occupancy via LANZ (sub-microsecond resolution)',
      'JCT degradation as GPU count increases (scaling efficiency metric)'
    ],
    seNote: 'If a customer reports scaling efficiency collapse when a job grows from a few hundred to a thousand-plus GPUs, All-Reduce pressure and ECMP elephant-flow collisions are the first suspects.'
  },
  {
    id: 'all-gather',
    name: 'All-Gather',
    category: 'Collective',
    description: 'Each participant receives data from every other participant. Common in tensor parallelism and model state sharing between GPU groups.',
    whereItShowsUp: [
      'Tensor parallelism — intermediate activation sharing',
      'Model state distribution',
      'Attention weight aggregation in transformer models'
    ],
    trafficSignature: 'Fan-in and fan-out behavior. Many simultaneous medium-to-large flows. Bursty but structured cluster-wide participation. Aggregation points see sudden pressure.',
    fabricRisks: [
      { risk: 'Queue pressure on aggregation points — short incast windows', severity: 'High' },
      { risk: 'Microburst-driven buffer pressure at fan-in points', severity: 'Medium' },
      { risk: 'Uneven utilization if topology awareness is weak', severity: 'Medium' }
    ],
    designResponses: {
      loadBalancing: 'Balanced Clos design with good fan-out symmetry. DLB helps but the burst duration is shorter than All-Reduce — ECMP with good hash entropy may suffice for smaller jobs.',
      bufferStrategy: 'Buffer headroom for short-burst absorption is key. Shallow-buffer switches show microburst-induced drops even at low average utilization.',
      ecnThresholds: 'ECN should trigger on burst events — mark early enough to prevent buffer overflow during fan-in peak.',
      topologyRequirements: 'Balanced Clos topology. Good workload placement to minimize fan-in concentration points.'
    },
    operationalWatchPoints: [
      'Short queue spikes (LANZ captures sub-millisecond events)',
      'Microburst evidence at aggregation leaves',
      'Temporary ECN spikes without sustained congestion (healthy sign — ECN working)'
    ],
    seNote: 'All-Gather is not as continuously brutal as All-Reduce, but it still punishes shallow-buffer, poorly balanced fabrics through burst-driven drops.'
  },
  {
    id: 'all-to-all',
    name: 'All-to-All / MoE Expert Routing',
    category: 'Collective',
    description: 'Every GPU exchanges data with every other GPU. The most stressful AI traffic pattern. Dominant in Mixture-of-Experts (MoE) workloads where tokens are routed to expert subsets dynamically.',
    whereItShowsUp: [
      'Mixture-of-Experts (MoE) training — expert routing phases',
      'Large-scale model sharding with expert parallelism',
      'Full mesh collective operations'
    ],
    trafficSignature: 'Full-mesh communication — simultaneous many-to-many transfers. Extreme fan-out and fan-in at every switch. Dynamic, unpredictable hot spots driven by token routing. One of the most entropy-maximizing traffic patterns in AI.',
    fabricRisks: [
      { risk: 'Severe microbursts across the entire fabric simultaneously', severity: 'Critical' },
      { risk: 'Head-of-line blocking and congestion spreading beyond origin point', severity: 'Critical' },
      { risk: 'Poor path utilization with static ECMP alone', severity: 'High' },
      { risk: 'Scaling efficiency drop with MoE workload growth', severity: 'High' }
    ],
    designResponses: {
      loadBalancing: 'DLB or adaptive routing is strongly recommended — static flow pinning fails badly under MoE entropy. CLB on spine required for cross-spine balancing.',
      bufferStrategy: 'Near-1:1 design. Deep shared buffer. MoE creates simultaneous pressure across many fabric points — no oversubscription tolerance.',
      ecnThresholds: 'Aggressive ECN marking. DCQCN endpoint adaptation critical. PFC watchdog mandatory to prevent deadlock.',
      topologyRequirements: 'High-radix flat fabric. Near 1:1 oversubscription. Strong ECN and rate adaptation. Topology-aware job placement to reduce cross-pod MoE traffic.'
    },
    operationalWatchPoints: [
      'Fabric-wide queue volatility (not localized — everywhere simultaneously)',
      'Broad ECN marking across many links (not just a few hot links)',
      'Outlier latency under load — scaling efficiency with MoE job count',
      'Sharp drop in scaling efficiency versus data-parallel baseline at same GPU count'
    ],
    seNote: 'If the customer is moving toward MoE, the conversation must shift from bandwidth to fabric behavior under synchronized entropy. "Enough bandwidth" is the wrong frame — MoE is a traffic-behavior problem.'
  },
  {
    id: 'tensor-parallelism',
    name: 'Tensor Parallelism',
    category: 'Parallel',
    description: 'The model is split across multiple GPUs. These GPUs must constantly exchange intermediate activations, making the fabric feel much closer to the compute path than in data parallelism.',
    whereItShowsUp: [
      'Large model training where single GPU cannot hold the model',
      'Tightly coupled model sharding across multiple GPUs',
      'Attention layer splitting in large transformer models'
    ],
    trafficSignature: 'Frequent, fine-grained exchanges. Latency-sensitive east-west communication. More chatty than pure data parallelism. Poor topology alignment is costly per step.',
    fabricRisks: [
      { risk: 'Tail-latency impact from any path asymmetry', severity: 'High' },
      { risk: 'Hop-count sensitivity — every additional hop adds step-time cost', severity: 'High' },
      { risk: 'Localized congestion causing widespread stall behavior', severity: 'Medium' }
    ],
    designResponses: {
      loadBalancing: 'Locality-aware placement to keep tensor-parallel GPUs on the same leaf or adjacent leaves. Lower hop count is more important than load balancing across spines.',
      bufferStrategy: 'Buffer requirements are lower per-flow but latency sensitivity is high — deep buffer is less critical than low hop count and predictable latency.',
      ecnThresholds: 'Standard ECN tuning. The key is latency predictability, not burst absorption.',
      topologyRequirements: 'Lower hop count — 2-tier preferred. Rail optimization to keep tensor-parallel groups on same leaf. Predictable path performance across the pod.'
    },
    operationalWatchPoints: [
      'Long-tail latency rather than low average throughput (the key metric)',
      'Higher sensitivity to small path asymmetries than data-parallel jobs',
      'Step-time growth with tensor-parallel group size increase'
    ],
    seNote: 'Tensor parallelism makes the network feel much closer to the compute path than teams expect. The customer may think they have a compute problem when the root cause is hop-count or path asymmetry.'
  },
  {
    id: 'pipeline-parallelism',
    name: 'Pipeline Parallelism',
    category: 'Parallel',
    description: 'Different model stages are distributed across different GPU groups. Traffic flows sequentially between stages rather than all-to-all. Stage boundaries are potential chokepoints.',
    whereItShowsUp: [
      'Very large model training with stage-oriented partitioning',
      'GPT-style models split across multiple nodes by layer group'
    ],
    trafficSignature: 'More sequential stage-to-stage flows. Less fully meshed behavior than All-to-All. Directional traffic corridors between stage groups. Skew between stages creates uneven load.',
    fabricRisks: [
      { risk: 'Persistent directional hot links between stage boundaries', severity: 'Medium' },
      { risk: 'Traffic imbalance by stage locality', severity: 'Medium' }
    ],
    designResponses: {
      loadBalancing: 'Topology-aware workload placement to map stages to locality domains. Balanced fabric tiers to avoid stage-boundary hot links.',
      bufferStrategy: 'Standard buffer sizing — no deep-buffer requirement specific to pipeline patterns.',
      ecnThresholds: 'Standard ECN at stage boundaries.',
      topologyRequirements: 'Topology-aware placement of stage groups. Stage boundaries should land on different leaves to distribute inter-stage traffic.'
    },
    operationalWatchPoints: [
      'Hot links persisting in one direction (stage-to-stage)',
      'Latency or loss concentrated at specific stage boundaries',
      'Bubble latency from pipeline stalls (not always a network problem)'
    ]
  },
  {
    id: 'checkpointing',
    name: 'Checkpointing',
    category: 'Storage',
    description: 'Periodic saving of model state during training. Creates episodic, intense traffic bursts toward storage — often overlapping with active training communication. Front-end and back-end fabric separation becomes critical.',
    whereItShowsUp: [
      'Long-running training jobs (required for recovery)',
      'Production training environments with fault tolerance requirements'
    ],
    trafficSignature: 'Strong north-south or east-west-to-storage bursts. Large but episodic traffic events. Checkpoint timing aligns with training step boundaries — regular periodicity.',
    fabricRisks: [
      { risk: 'Training fabric interference if storage is not isolated', severity: 'High' },
      { risk: 'Storage head-end contention during checkpoint windows', severity: 'High' },
      { risk: 'Training JCT jitter during checkpoint periods', severity: 'Medium' }
    ],
    designResponses: {
      loadBalancing: 'Not a load balancing problem — a separation problem. Storage fabric must be isolated from training fabric.',
      bufferStrategy: 'Deep buffer required on storage-facing paths for checkpoint burst absorption. Checkpoint bursts are large (full model state) and sudden.',
      ecnThresholds: 'ECN on storage paths to signal WEKA/NFS clients to back off during congestion.',
      topologyRequirements: 'Clear front-end (storage-to-compute) and back-end (GPU-to-GPU) fabric separation. Either physical separation or VRF + QoS queue isolation.'
    },
    operationalWatchPoints: [
      'Recurring spikes toward storage endpoints aligned with training step timing',
      'Training JCT jitter that correlates with checkpoint intervals',
      'Storage-path congestion indicators separate from training-fabric indicators'
    ],
    seNote: 'The customer may not realize their checkpoint schedule is causing training instability. Correlate checkpoint timing with JCT variance before blaming the training fabric.'
  },
  {
    id: 'dataset-ingest',
    name: 'Dataset Ingest / Data Loading',
    category: 'Storage',
    description: 'Moving training data into compute nodes. The hidden bottleneck — GPUs can be idle even when the training fabric is healthy, simply because the data pipeline cannot feed them fast enough.',
    whereItShowsUp: [
      'Startup and warm-up phases of training jobs',
      'Steady-state data feeding for large training jobs with random access'
    ],
    trafficSignature: 'Typically north-south or storage-to-compute traffic. Steady-state or bursty depending on caching and prefetching strategy. CPU-heavy on the data-loading host side.',
    fabricRisks: [
      { risk: 'GPU utilization starvation — idle GPUs waiting for data', severity: 'High' },
      { risk: 'Front-end storage congestion while training fabric shows green', severity: 'High' }
    ],
    designResponses: {
      loadBalancing: 'Strong front-end storage connectivity. Dedicated paths or VRF separation from training traffic.',
      bufferStrategy: 'Standard for storage paths. Caching and prefetching discipline reduces bursty demand.',
      ecnThresholds: 'Standard ECN on storage paths.',
      topologyRequirements: 'Strong front-end storage connectivity. Caching and prefetching close to compute reduces cross-fabric demand.'
    },
    operationalWatchPoints: [
      'Low GPU utilization with healthy backend training fabric counters',
      'Storage-side hot spots without corresponding training-fabric congestion',
      'CPU saturation on data-loading nodes (not a network problem)'
    ],
    seNote: 'Sometimes GPU underutilization is not a back-end fabric problem. It is a data-pipeline problem. Always check dataset ingest rate and GPU idle time before diagnosing the training fabric.'
  }
];
