
import { DemoScenario } from '../types';

export const GOLDEN_FLOW_GUIDES: Record<string, DemoScenario> = {
  'flow-1': {
    title: 'ZTP & Change Control',
    persona: 'The Infrastructure Lead (Scaling Focus)',
    playbook: [
      {
        step: 'The Zero Touch Handshake',
        highlight: 'Explain how the switch identifies itself via DHCP options. We aren\'t just booting; we are identifying architectural placement.',
        cliCommand: 'show zero-touch status'
      },
      {
        step: 'The Configlet Abstraction',
        highlight: 'Show how we build configs from reusable snippets. Mention that one change to a configlet can update 500 switches safely.',
        cliCommand: 'show running-config'
      },
      {
        step: 'Executing the Change Control',
        highlight: 'This is the differentiator. We don\'t just "send" config; we wrap it in a transaction with pre/post-snapshots.',
        cliCommand: 'show cvx change-control'
      },
      {
        step: 'The Rollback Assurance',
        highlight: 'Demonstrate that if a change causes a flap, we can revert the entire fabric to the previous known-good state in one click.'
      }
    ],
    cognitiveAngle: 'Operational consistency through software-defined automation. We treat the network as code, not as individual boxes.'
  },
  'flow-2': {
    title: 'The Time-Lag Anomaly',
    persona: 'The SRE / Network Operator (Troubleshooting Focus)',
    playbook: [
      {
        step: 'Event Correlator',
        highlight: 'Start at the dashboard. Note how CloudVision aggregates alerts into "Events" rather than showing 50,000 raw syslog lines.',
        cliCommand: 'show logging'
      },
      {
        step: 'The Time Machine (Cursor)',
        highlight: 'Move the global time slider back to the point of failure. Note that we aren\'t querying logs; we are re-rendering the state of the switch.',
        cliCommand: 'show agent state'
      },
      {
        step: 'Diffing the Fabric',
        highlight: 'Show the "Config Diff" between 2 AM and 1 AM. Identify the specific person or script that triggered the change.',
        cliCommand: 'show configuration diff'
      },
      {
        step: 'MTTR Resolution',
        highlight: 'By seeing exactly what happened, we reduce Mean Time to Resolution from hours to seconds. Architectural visibility is our superpower.'
      }
    ],
    cognitiveAngle: 'State-streaming telemetry vs SNMP polling. We record every tiny change in the SysDB database for absolute forensic clarity.'
  },
  'flow-3': {
    title: 'CUE Client Journey',
    persona: 'The Campus Director (Experience Focus)',
    playbook: [
      {
        step: 'The Experience Dashboard',
        highlight: 'Focus on the "Client Health" score. It is the only metric that matters to the end user. Is the Wi-Fi actually working?',
        cliCommand: 'show wireless client health'
      },
      {
        step: 'Association Analysis',
        highlight: 'Drill into a specific MAC address. Show the "Client Journey" map. Was it a signal issue, or a DHCP failure?',
        cliCommand: 'show wireless client journey'
      },
      {
        step: 'Proactive Packet Capture',
        highlight: 'Show how the AP automatically captured the failed handshake packets. We don\'t need to "reproduce" the issue; it\'s already saved.',
        cliCommand: 'show wireless packet-capture'
      },
      {
        step: 'Root Cause Synthesis',
        highlight: 'Use the "Ask CUE" AI to get a plain-English explanation of why the user couldn\'t connect.'
      }
    ],
    cognitiveAngle: 'Cognitive Wi-Fi moves the focus from "Connected" to "Optimized." We manage quality, not just connectivity.'
  },
  'flow-4': {
    title: 'Topology & Tagging Strategy',
    persona: 'The Network Architect / Automation Engineer',
    playbook: [
      {
        step: 'Physical LLDP Discovery',
        highlight: 'Start with the raw Physical View. Explain that CloudVision automatically discovers every link via LLDP streaming. No manual drawing required.',
        cliCommand: 'show lldp neighbors'
      },
      {
        step: 'The Power of Topology Tags',
        highlight: 'Explain how Tags drive the UI. By adding a "Site" or "Pod" tag, the Topology map automatically creates logical boundaries. Tags are the primary key for the visual engine.',
        cliCommand: 'show tag device'
      },
      {
        step: 'Dynamic Grouping (The Logic View)',
        highlight: 'Switch the view from "Physical" to "Group By: Tag." Watch the fabric reorganize from a messy web into a clean hierarchical Site/Rack/Switch view.',
        cliCommand: 'show tag device-grouping'
      },
      {
        step: 'Multi-Dimensional Filtering',
        highlight: 'Show the search bar. Type "site:Dublin AND role:Leaf." CloudVision instantly prunes 10,000 nodes down to the exact subset you need. This is how we handle massive scale without cognitive overload.',
        cliCommand: 'show inventory filter tag site:Dublin'
      }
    ],
    cognitiveAngle: 'Tags transform a collection of individual switches into a structured, searchable database. Your tags define your operational hierarchy, not your cabling.'
  },
  'flow-issu': {
    title: 'Hitless Upgrades (ISSU)',
    persona: 'The Operations Director (Uptime Focus)',
    playbook: [
      {
        step: 'Smart System Upgrade (SSU) Prep',
        highlight: 'Explain that Arista doesn\'t do "blind" reboots. SSU allows us to gracefully divert traffic, upgrade, and return to service without packet loss.',
        cliCommand: 'show reload cause'
      },
      {
        step: 'Pre-Upgrade Validation',
        highlight: 'Show CloudVision automatically checking for protocol stability (BGP, MLAG, EVPN) before even attempting the upgrade binary swap.',
        cliCommand: 'show ip bgp summary'
      },
      {
        step: 'Hitless Execution',
        highlight: 'Describe the "Leaf-by-Leaf" or "Spine-by-Spine" orchestration. The system keeps the fabric active while specific nodes are upgraded.',
        cliCommand: 'upgrade system image flash:<image>'
      },
      {
        step: 'The Zero-Impact Proof',
        highlight: 'Finalize the demo by showing the streaming telemetry graphs during the upgrade. Note the absence of throughput dips or increased error rates.'
      }
    ],
    cognitiveAngle: 'The separation of Control and Data planes via SysDB state-sharing enables true In-Service Software Upgrades. We eliminate the maintenance window anxiety.'
  },
  'flow-ai': {
    title: 'AI Fabric Congestion (LANZ)',
    persona: 'The HPC / AI Systems Architect',
    playbook: [
      {
        step: 'Micro-Burst Visibility',
        highlight: 'Standard polling misses micro-bursts. LANZ (Latency Analyzer) captures queue-depth events at the microsecond level.',
        cliCommand: 'show queue-monitor length'
      },
      {
        step: 'Buffer Histograms',
        highlight: 'Visualize the traffic distribution. Show how "Deep Buffers" absorbed the impact of an All-to-All checkpointing burst that would have dropped on commodity silicon.',
        cliCommand: 'show platform trident counters'
      },
      {
        step: 'RoCE v2 Lossless Profile',
        highlight: 'Validate PFC (Priority Flow Control) counters. Prove that the fabric paused traffic gracefully instead of dropping packets, preserving the AI training run.',
        cliCommand: 'show interface priority-flow-control'
      }
    ],
    cognitiveAngle: 'In AI, packet loss equals idle GPUs. Arista deep buffers and LANZ telemetry ensure the compute investment ($100k/GPU) is never waiting on the network.'
  },
  'flow-mss': {
    title: 'Zero Trust Macro-Segmentation',
    persona: 'The CISO / SecOps Lead',
    playbook: [
      {
        step: 'Defining the Security Zone',
        highlight: 'Create a "Zone" tag in CloudVision. Note that we define policy logically (e.g., "Cameras"), not by listing 5,000 IP addresses.',
        cliCommand: 'show tag interface'
      },
      {
        step: 'Policy Visualization',
        highlight: 'Open the MSS Dashboard. Show the "Who is talking to Whom" matrix. Identify authorized flows vs blocked lateral movement.',
        cliCommand: 'show monitor session 1 segmentation'
      },
      {
        step: 'Enforcement Push',
        highlight: 'Deploy the policy. Show how CloudVision pushes ACLs to the TCAM of every relevant switch instantly. Security is enforced at the port level, not the perimeter.',
        cliCommand: 'show ip access-lists'
      }
    ],
    cognitiveAngle: 'Security should be an intrinsic property of the fabric, not an appliance bottleneck. MSS moves the firewalling function to the switch silicon.'
  }
};
