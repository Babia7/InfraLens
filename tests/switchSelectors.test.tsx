import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SwitchSelector7050 } from '@/components/apps/SwitchSelector7050';
import { SwitchSelector7280 } from '@/components/apps/SwitchSelector7280';

describe('Switch selectors', () => {
  it('renders 7050 selector with data-driven cards', async () => {
    render(<SwitchSelector7050 onBack={() => {}} />);

    expect(await screen.findByText(/7050 Selector/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Datasheet/i).length).toBeGreaterThan(0);
  });

  it('renders 7280 selector with data-driven cards', async () => {
    render(<SwitchSelector7280 onBack={() => {}} />);

    expect(await screen.findByText(/7280 Selector/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Datasheet/i).length).toBeGreaterThan(0);
  });
});
