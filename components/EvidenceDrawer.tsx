import React, { useState, useMemo } from 'react';
import { Folder, ChevronDown, Clipboard } from 'lucide-react';
import { EVIDENCE_LOCKER, EvidenceItem } from '@/data/evidence';

interface EvidenceDrawerProps {
  contextTags?: string[];
  title?: string;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ contextTags = [], title = 'Evidence Locker' }) => {
  const [open, setOpen] = useState(false);

  const items = useMemo(() => {
    if (!contextTags.length) return EVIDENCE_LOCKER;
    return EVIDENCE_LOCKER.filter((item) => item.tags?.some((t) => contextTags.includes(t)) || !item.tags?.length);
  }, [contextTags]);

  const copy = (cmd: string) => {
    try {
      if (navigator?.clipboard) navigator.clipboard.writeText(cmd);
    } catch {
      // ignore
    }
  };

  if (!items.length) return null;

  return (
    <div className="border border-border rounded-2xl bg-card-bg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-primary hover:bg-card-bg/80"
      >
        <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary">
          <Folder size={14} className="text-emerald-400" /> {title}
        </span>
        <ChevronDown size={14} className={`text-secondary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="p-4 space-y-2">
          {items.map((item) => (
            <div key={item.id} className="p-2 rounded-lg border border-border bg-card-bg/70 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-semibold text-primary">{item.title}</div>
                <button
                  onClick={() => copy(item.command)}
                  className="text-[11px] text-secondary hover:text-primary inline-flex items-center gap-1"
                >
                  <Clipboard size={12} /> Copy
                </button>
              </div>
              <div className="text-[11px] text-secondary font-mono break-all">{item.command}</div>
              <div className="text-xs text-secondary">{item.why}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
