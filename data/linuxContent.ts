import { Terminal, FileText, HardDrive, Network, Code, ShieldCheck, Activity } from 'lucide-react';

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
        snippet: 'bash',
        why: 'EOS is Fedora-based; bash exposes GNU tools and the real filesystem.',
        insight: 'Use `bash sudo` for root-level diagnostics when required.'
      },
      {
        title: 'Process Management',
        snippet: 'ps aux | grep -i bgp',
        why: 'Each EOS agent is a Linux process; seeing them helps with hitless restarts.',
        insight: 'SysDB lets agents restart without dropping data-plane state.'
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
        snippet: `find /mnt/flash -name "*.swi"\ngrep -r "error" /var/log/agents\nwhich FastCli\nwhereis python\nawk '/Error/ {print $1}' log\nsed 's/foo/bar/g' config.txt`,
        why: 'Locate images/configs/logs fast; avoid manual traversal.',
        insight: 'Use `grep -C 5` for context around errors.'
      },
      {
        title: 'System & Process',
        snippet: `ps aux --sort=-%mem | head\ntop -b -n 1 | head -n 20\nlsof -i :443\nkill -9 [pid]\nfree -h\nlscpu\nuptime`,
        why: 'Check load, memory, and ports when CLI feels slow.',
        insight: 'Avoid `kill -9` on EOS agents unless TAC instructs.'
      },
      {
        title: 'Network & Transfer',
        snippet: `ip -d link show et1\ntcpdump -i et1 -w capture.pcap\nnetstat -tulnp\ncurl -O http://repo/image.swi\nscp user@host:/path/file .\ndig +short arista.com\nip route show`,
        why: 'Kernel-level view of interfaces and sockets; move files faster than `copy`.',
        insight: 'Use `netstat -tulnp` to verify eAPI/SSH listeners in the right VRF.'
      },
      {
        title: 'File & Storage',
        snippet: `df -h /mnt/flash\ndu -sh /var/log/*\ntar -czvf logs.tar.gz /var/log\nchmod 755 script.py\nchown admin:root file\ntail -f /var/log/messages`,
        why: 'Flash is limited—find and offload large cores/pcaps before upgrades.',
        insight: 'Always clean `/mnt/flash` pre-ISSU; offload old logs.'
      },
      {
        title: 'Shell & Shortcuts',
        snippet: `Ctrl+R\nCtrl+A / Ctrl+E\nCtrl+W\n!!\n!$\nhistory | grep "ip"\nwatch -n 1 "FastCli -p 15 -c 'show int status'"`,
        why: 'Speed up CLI usage and live monitoring.',
        insight: 'Combine `watch` + `FastCli` for real-time interface dashboards.'
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
        snippet: 'ls -al /mnt/flash',
        why: 'Find configs, images, extensions; know what survives reboot.',
        insight: 'Work in /mnt/flash for persistence; /tmp is volatile.'
      },
      {
        title: 'Extensions & Schedules',
        snippet: 'ls /mnt/flash/schedule/',
        why: 'See scheduled scripts and SWIX extensions.',
        insight: 'You can install RPMs for custom tooling; keep them documented.'
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
        snippet: 'ip link show',
        why: 'Translate Ethernet1 ↔ et1 for kernel-level troubleshooting.',
        insight: 'Critical for tcpdump accuracy and VRF/netns debugging.'
      },
      {
        title: 'Packet Sniffer',
        snippet: 'tcpdump -i et1 -n vlan 10',
        why: 'On-box capture for proof of transit and anomaly triage.',
        insight: 'Not limited to SPAN—use tcpdump directly on EOS.'
      }
    ],
    quiz: {
      question: 'What maps to netns in EOS?',
      options: ['VLANs', 'VRFs', 'ACLs'],
      answer: 'VRFs'
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
        snippet: 'python',
        why: 'Interact with EOS programmatically on-box.',
        insight: 'Arista SDKs are pre-loaded—no pip needed.'
      },
      {
        title: 'Localhost eAPI',
        snippet: 'switch = jsonrpclib.Server("unix:/var/run/command-api.sock")',
        why: 'Fast access to EOS state without HTTPS overhead.',
        insight: 'Unix sockets beat HTTPS loopback for speed.'
      },
      {
        title: 'Structured Output',
        snippet: `curl -s -k -u USER:REPLACE_ME -X POST \\\n  -H "Content-Type: application/json" \\\n  -d '{"jsonrpc":"2.0","method":"runCmds","params":{"version":1,"cmds":["show version"]},"id":"1"}' \\\n  https://127.0.0.1:443/command-api`,
        why: 'Avoid scraping; get JSON for downstream automation.',
        insight: 'Pipe to jq for quick field extraction.'
      }
    ],
    quiz: {
      question: 'Best way to query EOS without scraping?',
      options: ['Expect scripts', 'eAPI runCmds returning JSON', 'Screen-scrape show run'],
      answer: 'eAPI runCmds returning JSON'
    }
  },
  {
    id: 'hardening',
    title: 'Hardening & Support',
    domain: 'hardening',
    summary: 'Audit roles, bundles, and pre-flight checks for TAC readiness.',
    icon: ShieldCheck,
    tags: ['aaa', 'support', 'isssu', 'tac'],
    modes: ['reference', 'guided', 'scenario'],
    commands: [
      {
        title: 'RBAC Snapshot',
        snippet: `grep -A3 "role" /mnt/flash/configs/startup-config\nshow aaa authorization`,
        why: 'Validate AAA/roles before handoff; avoid lab leftovers.',
        insight: 'Keep role diffs handy for compliance sign-off.'
      },
      {
        title: 'Tech-Support & Offload',
        snippet: `bash sudo tar -czvf tech-support.tgz /var/log\nscp tech-support.tgz user@host:/tmp/`,
        why: 'Package evidence for TAC or audits quickly.',
        insight: 'Checksum and offload before upgrades to free flash.'
      },
      {
        title: 'Upgrade Readiness',
        snippet: 'FastCli -p 15 -c "show boot-config"',
        why: 'Confirm boot targets and ISSU readiness.',
        insight: 'Pair with flash cleanup to avoid upgrade failures.'
      }
    ]
  },
  {
    id: 'telemetry',
    title: 'Telemetry & State',
    domain: 'reference',
    summary: 'SysDB context, logs, and time-machine concepts.',
    icon: Activity,
    tags: ['sysdb', 'logs', 'state'],
    modes: ['reference'],
    commands: [
      {
        title: 'SysDB Walk',
        snippet: 'FastCli -p 15 -c "show sysdb path | grep interfaces"',
        why: 'Understand where state is persisted over time.',
        insight: 'SysDB makes hitless restarts possible; use it for forensics.'
      },
      {
        title: 'Logs Quick View',
        snippet: 'tail -f /var/log/agents',
        why: 'See agent-level events outside the EOS CLI.',
        insight: 'Correlate with SysDB for timeline debugging.'
      }
    ]
  }
];

