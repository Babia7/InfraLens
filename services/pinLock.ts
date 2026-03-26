const APP_UNLOCKED_STORAGE_KEY = 'infralens_pin_unlocked';
export const MANDATORY_APP_PIN = '19901991';

export const isPinLockEnabled = (): boolean => true;

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
