import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import App from '@/App';

describe('App', () => {
  it('renders the home grid without crashing', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getAllByText(/InfraLens/i).length).toBeGreaterThan(0);
    });
  });
});
