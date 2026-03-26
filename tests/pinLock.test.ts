import { describe, expect, it, beforeEach } from 'vitest';
import { clearUnlockedSession, getConfiguredAppPin, isPinLockEnabled, isPinUnlockedInSession, unlockSession } from '@/services/pinLock';

describe('pin lock utilities', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('treats VITE_APP_PIN as optional and trims whitespace', () => {
    expect(getConfiguredAppPin({ VITE_APP_PIN: ' 1234 ' })).toBe('1234');
    expect(isPinLockEnabled({ VITE_APP_PIN: '   ' })).toBe(false);
    expect(isPinLockEnabled({ VITE_APP_PIN: '0000' })).toBe(true);
  });

  it('stores and clears unlocked state in session storage', () => {
    expect(isPinUnlockedInSession()).toBe(false);
    unlockSession();
    expect(isPinUnlockedInSession()).toBe(true);
    clearUnlockedSession();
    expect(isPinUnlockedInSession()).toBe(false);
  });
});

