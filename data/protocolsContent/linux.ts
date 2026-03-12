import { ProtocolDetail } from './types';

export const LINUX_PROTOCOL: ProtocolDetail = {
    id: 'linux',
    name: 'Linux Fundamentals on EOS',
    legacyTerm: 'Bash Access',
    tagline: 'Native Linux access for deep troubleshooting.',
    description:
      'EOS runs on Fedora Linux; you can drop into bash for process, filesystem, and network introspection. This is the bridge between EOS CLI and the underlying OS.',
    keyBenefits: [
      'Full GNU toolkit (bash, ps, tcpdump, curl).',
      'Direct access to processes managed by ProcMgr.',
      'On-box automation via Python/eAPI without scraping.',
      'Visibility into namespaces, storage, and sensors.',
      'Rapid packet capture for live control/data-plane validation.'
    ],
    bestPractices: [
      'Always prefix diagnostic commands with `ip netns exec <vrf-name>` when working inside a VRF — standard Linux tools executed in the default namespace have no VRF awareness and will return empty or misleading results.',
      'Never make persistent configuration changes through the bash shell; use EOS CLI or CloudVision for all production configuration — bash changes bypass EOS configuration validation, rollback, and audit logging.',
      'Always pass `-c <count>` to `tcpdump` — runaway captures with no packet limit will fill flash storage, which can crash EOS processes and cause an unplanned reload.',
      'Avoid destructive Linux commands (`rm -rf`, `kill -9` on ProcMgr agents, `dd` to block devices) without explicit Arista TAC guidance — EOS process recovery from manual agent kills is not guaranteed.',
      'Prefer Python eAPI scripts over ad-hoc bash scripts for any automation that will run repeatedly — eAPI returns structured JSON, integrates with CI/CD, and supports dry-run validation before commit.',
      'Check flash utilisation (`df -h /`) before and after upgrades or extended troubleshooting sessions — large pcap files and accumulated log files are the most common and easily overlooked cause of flash exhaustion.',
      'Be aware that EOS AAA logging captures CLI commands but does not log all activity inside a bash session — enable syslog forwarding of bash history to a central collector for audit compliance in regulated environments.'
    ],
    cliTranslation: [
      { legacy: 'enable\nbash', arista: 'bash' },
      { legacy: 'show process', arista: 'ps aux | grep ProcMgr' },
      { legacy: 'monitor session', arista: 'tcpdump -i et1 -n vlan 10' },
      { legacy: 'copy', arista: 'curl -O http://repo/image.swi' }
    ],
    masteryPath: [
      {
        level: 'Foundation',
        heading: 'Process View',
        body: 'Every EOS feature runs as a Linux process managed by ProcMgr. Bash access exposes them via standard tools.',
        keyConcept: 'ProcMgr & Agents'
      },
      {
        level: 'Logic',
        heading: 'Namespaces',
        body: 'VRFs map to Linux namespaces; use ip netns exec for accurate per-VRF visibility.',
        keyConcept: 'netns awareness'
      },
      {
        level: 'Architecture',
        heading: 'On-box Validation',
        body: 'Pair tcpdump with protocol labs (VXLAN/EVPN) to prove encapsulation, or curl/eAPI calls for automation smoke tests before rollout.',
        keyConcept: 'CLI ↔ Bash bridging'
      },
      {
        level: 'Architecture',
        heading: 'VRF-Aware Debugging',
        body: 'EOS VRFs are Linux network namespaces. When you drop into bash, you are in the default namespace — the management VRF. Use "ip netns list" to see all VRF namespaces and "ip netns exec <vrf>" to run commands inside a specific VRF. This is the fundamental difference between bash on EOS and bash on a standard server: the routing table, ARP cache, and socket listeners are all namespace-specific.',
        keyConcept: 'ip netns exec <VRF>'
      },
      {
        level: 'Architecture',
        heading: 'Automation Scripting',
        body: 'EOS includes Python 3 and the eAPI JSON-RPC interface accessible at localhost. The pattern: use requests or the Arista pyeapi library to send EOS show/config commands and get structured JSON back. This enables on-box scripts that run at startup (event-handler), on a schedule (daemon), or triggered by EOS events (trigger). Combined with CloudVision configlets, on-box scripts become part of declarative fabric management.',
        keyConcept: 'pyeapi · event-handler · structured JSON'
      }
    ],
    overview: {
      title: 'EOS Linux Architecture',
      intro: 'EOS is Fedora Linux under the hood. Every EOS feature — BGP, OSPF, LLDP, STP — runs as an independent Linux process managed by ProcMgr. They communicate via SysDB, Arista\'s publish/subscribe state database. This architecture enables hitless agent restarts without clearing forwarding tables.',
      sections: [
        {
          title: 'ProcMgr & Agents',
          body: 'ProcMgr monitors all EOS agent processes. If an agent crashes, ProcMgr automatically restarts it. The agent re-subscribes to SysDB and recovers state without a protocol reconvergence event. Visible via: ps aux | grep -E "Bgp|Ospf|Lldp|ProcMgr".',
          bestFor: 'Understanding why EOS is more resilient than monolithic network OS.'
        },
        {
          title: 'SysDB & eAPI',
          body: 'SysDB is the in-memory state database that all agents read and write. The eAPI JSON-RPC endpoint at localhost:8765 provides direct read/write access to SysDB — enabling on-box automation, health checks, and event-driven scripts without SSH or CLI scraping.',
          bestFor: 'On-box automation, event-handler scripts, pre/post-change validation.'
        }
      ],
      conclusion: 'The bash shell on EOS is a diagnostic and automation surface, not a configuration surface. Use CLI or CVP for config. Use bash for deep inspection, packet capture, and on-box scripting.'
    },
    primer: {
      title: 'tcpdump Safety Rules on EOS Flash',
      body: 'Flash storage on EOS is typically 4-8 GB. A 10 Gbps interface running tcpdump without a packet count limit can fill flash in under 60 seconds, crashing EOS log writers and potentially triggering a reload. Always use: (1) -c <count> to limit packets (e.g., -c 100), (2) -w /tmp/capture.pcap to write to volatile memory instead of flash, (3) port filters to narrow the capture (tcpdump -nn port 4789 -c 100), and (4) tcpdump on a specific interface, never on "any" in production. The safest practice: capture to /tmp (RAM disk), copy off the switch with scp, then delete the file.'
    },
    roleConfigs: [
      {
        role: 'Packet Capture (VXLAN aware)',
        description: 'Capture encapsulated traffic in the correct namespace.',
        config: `bash
ip netns exec Prod tcpdump -i vxlan1 -nn udp port 4789 -c 50
ip netns exec Prod tcpdump -i Ethernet2 -nn vlan 10 -c 20`
      },
      {
        role: 'Process & Storage Health',
        description: 'Check ProcMgr and flash health before upgrades.',
        config: `bash
ps -ef | grep ProcMgr
df -h /
lsblk
sudo journalctl -xe | head`
      },
      {
        role: 'VRF Namespace Debug',
        description: 'Inspect routing tables, ARP, and connectivity inside a specific VRF.',
        config: `bash
# List all VRF namespaces
ip netns list
!
# Routing table for VRF Prod
ip netns exec Prod ip route show
!
# ARP cache for VRF Prod
ip netns exec Prod arp -n
!
# Test connectivity from inside VRF
ip netns exec Prod ping -c 3 10.10.10.50
!
# Traceroute within VRF
ip netns exec Prod traceroute 10.10.10.50`
      },
      {
        role: 'Python eAPI Script',
        description: 'On-box eAPI automation using Python — get structured JSON from EOS.',
        config: `#!/usr/bin/env python3
# Save as /mnt/flash/check_bgp.py, run: bash python3 /mnt/flash/check_bgp.py
import json, urllib.request, base64

url = 'http://localhost/command-api'  # EOS eAPI default HTTP port 80
creds = base64.b64encode(b'admin:').decode()
payload = json.dumps({
    'jsonrpc': '2.0',
    'method': 'runCmds',
    'params': {'version': 1, 'cmds': ['show bgp summary'], 'format': 'json'},
    'id': 1
})
req = urllib.request.Request(url, payload.encode(), {
    'Content-Type': 'application/json',
    'Authorization': f'Basic {creds}'
})
resp = json.loads(urllib.request.urlopen(req).read())
peers = resp['result'][0]['vrfs']['default']['peers']
for peer, data in peers.items():
    print(f"{peer}: {data['peerState']} prefixes={data['prefixReceived']}")`
      },
      {
        role: 'Log Capture',
        description: 'Collect EOS logs and event history for incident analysis.',
        config: `bash
# Recent EOS events (last 100 lines)
sudo journalctl -u Bgp --no-pager | tail -100
!
# Search for BGP or interface events
sudo grep -i "bgp\|neighbor\|state" /var/log/messages | tail -50
!
# EOS event log (accessible from CLI too)
# show logging last 100
!
# Save logs to /tmp before copying off-switch
sudo journalctl --no-pager > /tmp/eos_journal.txt
scp admin@<switch>:/tmp/eos_journal.txt .`
      },
      {
        role: 'Flash Management',
        description: 'Safe flash cleanup before upgrades to ensure adequate free space.',
        config: `bash
# Check flash usage
df -h /
!
# Find large files
find /mnt/flash -size +50M -ls 2>/dev/null
!
# List EOS images
ls -lh /mnt/flash/*.swi 2>/dev/null
!
# Delete old images (keep current + 1 backup max)
# rm /mnt/flash/EOS-old.swi
!
# Truncate large log files safely
sudo truncate -s 0 /var/log/messages
!
# Check after cleanup
df -h /`
      }
    ],
    referenceLinks: [
      { title: 'EOS Linux Internals', summary: 'Mapping EOS features to Linux processes and namespaces.' },
      { title: 'On-box Troubleshooting Recipes', summary: 'Tcpdump, ip netns exec, python -m json.tool for eAPI responses.' }
    ],
    dcContext: {
      small: {
        scale: '2-tier · single switch · EOS bash + eAPI',
        topologyRole: 'ZTP script customization; on-box Python for day-1 automation; sysdb interaction via Bash',
        keyConfig: 'bash\npython3 /mnt/flash/ztp_init.py  ! ZTP on-box hook',
        highlight: 'host-edge'
      },
      medium: {
        scale: '3-tier · CloudVision + eAPI · multi-switch automation',
        topologyRole: 'CloudVision API for multi-switch config push; eAPI JSON for programmatic show commands; Python SDK',
        keyConfig: 'show version | json  ! eAPI: curl http://localhost/command-api',
        highlight: 'leaf-spine'
      },
      large: {
        scale: 'Multi-pod · gNMI/gRPC telemetry · Ansible + AVD at scale',
        topologyRole: 'CVP Telemetry streaming via gNMI; Ansible AVD for Day-2 config; gRPC for real-time state',
        keyConfig: 'management gnmi\n   provider eos-native\n   transport grpc default',
        highlight: 'all'
      }
    }
  }
