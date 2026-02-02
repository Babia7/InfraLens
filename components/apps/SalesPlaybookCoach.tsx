import React, { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, Filter, ShieldCheck, ThumbsUp, MessageSquare, FileText, Download, BookOpen, Target, Users, Compass, LayoutGrid, Copy, Check } from 'lucide-react';
import { SectionType, SalesPlayContext } from '@/types';
import { RelatedActions } from '@/components/RelatedActions';
import { lifeSciencesPlays } from '@/data/lifesciences';
import { EVIDENCE_LOCKER } from '@/data/evidence';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';

interface SalesPlaybookCoachProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

type Play = {
  id: string;
  vertical: string;
  persona: string;
  talkTrack: string;
  discovery: string[];
  objections: { title: string; response: string }[];
  proofPoints: string[];
  callToActions: string[];
  tags: string[];
  lastUpdated?: string;
  sources?: { title: string; url?: string; summary?: string }[];
  references?: { title: string; url?: string; summary?: string }[];
  regulated?: boolean;
};

const PLAYS: Play[] = [
  {
    id: 'finance',
    vertical: 'Financial Services',
    persona: 'CIO / Trading Ops',
    talkTrack: 'Deterministic latency and operational resilience for trading and market data.',
    discovery: [
      'How do you guarantee latency for market data and risk checks today?',
      'What’s your tolerance for microbursts and packet loss on storage/market feeds?',
      'How do you validate change windows and rollback for production exchanges?'
    ],
    objections: [
      { title: 'We already have low-latency switches', response: 'Layer 1/FPGA for 4ns hops plus consistent EOS state/telemetry lets you prove latency end-to-end, not just in a spec sheet.' },
      { title: 'MACsec will slow us down', response: 'On supported optics/platforms, MACsec has minimal overhead. We validate throughput and MTU headroom before enablement.' }
    ],
    proofPoints: [
      '7130 Layer 1 latency: sub-10ns for fanout/tapping',
      'Deep buffer R-series prevents incast drops for storage feeds',
      'Change control with CloudVision snapshots + rollback'
    ],
    callToActions: [
      'Run a microburst demo with R-series deep buffers',
      'Show telemetry replay to prove deterministic latency',
      'Offer a MACsec performance validation on target optics'
    ],
    tags: ['Latency', 'Compliance', 'Finance'],
    lastUpdated: 'FY25-Q1',
    sources: [
      { title: 'Validated Design: Cloud Spine-Leaf', url: 'https://www.arista.com/en/solutions/validated-designs', summary: 'Baseline for trading/market data fabrics.' },
      { title: 'CVaaS Change Windows', summary: 'Use snapshots/rollback for maintenance on trading floors.' }
    ]
  },
  ...lifeSciencesPlays,
  {
    id: 'cloud',
    vertical: 'Cloud / SaaS',
    persona: 'Head of Cloud Platform',
    talkTrack: 'Elastic scale with deterministic networking and observability for multi-tenant services.',
    discovery: [
      'Where do you hit scale/latency ceilings today (east-west, data services, ingress)?',
      'How do you handle noisy-neighbor and incast issues?',
      'What’s your change approval + rollback path for production pushes?'
    ],
    objections: [
      { title: 'We’re fully automated already', response: 'We align with your CI/CD: AVD produces intent, CloudVision handles drift/rollback; we don’t replace your pipelines, we strengthen their network guardrails.' },
      { title: 'Telemetry is “good enough”', response: 'Streaming state plus time-machine replay catches gray failures SNMP misses; proven in large SaaS fabrics.' }
    ],
    proofPoints: [
      'Non-blocking L3LS with EVPN RT-5 for scale-out services',
      'Telemetry replay for gray failure RCA; sFlow/ERSPAN ready',
      'API-first: AVD + CVaaS integrate with CI/CD'
    ],
    callToActions: [
      'Pilot a single L3LS pod with AVD + CV drift detection',
      'Run an ERSPAN/sFlow proof to catch gray failures',
      'Map noisy-neighbor incast to deep-buffer mitigation'
    ],
    tags: ['AI/ML', 'Operations', 'Telemetry'],
    lastUpdated: 'FY25-Q1',
    sources: [
      { title: 'Validated Design: Cloud Spine-Leaf', url: 'https://www.arista.com/en/solutions/validated-designs', summary: 'Baseline for scale-out services.' },
      { title: 'Telemetry Replay', summary: 'Use CV streaming/time machine for gray failure RCA.' }
    ]
  },
  {
    id: 'msp',
    vertical: 'Managed Services / Partners',
    persona: 'Services Director / Partner SE',
    talkTrack: 'Package repeatable services (segmentation, DCI, MACsec) with predictable delivery and rollback.',
    discovery: [
      'Which repeatable services do you deliver most often?',
      'How do you handle version control and rollback across customers?',
      'What’s your onboarding experience for new SEs/partners?'
    ],
    objections: [
      { title: 'Too many customer variants', response: 'Use AVD intent + service templates; CloudVision keeps per-customer state and rollbacks, reducing variance risk.' },
      { title: 'We need fast training for new hires', response: 'Single EOS image across services plus guided runbooks; Linux/Protocol labs for skills ramp.' }
    ],
    proofPoints: [
      'Service templates: DCI, segmentation, MACsec with RT schemas',
      'CloudVision change control per customer tenant',
      'Training accelerators: Linux Lab + Protocol Lab alignment'
    ],
    callToActions: [
      'Define one service template and push via AVD to a lab',
      'Show CVaaS per-tenant rollback for a change window',
      'Bundle Linux/Protocol labs into partner onboarding'
    ],
    tags: ['Automation', 'Services', 'Operations'],
    lastUpdated: 'FY25-Q1',
    sources: [
      { title: 'Validated Design: Cloud Spine-Leaf', summary: 'Reusable templates for services.' },
      { title: 'CVaaS Change Control', summary: 'Per-tenant rollback for partner services.' }
    ]
  },
  {
    id: 'healthcare',
    vertical: 'Healthcare',
    persona: 'CTO / Compliance',
    talkTrack: 'Reliable, compliant transport for clinical apps and imaging with unified operations.',
    discovery: [
      'Which clinical apps are most sensitive to jitter or downtime?',
      'How do you segment clinical vs guest vs IoT today?',
      'What is your audit story for network changes?'
    ],
    objections: [
      { title: 'Too risky to touch production', response: 'We use pre-flight validation, snapshots, and defined rollback in CloudVision. Safe-change flows minimize downtime risk.' },
      { title: 'We need vendor diversity', response: 'Arista interoperates via standards (EVPN, OSPF, BGP). We can start with a contained domain and prove interoperability.' }
    ],
    proofPoints: [
      'EVPN segmentation with Anycast Gateway—no STP outages',
      'CloudVision change control: approval + auto-rollback',
      'MACsec and role-based segmentation for compliance'
    ],
    callToActions: [
      'Pilot segmented VLAN/VRF for clinical apps',
      'Show change approval/rollback in a live demo',
      'Share validated design for campus + imaging backhaul'
    ],
    tags: ['Compliance', 'Segmentation', 'MACsec'],
    lastUpdated: 'FY25-Q1',
    sources: [
      { title: 'Validated Design: Campus', summary: 'Segmentation and DHCP helper patterns.' },
      { title: 'MACsec Validation', summary: 'Ensure MTU/headroom for clinical encryption.' }
    ],
    regulated: true
  },
  {
    id: 'enterprise',
    vertical: 'Enterprise / SLED',
    persona: 'Infrastructure Director',
    talkTrack: 'Simplify operations: one EOS image across campus, DC, WAN with open automation.',
    discovery: [
      'How many images/vendors are you managing today?',
      'Where do tickets pile up—Wi-Fi, campus core, DC?',
      'How do you validate configurations before rollout?'
    ],
    objections: [
      { title: 'Automation is too complex', response: 'Start with AVD-generated configs and CloudVision for intent + snapshot-based change control. No heavy scripting to begin.' },
      { title: 'Risk of outages during migration', response: 'We do staged cutovers with health checks, and can run EVPN/VRF-lite alongside current designs to reduce blast radius.' }
    ],
    proofPoints: [
      'Single EOS binary across campus/DC/WAN',
      'AVD + CloudVision: intent-driven configs and rollbacks',
      'Telemetry “time machine” for RCA and compliance'
    ],
    callToActions: [
      'Spin a small AVD-generated pod and compare ops time',
      'Show CV telemetry replay for real RCA',
      'Offer a migration plan with rollback checkpoints'
    ],
    tags: ['Operations', 'Migration', 'Cost'],
    lastUpdated: 'FY25-Q1',
    sources: [
      { title: 'Validated Design: Cloud Spine-Leaf', summary: 'Baseline for enterprise fabrics.' },
      { title: 'Change Simulation', summary: 'Use CV snapshots + rollback checkpoints.' }
    ]
  },
  {
    id: 'wireless-campus-eng',
    vertical: 'Campus / Wireless',
    persona: 'Network Engineer',
    talkTrack: 'Controllerless wireless with edge intelligence and deep telemetry to cut MTTR and remove controller bottlenecks vs. Cisco-style controller-centric stacks.',
    discovery: [
      'Where do wireless tickets pile up—roaming, RF, onboarding, or policy drift?',
      'How long does it take to isolate a client issue end-to-end today?',
      'What happens to WLAN operations during controller maintenance or failures?',
      'How do you validate wireless changes before a site-wide rollout?'
    ],
    objections: [
      { title: 'We depend on Cisco controllers for centralized control', response: 'You still get centralized visibility and policy. The difference is the control intelligence lives at the edge/AP, removing a single failure domain and keeping local decisions close to RF reality.' },
      { title: 'We already have telemetry', response: 'Arista focuses on per-client experience, roam timelines, and RF health over time. It shortens root-cause analysis without packet captures or guesswork.' },
      { title: 'Controllerless sounds risky', response: 'It reduces blast radius. Sites continue enforcing policy even if upstream tools are unavailable, while CloudVision provides fleet-wide visibility and change control.' }
    ],
    proofPoints: [
      'Edge/AP intelligence for local decisioning and resilient site operations',
      'Per-client journey and roaming event visibility for faster RCA',
      'Template-based SSID/policy rollout with change tracking'
    ],
    callToActions: [
      'Demo a client journey trace + roaming timeline',
      'Show controllerless resiliency during a simulated outage',
      'Pilot one site with template-based SSID/policy rollout'
    ],
    tags: ['Wireless', 'Campus', 'Telemetry', 'Controllerless', 'Operations'],
    lastUpdated: 'FY25-Q1'
  },
  {
    id: 'wireless-campus-arch',
    vertical: 'Campus / Wireless',
    persona: 'Network Architect',
    talkTrack: 'Unify wired + wireless policy and telemetry with controllerless edge intelligence, reducing failure domains common to controller-centric incumbents.',
    discovery: [
      'How do you enforce consistent segmentation across wired and wireless today?',
      'What is your failure domain when the controller layer is degraded?',
      'How do you audit wireless changes for compliance and rollback readiness?',
      'Where do you want your system of record for wireless state and policy?'
    ],
    objections: [
      { title: 'Centralized control is mandatory', response: 'Centralized visibility and policy remain—controllerless simply moves decisioning to the edge/AP to remove controller bottlenecks and single points of failure.' },
      { title: 'We can’t disrupt our Cisco-based campus design', response: 'Arista can start with a contained domain or new site. The goal is to prove telemetry depth, change safety, and operational savings before broader migration.' }
    ],
    proofPoints: [
      'Unified policy intent across wired + wireless with consistent enforcement',
      'Telemetry-first operations for audit trails and compliance reporting',
      'Change control workflows aligned to campus segmentation standards'
    ],
    callToActions: [
      'Run a policy alignment workshop (wired + wireless)',
      'Map a phased migration with rollback checkpoints',
      'Produce a telemetry-based wireless service health report'
    ],
    tags: ['Wireless', 'Campus', 'Architecture', 'Telemetry', 'Controllerless'],
    lastUpdated: 'FY25-Q1'
  },
  {
    id: 'wireless-campus-eng-troubleshooting',
    vertical: 'Campus / Wireless',
    persona: 'Network Engineer',
    talkTrack: 'Reduce wireless MTTR with client‑level telemetry, roam timelines, and edge‑based decisioning—without the controller bottleneck of incumbents.',
    discovery: [
      'How often do you need packet captures to diagnose Wi‑Fi issues?',
      'Which metrics are hardest to access during a user complaint (RSSI/SNR, retries, roam events)?',
      'What’s your current mean time to identify root cause for wireless tickets?',
      'How do you validate that a change improved client experience?'
    ],
    objections: [
      { title: 'We already have dashboards', response: 'Arista focuses on per‑client journey and roam timelines, not just AP health. That’s what shortens MTTR when users complain about “slow Wi‑Fi.”' },
      { title: 'Controller telemetry is enough', response: 'Controllerless shifts intelligence to the edge/AP, so local decisions and telemetry remain available without centralized bottlenecks.' }
    ],
    proofPoints: [
      'Per‑client experience views reduce “hunt and guess” troubleshooting',
      'Roam event timelines reveal RF or policy‑driven handoff issues',
      'Edge/AP telemetry remains available even during upstream disruptions'
    ],
    callToActions: [
      'Run a live client‑journey demo with a roaming device',
      'Compare MTTR on a real ticket with telemetry‑first workflow',
      'Show before/after change impact on client experience'
    ],
    tags: ['Wireless', 'Campus', 'Telemetry', 'Operations', 'Troubleshooting'],
    lastUpdated: 'FY25-Q1'
  },
  {
    id: 'wireless-campus-eng-security',
    vertical: 'Campus / Wireless',
    persona: 'Network Engineer',
    talkTrack: 'Simplify secure onboarding and segmentation with controllerless policy enforcement at the edge—fewer moving parts than controller‑centric incumbents.',
    discovery: [
      'How do you enforce consistent access policy across wired and wireless?',
      'What’s your guest onboarding and BYOD workflow today?',
      'How do you segment IoT or untrusted devices without breaking user experience?',
      'How do you audit who had access when an incident occurs?'
    ],
    objections: [
      { title: 'Wireless security needs a controller', response: 'Policy is still centrally defined, but enforcement and decisioning happen at the edge/AP, reducing single‑point failure risk.' },
      { title: 'Segmentation is too complex', response: 'Arista emphasizes template‑based policy and telemetry to validate enforcement—less manual tuning than controller‑centric stacks.' }
    ],
    proofPoints: [
      'Edge policy enforcement keeps access control resilient at the site',
      'Consistent segmentation across wired + wireless with audit trails',
      'Telemetry‑backed visibility into client access and policy outcomes'
    ],
    callToActions: [
      'Map wired/wireless policy alignment and identify gaps',
      'Pilot a secure guest onboarding flow with audit visibility',
      'Show policy enforcement validation from client telemetry'
    ],
    tags: ['Wireless', 'Campus', 'Security', 'Segmentation', 'Controllerless'],
    lastUpdated: 'FY25-Q1'
  }
];

