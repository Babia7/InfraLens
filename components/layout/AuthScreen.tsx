import React from 'react';

interface AuthScreenProps {
  onSignIn: () => Promise<void>;
  error?: string | null;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSignIn, error }) => {
  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-card-bg border border-border rounded-2xl p-8 space-y-5 shadow-xl">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">InfraLens</p>
        <h1 className="text-2xl font-semibold text-primary">Sign in required</h1>
        <p className="text-sm text-secondary leading-relaxed">
          Authentication is enabled for this deployment. Continue with Google to sign up or log in.
        </p>
        {error && (
          <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
            {error}
          </div>
        )}
        <button
          onClick={() => void onSignIn()}
          className="w-full px-4 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};
