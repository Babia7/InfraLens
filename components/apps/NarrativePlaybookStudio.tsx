import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Users,
  Building2,
  ShieldCheck,
  Play,
  Download,
  MonitorPlay,
  SplitSquareVertical as Branch,
  FolderTree,
  Command,
  Clipboard,
  ListChecks,
  Target,
  FileText,
  Compass
} from 'lucide-react';
import { PLAYBOOKS } from '@data/playbookData';
import { SalesPlayContext, TeleprompterContext, SectionType } from '@/types';
import { RelatedActions } from '@/components/RelatedActions';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';
import { lifeSciencesPlays } from '@/data/lifesciences';

interface NarrativePlaybookStudioProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

export const NarrativePlaybookStudio: React.FC<NarrativePlaybookStudioProps> = ({ onBack, onNavigate }) => {
  const [audience, setAudience] = useState('Executive');
  const [vertical, setVertical] = useState('AI / HPC');
  const [teleprompter, setTeleprompter] = useState(false);
  const [completedBeats, setCompletedBeats] = useState<Record<string, boolean>>({});
  const [taskState, setTaskState] = useState<Record<string, boolean>>({});
  const [accordionOpen, setAccordionOpen] = useState<Record<string, boolean>>({
    pacing: true,
    discovery: true,
    proof: true,
    success: true,
    followups: false,
    objections: false,
    snippets: false
  });
  const [salesContext, setSalesContext] = useState<SalesPlayContext | null>(null);
  const [pendingSalesContext, setPendingSalesContext] = useState<SalesPlayContext | null>(null);
  const lifeSciencesPlay = useMemo(() => {
    if (vertical !== 'Life Sciences') return null;
    if (salesContext) {
      const match = lifeSciencesPlays.find((p) => p.persona === salesContext.persona);
      if (match) return match;
    }
    return lifeSciencesPlays[0];
  }, [vertical, salesContext]);

  const filtered = useMemo(
    () =>
      PLAYBOOKS.filter(
        (p) =>
          (audience ? p.audience === audience : true) &&
          (vertical ? p.vertical === vertical : true)
      ),
    [audience, vertical]
  );

  const active = filtered[0] ?? PLAYBOOKS[0];
  const totalBeats = active?.beats.length ?? 0;
  const deliveredCount = Object.entries(completedBeats).filter(([key, val]) => val && key.startsWith(active?.id ?? '')).length;
  const completionPct = totalBeats > 0 ? Math.round((deliveredCount / totalBeats) * 100) : 0;
  const followUpsDone = Object.values(taskState).filter(Boolean).length;

  const objectionBank = useMemo(
    () => [
      { label: 'Vendor Lock-In', response: 'Standards-first (BGP EVPN/VXLAN), open eAPI, no mandatory controller. Swap fabrics without rewriting apps.' },
      { label: 'Upgrade Risk', response: 'ISSU + SysDB state isolation; hitless agent restarts; tech-support bundles and CV snapshots for rollback evidence.' },
      { label: 'East-West Visibility', response: 'Inline mirror/TAP aggregation (DANZ), ERSPAN with metadata, deterministic path tracing, and CV streaming telemetry.' },
      { label: 'Compliance / Audit', response: 'Immutable change records via CV snapshots; RBAC + key audits; eAPI logging; tech-support bundles as audit artifacts.' },
      { label: 'Supportability', response: 'Unified EOS binary across domains reduces training surface; TAC-ready artifacts (logs, pcaps) generated on-box.' }
    ],
    []
  );
  const effectiveObjectionBank = useMemo(() => {
    const bank = [...objectionBank];
    if (lifeSciencesPlay) {
      bank.unshift(...lifeSciencesPlay.objections.map((o) => ({ label: o.title, response: o.response })));
    }
    if (salesContext?.objections?.length) {
      const mapped = salesContext.objections.map((o) => ({ label: o.title, response: o.response }));
      return [...mapped, ...bank];
    }
    return bank;
  }, [salesContext, objectionBank, lifeSciencesPlay]);

  const snippetDeck = useMemo(
    () => [
      { title: 'Outcome-first opener', body: '“In 10 minutes I’ll show you how we cut your upgrade window in half and give you forensic state if anything slips.”' },
      { title: 'Telemetry hook', body: '“Every state change is streamed; you can time-travel any incident to prove root cause.”' },
      { title: 'Security hook', body: '“Segmentation + observability: VRFs/EVPN for policy, DANZ/ERSPAN for evidence, RBAC for controls.”' },
      { title: 'Cost hook', body: '“Unified EOS cuts OpEx: one training track, one binary, repeatable automation across campus, DC, cloud.”' },
      { title: 'AI fabric hook', body: '“Rail-aligned non-blocking fabrics with deterministic latency for GPUs; avoid soft failures before they surface in training runs.”' }
    ],
    []
  );

  const toggleBeat = (key: string) => {
    setCompletedBeats((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleTask = (key: string) => {
    setTaskState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const proofKits = useMemo(
    () => ({
      'AI / HPC': [
        { title: 'Deterministic latency trace', cmd: 'bash tools/pathtrace.sh --fabric ai --duration 60 --export traces.json', why: 'Shows rail alignment + lossless behavior for GPU jobs.' },
        { title: 'Telemetry snapshot', cmd: 'cv-cli snapshots create --fabric ai --paths spine,leaf --label \"gpu-run\"', why: 'Proves time travel + audit trail for RCA.' },
        { title: 'Flow replay', cmd: 'python tools/traffic-replay.py --profile training --pps 400k', why: 'Demonstrates predictable throughput during model runs.' }
      ],
      Enterprise: [
        { title: 'Zero Trust path check', cmd: 'tools/flow-validate --tenant finance --vrf secure-edge --trace', why: 'Validates segmentation policy + observability.' },
        { title: 'Upgrade dry run', cmd: 'cv-cli change-control simulate --plan issu-quarterly', why: 'Shows ISSU rehearsal + blast-radius control.' },
        { title: 'Streaming telemetry', cmd: 'cv-cli stream watch --device leaf1 --metrics cpu,memory,flow', why: 'Displays real-time state for ops readiness.' }
      ],
      Finance: [
        { title: 'ISSU rehearsal', cmd: 'bash tools/issu-guardrails.sh --fabric trading --precheck', why: 'Highlights maintenance safety for trading floors.' },
        { title: 'Audit artifact', cmd: 'cv-cli snapshots export --fabric trading --format pdf --label audit-ready', why: 'Produces compliance evidence instantly.' },
        { title: 'Deterministic failover', cmd: 'tools/pathtrace --vrf trading --simulate link-down --report', why: 'Shows predictable failover under stress.' }
      ],
      'Life Sciences': lifeSciencesPlay
        ? [
            ...lifeSciencesPlay.proofPoints.map((p) => ({ title: lifeSciencesPlay.persona, cmd: '', why: p })),
            { title: 'Compliance snapshot', cmd: 'cv-cli snapshots create --fabric gxp --label validation --with-logs', why: 'Collects evidence for 21 CFR Part 11 audits.' },
            { title: 'Change record export', cmd: 'cv-cli change-control export --plan gxp-change --format pdf', why: 'Provides immutable change control artifacts.' },
            { title: 'State replay', cmd: 'cv-cli stream replay --device spine1 --at \"-15m\"', why: 'Shows time-travel for incident reconstruction.' }
          ]
        : [
            { title: 'Compliance snapshot', cmd: 'cv-cli snapshots create --fabric gxp --label validation --with-logs', why: 'Collects evidence for 21 CFR Part 11 audits.' },
            { title: 'Change record export', cmd: 'cv-cli change-control export --plan gxp-change --format pdf', why: 'Provides immutable change control artifacts.' },
            { title: 'State replay', cmd: 'cv-cli stream replay --device spine1 --at \"-15m\"', why: 'Shows time-travel for incident reconstruction.' }
          ],
      Campus: [
        { title: 'Client journey', cmd: 'cv-wifi journey --client mac:aa:bb:cc:dd:ee --export report.pdf', why: 'Surfaced auth/DHCP/DNS failures for helpdesk.' },
        { title: 'Noise scan', cmd: 'cv-wifi spectrum --site hq --duration 120', why: 'Visual proof of RF interference handling.' },
        { title: 'Access health', cmd: 'cv-wifi rca --site hq --since 2h', why: 'Auto-RCA storytelling for execs.' }
      ]
    }),
    []
  );

  const discoveryPrompts = useMemo(
    () => {
      const base = [
        'Where do outages or escalations create the most executive pain (SLA, churn, compliance)?',
        'Which workflows burn SE time today—upgrades, onboarding, segmentation, or RCA?',
        'What data or proof would reduce risk for the sponsor (audit pack, rollback, deterministic path)?',
        'Who signs off on success and what metric convinces them (MTTR, ticket deflection, GPU utilization)?',
        'Which integrations are non-negotiable (ITSM, SIEM, CI/CD, observability stack)?'
      ];
      if (lifeSciencesPlay) {
        return [...lifeSciencesPlay.discovery, ...base];
      }
      return base;
    },
    [lifeSciencesPlay]
  );

  const followUps = useMemo(
    () => {
      const base = [
        { id: 'artifact-pack', label: 'Send snapshot + topology sketch + script export' },
        { id: 'pilot-scope', label: 'Propose a 2-week pilot scope with success metrics' },
        { id: 'lab-invite', label: 'Invite champion to co-drive demo in the lab / theater' },
        { id: 'risks', label: 'Document risks/assumptions + mitigation plan (rollback, guardrails)' },
        { id: 'next-meeting', label: 'Schedule exec readout with metrics + agreed decision date' }
      ];
      if (lifeSciencesPlay) {
        base.push({ id: 'audit-pack', label: 'Export audit pack (snapshots, change record, MACsec/throughput proof)' });
      }
      return base;
    },
    [lifeSciencesPlay]
  );

  const personaMetrics = useMemo(
    () => ({
      Executive: ['Time-to-decision', 'Risk reduced (audit/upgrade)', 'Cost-to-serve / OpEx', 'Business continuity'],
      Security: ['Blast radius reduction', 'Coverage (segmentation + detection)', 'Evidence quality (audit packs)', 'Incident MTTR'],
      Operations: ['Ticket deflection', 'Upgrade success / rollback rate', 'Change velocity', 'Mean time to innocence'],
      'IT / Infra': ['Wi-Fi experience (journey success)', 'Onboarding time', 'SLO adherence', 'Integration completeness']
    }),
    []
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sales_play_context');
      if (stored) {
        const parsed = JSON.parse(stored) as SalesPlayContext;
        setPendingSalesContext(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const applySalesContext = () => {
    if (!pendingSalesContext) return;
    setSalesContext(pendingSalesContext);
    setAudience(pendingSalesContext.persona);
    setVertical(pendingSalesContext.vertical);
    setPendingSalesContext(null);
  };

  const dismissSalesContext = () => setPendingSalesContext(null);

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  const toggleAccordion = (key: string) => {
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const proofList = proofKits[vertical] ?? proofKits['Enterprise'];
  const metricList = personaMetrics[audience] ?? personaMetrics.Executive;
  const effectiveProofList = useMemo(() => {
    if (salesContext?.proofPoints?.length) {
      const mapped = salesContext.proofPoints.map((p, idx) => ({
        title: `Sales Proof ${idx + 1}`,
        cmd: '',
        why: p
      }));
      return [...mapped, ...proofList];
    }
    return proofList;
  }, [salesContext, proofList]);

  const promoteToTeleprompter = (heading: string, content: string, cue?: string) => {
    const payload: TeleprompterContext = {
      title: `Narrative Beat: ${heading}`,
      scene: {
        heading,
        caption: content,
        teleprompter: cue ? `${content}\nCue: ${cue}` : content
      },
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem('teleprompter_context', JSON.stringify(payload));
      window.location.hash = '#/theater';
    } catch {
      // ignore storage errors
    }
  };
  const tonePresets = useMemo(
    () => [
      { label: 'Exec Tight', notes: '90s per beat, outcome-first, defer details to appendix.' },
      { label: 'Ops Deep Dive', notes: 'Process steps, rollback proof, tooling ergonomics.' },
      { label: 'Security Assure', notes: 'Controls, evidence, auditability, ops safety.' },
      { label: 'Innovation', notes: 'Roadmap alignment, APIs, integration velocity.' }
    ],
    []
  );
  const pacingGuides = useMemo(
    () => [
      { label: 'Heartbeat', detail: 'Mark beats as delivered; aim for steady 60–90s per beat.' },
      { label: 'Proof cadence', detail: 'Show one proof per objection; copy a command, run, narrate evidence.' },
      { label: 'Close loop', detail: 'End each beat with a “so what” tied to the persona metric.' }
    ],
    []
  );

  const exportMarkdown = () => {
    if (!active) return;
    const lines = [
      `# ${active.title}`,
      `Audience: ${active.audience}`,
      `Vertical: ${active.vertical}`,
      active.objection ? `Objection: ${active.objection}` : '',
      '',
      ...active.beats.map(
        (beat, idx) =>
          `## Beat ${idx + 1}: ${beat.heading}\n${beat.content}\n${beat.cue ? `> Cue: ${beat.cue}` : ''}`
      )
    ].filter(Boolean);

    const blob = new Blob([lines.join('\n\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${active.id}-playbook.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen bg-page-bg text-primary flex flex-col selection:bg-blue-500/30`}>
      <header className="sticky top-0 z-40 px-6 md:px-10 h-16 flex items-center justify-between border-b border-border bg-card-bg/80 backdrop-blur">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-card-bg transition">
            <ArrowLeft size={18} />
          </button>
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono text-blue-500 uppercase tracking-[0.3em]">Narrative Playbook Studio</div>
            <div className="text-sm text-secondary">Branching scripts for demo/briefing delivery</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RelatedActions
            actions={[
              ...(onNavigate ? [{
                label: 'Sales Coach',
                onClick: () => onNavigate(SectionType.SALES_PLAYBOOK_COACH),
                icon: <FileText size={12} />,
                tone: 'blue'
              }] : []),
              ...(onNavigate ? [{
                label: 'Validated Designs',
                onClick: () => onNavigate(SectionType.VALIDATED_DESIGN_NAVIGATOR),
                icon: <Compass size={12} />,
                tone: 'emerald'
              }] : [])
            ]}
            className="hidden md:flex"
          />
          <button
            onClick={() => setTeleprompter(!teleprompter)}
            className="px-3 py-2 rounded-lg border border-border text-xs font-semibold hover:border-blue-500 hover:text-primary transition flex items-center gap-2"
          >
            <MonitorPlay size={14} className="text-blue-400" /> {teleprompter ? 'Exit Teleprompter' : 'Teleprompter'}
          </button>
          <button
            onClick={exportMarkdown}
            className="px-3 py-2 rounded-lg border border-border text-xs font-semibold hover:border-emerald-500 hover:text-primary transition flex items-center gap-2"
          >
            <Download size={14} className="text-emerald-400" /> Export
          </button>
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400" /> Versioned
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 p-6 md:p-10">
        {/* Left rail */}
        <aside className="md:w-72 space-y-4">
          <div className="bg-card-bg border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-blue-500 uppercase tracking-[0.3em]">
              <FolderTree size={14} /> Branch Controls
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">Audience</label>
              <div className="grid grid-cols-2 gap-2">
                {['Executive', 'Security', 'Operations', 'IT / Infra'].map((a) => (
                  <button
                    key={a}
                    onClick={() => setAudience(a)}
                    className={`px-3 py-2 rounded-xl border text-left text-sm transition ${
                      audience === a ? 'border-blue-500/40 bg-blue-500/10 text-primary' : 'border-border bg-card-bg text-secondary hover:border-blue-400/40'
                    }`}
                  >
                    <Users size={14} className="inline mr-2 text-blue-400" /> {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">Vertical</label>
              <div className="grid grid-cols-2 gap-2">
                {['AI / HPC', 'Enterprise', 'Finance', 'Campus', 'Life Sciences'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setVertical(v)}
                    className={`px-3 py-2 rounded-xl border text-left text-sm transition ${
                      vertical === v ? 'border-emerald-500/40 bg-emerald-500/10 text-primary' : 'border-border bg-card-bg text-secondary hover:border-emerald-400/40'
                    }`}
                  >
                    <Building2 size={14} className="inline mr-2 text-emerald-400" /> {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 bg-card-bg border border-border rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-secondary uppercase tracking-[0.3em]">
                <Sparkles size={14} /> Branching Tips
              </div>
              <p className="text-sm text-secondary">Use audience + vertical filters to swap narratives. Objection handling cues are baked into each beat.</p>
            </div>
          </div>

          {/* Accordions */}
          {[
            { key: 'pacing', title: 'Pacing Hints', icon: <Sparkles size={14} className="text-blue-400" />, content: pacingGuides.map((g) => ({ title: g.label, body: g.detail })) },
            { key: 'discovery', title: 'Discovery Prompts', icon: <BookOpen size={14} className="text-blue-300" />, content: discoveryPrompts.map((p) => ({ title: '', body: p })) },
            { key: 'proof', title: 'Proof / Demo Kit', icon: <Command size={14} className="text-emerald-300" />, content: effectiveProofList.map((p) => ({ title: p.title, body: `${p.cmd ?? ''} ${p.why ?? ''}`.trim() })) },
            { key: 'success', title: 'Success Metrics', icon: <Target size={14} className="text-blue-400" />, content: metricList.map((m) => ({ title: '', body: m })) },
            { key: 'followups', title: 'Follow-ups & Artifacts', icon: <ListChecks size={14} className="text-emerald-400" />, content: followUps.map((f) => ({ title: '', body: f.label })) },
            { key: 'objections', title: 'Objection Bank', icon: <ShieldCheck size={14} className="text-emerald-400" />, content: effectiveObjectionBank.map((o) => ({ title: o.label, body: o.response })) },
            { key: 'snippets', title: 'Talk Track Snippets', icon: <Sparkles size={14} className="text-blue-400" />, content: snippetDeck.map((s) => ({ title: s.title, body: s.body })) }
          ].map((section) => (
            <div key={section.key} className="bg-card-bg border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleAccordion(section.key)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-primary hover:bg-card-bg/80"
              >
                <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary">{section.icon} {section.title}</span>
                <span className="text-secondary">{accordionOpen[section.key] ? '−' : '+'}</span>
              </button>
              {accordionOpen[section.key] && (
                <div className="p-4 space-y-2">
                  {section.content.slice(0, 5).map((item, idx) => (
                    <div key={`${section.key}-${idx}`} className="p-2 rounded-lg border border-border bg-card-bg/70">
                      {item.title && <div className="text-xs font-semibold text-primary">{item.title}</div>}
                      <div className="text-sm text-secondary">{item.body}</div>
                    </div>
                  ))}
                  {section.content.length > 5 && (
                    <div className="text-[11px] text-secondary italic">+ {section.content.length - 5} more…</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* Main script */}
        <main className={`${teleprompter ? 'bg-card-bg border border-border' : 'bg-card-bg border border-border'} rounded-3xl p-6 md:p-8 shadow-2xl flex-1 flex flex-col gap-6`}>
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] font-mono text-blue-500 uppercase tracking-[0.4em]">Script</span>
              <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] text-primary font-semibold">
                {active?.title}
              </div>
              <div className="px-3 py-1 rounded-full bg-card-bg border border-border text-[11px] text-secondary">
                {active?.vertical} • {active?.audience}
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-secondary">
              <div className="flex items-center gap-2">
                <Play size={12} className="text-blue-400" /> {completionPct}% delivered
              </div>
              <div className="flex items-center gap-2">
                <Target size={12} className="text-emerald-400" /> {followUpsDone} follow-ups
              </div>
            </div>
          </div>

          {pendingSalesContext && (
            <div className="p-3 rounded-2xl border border-border bg-emerald-500/5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="text-sm text-primary">
                Sales context available: <span className="font-semibold">{pendingSalesContext.vertical}</span> / {pendingSalesContext.persona}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={applySalesContext}
                  className="px-3 py-2 rounded-lg border border-emerald-400/60 text-xs font-semibold text-primary hover:border-emerald-400 transition"
                >
                  Apply to Narrative
                </button>
                <button
                  onClick={dismissSalesContext}
                  className="px-3 py-2 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl border border-border bg-card-bg/80">
              <div className="text-[10px] uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
                <Play size={12} className="text-blue-400" /> Progress
              </div>
              <div className="flex items-end justify-between mt-2">
                <div className="text-2xl font-bold text-primary">{completionPct}%</div>
                <div className="text-xs text-secondary">
                  {deliveredCount}/{totalBeats} beats
                </div>
              </div>
              <div className="mt-2 h-2 bg-card-bg rounded-full overflow-hidden border border-border">
                <div className="h-full bg-blue-500" style={{ width: `${completionPct}%` }}></div>
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-card-bg/80">
              <div className="text-[10px] uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
                <Target size={12} className="text-emerald-400" /> Follow-ups
              </div>
              <div className="flex items-end justify-between mt-2">
                <div className="text-2xl font-bold text-primary">{followUpsDone}</div>
                <div className="text-xs text-secondary">ready to send</div>
              </div>
              <div className="mt-2 text-xs text-secondary">Close loops with artifacts after the session.</div>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-card-bg/80">
              <div className="text-[10px] uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
                <Sparkles size={12} className="text-indigo-400" /> Tone
              </div>
              <div className="flex items-center gap-2 mt-2 overflow-x-auto no-scrollbar">
                {tonePresets.map((tone) => (
                  <div key={tone.label} className="px-3 py-2 rounded-xl border border-border bg-card-bg">
                    <div className="text-xs text-primary font-semibold">{tone.label}</div>
                    <div className="text-[10px] text-secondary">{tone.notes}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <EvidenceDrawer contextTags={['Narrative', vertical === 'Life Sciences' ? 'Life Sciences' : undefined].filter(Boolean) as string[]} />

          <div className="space-y-6">
            {active?.beats.map((beat, idx) => (
              <div key={idx} className={`bg-card-bg/90 border border-border rounded-2xl p-6 space-y-3 shadow-xl`}>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
                  <Play size={14} className="text-blue-400" /> Beat 0{idx + 1}
                </div>
                <h3 className="text-2xl font-serif text-primary">{beat.heading}</h3>
                <p className="text-sm text-secondary leading-relaxed">{beat.content}</p>
                {beat.cue && (
                  <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                    <Sparkles size={12} /> {beat.cue}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl border border-border bg-card-bg/70">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
                      <BookOpen size={12} className="text-blue-300" /> Discovery
                    </div>
                    <p className="text-sm text-secondary leading-snug">
                      {discoveryPrompts[idx % discoveryPrompts.length]}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-card-bg/70">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
                      <Command size={12} className="text-emerald-300" /> Proof
                    </div>
                    <p className="text-sm text-secondary leading-snug">
                      {effectiveProofList[idx % effectiveProofList.length]?.title ?? 'Proof step'} — {effectiveProofList[idx % effectiveProofList.length]?.why ?? ''}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-card-bg/70">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
                      <Target size={12} className="text-blue-400" /> Metric
                    </div>
                    <p className="text-sm text-secondary leading-snug">
                      {metricList[idx % metricList.length]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-secondary flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!completedBeats[`${active.id}-${idx}`]}
                      onChange={() => toggleBeat(`${active.id}-${idx}`)}
                      className="accent-emerald-500"
                    />
                    Mark as delivered
                  </label>
                  <button
                    onClick={() => copyToClipboard(`${beat.heading}\n${beat.content}${beat.cue ? `\nCue: ${beat.cue}` : ''}`)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md border border-border text-secondary hover:text-primary hover:border-blue-500 transition"
                  >
                    <Clipboard size={12} /> Copy beat
                  </button>
                  <button
                    onClick={() => promoteToTeleprompter(beat.heading, beat.content, beat.cue)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md border border-border text-secondary hover:text-primary hover:border-emerald-400 transition"
                  >
                    <MonitorPlay size={12} /> Teleprompter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
