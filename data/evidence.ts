export type EvidenceItem = {
  id: string;
  title: string;
  command: string;
  why: string;
  tags?: string[];
};

export const EVIDENCE_LOCKER: EvidenceItem[] = [
  {
    id: 'cv-snapshot',
    title: 'CloudVision Snapshot',
    command: 'cv-cli snapshots create --fabric prod --paths spine,leaf --label "exec-proof"',
    why: 'Creates immutable state for audit/rollback. Use in demos to prove change safety.',
    tags: ['Navigator', 'Narrative', 'Protocol', 'MTTR']
  },
  {
    id: 'path-trace',
    title: 'Path Trace',
    command: 'tools/pathtrace.sh --vrf secure --dest 10.1.10.10 --report',
    why: 'Shows deterministic path and symmetry; great for proving non-blocking fabrics.',
    tags: ['Navigator', 'Protocol', 'Narrative', 'MTTR']
  },
  {
    id: 'vxlan-pcap',
    title: 'VXLAN Capture',
    command: 'ip netns exec Prod tcpdump -i vxlan1 -nn udp port 4789 -c 50 -w vxlan.pcap',
    why: 'Capture encapsulation proof for VXLAN/EVPN labs; reuse in demos.',
    tags: ['Protocol']
  },
  {
    id: 'cv-change-export',
    title: 'Change Control Export',
    command: 'cv-cli change-control export --plan weekend-upgrade --format pdf',
    why: 'Produces a PDF artifact to show change governance and rollback plans.',
    tags: ['Navigator', 'Narrative', 'MTTR']
  },
  {
    id: 'issu-sim',
    title: 'ISSU Simulation',
    command: 'cv-cli change-control simulate --plan issu-quarterly',
    why: 'Demonstrates upgrade rehearsal and blast-radius control.',
    tags: ['Narrative', 'Navigator', 'MTTR']
  },
  {
    id: 'sysdb-restart-demo',
    title: 'SysDB Restart Demo',
    command: 'FastCli -p 15 -c \"enable; bash sudo systemctl restart lldpd && sleep 5 && show system processes cpu\"',
    why: 'Shows process restart without forwarding interruption; ties MTTR story to observable recovery.',
    tags: ['MTTR', 'Narrative']
  },
  {
    id: 'telemetry-healthcheck',
    title: 'Post-Change Telemetry Check',
    command: 'cv-cli telemetry verify --fabric prod --checks bgp,mlag,lag --window 5m',
    why: 'Provides pre/post validation to prove recovery completeness and blast radius containment.',
    tags: ['MTTR', 'Navigator']
  },
  {
    id: 'pacs-change-window',
    title: 'PACS/Clinical Snapshot',
    command: 'cv-cli snapshots create --fabric clinical --paths leaf,spine --label "pacs-change"',
    why: 'Audit evidence for Life Sciences change windows; proves state before/after clinical changes.',
    tags: ['Life Sciences', 'MTTR']
  },
  {
    id: 'macsec-validation',
    title: 'MACsec Validation',
    command: 'bash macsec-validate.sh --interface Ethernet1 --expected-throughput 9.5g --mtu-check',
    why: 'Validates MACsec performance/headroom for regulated pipelines (clinical/genomics).',
    tags: ['Life Sciences']
  },
  {
    id: 'imaging-burst-test',
    title: 'Imaging Burst Test',
    command: 'iperf3 -c imaging-host -u -b 2G -t 30 --get-server-output',
    why: 'Proves deep-buffer handling for imaging/genomics bursts in Life Sciences.',
    tags: ['Life Sciences', 'Protocol']
  }
];
