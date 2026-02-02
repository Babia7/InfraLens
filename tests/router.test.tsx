import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { toolsRegistry } from '@/config/toolsRegistry';
import { InfraLensProvider } from '@/context/InfraLensContext';

// Simple router harness to ensure lazy routes resolve without runtime errors.
describe('Router', () => {
  it('renders home route without crashing', async () => {
    render(
      <InfraLensProvider>
        <HashRouter>
          <Routes>
            {Object.values(toolsRegistry).map((tool) => (
              <Route
                key={tool.id}
                path={tool.path}
                element={<tool.component />}
              />
            ))}
          </Routes>
        </HashRouter>
      </InfraLensProvider>
    );

    // Expect home tile content to appear
    expect(await screen.findByText(/InfraLens/i)).toBeInTheDocument();
  });
});
