import { Terminal, FileText, HardDrive, Network, Code, ShieldCheck, Activity, Cpu, Search } from 'lucide-react';

export type LinuxDomain = 'foundations' | 'filesystem' | 'networking' | 'automation' | 'hardening' | 'reference';

export interface LinuxCommand {
  title: string;
  snippet: string;
  why: string;
  insight: string;
  pitfalls?: string;
  links?: { label: string; url: string }[];
}

export interface LinuxCard {
  id: string;
  title: string;
  domain: LinuxDomain;
  summary: string;
  icon: any;
  tags: string[];
  modes: Array<'reference' | 'guided' | 'scenario'>;
  commands: LinuxCommand[];
  quiz?: { question: string; options: string[]; answer: string };
}

export interface LinuxTrack {
  id: string;
  label: string;
  description: string;
  steps: string[]; // card ids
}

export interface LinuxScenario {
  id: string;
  title: string;
  description: string;
  cards: string[]; // card ids
  outcome: string;
}

export const LINUX_CARDS: LinuxCard[] = [
  {
    id: 'bash-intro',
    title: 'The Linux Entrypoint',
    domain: 'foundations',
    summary: 'Drop to bash, map agents, and get comfortable with EOS as Linux.',
    icon: Terminal,
    tags: ['bash', 'processes', 'shell'],
    modes: ['reference', 'guided'],
    commands: [
      {
        title: 'Bash Access',
        snippet: 'bash\n# Elevate to root inside bash:\nsudo bash\n# Return to EOS CLI:\nexit',
        why: 'EOS is Fedora-based; bash exposes GNU tools and the real filesystem.',
        insight: 'Enter bash with `bash`, then elevate with `sudo bash` for root-level diagnostics. Use `sudo -l` to check available commands. Apply least-privilege—avoid staying as root.'
      },
      {
        title: 'Process Management',
        snippet: 'ps aux | grep -i bgp\nps aux --sort=-%cpu | head -20',
        why: 'Each EOS agent is a Linux process supervised by ProcMgr; seeing them helps with hitless restarts.',
        insight: 'SysDB lets agents restart without dropping data-plane state. Use `show processes` from EOS CLI for a structured view.'
      }
    ],
    quiz: {
      question: 'Why drop to bash on EOS?',
      options: [
        'To bypass the routing engine',
        'To access GNU tools and see EOS agents as Linux processes',
        'To disable EOS services'
      ],
      answer: 'To access GNU tools and see EOS agents as Linux processes'
    }
  },
  {
    id: 'cheatsheet',
    title: 'Operator Cheatsheet',
    domain: 'reference',
    summary: 'Rapid-fire commands for search, system, network, storage, shortcuts.',
    icon: FileText,
    tags: ['search', 'logs', 'process', 'networking'],
    modes: ['reference', 'guided'],
    commands: [
      {
        title: 'Search & Navigation',
        snippet: `find /mnt/flash -name "*.swi"\ngrep -r "error" /var/log/agents\nwhich FastCli\nwhereis python3\nawk '/Error/ {print $1}' log\nsed 's/foo/bar/g' config.txt`,
        why: 'Locate images/configs/logs fast; avoid manual traversal.',
        insight: 'Use `grep -C 5` for context around errors. `grep -i` for case-insensitive searches in logs.'
      },
      {
        title: 'System & Process',
        snippet: `ps aux --sort=-%mem | head\ntop -b -n 1 | head -n 20\nlsof -i :443\nkill -9 <PID>\nfree -h\nlscpu\nuptime`,
        why: 'Check load, memory, and ports when CLI feels slow.',
        insight: 'Avoid `kill -9` on EOS agents unless TAC instructs. Use `FastCli -p 15 -c "agent <name> graceful-restart"` instead.'
      },
      {
        title: 'Network & Transfer',
        snippet: `ip -d link show et1\ntcpdump -i et1 -w capture.pcap\nss -tlnp\ncurl -O http://repo/image.swi\nscp user@host:/path/file .\ndig +short arista.com\nip route show`,
        why: 'Kernel-level view of interfaces and sockets; move files faster than `copy`.',
        insight: 'Prefer `ss -tlnp` over `netstat` on modern Fedora-based EOS. Use `ip netns exec <vrf> ss -tlnp` for per-VRF listener check.'
      },
      {
        title: 'File & Storage',
        snippet: `df -h /mnt/flash\ndu -sh /var/log/*\ntar -czvf logs.tar.gz /var/log\nchmod 755 script.py\nchown admin:root file\ntail -f /var/log/messages`,
        why: 'Flash is limited—find and offload large cores/pcaps before upgrades.',
        insight: 'Always clean `/mnt/flash` pre-ISSU; offload old logs and coredumps from `/mnt/flash/cores/`.'
      },
      {
        title: 'Shell & Shortcuts',
        snippet: `Ctrl+R\nCtrl+A / Ctrl+E\nCtrl+W\n!!\n!$\nhistory | grep "ip"\nwatch -n 1 "FastCli -p 15 -c 'show int status'"`,
        why: 'Speed up CLI usage and live monitoring.',
        insight: 'Combine `watch` + `FastCli` for real-time interface dashboards without leaving bash.'
      }
    ]
  },
  {
    id: 'filesystem',
    title: 'Filesystem Topology',
    domain: 'filesystem',
    summary: 'Persistent vs volatile storage; extensions and flash hygiene.',
    icon: HardDrive,
    tags: ['flash', 'extensions', 'storage'],
    modes: ['reference', 'guided', 'scenario'],
    commands: [
      {
        title: 'Persistence Layer',
        snippet: `ls -al /mnt/flash\n# Key locations:\n# /mnt/flash/startup-config\n# /mnt/flash/*.swi  (EOS images)\n# /mnt/flash/extensions/\n# /mnt/flash/schedule/\n# /mnt/flash/cores/  (coredumps)`,
        why: 'Find configs, images, extensions; know what survives reboot.',
        insight: 'Work in /mnt/flash for persistence; /tmp and /var/volatile are cleared on reboot. EOS images (.swi) and startup-config are the critical survivors.'
      },
      {
        title: 'Extensions & Schedules',
        snippet: `ls /mnt/flash/schedule/\nls /mnt/flash/extensions/\n# Install an extension (SWIX):\nFastCli -p 15 -c "copy http://repo/tool.swix extension:"\nFastCli -p 15 -c "extension tool.swix"`,
        why: 'See scheduled scripts and SWIX extensions.',
        insight: 'SWIX files bundle RPMs for custom tooling. Extensions persist across reboots when installed via EOS CLI. Keep them documented for audit.'
      },
      {
        title: 'Flash Hygiene',
        snippet: `df -h /mnt/flash\n# Remove old images:\nrm /mnt/flash/EOS-old.swi\n# Clear coredumps:\nrm -f /mnt/flash/cores/*\n# Offload logs:\ntar -czvf /tmp/logs.tgz /var/log\nscp /tmp/logs.tgz user@server:/tmp/`,
        why: 'Flash fills up and causes upgrade failures. Pre-ISSU hygiene is critical.',
        insight: 'A full /mnt/flash blocks ISSU and image copy. Always run `df -h /mnt/flash` before upgrade. Target >20% free.'
      }
    ]
  },
  {
    id: 'networking',
    title: 'Low-Level Networking',
    domain: 'networking',
    summary: 'Map kernel interfaces, capture packets, and prove transit.',
    icon: Network,
    tags: ['netns', 'tcpdump', 'capture'],
    modes: ['reference', 'guided', 'scenario'],
    commands: [
      {
        title: 'Interface Mapping',
        snippet: `ip link show\n# EOS name → kernel name:\n# Ethernet1 → et1\n# Ethernet1/1 → et1_1\n# Management1 → ma1\nip -d link show et1`,
        why: 'Translate Ethernet1 ↔ et1 for kernel-level troubleshooting.',
        insight: 'Critical for tcpdump accuracy and VRF/netns debugging. `ip -d link show et1` shows bond, VLAN, and encap details.'
      },
      {
        title: 'Packet Sniffer',
        snippet: `tcpdump -i et1 -n 'vlan 10'\ntcpdump -i et1 -n 'host 10.0.0.1'\ntcpdump -i et1 -c 50 -w /mnt/flash/capture.pcap\n# In a specific VRF (netns):\nip netns exec ns-MGMT tcpdump -i et1 -n`,
        why: 'On-box capture for proof of transit and anomaly triage.',
        insight: 'Quote BPF filter expressions containing keywords like `vlan` to prevent shell misinterpretation. Write to /tmp or /mnt/flash and offload.'
      }
    ],
    quiz: {
      question: 'What maps to netns in EOS?',
      options: ['VLANs', 'VRFs', 'ACLs'],
      answer: 'VRFs'
    }
  },
  {
    id: 'vrf-netns',
    title: 'VRF / NetNS Operations',
    domain: 'networking',
    summary: 'Per-VRF routing tables, captures, listeners, and ARP using Linux netns.',
    icon: Network,
    tags: ['vrf', 'netns', 'routing', 'tcpdump'],
    modes: ['reference', 'guided', 'scenario'],
    commands: [
      {
        title: 'List VRF Namespaces',
        snippet: `ip netns list\n# Output example:\n# ns-default\n# ns-MGMT\n# ns-PROD`,
        why: 'Each EOS VRF is a Linux network namespace; listing them maps EOS VRF names to netns handles.',
        insight: 'The default VRF is `ns-default`. Management VRF is typically `ns-MGMT`. Custom VRFs appear as `ns-<VRF-name>`.'
      },
      {
        title: 'Per-VRF Route Table',
        snippet: `ip netns exec ns-PROD ip route show\nip netns exec ns-PROD ip route show table all\nip netns exec ns-PROD ip neigh show`,
        why: 'Check kernel routing state per VRF—bypasses EOS RIB for ground truth.',
        insight: 'EOS FIB sync issues may show as discrepancies between `show ip route vrf PROD` and `ip netns exec ns-PROD ip route show`.'
      },
      {
        title: 'Per-VRF Packet Capture',
        snippet: `# Capture in PROD VRF on et1:\nip netns exec ns-PROD tcpdump -i et1 -n -c 100 -w /mnt/flash/prod-capture.pcap\n# BGP traffic only:\nip netns exec ns-PROD tcpdump -i et1 -n 'tcp port 179'`,
        why: 'Prove packet transit within a specific VRF without SPAN setup.',
        insight: 'Running tcpdump outside a netns captures all VRFs on that interface. Always exec into the correct ns for accurate VRF-specific captures.'
      },
      {
        title: 'Per-VRF Socket Listeners',
        snippet: `ip netns exec ns-PROD ss -tlnp\nip netns exec ns-MGMT ss -tlnp\n# ARP table per VRF:\nip netns exec ns-PROD arp -n`,
        why: 'Verify which services are listening in which VRF—critical for eAPI/SSH placement.',
        insight: 'eAPI and SSH can be placed in specific VRFs. `ss -tlnp` in the target netns confirms the listener is bound correctly.'
      }
    ],
    quiz: {
      question: 'Which command shows the routing table for EOS VRF "PROD" at the Linux kernel level?',
      options: [
        'ip route show vrf PROD',
        'ip netns exec ns-PROD ip route show',
        'netstat -rn --vrf=PROD'
      ],
      answer: 'ip netns exec ns-PROD ip route show'
    }
  },
  {
    id: 'programmability',
    title: 'Python & eAPI',
    domain: 'automation',
    summary: 'On-box Python, sockets, and JSON outputs without scraping.',
    icon: Code,
    tags: ['eapi', 'python', 'automation'],
    modes: ['reference', 'guided', 'scenario'],
    commands: [
      {
        title: 'Python Shell',
        snippet: `python3\n# Check available SDKs:\npython3 -c "import eossdk; print(eossdk.__file__)"\npython3 -c "import jsonrpclib; print(jsonrpclib.__version__)"`,
        why: 'EOS ships Python 3; Arista SDKs (eossdk, jsonrpclib) are pre-installed—no pip needed.',
        insight: 'Use `python3` explicitly. Scripts in /mnt/flash/schedule/ run as EOS scheduled tasks. Always test interactively first.'
      },
      {
        title: 'Localhost eAPI (Unix Socket)',
        snippet: `python3 << 'EOF'\nimport jsonrpclib, json\nswitch = jsonrpclib.Server("unix:/var/run/command-api.sock")\nresult = switch.runCmds(1, ["show version"])\nprint(json.dumps(result, indent=2))\nEOF`,
        why: 'Unix socket eAPI is faster than HTTPS loopback and avoids TLS overhead for on-box scripts.',
        insight: 'The socket at `/var/run/command-api.sock` requires `management api http-commands` to be enabled. Unix socket does not need credentials.'
      },
      {
        title: 'Structured Output via curl',
        snippet: `curl -s -k -u admin:REPLACE_ME -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"runCmds","params":{"version":1,"cmds":["show version"]},"id":"1"}' \\
  https://127.0.0.1:443/command-api | python3 -m json.tool`,
        why: 'Avoid scraping; get JSON for downstream automation. Pipe to python3 or jq for field extraction.',
        insight: 'Always replace REPLACE_ME with a credential from a vault. For on-box use, prefer the Unix socket (no creds needed).'
      }
    ],
    quiz: {
      question: 'Best way to query EOS on-box without scraping?',
      options: ['Expect scripts', 'eAPI runCmds via Unix socket returning JSON', 'Screen-scrape show run'],
      answer: 'eAPI runCmds via Unix socket returning JSON'
    }
  },
  {
    id: 'agent-ops',
    title: 'Agent & Process Management',
    domain: 'foundations',
    summary: 'Identify EOS agents, read per-agent logs, and restart safely via ProcMgr.',
    icon: Cpu,
    tags: ['procmgr', 'agents', 'restart', 'logs'],
    modes: ['reference', 'guided', 'scenario'],
    commands: [
      {
        title: 'List Agents (EOS CLI)',
        snippet: `FastCli -p 15 -c "show processes"\nFastCli -p 15 -c "show agent"\nFastCli -p 15 -c "show agent logs"`,
        why: 'EOS CLI gives a structured view of running agents with CPU, memory, and restart counts.',
        insight: 'High restart counts on an agent (e.g., Bgp, Ospf) indicate a crash loop. Check agent logs before restarting.'
      },
      {
        title: 'Find Agent PID (bash)',
        snippet: `# Find BGP agent PID:\nps aux | grep -i '[B]gp'\n# List all EOS agents:\nps aux | grep -E 'Agent|agent' | grep -v grep\n# View agent log files:\nls -la /var/log/agents/`,
        why: 'Agent PIDs are needed for `strace`, `lsof`, or kill operations under TAC guidance.',
        insight: 'Each agent writes its own log under `/var/log/agents/<AgentName>-<PID>`. The latest file matches the current PID.'
      },
      {
        title: 'Safe Agent Restart (ProcMgr)',
        snippet: `# Graceful restart via EOS CLI (safest):\nFastCli -p 15 -c "agent Bgp graceful-restart"\n# Or from bash via ProcMgr:\nbash sudo killall -HUP ProcMgr\n# NEVER use kill -9 on agents without TAC guidance`,
        why: 'ProcMgr supervises all EOS agents. A graceful restart preserves SysDB state and avoids data-plane disruption.',
        insight: 'SysDB decouples agent state from the process. An agent can crash and restart without affecting forwarding. `kill -9` bypasses this and may corrupt state.'
      },
      {
        title: 'Live Agent Log Streaming',
        snippet: `# Tail the latest BGP agent log:\ntail -f /var/log/agents/Bgp-*\n# Or watch all agents:\ntail -f /var/log/agents/*\n# Search for errors:\ngrep -i "error\\|warn\\|crit" /var/log/agents/Bgp-*`,
        why: 'Agent logs capture events not visible in `show log`. Essential for agent crash forensics.',
        insight: 'Correlate agent log timestamps with `show log` events. Log rotation creates new files; always tail the latest by using the glob pattern.'
      }
    ],
    quiz: {
      question: 'What is the safest way to restart an EOS agent?',
      options: [
        'kill -9 <agent PID>',
        'FastCli -p 15 -c "agent <name> graceful-restart"',
        'systemctl restart <agentname>'
      ],
      answer: 'FastCli -p 15 -c "agent <name> graceful-restart"'
    }
  },
  {
    id: 'hardening',
    title: 'Hardening & Support',
    domain: 'hardening',
    summary: 'Audit roles, bundles, and pre-flight checks for TAC readiness.',
    icon: ShieldCheck,
    tags: ['aaa', 'support', 'issu', 'tac'],
    modes: ['reference', 'guided', 'scenario'],
    commands: [
      {
        title: 'RBAC Snapshot',
        snippet: `FastCli -p 15 -c "show role"\nFastCli -p 15 -c "show aaa authorization"\ngrep -A3 "role" /mnt/flash/startup-config`,
        why: 'Validate AAA/roles before handoff; avoid lab leftovers in production configs.',
        insight: 'Keep role diffs handy for compliance sign-off. `show role` shows effective privilege levels; check for any `role network-admin` overreach.'
      },
      {
        title: 'Tech-Support & Offload',
        snippet: `# Generate tech-support from EOS CLI:\nFastCli -p 15 -c "show tech-support" > /mnt/flash/tech-support.log\n# Or bundle logs from bash:\nbash sudo tar -czvf /mnt/flash/tech-support.tgz /var/log/agents /mnt/flash/cores\n# Offload:\nscp /mnt/flash/tech-support.tgz user@host:/tmp/`,
        why: 'Package evidence for TAC or audits quickly. TAC always asks for tech-support first.',
        insight: 'Checksum (`md5sum`) and offload before upgrades to free flash. `show tech-support` is preferred as it includes structured EOS state.'
      },
      {
        title: 'Upgrade Readiness',
        snippet: `FastCli -p 15 -c "show boot-config"\nFastCli -p 15 -c "show version"\ndf -h /mnt/flash\n# Verify ISSU compatibility:\nFastCli -p 15 -c "show issu"`,
        why: 'Confirm boot targets, EOS version, and flash space before ISSU.',
        insight: 'Pair with flash cleanup. `show issu` shows ISSU upgrade path compatibility. Always have a rollback plan: save startup-config off-box first.'
      }
    ]
  },
  {
    id: 'diagnostics',
    title: 'Diagnostics & TAC Prep',
    domain: 'hardening',
    summary: 'Coredumps, memory forensics, evidence bundling, and TAC-ready triage.',
    icon: Search,
    tags: ['coredump', 'memory', 'tac', 'forensics'],
    modes: ['reference', 'guided', 'scenario'],
    commands: [
      {
        title: 'Coredump Triage',
        snippet: `# List coredumps:\nls -lh /mnt/flash/cores/\nFastCli -p 15 -c "show coredump"\n# Check which agent crashed:\nfile /mnt/flash/cores/*.core\n# Remove old cores to free flash:\nrm -f /mnt/flash/cores/*.core.old`,
        why: 'Coredumps appear after agent crashes. They tell you which agent, when, and why.',
        insight: 'Coredumps are large and fill /mnt/flash quickly. Offload them before deleting—TAC will need them. Always check `show coredump` for structured metadata first.'
      },
      {
        title: 'Memory Diagnostics',
        snippet: `free -h\ncat /proc/meminfo | grep -E 'MemTotal|MemFree|MemAvailable|Cached'\n# Per-agent memory from EOS:\nFastCli -p 15 -c "show processes top once"\n# Top memory consumers:\nps aux --sort=-%mem | head -15`,
        why: 'Memory exhaustion causes agent crashes and CLI slowness. Know your baseline.',
        insight: 'EOS agents have memory limits enforced by ProcMgr. A steadily growing agent process (memory leak) will be restarted. Alert if MemAvailable drops below ~10%.'
      },
      {
        title: 'Evidence Bundle for TAC',
        snippet: `# Create dated bundle:\nTIMESTAMP=$(date +%Y%m%d-%H%M)\nsudo tar -czvf /mnt/flash/diag-\${TIMESTAMP}.tgz \\\n  /var/log/agents \\\n  /mnt/flash/cores \\\n  /mnt/flash/startup-config\n# Verify bundle:\ntar -tzvf /mnt/flash/diag-\${TIMESTAMP}.tgz | head\n# Offload:\nscp /mnt/flash/diag-\${TIMESTAMP}.tgz user@jumphost:/cases/`,
        why: 'TAC requires logs, coredumps, and config in one package. Do this before any remediation.',
        insight: 'Always bundle BEFORE restarting agents or rebooting. Post-reboot logs are truncated. Include `show tech-support` output in the bundle for completeness.'
      },
      {
        title: 'CPU & Interrupts',
        snippet: `top -b -n 1 | head -25\ncat /proc/interrupts | head -20\n# Sustained high-CPU agent:\nFastCli -p 15 -c "show processes top once"\n# Check softirq backlog:\ncat /proc/net/softnet_stat`,
        why: 'CPU spikes cause CLI unresponsiveness and may indicate a protocol storm or agent bug.',
        insight: 'Software interrupts (softirq) spikes indicate packet processing overload. Correlate with interface rx_errors and tcpdump for root cause.'
      }
    ],
    quiz: {
      question: 'Where are EOS agent coredumps stored by default?',
      options: ['/var/log/agents/', '/mnt/flash/cores/', '/tmp/cores/'],
      answer: '/mnt/flash/cores/'
    }
  },
  {
    id: 'telemetry',
    title: 'Telemetry & State',
    domain: 'reference',
    summary: 'SysDB context, logs, and state forensics for EOS agents.',
    icon: Activity,
    tags: ['sysdb', 'logs', 'state'],
    modes: ['reference'],
    commands: [
      {
        title: 'SysDB State Exploration',
        snippet: `# List SysDB mount paths (bash, requires sudo):\nbash sudo ls /var/volatile/sysdb/\n# View agent registrations:\nFastCli -p 15 -c "show agent"\n# Check which agents own SysDB subtrees:\nFastCli -p 15 -c "show processes"`,
        why: 'SysDB is the in-memory state database shared by all EOS agents. Understanding its structure helps forensics.',
        insight: 'Each agent owns a SysDB subtree. When an agent restarts hitlessly, SysDB preserves state so the data plane keeps forwarding. Do not expect `show sysdb path` in EOS CLI—SysDB is explored via bash or agent APIs.'
      },
      {
        title: 'Logs Quick View',
        snippet: `tail -f /var/log/agents\ntail -f /var/log/messages\n# Show EOS system log:\nFastCli -p 15 -c "show log last 100"\n# Filter for errors:\nFastCli -p 15 -c "show log | grep -i error"`,
        why: 'See agent-level events outside the EOS CLI. `/var/log/messages` captures kernel and system events.',
        insight: 'Correlate `/var/log/agents/<AgentName>-<PID>` timestamps with `show log` for timeline debugging. Agent logs survive across agent restarts (new file per PID).'
      }
    ]
  }
];

