import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { BriefingTheater } from '@apps/BriefingTheater';

describe('BriefingTheater', () => {
  it('renders preset titles', async () => {
    render(
      <MemoryRouter initialEntries={['/theater']}>
        <BriefingTheater onBack={() => {}} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Why Arista 2.0/i)).toBeInTheDocument();
    });
  });
});