const personas = Array.from(new Set(PLAYS.map((p) => p.persona)));
const verticals = Array.from(new Set(PLAYS.map((p) => p.vertical)));
const tags = Array.from(new Set(PLAYS.flatMap((p) => p.tags)));

export const SalesPlaybookCoach: React.FC<SalesPlaybookCoachProps> = ({ onBack, onNavigate }) => {
  const [verticalFilter, setVerticalFilter] = useState<string>('All');
  const [personaFilter, setPersonaFilter] = useState<string>('All');
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [copiedPlay, setCopiedPlay] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(() => localStorage.getItem('sales_play_search') || '');
  const [tagFilter, setTagFilter] = useState<string>(() => localStorage.getItem('sales_play_tag') || 'All');
  const [openSourceId, setOpenSourceId] = useState<string | null>(null);
  const [dealCustomer, setDealCustomer] = useState<string>(() => localStorage.getItem('sales_play_customer') || '');
  const [dealStage, setDealStage] = useState<string>(() => localStorage.getItem('sales_play_stage') || '');
  const [dealPain, setDealPain] = useState<string>(() => localStorage.getItem('sales_play_pain') || '');
  const [dealSuccess, setDealSuccess] = useState<string>(() => localStorage.getItem('sales_play_success') || '');
  const [savedDeals, setSavedDeals] = useState<{ id: string; customer: string; stage: string; vertical?: string; persona?: string; pain?: string; success?: string }[]>(() => {
    try {
      const saved = localStorage.getItem('sales_play_deals');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const filteredPlays = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return PLAYS.filter((p) => {
      const vMatch = verticalFilter === 'All' || p.vertical === verticalFilter;
      const pMatch = personaFilter === 'All' || p.persona === personaFilter;
      const tagMatch = tagFilter === 'All' || p.tags.includes(tagFilter);
      const textMatch =
        !term ||
        p.talkTrack.toLowerCase().includes(term) ||
        p.discovery.some((d) => d.toLowerCase().includes(term)) ||
        p.objections.some((o) => o.title.toLowerCase().includes(term) || o.response.toLowerCase().includes(term));
      return vMatch && pMatch && tagMatch && textMatch;
    });
  }, [verticalFilter, personaFilter, tagFilter, searchTerm]);

  const handleExport = (play: Play) => {
    const contextLines = [
      dealCustomer ? `- Customer: ${dealCustomer}` : '',
      dealStage ? `- Stage: ${dealStage}` : '',
      dealPain ? `- Main Pain: ${dealPain}` : '',
      dealSuccess ? `- Success Metric: ${dealSuccess}` : ''
    ].filter(Boolean).join('\n');

    const md = `# ${play.vertical} · ${play.persona}

## Why it matters
${play.talkTrack}

${contextLines ? `## Deal Context\n${contextLines}\n` : ''}

## Discovery
${play.discovery.map((d) => `- ${d}`).join('\n')}

## Objections & Responses
${play.objections.map((o) => `- **${o.title}**: ${o.response}`).join('\n')}

## Proof Points
${play.proofPoints.map((p) => `- ${p}`).join('\n')}

## Calls to Action
${play.callToActions.map((c) => `- ${c}`).join('\n')}

---
Generated by Sales Playbook Coach • Keep messaging grounded to validated designs and Evidence Locker artifacts.`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${play.vertical.replace(/\\s+/g, '-')}-playbook.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    localStorage.setItem('sales_play_search', searchTerm);
    localStorage.setItem('sales_play_tag', tagFilter);
    localStorage.setItem('sales_play_customer', dealCustomer);
    localStorage.setItem('sales_play_stage', dealStage);
    localStorage.setItem('sales_play_pain', dealPain);
    localStorage.setItem('sales_play_success', dealSuccess);
    localStorage.setItem('sales_play_deals', JSON.stringify(savedDeals));
  }, [searchTerm, tagFilter, dealCustomer, dealStage, dealPain, dealSuccess]);

  const pushToNarrative = (play: Play) => {
    const payload = {
      persona: play.persona,
      vertical: play.vertical,
      objections: play.objections,
      proofPoints: play.proofPoints,
      dealContext: {
        customer: dealCustomer || undefined,
        stage: dealStage || undefined,
        pain: dealPain || undefined,
        successMetric: dealSuccess || undefined
      },
      updatedAt: Date.now()
    };
    localStorage.setItem('sales_play_context', JSON.stringify(payload));
    setStatusMsg(`Sent ${play.vertical} / ${play.persona} to Narrative Studio`);
    if (onNavigate) onNavigate(SectionType.NARRATIVE_PLAYBOOK);
  };

  const saveDealContext = (play?: Play) => {
    const entry = {
      id: `${Date.now()}`,
      customer: dealCustomer || 'Unnamed',
      stage: dealStage || 'Unspecified',
      vertical: play?.vertical,
      persona: play?.persona,
      pain: dealPain || undefined,
      success: dealSuccess || undefined
    };
    setSavedDeals((prev) => [entry, ...prev].slice(0, 5));
    setStatusMsg(`Saved deal: ${entry.customer} (${entry.stage})`);
  };

  const loadDealContext = (id: string) => {
    const match = savedDeals.find((d) => d.id === id);
    if (!match) return;
    setDealCustomer(match.customer || '');
    setDealStage(match.stage || '');
    setDealPain(match.pain || '');
    setDealSuccess(match.success || '');
    if (match.vertical) setVerticalFilter(match.vertical);
    if (match.persona) setPersonaFilter(match.persona);
    setStatusMsg(`Loaded deal: ${match.customer}`);
  };

  return (
    <div className="min-h-screen bg-page-bg text-primary flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_15%_-10%,rgba(16,185,129,0.16),transparent_60%),radial-gradient(900px_500px_at_90%_10%,rgba(59,130,246,0.14),transparent_60%)]" />
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card-bg/90 backdrop-blur z-20 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="group p-2 text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Target size={18} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-tight leading-none">Sales Playbook Coach</h1>
              <span className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-1 block">Vertical-ready talk tracks</span>
            </div>
          </div>
        </div>
        {onNavigate && (
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate(SectionType.NARRATIVE_PLAYBOOK)} className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-400 hover:text-primary">
              Narrative Playbook →
            </button>
            <button onClick={() => onNavigate(SectionType.VALIDATED_DESIGN_NAVIGATOR)} className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400 hover:text-primary">
              Validated Designs →
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 p-6 md:p-10 space-y-8 relative z-10">
        <RelatedActions
          actions={[
            ...(onNavigate ? [{
              label: 'Narrative Studio',
              onClick: () => onNavigate(SectionType.NARRATIVE_PLAYBOOK),
              icon: <FileText size={12} />,
              tone: 'blue'
            }] : []),
          ...(onNavigate ? [{
            label: 'Validated Designs',
            onClick: () => onNavigate(SectionType.VALIDATED_DESIGN_NAVIGATOR),
            icon: <Compass size={12} />,
            tone: 'emerald'
          }] : []),
            ...(onNavigate ? [{
              label: 'Apps',
              onClick: () => onNavigate(SectionType.APPS),
              icon: <LayoutGrid size={12} />
            }] : [])
          ]}
        />
        <section className="p-6 rounded-3xl border border-border bg-card-bg/90 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
              <Users size={14} className="text-emerald-400" /> Persona & Vertical aware
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary leading-tight">Coaching for Arista account teams.</h2>
            <p className="text-primary opacity-80 text-base md:text-lg leading-relaxed">
              Filter by vertical/persona, get discovery, objection handling, proof points, and CTAs. Export a quick Markdown play for your deal.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold border border-emerald-400/40 text-emerald-400 bg-emerald-500/5">Updated: FY25</span>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold border border-blue-400/40 text-blue-400 bg-blue-500/5">Export: .MD</span>
            <button
              onClick={() => saveDealContext()}
              className="px-3 py-1 rounded-full text-[11px] font-semibold border border-emerald-400/50 text-primary bg-card-bg hover:border-emerald-400 transition"
            >
              Save Deal Context
            </button>
          </div>
        </section>
        {statusMsg && (
          <div className="px-4 py-3 rounded-xl border border-emerald-400/40 bg-emerald-500/10 text-sm text-primary shadow-[0_10px_30px_-22px_rgba(16,185,129,0.6)]">
            {statusMsg}
          </div>
        )}

        <section className="p-4 rounded-2xl border border-border bg-card-bg/70 shadow-[0_18px_40px_-32px_rgba(0,0,0,0.85)] grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-4 flex items-center gap-2 text-secondary text-sm">
            <Target size={14} className="text-emerald-400" /> Deal Context (local only)
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-secondary">Customer</label>
            <input
              value={dealCustomer}
              onChange={(e) => setDealCustomer(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-card-bg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              placeholder="Acme Bio"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-secondary">Stage</label>
            <select
              value={dealStage}
              onChange={(e) => setDealStage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-card-bg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
            >
              {['', 'Discovery', 'Validation/POC', 'Negotiation', 'Closed'].map((s) => (
                <option key={s || 'none'} value={s}>{s || 'Select'}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-secondary">Main Pain</label>
            <input
              value={dealPain}
              onChange={(e) => setDealPain(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-card-bg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              placeholder="Audit risk / MTTR"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-secondary">Success Metric</label>
            <input
              value={dealSuccess}
              onChange={(e) => setDealSuccess(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-card-bg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              placeholder="Cut MTTR 50%, pass audit"
            />
          </div>
          {savedDeals.length > 0 && (
            <div className="md:col-span-4 bg-card-bg/70 border border-border rounded-xl p-3 space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">Saved Deals</div>
              <div className="flex flex-wrap gap-2">
                {savedDeals.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => loadDealContext(d.id)}
                    className="px-3 py-2 rounded-lg border border-border text-xs text-secondary hover:text-primary hover:border-emerald-400/50 transition"
                  >
                    {d.customer} · {d.stage}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="p-4 rounded-2xl border border-border bg-card-bg/70 shadow-[0_18px_40px_-32px_rgba(0,0,0,0.85)] flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 text-secondary text-sm">
            <Filter size={14} className="text-emerald-400" /> Filters
          </div>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search discovery/objections/talk track"
            className="px-3 py-2 rounded-lg border border-border bg-card-bg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-emerald-400 flex-1 min-w-[200px]"
          />
          <select
            value={verticalFilter}
            onChange={(e) => setVerticalFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-card-bg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="All">All Verticals</option>
            {verticals.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          <select
            value={personaFilter}
            onChange={(e) => setPersonaFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-card-bg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="All">All Personas</option>
            {personas.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">Tags</span>
            <button
              onClick={() => setTagFilter('All')}
              className={`px-3 py-1 rounded-full text-[11px] border transition ${tagFilter === 'All' ? 'border-emerald-400/60 text-primary bg-card-bg' : 'border-border text-secondary hover:text-primary'}`}
            >
              All
            </button>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTagFilter(t)}
                className={`px-3 py-1 rounded-full text-[11px] border transition ${tagFilter === t ? 'border-emerald-400/60 text-primary bg-card-bg' : 'border-border text-secondary hover:text-primary'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {filteredPlays.length === 0 && (
          <div className="p-6 rounded-2xl border border-border bg-card-bg text-secondary">
            No plays match that filter. Try selecting “All” or another persona/vertical.
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPlays.map((play) => (
            <div key={play.id} className="p-6 rounded-3xl border border-border bg-card-bg/95 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)] space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-secondary">{play.vertical}</p>
                  <h3 className="text-2xl font-serif font-bold text-primary">{play.persona}</h3>
                  <p className="text-sm text-primary opacity-80 mt-2 leading-relaxed">{play.talkTrack}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {play.tags.map((t) => (
                      <span key={`${play.id}-${t}`} className="px-2 py-1 rounded-full text-[10px] border border-border text-secondary">{t}</span>
                    ))}
                    {play.regulated && <span className="px-2 py-1 rounded-full text-[10px] border border-amber-400/60 text-amber-300 bg-amber-500/5">Regulated</span>}
                    {play.lastUpdated && <span className="px-2 py-1 rounded-full text-[10px] border border-border text-secondary">Updated {play.lastUpdated}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleExport(play)}
                    className="px-2 py-1 rounded-lg border border-border text-xs text-secondary hover:text-primary hover:border-emerald-400/40 transition inline-flex items-center gap-1 bg-card-bg/60"
                  >
                    <Download size={12} /> Export
                  </button>
                  <button
                    onClick={() => pushToNarrative(play)}
                    className="px-2 py-1 rounded-lg border border-border text-xs text-secondary hover:text-primary hover:border-blue-400/60 transition inline-flex items-center gap-1 bg-card-bg/60"
                  >
                    <FileText size={12} /> Sync to Narrative
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-secondary flex items-center gap-2">
                  <BookOpen size={14} className="text-blue-400" /> Discovery
                </p>
                <ul className="space-y-2">
                  {play.discovery.map((d) => (
                    <li key={d} className="text-sm text-primary opacity-80 flex gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-secondary flex items-center gap-2">
                  <ShieldCheck size={14} className="text-amber-400" /> Objections
                </p>
                <ul className="space-y-3">
                  {play.objections.map((o) => (
                    <li key={o.title} className="text-sm text-primary opacity-80 leading-relaxed">
                      <span className="font-semibold text-primary">{o.title}:</span> {o.response}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-secondary flex items-center gap-2">
                  <ThumbsUp size={14} className="text-emerald-400" /> Proof Points
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(play.proofPoints.join('\n'));
                    setCopiedPlay(play.id);
                    setTimeout(() => setCopiedPlay(null), 2000);
                  }}
                  className="text-[11px] text-secondary hover:text-primary inline-flex items-center gap-1 px-2 py-1 rounded border border-border bg-card-bg/60"
                >
                  {copiedPlay === play.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />} {copiedPlay === play.id ? 'Copied' : 'Copy proof kit'}
                </button>
                <ul className="space-y-2">
                  {play.proofPoints.map((p) => (
                    <li key={p} className="text-sm text-primary opacity-80 flex gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-1 text-[11px] text-secondary mt-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary"><ShieldCheck size={12} className="text-emerald-400" /> Evidence hooks</div>
                  {(
                    EVIDENCE_LOCKER.filter((e) => {
                      if (play.vertical === 'Life Sciences') return e.tags?.includes('Life Sciences');
                      return e.tags?.includes('Navigator') || e.tags?.includes('Protocol');
                    }).slice(0, 2)
                  ).map((evidence) => (
                    <div key={`${play.id}-${evidence.id}`} className="flex items-center justify-between gap-2 rounded-lg border border-border px-2 py-1 bg-card-bg/70">
                      <span className="text-[11px] text-secondary">{evidence.title}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(evidence.command);
                          setCopiedPlay(`${play.id}-${evidence.id}`);
                          setTimeout(() => setCopiedPlay(null), 2000);
                        }}
                        className="inline-flex items-center gap-1 text-[10px] text-secondary hover:text-primary"
                      >
                        {copiedPlay === `${play.id}-${evidence.id}` ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />} Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-secondary flex items-center gap-2">
                  <MessageSquare size={14} className="text-blue-400" /> Calls to Action
                </p>
                <ul className="space-y-2">
                  {play.callToActions.map((c) => (
                    <li key={c} className="text-sm text-primary opacity-80 flex gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {(play.sources || play.references) && (
                <div className="space-y-2">
                  <button
                    onClick={() => setOpenSourceId(openSourceId === play.id ? null : play.id)}
                    className="text-[11px] font-mono uppercase tracking-[0.25em] text-secondary flex items-center gap-2 px-2 py-1 rounded-lg border border-border hover:border-blue-400/40"
                  >
                    <BookOpen size={14} className="text-blue-400" /> Sources
                  </button>
                  {openSourceId === play.id && (
                    <div className="space-y-1 text-sm text-secondary border border-border rounded-lg p-3 bg-card-bg/60">
                      {(play.sources || play.references || []).map((s) => (
                        <div key={`${play.id}-${s.title}`} className="flex items-center justify-between gap-2">
                          <div>
                            <div className="text-primary text-sm font-semibold">{s.title}</div>
                            {s.summary && <div className="text-xs text-secondary">{s.summary}</div>}
                          </div>
                          {s.url && (
                            <a className="text-[11px] text-blue-400 hover:text-primary underline" href={s.url} target="_blank" rel="noreferrer">
                              Link
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </section>
        <EvidenceDrawer contextTags={['Sales', 'Life Sciences']} />
      </main>
    </div>
  );
};
