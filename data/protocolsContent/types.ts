export interface MasteryLevel {
  level: 'Foundation' | 'Logic' | 'Architecture';
  heading: string;
  body: string;
  keyConcept: string;
}

export interface RoleConfig {
  role: string;
  description: string;
  config: string;
}

export interface DCContextEntry {
  scale: string;
  topologyRole: string;
  keyConfig: string;
  highlight: 'leaf-spine' | 'isl' | 'host-edge' | 'border' | 'all';
}

export interface DCContext {
  small: DCContextEntry;
  medium: DCContextEntry;
  large: DCContextEntry;
}

export interface ProtocolDetail {
  id: string;
  name: string;
  legacyTerm: string;
  tagline: string;
  description: string;
  keyBenefits: string[];
  bestPractices?: string[];
  cliTranslation: { legacy: string; arista: string }[];
  masteryPath?: MasteryLevel[];
  roleConfigs?: RoleConfig[];
  referenceLinks?: { title: string; summary?: string; url?: string }[];
  overview?: {
    title: string;
    intro: string;
    sections: { title: string; body: string; bestFor: string }[];
    conclusion: string;
  };
  primer?: {
    title: string;
    body: string;
  };
  dcContext?: DCContext;
}