export const LINUX_TRACKS: LinuxTrack[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    description: 'Bash, processes, agents, and filesystem hygiene.',
    steps: ['bash-intro', 'agent-ops', 'filesystem']
  },
  {
    id: 'networking',
    label: 'Networking & NetNS',
    description: 'Interfaces, tcpdump, VRF/netns mapping, and per-VRF captures.',
    steps: ['networking', 'vrf-netns']
  },
  {
    id: 'automation',
    label: 'Automation & eAPI',
    description: 'Python, sockets, and JSON pipelines.',
    steps: ['programmability']
  },
  {
    id: 'hardening',
    label: 'Hardening & Supportability',
    description: 'AAA audits, bundles, upgrades, and TAC prep.',
    steps: ['hardening', 'diagnostics']
  }
];

export const LINUX_SCENARIOS: LinuxScenario[] = [
  {
    id: 'netns-capture',
    title: 'VRF-Aware Capture & Proof of Transit',
    description: 'Map EOS VRFs to Linux netns, then capture packets in the correct namespace.',
    cards: ['vrf-netns', 'networking', 'cheatsheet'],
    outcome: 'Produce a pcap inside the correct netns showing traffic path per VRF.'
  },
  {
    id: 'eapi-audit',
    title: 'eAPI Audit & JSON Output',
    description: 'Prove automation readiness on-box via Unix socket and HTTPS.',
    cards: ['programmability', 'cheatsheet'],
    outcome: 'Return structured `show version` via Unix socket and curl; pipe to python3 -m json.tool.'
  },
  {
    id: 'flash-hygiene',
    title: 'Flash Hygiene & Upgrade Prep',
    description: 'Clean flash, validate boot targets, package evidence.',
    cards: ['filesystem', 'hardening'],
    outcome: 'Flash cleaned, boot-config confirmed, evidence offloaded. >20% flash free.'
  },
  {
    id: 'agent-triage',
    title: 'Agent Crash Triage & TAC Bundle',
    description: 'Identify crashed agent, collect coredumps and logs, bundle for TAC.',
    cards: ['agent-ops', 'diagnostics'],
    outcome: 'Dated evidence bundle on jump host; agent restarted gracefully; no data-plane impact.'
  }
];
