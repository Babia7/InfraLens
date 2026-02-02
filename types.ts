
export enum SectionType {
  HOME = 'HOME',
  APPS = 'APPS',
  BOOKS = 'BOOKS',
  BOOKS_ABOUT = 'BOOKS_ABOUT',
  CONCEPTS = 'CONCEPTS',
  CONCEPTS_ABOUT = 'CONCEPTS_ABOUT',
  ROADMAP = 'ROADMAP',
  ABOUT = 'ABOUT',
  SE_PERFORMANCE = 'SE_PERFORMANCE',
  SE_PERFORMANCE_ABOUT = 'SE_PERFORMANCE_ABOUT',
  ADMIN = 'ADMIN',
  KNOWLEDGE_GRAPH = 'KNOWLEDGE_GRAPH',
  TCO_CALCULATOR = 'TCO_CALCULATOR',
  AVD_STUDIO = 'AVD_STUDIO',
  BRIEFING_THEATER = 'BRIEFING_THEATER',
  DEMO_COMMAND = 'DEMO_COMMAND',
  MODEL_SELECTOR_7280 = 'MODEL_SELECTOR_7280',
  MODEL_SELECTOR_7050 = 'MODEL_SELECTOR_7050',
  CLOUDVISION_ENABLEMENT = 'CLOUDVISION_ENABLEMENT',
  LINUX_LAB = 'LINUX_LAB',
  LINUX_TRAINING = 'LINUX_TRAINING',
  LINKS_HUB = 'LINKS_HUB',
  VERTICAL_MATRIX = 'VERTICAL_MATRIX',
  PROTOCOLS = 'PROTOCOLS',
  RELEASE_NOTES_DECONSTRUCTOR = 'RELEASE_NOTES_DECONSTRUCTOR',
  ARCHITECTURAL_GAP_ANALYSIS = 'ARCHITECTURAL_GAP_ANALYSIS',
  AI_FABRIC_DESIGNER = 'AI_FABRIC_DESIGNER',
  STORAGE_FABRIC_PLANNER = 'STORAGE_FABRIC_PLANNER',
  STORAGE_FABRIC_PLANNER_ABOUT = 'STORAGE_FABRIC_PLANNER_ABOUT',
  OPERATIONAL_VELOCITY_MODELER = 'OPERATIONAL_VELOCITY_MODELER',
  OPERATIONAL_VELOCITY_MODELER_ABOUT = 'OPERATIONAL_VELOCITY_MODELER_ABOUT',
  MTTR_DOWNTIME_INSURANCE = 'MTTR_DOWNTIME_INSURANCE',
  MTTR_DOWNTIME_INSURANCE_ABOUT = 'MTTR_DOWNTIME_INSURANCE_ABOUT',
  UNIFIED_OS_TALENT_ROI = 'UNIFIED_OS_TALENT_ROI',
  UNIFIED_OS_TALENT_ROI_ABOUT = 'UNIFIED_OS_TALENT_ROI_ABOUT',
  NARRATIVE_PLAYBOOK = 'NARRATIVE_PLAYBOOK',
  PROTOCOL_COLLISION_MAPPER = 'PROTOCOL_COLLISION_MAPPER',
  VALIDATED_DESIGN_NAVIGATOR = 'VALIDATED_DESIGN_NAVIGATOR',
  SALES_PLAYBOOK_COACH = 'SALES_PLAYBOOK_COACH',
  TCO_CALCULATOR_ABOUT = 'TCO_CALCULATOR_ABOUT',
  LIFE_SCIENCES_ARCHITECT = 'LIFE_SCIENCES_ARCHITECT',
  WHY_NOW_ENGINE = 'WHY_NOW_ENGINE'
}

export interface SalesPlayContext {
  persona: string;
  vertical: string;
  objections: { title: string; response: string }[];
  proofPoints?: string[];
  dealContext?: {
    customer?: string;
    stage?: string;
    pain?: string;
    successMetric?: string;
  };
  updatedAt: number;
}

export interface TeleprompterContext {
  title: string;
  scene: {
    heading: string;
    caption?: string;
    teleprompter?: string;
    visualIntent?: string;
  };
  updatedAt: number;
}

export interface ValidatedDesignEvidence {
  source: string;
  url?: string;
  lastValidated: string;
  eosTrain: string;
  caveats: string[];
}

export interface ValidatedDesignExport {
  type: 'AVD Inventory' | 'Config Snippet' | 'PDF' | 'Markdown';
  description: string;
}

export interface ValidatedDesign {
  id: string;
  name: string;
  fabricType: string;
  scale: string;
  brownfieldReady: boolean;
  useCases: string[];
  topology: string;
  rtSchema?: string;
  mtuPlan?: string;
  underlay: string;
  overlay: string;
  mandatory: string[];
  optional: string[];
  bomNotes: string[];
  bom?: { item: string; count?: string; notes?: string }[];
  avdSeed?: { spines: number; leaves: number; linksPerLeaf: number; uplinkSpeed: string; vrfs: string[]; notes?: string };
  preflight: string[];
  runbook: string[];
  evidence: ValidatedDesignEvidence;
  exports: ValidatedDesignExport[];
}

