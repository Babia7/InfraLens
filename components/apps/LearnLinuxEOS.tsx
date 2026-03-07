import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Terminal, Brain, Compass, Sparkles, BookOpen, Play, Trophy, CheckCircle2, Clock, Layers, ShieldCheck, BadgeCheck, ChevronRight, Filter, Info, Zap } from 'lucide-react';
import { LINUX_CARDS, LINUX_TRACKS, LINUX_SCENARIOS } from '@data/linuxContent';
import { SectionType } from '@/types';

interface LearnLinuxEOSProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

const MODULE_PROTOCOL_LINK: Record<string, string> = {
  networking: 'VXLAN',
  'bash-intro': 'LINUX',
  programmability: 'EVPN'
};

const PRIMER = {
  title: 'EOS + Linux Primer',
  subtitle: 'What EOS is, why bash matters, and the safest first steps.',
  bullets: [
    'EOS is Fedora-based; FastCli is the front door, bash is the workshop.',
    'Multi-agent: protocols are Linux processes supervised by ProcMgr; SysDB stores state for hitless restarts and forensics.',
    'Filesystem: /mnt/flash is persistent; /var/log and /tmp are volatile. Clean flash before upgrades.',
    'VRFs map to Linux netns; interfaces map Ethernet1 → et1. Use per-VRF tcpdump and netstat to prove transit/listeners.',
    'Automation: local eAPI sockets return JSON (no scraping); Python + jq/curl are preloaded.',
    'Safety rails: avoid kill -9 on agents; use sudo only when needed; keep /mnt/flash tidy; offload logs/pcaps.'
  ],
  starter: [
    { title: 'Enter/Exit', cmd: 'bash … exit', why: 'Drop into bash; return to EOS CLI.' },
    { title: 'Processes', cmd: 'ps aux | head', why: 'See top processes; verify agents running.' },
    { title: 'Interfaces', cmd: 'ip link show', why: 'View kernel interfaces; map Ethernet → et1.' },
    { title: 'Logs (live)', cmd: 'tail -f /var/log/agents', why: 'Watch agent events while troubleshooting.' },
    { title: 'Flash space', cmd: 'df -h /mnt/flash', why: 'Check persistent storage before upgrades.' },
    { title: 'Quick pcap', cmd: 'tcpdump -i et1 -c 5', why: 'Capture a few packets for proof of transit.' },
    { title: 'eAPI up?', cmd: 'curl -I https://127.0.0.1:443', why: 'Confirm API listener responds (expect 200/301).' },
    { title: 'Python hello', cmd: 'python3 -c "import jsonrpclib"', why: 'Test on-box automation SDK availability.' },
    { title: 'Pack logs', cmd: 'tar -czvf logs.tgz /var/log', why: 'Bundle logs; offload to free flash.' }
  ]
};

