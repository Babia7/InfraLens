import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Search, Copy, Check, AlertTriangle,
  TerminalSquare, ChevronRight, ArrowRight, Download
} from 'lucide-react';
import { SectionType } from '@/types';
import {
  CLI_MAPPINGS,
  CATEGORY_META,
  CATEGORY_ORDER,
  CLICategory,
  CLIFamily,
  CLIMapping,
} from '@data/cliConverterContent';
import {
  LineStatus,
  TranslatedLine,
  translateLine,
} from '@/services/cliTranslator';

interface CLIConverterProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

type Mode = 'browse' | 'paste';

// ── Utility: copy to clipboard ────────────────────────────────────────────────
function useCopy() {
  const [copiedId, setCopiedId] = useState('');
  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 1500);
  };
  return { copiedId, copy };
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: LineStatus }) {
  if (status === 'matched')
    return <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">Translated</span>;
  if (status === 'behavior-warning')
    return <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400">⚠ Behavior differs</span>;
  if (status === 'unmatched')
    return <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border border-zinc-600/40 bg-zinc-800/40 text-zinc-500">Review manually</span>;
  return null;
}

// ── Browse mode components ────────────────────────────────────────────────────
function MappingCard({
  mapping,
  copy,
  copiedId,
}: {
  mapping: CLIMapping;
  copy: (text: string, id: string) => void;
  copiedId: string;
}) {
  const copied = copiedId === mapping.id;
  return (
    <div
      className={`rounded-xl border overflow-hidden ${
        mapping.behaviorDifference
          ? 'border-amber-500/20 bg-amber-500/3'
          : 'border-zinc-800 bg-zinc-900/40'
      }`}
    >
      {/* Warning banner */}
      {mapping.behaviorDifference && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/8 border-b border-amber-500/20">
          <AlertTriangle size={12} className="text-amber-400 shrink-0" />
          <span className="text-[10px] text-amber-400/80 font-mono">Behavior or syntax difference</span>
        </div>
      )}

      {/* Side-by-side CLI panels */}
      <div className="grid grid-cols-2 divide-x divide-zinc-800">
        {/* Cisco side */}
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-blue-400/70">Cisco</span>
          </div>
          <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap break-all">
            {mapping.ciscoCommand}
          </pre>
          {mapping.ciscoVariants && (
            <div className="space-y-0.5">
              {mapping.ciscoVariants.map((v, i) => (
                <div key={i} className="text-[10px] font-mono text-zinc-600 truncate">{v}</div>
              ))}
            </div>
          )}
        </div>

        {/* EOS side */}
        <div className="p-4 space-y-2 relative group">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400/70">EOS</span>
          </div>
          <pre className="text-[11px] font-mono text-emerald-300/90 leading-relaxed whitespace-pre-wrap break-all">
            {mapping.eosCommand}
          </pre>
          <button
            onClick={() => copy(mapping.eosCommand, mapping.id)}
            className="absolute top-3 right-3 p-1 rounded text-zinc-600 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100"
            title="Copy EOS command"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* Notes */}
      {mapping.notes && (
        <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-900/20">
          <p className="text-[11px] text-zinc-500 leading-relaxed">{mapping.notes}</p>
        </div>
      )}

      {/* Subcategory pill */}
      {mapping.subcategory && (
        <div className="px-4 pb-3">
          <span className="text-[9px] font-mono text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded">
            {mapping.subcategory}
          </span>
        </div>
      )}
    </div>
  );
}

