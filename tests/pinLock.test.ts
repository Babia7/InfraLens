import { describe, expect, it, beforeEach } from 'vitest';
import { MANDATORY_APP_PIN, clearUnlockedSession, isPinLockEnabled, isPinUnlockedInSession, unlockSession } from '@/services/pinLock';

describe('pin lock utilities', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('uses mandatory app pin gate with fixed pin', () => {
    expect(MANDATORY_APP_PIN).toBe('19901991');
    expect(isPinLockEnabled()).toBe(true);
  });

  it('stores and clears unlocked state in session storage', () => {
    expect(isPinUnlockedInSession()).toBe(false);
    unlockSession();
    expect(isPinUnlockedInSession()).toBe(true);
    clearUnlockedSession();
    expect(isPinUnlockedInSession()).toBe(false);
  });
});