export const LearnLinuxEOS: React.FC<LearnLinuxEOSProps> = ({ onBack }) => {
  const [trackId, setTrackId] = useState<string>('foundations');
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'reference' | 'guided' | 'scenarios' | 'quickref'>('reference');
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, { selected?: string; correct?: boolean }>>({});
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const handleExportScenario = (scenarioId: string) => {
    const scenario = LINUX_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;
    const lines: string[] = [];
    lines.push(`# ${scenario.title}`);
    lines.push('');
    lines.push(scenario.description);
    lines.push('');
    lines.push(`Outcome: ${scenario.outcome}`);
    lines.push('');
    scenario.cards.forEach((id) => {
      const card = LINUX_CARDS.find((c) => c.id === id);
      if (!card) return;
      lines.push(`## ${card.title} (${card.domain})`);
      lines.push(card.summary);
      card.commands.forEach((cmd) => {
        lines.push(`- **${cmd.title}**`);
        lines.push('```bash');
        lines.push(cmd.snippet);
        lines.push('```');
        lines.push(`  - Why: ${cmd.why}`);
        lines.push(`  - Insight: ${cmd.insight}`);
      });
      lines.push('');
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `linux_scenario_${scenario.id}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const modulesToRender = useMemo(() => {
    if (activeTab === 'guided') {
      const track = LINUX_TRACKS.find((t) => t.id === trackId);
      const ids = track?.steps || [];
      return LINUX_CARDS.filter((c) => ids.includes(c.id));
    }
    return LINUX_CARDS;
  }, [activeTab, trackId]);

  const activeModule = modulesToRender[activeIdx] ?? modulesToRender[0];
  const completionPct = Math.round(
    (Object.values(completedModules).filter(Boolean).length / LINUX_CARDS.length) * 100
  );

  useEffect(() => {
    const stored = localStorage.getItem('linux_learn_progress');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCompletedModules(parsed.completed ?? {});
        setQuizAnswers(parsed.quizzes ?? {});
      } catch (e) {
        console.warn('Failed to parse linux progress', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'linux_learn_progress',
      JSON.stringify({ completed: completedModules, quizzes: quizAnswers })
    );
  }, [completedModules, quizAnswers]);

  useEffect(() => {
    if (activeIdx >= modulesToRender.length) {
      setActiveIdx(0);
    }
  }, [modulesToRender.length, activeIdx]);

  const handleNext = () => {
    setActiveIdx((prev) => {
      const next = prev + 1;
      return next < modulesToRender.length ? next : 0;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!activeModule) {
    return (
      <div className="min-h-screen bg-[#060608] text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-sm text-zinc-400">No modules available.</p>
          <button onClick={onBack} className="px-4 py-2 border border-zinc-800 rounded-lg text-xs uppercase tracking-widest text-zinc-300 hover:text-white hover:border-emerald-500 transition">Return</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-bg text-primary flex flex-col selection:bg-emerald-500/30">
      <header className="h-16 px-6 md:px-10 flex items-center justify-between border-b border-border bg-card-bg/80 backdrop-blur text-body">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-card-bg transition border border-transparent hover:border-border">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="text-xs font-mono text-emerald-500 uppercase tracking-[0.3em]">Learn Linux for EOS</div>
            <div className="text-sm text-secondary">EdTech-inspired track-based drills</div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">
          <Clock size={14} /> Sprint ready
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[320px,1fr,320px] gap-4 md:gap-6 p-6 md:p-10 text-body">
        {/* Tracks */}
        <aside className="bg-card-bg border border-border rounded-2xl p-4 space-y-3 card-strong">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-2">Tracks (Guided)</div>
          {LINUX_TRACKS.map((track) => (
            <button
              key={track.id}
              onClick={() => { setTrackId(track.id); setActiveIdx(0); setActiveTab('guided'); }}
              className={`w-full text-left p-4 rounded-xl border transition-all group ${
                trackId === track.id ? 'border-emerald-400/40 bg-emerald-500/5 text-primary' : 'border-border bg-page-bg text-secondary hover:border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass size={14} className="text-emerald-400" />
                  <span className="text-xs font-semibold uppercase tracking-wide">{track.label}</span>
                </div>
                {trackId === track.id && <CheckCircle2 size={14} className="text-emerald-400" />}
              </div>
              <p className="text-[11px] text-secondary mt-2">{track.description}</p>
            </button>
          ))}
        </aside>

        {/* Main content with tabs */}
        <main className="bg-card-bg border border-border rounded-3xl p-6 md:p-10 shadow-sm flex flex-col gap-8 overflow-hidden text-body">
              <div className="flex items-center gap-4 border-b border-border pb-2">
                <button
                  onClick={() => setActiveTab('reference')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'reference' ? 'bg-emerald-500/10 text-primary border border-emerald-500/30' : 'text-secondary hover:text-primary'}`}
                >
              Reference
            </button>
            <button
              onClick={() => setActiveTab('guided')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'guided' ? 'bg-emerald-500/10 text-primary border border-emerald-500/30' : 'text-secondary hover:text-primary'}`}
            >
              Guided
            </button>
                <button
                  onClick={() => setActiveTab('scenarios')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'scenarios' ? 'bg-emerald-500/10 text-primary border border-emerald-500/30' : 'text-secondary hover:text-primary'}`}
                >
                  Scenarios
                </button>
                <button
                  onClick={() => setActiveTab('quickref')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${activeTab === 'quickref' ? 'bg-emerald-500/10 text-primary border border-emerald-500/30' : 'text-secondary hover:text-primary'}`}
                >
                  <Zap size={13} /> Quick Ref
                </button>
                <div className="ml-auto text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
                  <BadgeCheck size={14} className="text-emerald-400" /> {completionPct}% Complete
                </div>
              </div>

              {activeTab === 'reference' && (
                <>
                  <div className="p-6 bg-card-bg border border-border rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.15em] text-secondary">
                        <Info size={14} className="text-emerald-500" /> {PRIMER.title}
                      </div>
                      <span className="text-[11px] text-secondary uppercase tracking-[0.15em]">Orientation</span>
                    </div>
                    <p className="text-body-lg text-secondary">{PRIMER.subtitle}</p>
                    <ul className="list-disc list-inside text-body text-secondary space-y-2">
                      {PRIMER.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <div className="p-4 bg-[#111] border border-border rounded-xl space-y-3">
                      <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-600">Starter kit</div>
                      <div className="grid sm:grid-cols-2 gap-2 text-body text-primary">
                        {PRIMER.starter.map((item) => (
                          <div key={item.title} className="px-3 py-3 rounded bg-card-bg border border-border">
                            <div className="text-[11px] font-semibold text-secondary uppercase tracking-[0.1em] mb-1">{item.title}</div>
                            <div className="font-mono text-body-lg text-emerald-700">{item.cmd}</div>
                            <div className="text-xs text-secondary mt-1">{item.why}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

              <div className="flex flex-wrap gap-3 items-center text-body">
                    <div className="flex items-center gap-2 px-3 py-2 bg-page-bg border border-border rounded-lg">
                      <Filter size={16} className="text-secondary" />
                      <select
                        value={domainFilter}
                        onChange={(e) => { setDomainFilter(e.target.value); setActiveIdx(0); }}
                        className="bg-transparent text-sm text-primary outline-none"
                      >
                        <option value="all">All domains</option>
                        {Array.from(new Set(LINUX_CARDS.map((c) => c.domain))).map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search commands, tags, titles..."
                      className="px-3 py-2 bg-page-bg border border-border rounded-lg text-sm text-primary flex-1 min-w-[200px]"
                    />
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-600 font-semibold">
                      Reference Cards
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-body">
                    {LINUX_CARDS.filter((c) => (domainFilter === 'all' || c.domain === domainFilter) && (c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))).map((card) => (
                      <div key={card.id} className="p-5 bg-page-bg border border-border rounded-2xl shadow-sm space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <card.icon size={16} className="text-emerald-500" />
                            <div>
                              <div className="text-sm font-semibold text-primary">{card.title}</div>
                              <div className="text-[11px] text-secondary">{card.summary}</div>
                            </div>
                          </div>
                          <div className="text-[10px] text-secondary uppercase tracking-[0.3em]">{card.domain}</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {card.tags.map((t) => (
                            <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-pill border border-border text-secondary">{t}</span>
                          ))}
                        </div>
                        <div className="space-y-3">
                          {card.commands.map((cmd, idx) => (
                            <div key={idx} className="p-3 bg-card-bg border border-border rounded-xl space-y-2">
                              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">
                                <Brain size={12} className="text-emerald-500" /> {cmd.title}
                              </div>
                          <div className="font-mono text-body-lg text-emerald-700 whitespace-pre-wrap">{cmd.snippet}</div>
                              <p className="text-body text-secondary">{cmd.why}</p>
                              <p className="text-body-sm text-emerald-700">{cmd.insight}</p>
                            </div>
                          ))}
                        </div>
                        {card.quiz && (
                          <div className="p-3 bg-card-bg border border-border rounded-xl space-y-2">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-600">Quick Check</div>
                            <div className="text-sm text-primary">{card.quiz.question}</div>
                            <div className="grid gap-2">
                              {card.quiz.options.map((opt) => {
                                const selected = quizAnswers[card.id]?.selected === opt;
                                const correct = quizAnswers[card.id]?.correct;
                                const isAnswer = card.quiz?.answer === opt;
                                return (
                                  <button
                                    key={opt}
                                    onClick={() =>
                                      setQuizAnswers((prev) => ({
                                        ...prev,
                                        [card.id]: { selected: opt, correct: opt === card.quiz?.answer }
                                      }))
                                    }
                                    className={`text-left px-3 py-2 rounded-lg border ${
                                      selected
                                        ? isAnswer
                                          ? 'border-emerald-400 bg-emerald-500/10 text-emerald-800'
                                          : 'border-red-400 bg-red-500/10 text-red-800'
                                        : 'border-border bg-card-bg text-secondary hover:border-border'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                            {quizAnswers[card.id]?.correct && (
                              <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold">
                                <BadgeCheck size={14} /> Badge unlocked: Verified
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'guided' && activeModule && (
                <>
                  <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">
                        <Info size={14} className="text-emerald-500" /> Phase 0 — {PRIMER.title}
                      </div>
                      <span className="text-[10px] text-secondary uppercase tracking-[0.3em]">Start here</span>
                    </div>
                    <p className="text-sm text-secondary">{PRIMER.subtitle}</p>
                    <ul className="list-disc list-inside text-sm text-secondary space-y-1">
                      {PRIMER.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <div className="p-3 bg-page-bg border border-border rounded-xl">
                      <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-600 mb-2">Starter kit</div>
                      <div className="grid sm:grid-cols-2 gap-1 text-sm text-primary font-mono">
                        {PRIMER.starter.map((item) => (
                          <div key={item.title} className="px-2 py-1 rounded bg-card-bg border border-border text-emerald-700">{item.cmd}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 items-center">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.4em]">Guided Module</span>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-600 font-semibold">
                      {activeModule?.title}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-card-bg border border-border text-[11px] text-secondary">
                      {activeModule?.summary}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {activeModule?.commands.map((step, idx) => (
                      <div key={idx} className="p-6 bg-page-bg border border-border rounded-2xl shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
                            <Brain size={14} className="text-emerald-400" /> Lesson 0{idx + 1}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-secondary">
                            <ShieldCheck size={12} className="text-emerald-400" /> Field Ready
                          </div>
                        </div>
                        <h3 className="text-2xl font-serif text-primary">{step.title}</h3>
                        <p className="text-body text-secondary">{step.why}</p>

                        <div className="bg-card-bg border border-border rounded-xl p-4 font-mono text-body-lg text-emerald-700 relative">
                          <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500/60"></div>
                          {step.snippet.split('\n').map((line, i) => (
                            <div key={i} className="flex gap-2">
                              <span className="text-secondary select-none">$</span>
                              <span className="break-all">{line}</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-body text-emerald-800">
                          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-[0.3em] mb-2">
                            <Sparkles size={14} /> Insight
                          </div>
                          <p>{step.insight}</p>
                        </div>

                        {MODULE_PROTOCOL_LINK[activeModule.id] && (
                          <button
                            onClick={() => onNavigate?.(SectionType.PROTOCOLS)}
                            className="px-3 py-2 rounded-lg border border-emerald-500/40 text-xs font-semibold text-primary hover:border-emerald-400 transition flex items-center gap-2"
                          >
                            <Layers size={12} className="text-emerald-300" /> Validate in Protocol Lab ({MODULE_PROTOCOL_LINK[activeModule.id]})
                          </button>
                        )}

                        {activeModule.quiz && (
                          <div className="p-4 bg-page-bg border border-border rounded-xl space-y-2">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-600">Quick Check</div>
                            <div className="text-sm text-primary">{activeModule.quiz.question}</div>
                            <div className="grid gap-2">
                              {activeModule.quiz.options.map((opt) => {
                                const selected = quizAnswers[activeModule.id]?.selected === opt;
                                const correct = quizAnswers[activeModule.id]?.correct;
                                const isAnswer = activeModule.quiz?.answer === opt;
                                return (
                                  <button
                                    key={opt}
                                    onClick={() =>
                                      setQuizAnswers((prev) => ({
                                        ...prev,
                                        [activeModule.id]: { selected: opt, correct: opt === activeModule.quiz?.answer }
                                      }))
                                    }
                                    className={`text-left px-3 py-2 rounded-lg border ${
                                      selected
                                        ? isAnswer
                                          ? 'border-emerald-400 bg-emerald-500/10 text-emerald-800'
                                          : 'border-red-400 bg-red-500/10 text-red-800'
                                        : 'border-border bg-card-bg text-secondary hover:border-border'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                            {quizAnswers[activeModule.id]?.correct && (
                              <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold">
                                <BadgeCheck size={14} /> Badge unlocked: Verified
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-[11px] text-secondary cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!completedModules[activeModule.id]}
                              onChange={() =>
                                setCompletedModules((prev) => ({
                                  ...prev,
                                  [activeModule.id]: !prev[activeModule.id]
                                }))
                              }
                              className="accent-emerald-500"
                            />
                            Mark module complete
                          </label>
                          <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-500/40 text-xs font-semibold text-primary hover:border-emerald-400 transition"
                          >
                            Next <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center border-t border-border pt-4">
                    <div className="text-[10px] text-secondary uppercase tracking-[0.3em]">Modules</div>
                    <div className="flex gap-2">
                      {modulesToRender.map((m, i) => (
                        <button
                          key={m.id}
                          onClick={() => { setActiveIdx(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className={`h-2 w-10 rounded-full transition-all ${i === activeIdx ? 'bg-emerald-500' : 'bg-border hover:bg-secondary/40'}`}
                          aria-label={`Go to module ${m.title}`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'quickref' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Zap size={16} className="text-emerald-400" />
                    <div>
                      <div className="text-sm font-semibold text-primary">SE Quick Reference — EOS Linux</div>
                      <div className="text-[11px] text-secondary">Field-ready commands grouped by task. Copy and run.</div>
                    </div>
                  </div>

                  {[
                    {
                      label: 'Entry & Exit',
                      color: 'border-emerald-500/30 bg-emerald-500/5',
                      rows: [
                        { cmd: 'bash', desc: 'Drop into Linux shell from EOS CLI' },
                        { cmd: 'bash sudo', desc: 'Root shell (use sparingly)' },
                        { cmd: 'exit', desc: 'Return to EOS CLI from bash' },
                        { cmd: 'FastCli -p 15 -c "show version"', desc: 'Run EOS command from bash' },
                      ]
                    },
                    {
                      label: 'Processes & Agents',
                      color: 'border-sky-500/30 bg-sky-500/5',
                      rows: [
                        { cmd: 'ps aux | grep -i bgp', desc: 'Find BGP agent PID' },
                        { cmd: 'ps aux --sort=-%mem | head', desc: 'Top memory consumers' },
                        { cmd: 'FastCli -p 15 -c "show agent"', desc: 'List all EOS agents + state' },
                        { cmd: 'FastCli -p 15 -c "agent Bgp graceful-restart"', desc: 'Safe agent restart (preserves SysDB)' },
                        { cmd: 'tail -f /var/log/agents/Bgp-*', desc: 'Live BGP agent log' },
                        { cmd: 'ls -la /var/log/agents/', desc: 'All per-agent log files' },
                      ]
                    },
                    {
                      label: 'Networking & Capture',
                      color: 'border-violet-500/30 bg-violet-500/5',
                      rows: [
                        { cmd: 'ip link show', desc: 'List kernel interfaces (Eth1 → et1)' },
                        { cmd: 'ip -d link show et1', desc: 'Detailed interface info (VLAN, bond)' },
                        { cmd: "tcpdump -i et1 -n 'host 10.0.0.1'", desc: 'Capture packets to specific host' },
                        { cmd: "tcpdump -i et1 -n 'vlan 10' -c 50 -w /mnt/flash/cap.pcap", desc: 'VLAN-filtered capture to file' },
                        { cmd: 'ss -tlnp', desc: 'Socket listeners (replaces netstat)' },
                        { cmd: 'ip route show', desc: 'Kernel routing table (default VRF)' },
                      ]
                    },
                    {
                      label: 'VRF / NetNS',
                      color: 'border-amber-500/30 bg-amber-500/5',
                      rows: [
                        { cmd: 'ip netns list', desc: 'List all VRF namespaces (ns-MGMT, ns-PROD…)' },
                        { cmd: 'ip netns exec ns-PROD ip route show', desc: 'Routing table for VRF PROD' },
                        { cmd: 'ip netns exec ns-PROD ip neigh show', desc: 'ARP table for VRF PROD' },
                        { cmd: "ip netns exec ns-PROD tcpdump -i et1 -n 'tcp port 179'", desc: 'BGP capture in VRF PROD' },
                        { cmd: 'ip netns exec ns-PROD ss -tlnp', desc: 'Socket listeners in VRF PROD' },
                      ]
                    },
                    {
                      label: 'Filesystem & Flash',
                      color: 'border-orange-500/30 bg-orange-500/5',
                      rows: [
                        { cmd: 'df -h /mnt/flash', desc: 'Flash usage (target >20% free pre-ISSU)' },
                        { cmd: 'du -sh /var/log/* | sort -rh | head', desc: 'Largest log directories' },
                        { cmd: 'ls -lh /mnt/flash/cores/', desc: 'Coredumps (offload before deleting)' },
                        { cmd: 'rm -f /mnt/flash/cores/*.core.old', desc: 'Remove old coredumps' },
                        { cmd: 'tar -czvf /mnt/flash/logs.tgz /var/log/agents', desc: 'Bundle agent logs' },
                        { cmd: 'scp /mnt/flash/logs.tgz user@host:/tmp/', desc: 'Offload bundle to jump host' },
                      ]
                    },
                    {
                      label: 'eAPI & Automation',
                      color: 'border-cyan-500/30 bg-cyan-500/5',
                      rows: [
                        { cmd: 'python3', desc: 'On-box Python 3 (SDKs pre-installed)' },
                        { cmd: 'python3 -c "import jsonrpclib"', desc: 'Verify jsonrpclib available' },
                        { cmd: 'unix:/var/run/command-api.sock', desc: 'eAPI Unix socket path (no creds needed)' },
                        { cmd: "curl -sk -u admin:PW -X POST -H 'Content-Type: application/json' -d '{\"jsonrpc\":\"2.0\",\"method\":\"runCmds\",\"params\":{\"version\":1,\"cmds\":[\"show version\"]},\"id\":\"1\"}' https://127.0.0.1/command-api", desc: 'HTTPS eAPI call' },
                        { cmd: 'FastCli -p 15 -c "management api http-commands"', desc: 'Check eAPI config' },
                      ]
                    },
                    {
                      label: 'Diagnostics & TAC',
                      color: 'border-red-500/30 bg-red-500/5',
                      rows: [
                        { cmd: 'FastCli -p 15 -c "show coredump"', desc: 'Structured coredump list' },
                        { cmd: 'free -h', desc: 'Memory usage overview' },
                        { cmd: 'FastCli -p 15 -c "show processes top once"', desc: 'Per-agent CPU/mem usage' },
                        { cmd: 'FastCli -p 15 -c "show tech-support" > /mnt/flash/tech.log', desc: 'Full tech-support bundle' },
                        { cmd: 'FastCli -p 15 -c "show issu"', desc: 'ISSU upgrade path readiness' },
                        { cmd: 'FastCli -p 15 -c "show boot-config"', desc: 'Boot image and next boot target' },
                      ]
                    },
                    {
                      label: 'Search & Shell Shortcuts',
                      color: 'border-zinc-500/30 bg-zinc-500/5',
                      rows: [
                        { cmd: 'grep -r "error" /var/log/agents --include="*.log"', desc: 'Recursive error search in logs' },
                        { cmd: 'grep -C 5 "BGP NOTIFICATION" /var/log/messages', desc: 'Context around BGP notification' },
                        { cmd: "find /mnt/flash -name '*.swi' -mtime -7", desc: 'EOS images modified in last 7 days' },
                        { cmd: "watch -n 2 \"FastCli -p 15 -c 'show int status'\"", desc: 'Live interface dashboard' },
                        { cmd: 'Ctrl+R', desc: 'Reverse search command history' },
                        { cmd: '!! / !$', desc: 'Repeat last cmd / last argument' },
                      ]
                    },
                  ].map((section) => (
                    <div key={section.label} className={`rounded-2xl border p-4 space-y-2 ${section.color}`}>
                      <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-secondary mb-3">{section.label}</div>
                      <div className="divide-y divide-border">
                        {section.rows.map((row) => (
                          <div key={row.cmd} className="flex items-start gap-3 py-1.5 group">
                            <code className="font-mono text-[11px] text-emerald-700 whitespace-pre-wrap flex-1 min-w-0 break-all leading-relaxed">{row.cmd}</code>
                            <span className="text-[11px] text-secondary flex-shrink-0 max-w-[45%] text-right leading-relaxed">{row.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'scenarios' && (
                <div className="grid md:grid-cols-2 gap-4">
                  {LINUX_SCENARIOS.map((scenario) => (
                    <div key={scenario.id} className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-primary">{scenario.title}</div>
                          <div className="text-[11px] text-secondary">{scenario.description}</div>
                        </div>
                        <span className="text-[11px] text-secondary uppercase tracking-[0.2em]">Field kit</span>
                      </div>
                      <div className="space-y-2">
                        {scenario.cards.map((id) => {
                          const card = LINUX_CARDS.find((c) => c.id === id);
                          if (!card) return null;
                          return (
                            <div key={id} className="p-3 bg-page-bg border border-border rounded-xl">
                              <div className="text-sm font-semibold text-primary">{card.title}</div>
                              <div className="text-[12px] text-secondary">{card.summary}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-sm text-emerald-700">Outcome: {scenario.outcome}</div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleExportScenario(scenario.id)}
                          className="px-3 py-1.5 text-[11px] font-semibold border border-border rounded-lg text-secondary hover:text-primary"
                        >
                          Export Markdown
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
        </main>

        {/* Gamified sidebar */}
        <aside className="bg-card-bg border border-border rounded-2xl p-5 space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-600 text-[11px] font-semibold uppercase tracking-[0.3em]">
              <Trophy size={14} /> Objectives
            </div>
            <ul className="mt-3 space-y-2 text-sm text-secondary">
              <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-emerald-400 mt-0.5" /> Prove you can navigate bash and processes.</li>
              <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-emerald-400 mt-0.5" /> Capture packets and map VRF namespaces.</li>
              <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-emerald-400 mt-0.5" /> Automate via eAPI without scraping.</li>
            </ul>
          </div>

          <div className="p-4 bg-card-bg border border-border rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-[11px] text-secondary uppercase tracking-[0.3em]">
              <BookOpen size={14} /> Resources
            </div>
            <div className="space-y-2 text-sm text-secondary">
              <div className="flex items-center gap-2"><Layers size={14} className="text-emerald-400" /> Reference: EOS Process Model</div>
              <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-400" /> Security Checklist</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
