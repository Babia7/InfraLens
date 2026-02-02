import { describe, it, expect } from 'vitest';
import { indexData } from '@data/switches.index';
import { allChassis } from '@data/chassis.index';
import { datasetContract } from '@data/datasetContract';

describe('Data contracts', () => {
  it('switch specs contain required fields and datasheets', () => {
    expect(indexData.length).toBeGreaterThan(0);

    indexData.forEach((sw) => {
      expect(sw.id).toBeTruthy();
      expect(sw.model).toBeTruthy();
      expect(sw.series).toBeTruthy();
      expect(sw.description).toBeTruthy();
      expect(sw.datasheetUrl).toBeTruthy();
      expect(sw.interfaces && sw.interfaces.length).toBeGreaterThan(0);
    });
  });

  it('dataset contract expected models are present in switch index', () => {
    const models = new Set(indexData.map((s) => s.model));
    Object.values(datasetContract.families).forEach((fam) => {
      fam.expectedModels.forEach((m) => {
        expect(models.has(m)).toBe(true);
      });
    });
  });

  it('chassis specs contain required fields and datasheets', () => {
    expect(allChassis.length).toBeGreaterThan(0);
    allChassis.forEach((ch) => {
      expect(ch.id).toBeTruthy();
      expect(ch.model).toBeTruthy();
      expect(ch.series).toBeTruthy();
      expect(ch.slotsTotal).toBeGreaterThan(0);
      expect(ch.datasheetUrl).toBeTruthy();
    });
  });
});
