import type { SwitchSpec } from '../types';
import { family7050X3 } from './switches/7050X3.ts';
import { family7050X4 } from './switches/7050X4.ts';
import { family7060X5 } from './switches/7060X5.ts';
import { family7060X6 } from './switches/7060X6.ts';
import { family7280R3 } from './switches/7280R3.ts';
import { family7280R3A } from './switches/7280R3A.ts';
import { family7800R4 } from './switches/7800R4.ts';

export const indexData: SwitchSpec[] = [
  ...family7050X3,
  ...family7050X4,
  ...family7060X5,
  ...family7060X6,
  ...family7280R3,
  ...family7280R3A,
  ...family7800R4
];