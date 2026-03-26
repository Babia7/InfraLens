import React, { useState } from 'react';

interface PinLockScreenProps {
  onUnlock: (pin: string) => boolean;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onUnlock(pin);
    if (ok) {
      setError(null);
      setPin('');
      return;
    }
    setError('Incorrect PIN. Please try again.');
  };

  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-md bg-card-bg border border-border rounded-2xl p-8 space-y-5 shadow-xl">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">InfraLens</p>
        <h1 className="text-2xl font-semibold text-primary">Enter access PIN</h1>
        <p className="text-sm text-secondary leading-relaxed">
          This deployment is protected with a shared PIN lock before app access.
        </p>
        <input
          type="password"
          autoComplete="off"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-border text-primary focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
          placeholder="Enter PIN"
          aria-label="App access PIN"
        />
        {error && <p className="text-xs text-rose-400">{error}</p>}
        <button
          type="submit"
          className="w-full px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"
        >
          Unlock InfraLens
        </button>
      </form>
    </div>
  );
};

