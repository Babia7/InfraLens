import React, { useEffect } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { InfraLensProvider, useInfraLens } from '@/context/InfraLensContext';

const TestWriter: React.FC = () => {
  const { setApps } = useInfraLens();

  useEffect(() => {
    setApps((prev) => [
      {
        id: 'test-app',
        name: 'Test App',
        description: 'Smoke persistence',
        category: 'Reasoning',
        tags: ['test']
      },
      ...prev,
    ]);
  }, [setApps]);

  return null;
};

describe('InfraLensProvider persistence', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    localStorage.clear();
  });

  it('debounces and writes state to localStorage', () => {
    render(
      <InfraLensProvider>
        <TestWriter />
      </InfraLensProvider>
    );

    expect(localStorage.getItem('infralens_field_apps')).toBeNull();
    vi.advanceTimersByTime(1100);

    const stored = localStorage.getItem('infralens_field_apps');
    expect(stored).toBeTruthy();
    const parsed = stored ? JSON.parse(stored) : [];
    expect(parsed[0].id).toBe('test-app');
  });
});
