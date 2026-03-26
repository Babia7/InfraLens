export type PinLockEnv = {
  VITE_APP_PIN?: string;
};

const APP_UNLOCKED_STORAGE_KEY = 'infralens_pin_unlocked';

export const getConfiguredAppPin = (env: PinLockEnv): string => (env.VITE_APP_PIN ?? '').trim();

export const isPinLockEnabled = (env: PinLockEnv): boolean => getConfiguredAppPin(env).length > 0;

export const isPinUnlockedInSession = (): boolean => {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
    return false;
  }

  return sessionStorage.getItem(APP_UNLOCKED_STORAGE_KEY) === 'true';
};

export const unlockSession = (): void => {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(APP_UNLOCKED_STORAGE_KEY, 'true');
};

export const clearUnlockedSession = (): void => {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem(APP_UNLOCKED_STORAGE_KEY);
};

