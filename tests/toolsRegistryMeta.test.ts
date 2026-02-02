import { describe, it, expect } from 'vitest';
import { toolsRegistry } from '@/config/toolsRegistry';

describe('toolsRegistry metadata', () => {
  it('paths are unique and start with "/"', () => {
    const seen = new Set<string>();
    Object.values(toolsRegistry).forEach((tool) => {
      expect(tool.path.startsWith('/')).toBe(true);
      expect(seen.has(tool.path)).toBe(false);
      seen.add(tool.path);
    });
  });

  it('ids match registry keys and components are defined', () => {
    Object.entries(toolsRegistry).forEach(([key, tool]) => {
      expect(tool.id).toBe(key);
      expect(tool.component).toBeTruthy();
    });
  });

  it('parentIds, when provided, exist in registry', () => {
    Object.values(toolsRegistry).forEach((tool) => {
      if (tool.parentId) {
        expect(toolsRegistry[tool.parentId]).toBeTruthy();
      }
    });
  });
});
