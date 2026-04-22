import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import App from '@/App';
import {
  hasRequiredFirebaseConfig,
  isAllowedGoogleUser,
  isAuthFeatureEnabled,
  parseAllowedGoogleEmails,
} from '@/services/firebase';

describe('Authentication setup', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '#/';
  });

  it('enables auth only when feature flag and required firebase env are present', () => {
    expect(
      isAuthFeatureEnabled({
        VITE_ENABLE_AUTH: 'true',
        VITE_FIREBASE_API_KEY: 'api-key',
        VITE_FIREBASE_AUTH_DOMAIN: 'example.firebaseapp.com',
        VITE_FIREBASE_PROJECT_ID: 'example',
        VITE_FIREBASE_APP_ID: '1:123:web:abc',
      })
    ).toBe(true);

    expect(
      hasRequiredFirebaseConfig({
        VITE_FIREBASE_API_KEY: 'api-key',
        VITE_FIREBASE_AUTH_DOMAIN: 'example.firebaseapp.com',
        VITE_FIREBASE_PROJECT_ID: 'example',
      })
    ).toBe(false);

    expect(
      isAuthFeatureEnabled({
        VITE_ENABLE_AUTH: 'false',
        VITE_FIREBASE_API_KEY: 'api-key',
        VITE_FIREBASE_AUTH_DOMAIN: 'example.firebaseapp.com',
        VITE_FIREBASE_PROJECT_ID: 'example',
        VITE_FIREBASE_APP_ID: '1:123:web:abc',
      })
    ).toBe(false);
  });

  it('parses and enforces allowed Google email list', () => {
    expect(parseAllowedGoogleEmails(' tinurajan1@gmail.com,TEAM@Example.com ')).toEqual([
      'tinurajan1@gmail.com',
      'team@example.com',
    ]);

    expect(isAllowedGoogleUser('tinurajan1@gmail.com', ['tinurajan1@gmail.com'])).toBe(true);
    expect(isAllowedGoogleUser('other@gmail.com', ['tinurajan1@gmail.com'])).toBe(false);
    expect(isAllowedGoogleUser('anyone@gmail.com', [])).toBe(true);
  });

  it('keeps app accessible when auth flag is not enabled', async () => {
    window.location.hash = '#/admin';
    render(<App />);

    fireEvent.change(screen.getByLabelText('App access PIN'), { target: { value: '19901991' } });
    fireEvent.click(screen.getByRole('button', { name: /unlock infralens/i }));

    expect(await screen.findByText(/Admin Apps/i)).toBeInTheDocument();
  });
});
