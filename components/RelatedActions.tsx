import React from 'react';

type Action = {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  tone?: 'primary' | 'emerald' | 'blue';
  tooltip?: string;
};

interface RelatedActionsProps {
  title?: string;
  actions: Action[];
  className?: string;
}

export const RelatedActions: React.FC<RelatedActionsProps> = ({ title = 'Related actions', actions, className }) => {
  if (!actions.length) return null;
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className ?? ''}`}>
      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">{title}</span>
      <div className="flex flex-wrap gap-2">
        {actions.map((action, idx) => (
          <button
            key={`${action.label}-${idx}`}
            onClick={action.onClick}
            title={action.tooltip}
            className={`px-3 py-1 rounded-full border border-border text-xs font-semibold flex items-center gap-2 text-secondary hover:text-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg ${
              action.tone === 'emerald'
                ? 'hover:border-emerald-400/60'
                : action.tone === 'blue'
                  ? 'hover:border-blue-400/60'
                  : 'hover:border-emerald-300/40'
            }`}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};