function CategorySidebar({
  activeCategory,
  onSelect,
  counts,
}: {
  activeCategory: CLICategory;
  onSelect: (c: CLICategory) => void;
  counts: Record<CLICategory, number>;
}) {
  return (
    <nav className="space-y-0.5">
      {CATEGORY_ORDER.map((cat) => {
        const meta = CATEGORY_META[cat];
        const active = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              active
                ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300'
                : 'hover:bg-zinc-800/60 text-zinc-400 border border-transparent'
            }`}
          >
            <span className="text-base leading-none shrink-0">{meta.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{meta.label}</div>
            </div>
            <span className={`text-[10px] font-mono tabular-nums shrink-0 ${active ? 'text-blue-400' : 'text-zinc-600'}`}>
              {counts[cat]}
            </span>
            {active && <ChevronRight size={12} className="text-blue-400 shrink-0" />}
          </button>
        );
      })}
    </nav>
  );
}

// ── Browse Mode ───────────────────────────────────────────────────────────────
function BrowseMode() {
  const [activeCategory, setActiveCategory] = useState<CLICategory>('interfaces');
  const [platform, setPlatform] = useState<'ios' | 'nxos' | 'both'>('both');
  const [searchQuery, setSearchQuery] = useState('');
  const { copy, copiedId } = useCopy();

  const counts = useMemo(() => {
    const result = {} as Record<CLICategory, number>;
    for (const cat of CATEGORY_ORDER) {
      result[cat] = CLI_MAPPINGS.filter(
        m => m.category === cat && (platform === 'both' || m.family === platform || m.family === 'both')
      ).length;
    }
    return result;
  }, [platform]);

  const displayMappings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      // Search across all categories
      return CLI_MAPPINGS.filter(m => {
        const familyMatch = platform === 'both' || m.family === platform || m.family === 'both';
        const textMatch =
          m.ciscoCommand.toLowerCase().includes(q) ||
          m.eosCommand.toLowerCase().includes(q) ||
          (m.ciscoVariants ?? []).some(v => v.toLowerCase().includes(q)) ||
          (m.notes ?? '').toLowerCase().includes(q) ||
          (m.subcategory ?? '').toLowerCase().includes(q);
        return familyMatch && textMatch;
      });
    }
    return CLI_MAPPINGS.filter(
      m =>
        m.category === activeCategory &&
        (platform === 'both' || m.family === platform || m.family === 'both')
    );
  }, [activeCategory, platform, searchQuery]);

  return (
    <div className="flex gap-0 flex-1 min-h-0">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r border-zinc-800 p-3 overflow-y-auto">
        <CategorySidebar
          activeCategory={activeCategory}
          onSelect={(c) => { setActiveCategory(c); setSearchQuery(''); }}
          counts={counts}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Sub-header */}
        <div className="sticky top-0 z-10 bg-page-bg border-b border-zinc-800 px-6 py-3 flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search commands…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/40"
            />
          </div>

          {/* Platform toggle */}
          <div className="flex items-center gap-1 bg-zinc-800/60 rounded-lg p-1 border border-zinc-700/40">
            {(['ios', 'nxos', 'both'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                  platform === p
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {p === 'ios' ? 'IOS' : p === 'nxos' ? 'NX-OS' : 'Both'}
              </button>
            ))}
          </div>

          {searchQuery ? (
            <span className="text-xs text-zinc-500">{displayMappings.length} results</span>
          ) : (
            <span className="text-xs text-zinc-500">{CATEGORY_META[activeCategory].description}</span>
          )}
        </div>

        {/* Cards */}
        <div className="p-6 space-y-4">
          {displayMappings.length === 0 ? (
            <div className="text-center py-16 text-zinc-600">
              <TerminalSquare size={32} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">No commands match for this platform/category combination.</p>
            </div>
          ) : (
            displayMappings.map(mapping => (
              <MappingCard key={mapping.id} mapping={mapping} copy={copy} copiedId={copiedId} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Paste Mode ────────────────────────────────────────────────────────────────
function PasteMode() {
  const [inputText, setInputText] = useState('');
  const [platform, setPlatform] = useState<'ios' | 'nxos'>('ios');
  const [translated, setTranslated] = useState<TranslatedLine[] | null>(null);
  const { copy, copiedId } = useCopy();

  const handleTranslate = () => {
    const lines = inputText.split('\n');
    const result = lines.map(line => translateLine(line, platform));
    setTranslated(result);
  };

  const allEOS = useMemo(() => {
    if (!translated) return '';
    return translated
      .filter(l => l.status !== 'blank')
      .map(l => (l.status === 'comment' ? l.original : l.eosCommand))
      .join('\n');
  }, [translated]);

  const exportMarkdown = () => {
    if (!translated) return;
    const rows = translated
      .filter(l => l.status !== 'blank' && l.status !== 'comment')
      .map(l => `| \`${l.original.trim()}\` | \`${l.eosCommand}\` | ${l.notes || '—'} |`)
      .join('\n');
    const md = `# CLI Translation\n\nPlatform: ${platform.toUpperCase()}\n\n| Cisco | EOS | Notes |\n|---|---|---|\n${rows}`;
    navigator.clipboard.writeText(md).catch(() => {});
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Input area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">Paste Cisco Config</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Each line is translated independently. Unrecognized lines pass through with a review badge.</p>
          </div>
          {/* Platform selector */}
          <div className="flex items-center gap-1 bg-zinc-800/60 rounded-lg p-1 border border-zinc-700/40">
            {(['ios', 'nxos'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                  platform === p
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {p === 'ios' ? 'IOS' : 'NX-OS'}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={e => { setInputText(e.target.value); setTranslated(null); }}
          placeholder={`! Paste Cisco IOS / NX-OS config here\ninterface GigabitEthernet0/1\n  ip address 10.1.1.1 255.255.255.0\n  no shutdown\n!\nrouter bgp 65001\n  neighbor 10.0.0.1 remote-as 65000`}
          rows={10}
          className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-700/50 text-sm font-mono text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-blue-500/40 resize-y leading-relaxed"
        />

        <div className="flex items-center gap-3">
          <button
            onClick={handleTranslate}
            disabled={!inputText.trim()}
            className="px-5 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-medium hover:bg-blue-600/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowRight size={14} />
            Translate
          </button>
          {translated && (
            <>
              <button
                onClick={() => copy(allEOS, 'all-eos')}
                className="px-4 py-2 rounded-lg bg-zinc-800/60 border border-zinc-700/40 text-zinc-300 text-sm font-medium hover:bg-zinc-700/60 transition-colors flex items-center gap-2"
              >
                {copiedId === 'all-eos' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                Copy All EOS
              </button>
              <button
                onClick={exportMarkdown}
                className="px-4 py-2 rounded-lg bg-zinc-800/60 border border-zinc-700/40 text-zinc-300 text-sm font-medium hover:bg-zinc-700/60 transition-colors flex items-center gap-2"
              >
                <Download size={14} />
                Export Markdown
              </button>
            </>
          )}
        </div>
      </div>

      {/* Translation output */}
      {translated && (
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-xs text-zinc-500 pb-2 border-b border-zinc-800">
            <span>{translated.filter(l => l.status === 'matched' || l.status === 'behavior-warning').length} translated</span>
            <span>{translated.filter(l => l.status === 'unmatched').length} unmatched</span>
            <span>{translated.filter(l => l.status === 'behavior-warning').length} behavior warnings</span>
          </div>

          <div className="space-y-1">
            {translated.map((line, idx) => {
              if (line.status === 'blank') {
                return <div key={idx} className="h-4" />;
              }
              if (line.status === 'comment') {
                return (
                  <div key={idx} className="px-4 py-1.5 rounded-lg bg-zinc-900/20">
                    <span className="text-[11px] font-mono text-zinc-600">{line.original}</span>
                  </div>
                );
              }
              return (
                <div
                  key={idx}
                  className={`rounded-lg border overflow-hidden ${
                    line.status === 'behavior-warning'
                      ? 'border-amber-500/20'
                      : line.status === 'unmatched'
                      ? 'border-zinc-700/40'
                      : 'border-zinc-800'
                  }`}
                >
                  <div className="grid grid-cols-2 divide-x divide-zinc-800">
                    <div className="px-4 py-2.5 bg-zinc-900/30">
                      <pre className="text-[11px] font-mono text-zinc-500 leading-relaxed whitespace-pre-wrap break-all">
                        {line.original.trim()}
                      </pre>
                    </div>
                    <div className="px-4 py-2.5 bg-zinc-900/10 flex items-start justify-between gap-2">
                      <pre className={`text-[11px] font-mono leading-relaxed whitespace-pre-wrap break-all flex-1 ${
                        line.status === 'unmatched' ? 'text-zinc-500' : 'text-emerald-300/90'
                      }`}>
                        {line.eosCommand}
                      </pre>
                      <div className="shrink-0 pt-0.5">
                        <StatusBadge status={line.status} />
                      </div>
                    </div>
                  </div>
                  {line.notes && line.status !== 'unmatched' && (
                    <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/20">
                      <p className="text-[10px] text-zinc-600 leading-relaxed">{line.notes}</p>
                    </div>
                  )}
                  {line.status === 'unmatched' && (
                    <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/20">
                      <p className="text-[10px] text-zinc-600">No mapping found — verify against EOS documentation.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Root component ────────────────────────────────────────────────────────────
export const CLIConverter: React.FC<CLIConverterProps> = ({ onBack }) => {
  const [mode, setMode] = useState<Mode>('browse');

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card-bg shrink-0">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-secondary hover:text-primary rounded-lg hover:bg-surface-muted transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <TerminalSquare size={20} className="text-blue-400" />
        <div>
          <h1 className="font-serif font-bold text-lg text-primary">Cisco → EOS CLI Converter</h1>
          <p className="text-xs text-secondary">IOS / NX-OS to Arista EOS command reference and translation</p>
        </div>

        {/* Mode toggle */}
        <div className="ml-auto flex items-center gap-1 bg-zinc-800/60 rounded-lg p-1 border border-zinc-700/40">
          <button
            onClick={() => setMode('browse')}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              mode === 'browse'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setMode('paste')}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              mode === 'paste'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Paste & Translate
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {mode === 'browse' ? <BrowseMode /> : <PasteMode />}
      </div>
    </div>
  );
};