export interface StorageStrategy {
  topology: string;
  skuRecommendation: string;
  losslessConfig: {
    pfc: string;
    ecn: string;
    bufferStrategy: string;
  };
  reliabilityScore: string;
  businessOutcome: string;
  deploymentNotes: string[];
}

export interface FabricStrategy {
  topology: string;
  skuRecommendation: string;
  oversubscriptionRatio: string;
  railAlignment: string;
  executiveSummary: string;
  criticalCaveats: string[];
}

export interface GapAnalysisResult {
  scenario: string;
  legacyImpact: string;
  aristaResilience: string;
  businessMetric: string;
  executiveSummary: string;
  bulletPoints: string[];
}

export interface DeconstructedFeature {
  name: string;
  technicalSummary: string;
  businessValue: string;
  vertical: string;
}

export interface DeconstructionResult {
  version: string;
  features: DeconstructedFeature[];
}

export interface BookSummary {
  intro: string; // Strategic Context
  keyIdeas: { heading: string; body: string }[]; // Deployment/Architectural Pillars
  conclusion: string; // Business Outcome
  groundingSources?: { title?: string; uri?: string }[];
}

// Taxonomy Update: Aligned with "Reasoning + Enablement"
export type AppCategory = 'Reasoning' | 'Sales' | 'Practice' | 'Reference' | 'Delivery';

export interface AppItem {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
  subCategory?: string;
  tags: string[];
  link?: string;
  internalRoute?: SectionType;
  color?: string;
  featured?: boolean;
  hidden?: boolean;
  adminOnly?: boolean;
}

export interface Suggestion extends Omit<AppItem, 'category'> {
  reason: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  coverUrl?: string;
  review: string;
  rating: number; // 1-5
  tags: string[]; 
  preloadedSummary?: BookSummary;
  hidden?: boolean;
  type: 'White Paper' | 'Design Guide' | 'ASIC Deep-Dive' | 'Case Study';
}

export interface ConceptSection {
  heading: string;
  body: string;
  visualPrompt?: string; 
}

export interface ConceptExplainer {
  id: string;
  title: string;
  subtitle: string;
  sections: ConceptSection[];
  tags: string[];
  hidden?: boolean;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  category: 'Core' | 'Integration' | 'Content' | 'System' | 'Social';
  status: 'in-progress' | 'planned' | 'request' | 'released';
  type?: 'feature' | 'refinement'; 
  votes: number;
  icon?: any; 
  hidden?: boolean;
}

export interface TileConfig {
  title: string;
  subtext: string;
  visible: boolean;
  label?: string;
  category?: string;
}

export interface GlobalConfig {
  hero: {
    titlePrefix: string;
    titleSuffix: string;
    subtitle: string;
    version: string;
    linkedinUrl?: string;
    instagramUrl?: string;
  };
  tiles: {
    forge: TileConfig;
    library: TileConfig;
    essays: TileConfig;
    about: TileConfig;
    roadmap: TileConfig;
    sePerformance: TileConfig;
    briefing: TileConfig;
    salesPlaybook: TileConfig;
    demo: TileConfig;
    cvEnablement: TileConfig;
    links: TileConfig;
    protocols: TileConfig;
    linuxLab: TileConfig;
  }
}

export interface SEPerformanceStep {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  actionText: string;
}

export interface FeynmanAnalysis {
  score: number; 
  critique: string;
  jargonFound: string[];
  simplifiedVersion: string;
}

export interface AVDBrief {
  yaml: string;
  eos: string;
  validation: string;
}

export interface BriefingNarrative {
  title: string;
  subtitle: string;
  scenes: {
    heading: string;
    caption: string;
    teleprompter: string; 
    visualIntent: string; 
  }[];
}

export interface DemoScenario {
  title: string;
  persona: string;
  playbook: {
    step: string;
    highlight: string;
    cliCommand?: string;
  }[];
  cognitiveAngle: string;
}

export interface SwitchInterface {
  speedGbps: number;
  physicalPorts: number;
  formFactor: string;
  breakout?: { supported: boolean; notes?: string };
}

export interface SwitchSpec {
  id: string;
  model: string;
  series: string;
  description: string;
  type: string;
  maxPortsBySpeedGbps?: Record<string, number>;
  interfaces?: SwitchInterface[];
  throughputTbps?: number;
  pps?: string;
  latency?: string;
  cpu?: string;
  memory?: string;
  buffer?: string;
  powerDraw?: string;
  size?: string;
  weight?: string;
  eosLicense?: string;
  eosLicenseGroup?: number;
  datasheetUrl?: string;
  source?: { document?: string; page?: number; table?: string };
}

export interface ChassisSpec {
  id: string;
  model: string;
  series: string;
  slotsTotal: number;
  size?: string;
  power?: string;
  airflow?: string;
  datasheetUrl?: string;
  source?: { document?: string; page?: number; table?: string };
}
