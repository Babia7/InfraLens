import { describe, it, expect } from 'vitest';
import {
  CLI_MAPPINGS,
  CATEGORY_META,
  CATEGORY_ORDER,
  CLICategory,
  CLIFamily,
} from '@data/cliConverterContent';
import { normalizeCmd, translateLine } from '@/services/cliTranslator';

const VALID_CATEGORIES: CLICategory[] = [
  'interfaces', 'vlans', 'spanning-tree', 'routing',
  'bgp', 'ospf', 'acl', 'qos',
  'mlag-vpc', 'vxlan', 'management', 'show',
];

const VALID_FAMILIES: CLIFamily[] = ['ios', 'nxos', 'both'];

// ── Data contracts ─────────────────────────────────────────────────────────────

describe('CLI converter data contracts', () => {
  it('all mapping IDs are unique', () => {
    const ids = CLI_MAPPINGS.map(m => m.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('every mapping has required fields', () => {
    CLI_MAPPINGS.forEach(m => {
      expect(m.id, `${m.id} missing id`).toBeTruthy();
      expect(m.ciscoCommand, `${m.id} missing ciscoCommand`).toBeTruthy();
      expect(m.eosCommand, `${m.id} missing eosCommand`).toBeTruthy();
      expect(m.category, `${m.id} missing category`).toBeTruthy();
      expect(m.family, `${m.id} missing family`).toBeTruthy();
    });
  });

  it('all category values are valid CLICategory members', () => {
    CLI_MAPPINGS.forEach(m => {
      expect(VALID_CATEGORIES, `${m.id} has invalid category "${m.category}"`).toContain(m.category);
    });
  });

  it('all family values are valid CLIFamily members', () => {
    CLI_MAPPINGS.forEach(m => {
      expect(VALID_FAMILIES, `${m.id} has invalid family "${m.family}"`).toContain(m.family);
    });
  });

  it('CATEGORY_ORDER contains all 12 CLICategory values', () => {
    expect(CATEGORY_ORDER).toHaveLength(12);
    VALID_CATEGORIES.forEach(cat => {
      expect(CATEGORY_ORDER).toContain(cat);
    });
  });

  it('CATEGORY_META has an entry for every CLICategory', () => {
    VALID_CATEGORIES.forEach(cat => {
      expect(CATEGORY_META[cat], `CATEGORY_META missing entry for "${cat}"`).toBeDefined();
      expect(CATEGORY_META[cat].label).toBeTruthy();
      expect(CATEGORY_META[cat].icon).toBeTruthy();
      expect(CATEGORY_META[cat].description).toBeTruthy();
    });
  });
});

// ── Translation logic ──────────────────────────────────────────────────────────

describe('translateLine', () => {
  it('blank line returns status blank with empty eosCommand', () => {
    const result = translateLine('', 'ios');
    expect(result.status).toBe('blank');
    expect(result.eosCommand).toBe('');
  });

  it('! comment line passes through with status comment (ios)', () => {
    const result = translateLine('! comment', 'ios');
    expect(result.status).toBe('comment');
    expect(result.eosCommand).toBe('! comment');
  });

  it('# comment line passes through with status comment (nxos)', () => {
    const result = translateLine('# comment', 'nxos');
    expect(result.status).toBe('comment');
    expect(result.eosCommand).toBe('# comment');
  });

  it('hostname with leading whitespace matches and translates (both)', () => {
    const result = translateLine('  hostname myswitch', 'both');
    expect(result.status).toBe('matched');
    expect(result.eosCommand).toBe('hostname myswitch');
  });

  it('ip route with dotted-decimal mask returns behavior-warning and CIDR prefix (ios)', () => {
    const result = translateLine('ip route 10.0.0.0 255.0.0.0 192.168.1.1', 'ios');
    expect(result.status).toBe('behavior-warning');
    expect(result.eosCommand).toMatch(/^ip route 10\.0\.0\.0\//);
  });

  it('router bgp matches exactly (ios)', () => {
    const result = translateLine('router bgp 65001', 'ios');
    expect(result.status).toBe('matched');
    expect(result.eosCommand).toBe('router bgp 65001');
  });

  it('neighbor remote-as matches (both)', () => {
    const result = translateLine('neighbor 10.0.0.1 remote-as 65000', 'both');
    expect(result.status).toBe('matched');
    expect(result.eosCommand).toBe('neighbor 10.0.0.1 remote-as 65000');
  });

  it('neighbor maximum-prefix maps to maximum-routes with behavior-warning (ios)', () => {
    const result = translateLine('neighbor 10.0.0.1 maximum-prefix 12000', 'ios');
    expect(result.status).toBe('behavior-warning');
    expect(result.eosCommand).toMatch(/^neighbor 10\.0\.0\.1 maximum-routes/);
  });

  it('vrf context maps to vrf instance with behavior-warning (nxos)', () => {
    const result = translateLine('vrf context PROD', 'nxos');
    expect(result.status).toBe('behavior-warning');
    expect(result.eosCommand).toBe('vrf instance PROD');
  });

  it('show bgp sessions maps to show bgp summary with behavior-warning (nxos)', () => {
    const result = translateLine('show bgp sessions', 'nxos');
    expect(result.status).toBe('behavior-warning');
    expect(result.eosCommand).toBe('show bgp summary');
  });

  it('unrecognized command returns status unmatched and passes through (ios)', () => {
    const result = translateLine('no-such-command xyz', 'ios');
    expect(result.status).toBe('unmatched');
    expect(result.eosCommand).toBe('no-such-command xyz');
  });

  it('spanning-tree vlan priority maps to vlan-id with behavior-warning (ios)', () => {
    const result = translateLine('spanning-tree vlan 100 priority 4096', 'ios');
    expect(result.status).toBe('behavior-warning');
    expect(result.eosCommand).toMatch(/^spanning-tree vlan-id 100/);
  });
});
