
import { FeynmanAnalysis } from '../types';

export const PRE_POPULATED_ANALYSIS: Record<string, FeynmanAnalysis> = {
  'evpn': {
    score: 85,
    critique: "A solid explanation that avoids deep packet-header jargon while maintaining technical integrity. It correctly identifies the role of BGP without explaining the complexity of Type-2 or Type-5 routes, which is appropriate for a high-level overview.",
    jargonFound: ["BGP", "VXLAN", "L3LS"],
    simplifiedVersion: "EVPN-VXLAN is like a smart GPS for virtual private roads. Instead of every switch shouting to find a destination (which causes traffic jams), they use a central bulletin board (BGP) to share exactly where everyone is. This lets you build one giant, efficient network across multiple physical locations without the risk of loops or crashes."
  },
  'sysdb': {
    score: 92,
    critique: "Excellent use of the 'central heart' analogy. It perfectly captures the decoupling of process and state—the core differentiator of EOS. No mention of 'multi-process state sharing' is needed to convey the value of reliability.",
    jargonFound: ["SysDB", "Process", "Decoupling"],
    simplifiedVersion: "Imagine a kitchen where every chef (software process) writes their current task on a central whiteboard (SysDB) instead of just trying to remember it. If a chef needs to step out, the new chef just looks at the whiteboard and knows exactly where to pick up. This prevents the whole meal from being ruined if one person makes a mistake."
  },
  'deep-buffer': {
    score: 88,
    critique: "The 'waiting room' analogy is perfect for explaining VOQ (Virtual Output Queuing). It makes a complex ASIC architecture problem understandable to a financial or business stakeholder focused on performance.",
    jargonFound: ["VOQ", "ASIC", "Incast"],
    simplifiedVersion: "Deep buffers are like adding extra lanes and better waiting areas at a busy airport. In cheap switches, one delayed plane (packet) can block the entire runway for everyone. Arista switches give every destination its own 'private lounge' so a slow connection in one area never slows down the rest of your high-speed data."
  },
  'cvx': {
    score: 95,
    critique: "The 'time-machine' framing is the gold standard for explaining CloudVision. It shifts the value from 'monitoring' to 'forensics,' which is a high-status engineering outcome.",
    jargonFound: ["Telemetry", "Forensics", "State-streaming"],
    simplifiedVersion: "CloudVision is like a 24/7 security camera system for your entire network. Most tools only show you a grainy photo of what's happening right now. CloudVision records every single movement, so if a problem happened at 2 AM, you can 'rewind the tape' and see exactly what changed, making it easy to fix bugs that used to take days to find."
  },
  'mlag': {
    score: 82,
    critique: "Good explanation of a legacy-to-modern transition. Focuses on the outcome (reliability and speed) rather than the protocol specifics like LACP or Peer-Links.",
    jargonFound: ["MLAG", "LACP", "Loop"],
    simplifiedVersion: "MLAG is like having two engines on a plane instead of one. Normally, networking rules make it hard for two switches to work as a single team. MLAG tricks the rest of the network into seeing them as one super-switch. You get double the speed and, if one switch fails, the other takes over instantly without the internet even flickering."
  },
  'ptp': {
    score: 78,
    critique: "The 'orchestra conductor' is a strong analogy. The explanation stays focused on the precision requirement which is the key takeaway for High-Frequency Trading or Media customers.",
    jargonFound: ["Nanosecond", "Boundary Clock", "Jitter"],
    simplifiedVersion: "Precision Time (PTP) is like a world-class conductor for an orchestra of switches. While standard time-keeping is 'good enough' to be within a few seconds, PTP makes sure every switch is perfectly in sync down to the billionth of a second. This is mandatory for things like high-speed stock trading where even a tiny delay costs millions."
  },
  'ztp': {
    score: 90,
    critique: "Focuses on the human element (reducing error) which is the primary business driver for automation. Very clear and relatable.",
    jargonFound: ["Provisioning", "DHCP", "Boot-file"],
    simplifiedVersion: "Zero Touch Provisioning (ZTP) is like a 'Self-Setup' mode for network hardware. Instead of an engineer having to manually type in thousands of lines of code for every new switch, you just plug it in. The switch automatically calls home, grabs its specific instructions, and sets itself up perfectly. It turns a 2-hour job into a 2-minute plug-and-play task."
  },
  'cue': {
    score: 87,
    critique: "Properly identifies the shift from connectivity to experience. Using 'happiness' as a metric is a powerful way to explain Cognitive Wi-Fi's value proposition.",
    jargonFound: ["CUE", "Cognitive", "Interference"],
    simplifiedVersion: "Standard Wi-Fi just checks if your phone is 'plugged in' to the air. Cognitive Wi-Fi (CV-CUE) checks if you are actually having a good experience. It's like having a dedicated technician in every room who constantly checks for interference and 'clears the air' so your video calls stay smooth, even in a crowded office."
  },
  'varp': {
    score: 90,
    critique: "The 'no election' framing is powerful because it directly contrasts with HSRP/VRRP's primary weakness — wasted standby capacity and failover delay. Accurately captures the essence of anycast gateway behavior.",
    jargonFound: ["VARP", "Anycast", "ARP", "HSRP", "VRRP"],
    simplifiedVersion: "Traditional network gateways work like an elected mayor — only one is 'active' at a time, and if the mayor steps down, there's a vote that takes time. Arista VARP is like giving every intersection the same phone number. Any leaf switch can answer your 'which way to the internet?' question immediately — no election, no delay, no wasted capacity sitting on standby."
  },
  'dcqcn': {
    score: 86,
    critique: "The three-actor model accurately captures the DCQCN feedback loop. The 'traffic cop' analogy is strong for explaining reactive rate control. Missing nuance: the distinction between ECN marking rate (Notification Point) and endpoint behavior is important but appropriately simplified here.",
    jargonFound: ["DCQCN", "ECN", "PFC", "RDMA", "Congestion"],
    simplifiedVersion: "DCQCN is a three-way conversation between three actors to prevent traffic jams. The Notification Point (the switch) is a traffic cop who puts a yellow flag on packets when queues start building. The Reaction Point (the sender's NIC) slows down when it sees yellow flags — like a driver easing off the gas. The Congestion Point (the receiver) makes sure the flag reaches the right sender. Together they prevent the gridlock that would force everyone to slam on the brakes — which is what happens without this system."
  },
  'bisection': {
    score: 88,
    critique: "Correctly identifies that bisection bandwidth is a topological property, not just a speed specification. The 'highway vs. country road' analogy captures the asymmetry problem well. Good framing for explaining why non-blocking claims need scrutiny.",
    jargonFound: ["Bisection Bandwidth", "Non-blocking", "Oversubscription", "Clos"],
    simplifiedVersion: "Bisection bandwidth is the total highway capacity between two halves of your network. A switch might have 32 fast ports — but if the highway connecting the left half to the right half can only carry 8 lanes of traffic, the other 24 lanes are stuck at the bottleneck. 'Non-blocking' means the highway has exactly as many lanes as there are endpoints. Oversubscription means you've sold more tickets than the highway can handle — fine on average, but when everyone shows up at once (like an AI training job), everyone slows down."
  },
  'macsec-rotation': {
    score: 84,
    critique: "Correctly distinguishes CAK (long-term) from SAK (session-derived) without requiring the user to understand the full 802.1X-2010 protocol stack. The 'master key vs. session key' analogy is accurate and memorable.",
    jargonFound: ["MACsec", "MKA", "CAK", "SAK", "Key Rotation"],
    simplifiedVersion: "MACsec key rotation is like a hotel using a master key to generate temporary room keys. The master key (CAK) never travels across the network — it never leaves the device. Instead, the two switches use it to derive a temporary session key (SAK) that actually encrypts your traffic. When it's time to rotate, they derive a new session key from the same master — without any interruption to traffic. If someone steals a session key, it expires quickly. The master key stays safe because it was never sent anywhere."
  },
  'allreduce': {
    score: 89,
    critique: "The synchronization barrier concept is the critical insight and is correctly centered. The 'slowest runner gates the whole team' framing accurately explains why tail latency — not average throughput — determines AI training performance.",
    jargonFound: ["AllReduce", "Collective Communication", "Gradient Synchronization", "NCCL"],
    simplifiedVersion: "AllReduce is a mandatory team meeting that every GPU must attend before training can continue. Each GPU computes its local result and then must exchange it with every other GPU so they all agree on the combined answer. The rule: nobody moves forward until everyone has finished. This means the slowest GPU — or the slowest network path to any GPU — determines how fast the entire training job runs. A 1% performance difference in network path quality can cause that path to be the slowest 100% of the time, blocking every training step until it catches up."
  }
};