export const LINUX_TRACKS: LinuxTrack[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    description: 'Bash, processes, filesystem hygiene.',
    steps: ['bash-intro', 'cheatsheet', 'filesystem']
  },
  {
    id: 'networking',
    label: 'Networking & NetNS',
    description: 'Interfaces, tcpdump, VRF/netns mapping.',
    steps: ['networking']
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
    description: 'AAA audits, bundles, upgrades.',
    steps: ['hardening']
  }
];

export const LINUX_SCENARIOS: LinuxScenario[] = [
  {
    id: 'netns-capture',
    title: 'NetNS Capture & Proof of Transit',
    description: 'Show VRF/netns mapping and capture packets on the right interface.',
    cards: ['networking', 'cheatsheet'],
    outcome: 'Produce a pcap and mapping showing the path per VRF.'
  },
  {
    id: 'eapi-audit',
    title: 'eAPI Audit & JSON Output',
    description: 'Prove automation readiness on-box via sockets.',
    cards: ['programmability', 'cheatsheet'],
    outcome: 'Return structured `show version` via socket and curl.'
  },
  {
    id: 'flash-hygiene',
    title: 'Flash Hygiene & Upgrade Prep',
    description: 'Clean flash, validate boot targets, package evidence.',
    cards: ['filesystem', 'hardening'],
    outcome: 'Flash cleaned, boot-config confirmed, evidence offloaded.'
  }
];
