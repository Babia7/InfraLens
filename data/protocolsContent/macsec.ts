import { ProtocolDetail } from './types';

export const MACSEC_PROTOCOL: ProtocolDetail = {
    id: 'macsec',
    name: 'MACsec',
    legacyTerm: 'IPsec / GRE tunnels',
    tagline: 'Wire-speed L2 encryption — zero latency, zero trust.',
    description:
      'MACsec (IEEE 802.1AE) encrypts Ethernet frames at the link layer — inside the ASIC forwarding pipeline at full line rate. Unlike IPsec, which adds overhead and latency at L3, MACsec operates transparently at L2 with no visible latency penalty. EOS supports both static CAK (pre-shared) and dynamic MKA (802.1X-based) key management on supported platforms.',
    keyBenefits: [
      'Wire-speed AES-128 or AES-256 encryption with GCM authentication — no CPU overhead.',
      'Link-layer encryption: protects against passive tapping on dark fiber, colo cross-connects, and IDF closets.',
      'MKA (MACsec Key Agreement) automates key rotation without manual intervention or traffic interruption.',
      'Replay protection using per-frame sequence numbers prevents man-in-the-middle injection attacks.',
      'Combines with EVPN segmentation for defense in depth: MACsec encrypts the link, EVPN segments the fabric.',
      'Supported on Arista 7050X4/7280R3/7500R3 and select campus platforms with ASIC-offloaded encryption.'
    ],
    bestPractices: [
      'Deploy MACsec selectively on high-risk links: dark fiber DCI connections, colo cross-connects, and IDF closets with physical access risk — blanket deployment on all links creates key management overhead without proportional security value.',
      'Use AES-256-GCM-XPN for FIPS 140-2 Level 2 compliance (government, DoD, regulated financial environments) — AES-128-GCM is sufficient for most enterprise deployments.',
      'Never configure MACsec fallback to an unprotected association in regulated environments — if the MACsec session fails to establish, fallback to clear-text is a compliance violation.',
      'Verify replay protection window size matches your network jitter — too small a window causes legitimate out-of-order frames to be dropped; too large reduces protection against replay attacks.',
      'Test MACsec configuration with show mac security interfaces and show mac security counters before enabling on production links — a misconfigured cipher suite or key mismatch causes link traffic to drop silently.',
      'For inter-switch MACsec on 400G ZR/ZR+ coherent links, verify platform support — some coherent transport ASICs have MACsec offload constraints at 400G line rate.',
      'Document CAK key material in a secure vault and establish a key rotation procedure — lost CAK keys require a maintenance window to replace and force a link reset.'
    ],
    cliTranslation: [
      {
        legacy: '! IPsec: define transform-set\ncrypto ipsec transform-set MYXFORM esp-aes esp-sha-hmac',
        arista: '! MACsec: define profile with cipher suite\nmac security\n   profile MACSEC-PROFILE\n      cipher aes128-gcm'
      },
      {
        legacy: '! IPsec: crypto map + apply to interface\ncrypto map MYMAP 10 ipsec-isakmp\ninterface Gig0/0\n  crypto map MYMAP',
        arista: '! MACsec: apply profile to interface\ninterface Ethernet1\n   mac security profile MACSEC-PROFILE'
      },
      {
        legacy: '! IPsec: show crypto session\nshow crypto ipsec sa\nshow crypto session',
        arista: '! MACsec: show sessions\nshow mac security\nshow mac security interfaces\nshow mac security counters'
      }
    ],
    masteryPath: [
      {
        level: 'Foundation',
        heading: '802.1AE Basics',
        body: 'MACsec (IEEE 802.1AE) encrypts the payload of each Ethernet frame between two directly connected devices. The MAC header is not encrypted (needed for switching), but the EtherType field is replaced with MACsec EtherType (0x88E5) and a Security Tag (SecTAG) is added. The payload (IP packet) is encrypted with AES-GCM and authenticated with a GCM tag.',
        keyConcept: 'L2 frame encryption · AES-GCM · SecTAG'
      },
      {
        level: 'Logic',
        heading: 'MKA Key Exchange',
        body: 'MACsec Key Agreement (MKA, IEEE 802.1X-2010) manages key distribution. Two long-term keys: CAK (Connectivity Association Key, pre-shared or 802.1X-derived) and CKN (Connectivity Key Name, the CAK identifier). From these, SAKs (Secure Association Keys) are derived per-session and rotate automatically. CAK never traverses the wire — only derived session SAKs do. Key rotation is transparent to traffic.',
        keyConcept: 'CAK → SAK derivation · automatic rotation'
      },
      {
        level: 'Architecture',
        heading: 'EOS Config Patterns',
        body: 'EOS MACsec config: (1) Define a profile under "mac security": cipher suite, key, fallback policy. (2) Apply the profile to the interface. (3) Verify with "show mac security interfaces". Static CAK is simplest; MKA with 802.1X is preferred for automated key management at scale. Both options are in the mac security CLI hierarchy.',
        keyConcept: 'mac security → profile → cipher → key → interface'
      },
      {
        level: 'Architecture',
        heading: 'Compliance & Cipher Selection',
        body: 'For FIPS 140-2 compliance: use AES-256-GCM-XPN (Extended Packet Numbering for 400G+ links). For PCI-DSS: document cipher suite, key length, and replay window as evidence of encryption controls. For NDA-protected DC links: MACsec + EVPN VRF segmentation + NDR monitoring creates a three-layer defense. Replay window size: set to 32 for low-jitter links, 64 for long-haul or high-latency paths.',
        keyConcept: 'AES-256-GCM-XPN · FIPS 140-2 · replay-window 32'
      }
    ],
    overview: {
      title: 'Where MACsec Fits in the Security Stack',
      intro: 'MACsec fills the link-layer encryption gap between physical security and IP-level encryption. It operates between two directly connected devices — it cannot traverse a router or L3 hop. This makes it ideal for specific deployment scenarios where physical access risk exists on the cable path.',
      sections: [
        {
          title: 'MACsec vs IPsec',
          body: 'IPsec encrypts L3 packets, can traverse multiple hops, requires CPU or dedicated crypto hardware, and adds latency. MACsec encrypts L2 frames, works only hop-by-hop, runs in the ASIC at line rate with zero latency, and requires no CPU. Use MACsec for DC fabric links; use IPsec for WAN/VPN where multi-hop encryption is required.',
          bestFor: 'Dark fiber DCI links, colo cross-connects, IDF closets, leaf-spine inter-switch links in regulated environments.'
        },
        {
          title: 'Deployment Decision Matrix',
          body: 'Deploy MACsec when: (1) cable path has uncontrolled physical access (colo, leased fiber), (2) compliance mandate requires link encryption (FedRAMP, PCI-DSS, HIPAA PHI transport), (3) insider threat model includes physical tap risk. Do not deploy when: cost of key management exceeds risk reduction (all-trusted internal DC), or platform does not support hardware offload.',
          bestFor: 'Risk-based selection: colocation, regulated industries, government, financial services DCI.'
        }
      ],
      conclusion: 'MACsec is a point-to-point control. Combine it with EVPN segmentation (VRF isolation), MSS micro-segmentation, and NDR monitoring for layered network security. MACsec alone does not protect against insider threats at the OS layer — it only protects the wire.'
    },
    primer: {
      title: 'CAK vs SAK: The Two Keys of MACsec',
      body: 'MACsec uses a two-level key hierarchy. The CAK (Connectivity Association Key) is the long-term secret — either pre-configured on both switches (static CAK) or distributed via 802.1X authentication. The CAK never appears in clear text on the wire. From the CAK, EOS derives the SAK (Secure Association Key) for each session using NIST-approved KDF. The SAK is the actual encryption key applied to each frame. SAKs rotate periodically (default every 2^32 frames or configurable timer) without traffic interruption — the MKA protocol negotiates a new SAK and both sides switch simultaneously. The security model: even if an attacker captures all encrypted frames, they cannot decrypt them without the CAK; even if they somehow obtain one SAK, it decrypts only frames from that rotation window.'
    },
    roleConfigs: [
      {
        role: 'Static CAK Config',
        description: 'Pre-shared CAK MACsec — simplest deployment, no 802.1X infrastructure required.',
        config: `! Define MAC security profile with static CAK
mac security
   profile MACSEC-DC
      cipher aes128-gcm
      key 0 1234567890ABCDEF1234567890ABCDEF fallback
      mka key-server priority 255
      replay protection window-size 32
!
! Apply to inter-switch link
interface Ethernet1
   mac security profile MACSEC-DC
!
! Verify session established
show mac security interfaces Ethernet1
show mac security counters Ethernet1`
      },
      {
        role: 'MKA Dynamic Config',
        description: 'MKA with automatic SAK rotation — preferred for production environments.',
        config: `mac security
   profile MACSEC-MKA
      cipher aes128-gcm
      ! CAK in hex (minimum 32 hex chars for AES-128)
      key 01 3132333435363738313233343536373831323334353637383132333435363738
      mka session rekey-period 0   ! Rekey on counter rollover
      replay protection window-size 32
!
interface Ethernet1
   mac security profile MACSEC-MKA
!
! Verify MKA session and SAK rotation
show mac security
show mac security interfaces
show mac security detail`
      },
      {
        role: 'AES-256 FIPS Mode',
        description: 'AES-256-GCM-XPN for FIPS 140-2 and high-speed (400G) link compliance.',
        config: `mac security
   profile MACSEC-FIPS
      cipher aes256-gcm-xpn
      key 0 <64-hex-char-cak> fallback
      mka key-server priority 255
      replay protection window-size 64
      ! No fallback to no-encryption
!
interface Ethernet1
   mac security profile MACSEC-FIPS
!
! Confirm cipher negotiated
show mac security interfaces Ethernet1 | include cipher|AES`
      },
      {
        role: 'Fallback Policy',
        description: 'Configure behavior when MACsec fails to establish — allow or deny traffic.',
        config: `mac security
   profile MACSEC-STRICT
      cipher aes128-gcm
      key 0 1234567890ABCDEF1234567890ABCDEF
      ! No fallback line = block traffic if MACsec fails
!
! Compare: permissive fallback (unencrypted allowed)
mac security
   profile MACSEC-PERMISSIVE
      cipher aes128-gcm
      key 0 1234567890ABCDEF1234567890ABCDEF fallback
!
! Check if traffic is flowing encrypted or as fallback
show mac security interfaces Ethernet1 | include Secure|Fallback`
      },
      {
        role: 'MACsec Verification',
        description: 'Validate MACsec session state, counters, and troubleshoot common issues.',
        config: `! Full MACsec status
show mac security
show mac security interfaces
!
! Detailed session state and cipher
show mac security detail
!
! Frame counters (encrypted frames should increment)
show mac security counters
!
! Common failure: key mismatch
! — show mac security will show 'MKA-Failed' or 'CAK-Mismatch'
! Fix: ensure identical CAK hex string on both ends
!
! Common failure: cipher mismatch
! — both ends must configure identical cipher suite
show mac security interfaces | include cipher`
      },
      {
        role: 'Compliance Documentation',
        description: 'Evidence template for regulated environments (PCI-DSS, HIPAA, FedRAMP).',
        config: `! Evidence checklist for MACsec compliance audit:
!
! 1. Cipher suite: AES-128-GCM or AES-256-GCM-XPN
show mac security interfaces | include cipher
!
! 2. Replay protection enabled
show mac security detail | include replay
!
! 3. Session state: Secured (not fallback)
show mac security interfaces | include Secured
!
! 4. Key rotation occurring
show mac security counters | include SAK
!
! 5. No unencrypted fallback in regulated interfaces
! (verify profile has no 'fallback' keyword)
show running-config | section mac.security
!
! 6. Encrypt inter-site and colo links
! Document: which interfaces protected, cipher, rotation period`
      }
    ],
    referenceLinks: [
      { title: 'IEEE 802.1AE MACsec Standard', summary: 'Core specification for frame encryption, SecTAG structure, and GCM-AES cipher.' },
      { title: 'IEEE 802.1X-2010 MKA', summary: 'Key agreement protocol — CAK/SAK management and automatic rotation.' },
      { title: 'Arista MACsec Configuration Guide', summary: 'Platform support matrix, EOS config examples, and FIPS compliance notes.' },
      { title: 'MACsec vs IPsec Comparison', summary: 'Use-case decision guide for link-layer vs network-layer encryption.' }
    ],
    dcContext: {
      small: {
        scale: '2-tier · MACsec on spine↔leaf ISL · GCM-AES-128',
        topologyRole: 'MACsec on all spine-to-leaf ISL links; CAK pre-shared via EOS keychain; GCM-AES-128',
        keyConfig: 'mac security profile ISL-MACSEC\n   cipher aes128-gcm\n   key 0 <cak> ckn <ckn>',
        highlight: 'isl'
      },
      medium: {
        scale: '3-tier · MACsec on all ISL + border uplinks · RADIUS CAK',
        topologyRole: 'MACsec on all ISL and DCI/border uplinks; CAK distributed via RADIUS for centralized management',
        keyConfig: 'mac security profile BORDER-MACSEC\n   cipher aes256-gcm-xpn\n   mka policy MKA-STRICT',
        highlight: 'border'
      },
      large: {
        scale: 'Multi-pod · MACsec everywhere · automated SAK rotation · CKMS',
        topologyRole: 'MACsec on ISL, host NIC-to-leaf, and DCI; automated SAK rotation; CKMS for centralized key management',
        keyConfig: 'mka policy MKA-CKMS\n   key-server priority 16\n   sak-rekey interval 3600',
        highlight: 'all'
      }
    }
  }
