
import React from 'react';
import { SectionType } from '../types';

export interface ToolRegistryItem {
  id: SectionType;
  path: string;
  component: React.LazyExoticComponent<any>;
  parentId?: SectionType;
  props?: Record<string, any>;
  audience?: 'Internal' | 'Customer' | 'Public';
}

// Helper to clean up the registry definitions
const load = (importer: Promise<any>, name: string) => 
  React.lazy(() => importer.then(module => ({ default: module[name] })));

export const toolsRegistry: Record<SectionType, ToolRegistryItem> = {
  // --- CORE SYSTEM ---
  [SectionType.HOME]: {
    id: SectionType.HOME,
    path: '/',
    component: load(import('@apps/BentoGrid'), 'BentoGrid'),
    audience: 'Public'
  },
  [SectionType.ABOUT]: {
    id: SectionType.ABOUT,
    path: '/system-about',
    component: load(import('@apps/SystemAbout'), 'SystemAbout'),
    parentId: SectionType.HOME,
    audience: 'Public'
  },
  [SectionType.ADMIN]: {
    id: SectionType.ADMIN,
    path: '/admin',
    component: load(import('@apps/AdminConsole'), 'AdminConsole'),
    parentId: SectionType.HOME,
    audience: 'Internal'
  },
  [SectionType.ROADMAP]: {
    id: SectionType.ROADMAP,
    path: '/pipeline',
    component: load(import('@apps/RoadmapRequests'), 'RoadmapRequests'),
    parentId: SectionType.HOME,
    audience: 'Public'
  },

  // --- CATALOGS ---
  [SectionType.APPS]: {
    id: SectionType.APPS,
    path: '/forge',
    component: load(import('@apps/AppShowcase'), 'AppShowcase'),
    parentId: SectionType.HOME,
    audience: 'Public'
  },
  [SectionType.BOOKS]: {
    id: SectionType.BOOKS,
    path: '/codex',
    component: load(import('@apps/BookShelf'), 'BookShelf'),
    parentId: SectionType.HOME,
    audience: 'Public'
  },
  [SectionType.BOOKS_ABOUT]: {
    id: SectionType.BOOKS_ABOUT,
    path: '/codex/about',
    component: load(import('@apps/BookShelf'), 'BookShelf'),
    parentId: SectionType.ABOUT,
    props: { startAbout: true },
    audience: 'Public'
  },
  [SectionType.CONCEPTS]: {
    id: SectionType.CONCEPTS,
    path: '/nexus',
    component: load(import('@apps/VisualEssays'), 'VisualEssays'),
    parentId: SectionType.HOME,
    audience: 'Public'
  },
  [SectionType.CONCEPTS_ABOUT]: {
    id: SectionType.CONCEPTS_ABOUT,
    path: '/nexus/about',
    component: load(import('@apps/VisualEssays'), 'VisualEssays'),
    parentId: SectionType.ABOUT,
    props: { startAbout: true },
    audience: 'Public'
  },

  // --- PERFORMANCE MODULES ---
  [SectionType.SE_PERFORMANCE]: {
    id: SectionType.SE_PERFORMANCE,
    path: '/performance',
    component: load(import('@apps/SEPerformanceGuide'), 'SEPerformanceGuide'),
    parentId: SectionType.HOME,
    audience: 'Internal'
  },
  [SectionType.SE_PERFORMANCE_ABOUT]: {
    id: SectionType.SE_PERFORMANCE_ABOUT,
    path: '/performance/about',
    component: load(import('@apps/SEPerformanceGuide'), 'SEPerformanceGuide'),
    parentId: SectionType.ABOUT,
    props: { startAbout: true },
    audience: 'Internal'
  },

  // --- ORGANIC / STRATEGY APPS ---
  [SectionType.TCO_CALCULATOR]: {
    id: SectionType.TCO_CALCULATOR,
    path: '/apps/tco',
    component: load(import('@apps/TCOCalculator'), 'TCOCalculator'),
    parentId: SectionType.APPS,
    audience: 'Customer'
  },
  [SectionType.TCO_CALCULATOR_ABOUT]: {
    id: SectionType.TCO_CALCULATOR_ABOUT,
    path: '/apps/tco/about',
    component: load(import('@apps/TCOAbout'), 'TCOAbout'),
    parentId: SectionType.TCO_CALCULATOR,
    audience: 'Customer'
  },
  [SectionType.VERTICAL_MATRIX]: {
    id: SectionType.VERTICAL_MATRIX,
    path: '/apps/vertical-matrix',
    component: load(import('@apps/VerticalMatrix'), 'VerticalMatrix'),
    parentId: SectionType.APPS,
    audience: 'Internal'
  },
  [SectionType.OPERATIONAL_VELOCITY_MODELER]: {
    id: SectionType.OPERATIONAL_VELOCITY_MODELER,
    path: '/apps/velocity',
    component: load(import('@apps/OperationalVelocityModeler'), 'OperationalVelocityModeler'),
    parentId: SectionType.APPS,
    audience: 'Customer'
  },
  [SectionType.OPERATIONAL_VELOCITY_MODELER_ABOUT]: {
    id: SectionType.OPERATIONAL_VELOCITY_MODELER_ABOUT,
    path: '/apps/velocity/about',
    component: load(import('@apps/OperationalVelocityAbout'), 'OperationalVelocityAbout'),
    parentId: SectionType.OPERATIONAL_VELOCITY_MODELER,
    audience: 'Customer'
  },
  [SectionType.MTTR_DOWNTIME_INSURANCE]: {
    id: SectionType.MTTR_DOWNTIME_INSURANCE,
    path: '/apps/mttr',
    component: load(import('@apps/MTTRDowntimeInsurance'), 'MTTRDowntimeInsurance'),
    parentId: SectionType.APPS,
    audience: 'Customer'
  },
  [SectionType.MTTR_DOWNTIME_INSURANCE_ABOUT]: {
    id: SectionType.MTTR_DOWNTIME_INSURANCE_ABOUT,
    path: '/apps/mttr/about',
    component: load(import('@apps/MTTRDowntimeInsuranceAbout'), 'MTTRDowntimeInsuranceAbout'),
    parentId: SectionType.MTTR_DOWNTIME_INSURANCE,
    audience: 'Customer'
  },
  [SectionType.UNIFIED_OS_TALENT_ROI]: {
    id: SectionType.UNIFIED_OS_TALENT_ROI,
    path: '/apps/talent-roi',
    component: load(import('@apps/UnifiedOSTalentROI'), 'UnifiedOSTalentROI'),
    parentId: SectionType.APPS,
    audience: 'Customer'
  },
  [SectionType.UNIFIED_OS_TALENT_ROI_ABOUT]: {
    id: SectionType.UNIFIED_OS_TALENT_ROI_ABOUT,
    path: '/apps/talent-roi/about',
    component: load(import('@apps/UnifiedOSTalentROIAbout'), 'UnifiedOSTalentROIAbout'),
    parentId: SectionType.UNIFIED_OS_TALENT_ROI,
    audience: 'Customer'
  },
  [SectionType.WHY_NOW_ENGINE]: {
    id: SectionType.WHY_NOW_ENGINE,
    path: '/apps/why-now',
    component: load(import('@apps/WhyNowEngineApp'), 'WhyNowEngineApp'),
    parentId: SectionType.APPS,
    audience: 'Customer'
  },

  // --- TECHNIC / LAB APPS ---
  [SectionType.KNOWLEDGE_GRAPH]: {
    id: SectionType.KNOWLEDGE_GRAPH,
    path: '/nexus/graph',
    component: load(import('@apps/KnowledgeGraph'), 'KnowledgeGraph'),
    parentId: SectionType.HOME,
    audience: 'Public'
  },
  [SectionType.AVD_STUDIO]: {
    id: SectionType.AVD_STUDIO,
    path: '/apps/avd',
    component: load(import('@apps/AVDStudio'), 'AVDStudio'),
    parentId: SectionType.APPS,
    audience: 'Internal'
  },
  [SectionType.LINUX_LAB]: {
    id: SectionType.LINUX_LAB,
    path: '/apps/linux',
    component: load(import('@apps/LearnLinuxEOS'), 'LearnLinuxEOS'),
    parentId: SectionType.APPS,
    audience: 'Internal'
  },
  [SectionType.LIFE_SCIENCES_ARCHITECT]: {
    id: SectionType.LIFE_SCIENCES_ARCHITECT,
    path: '/apps/lifesciences-architect',
    component: load(import('@apps/LifeSciencesArchitect'), 'LifeSciencesArchitect'),
    parentId: SectionType.APPS,
    audience: 'Customer'
  },
  [SectionType.RELEASE_NOTES_DECONSTRUCTOR]: {
    id: SectionType.RELEASE_NOTES_DECONSTRUCTOR,
    path: '/apps/release-notes',
    component: load(import('@apps/ReleaseNoteDeconstructor'), 'ReleaseNoteDeconstructor'),
    parentId: SectionType.APPS,
    audience: 'Internal'
  },
  [SectionType.ARCHITECTURAL_GAP_ANALYSIS]: {
    id: SectionType.ARCHITECTURAL_GAP_ANALYSIS,
    path: '/apps/gap-analysis',
    component: load(import('@apps/ArchitecturalGapAnalysis'), 'ArchitecturalGapAnalysis'),
    parentId: SectionType.APPS,
    audience: 'Internal'
  },
  [SectionType.AI_FABRIC_DESIGNER]: {
    id: SectionType.AI_FABRIC_DESIGNER,
    path: '/apps/ai-fabric',
    component: load(import('@apps/AIClusterFabricDesigner'), 'AIClusterFabricDesigner'),
    parentId: SectionType.APPS,
    audience: 'Customer'
  },
  [SectionType.STORAGE_FABRIC_PLANNER]: {
    id: SectionType.STORAGE_FABRIC_PLANNER,
    path: '/apps/storage-planner',
    component: load(import('@apps/StorageFabricPlanner'), 'StorageFabricPlanner'),
    parentId: SectionType.APPS,
    audience: 'Customer'
  },
  [SectionType.STORAGE_FABRIC_PLANNER_ABOUT]: {
    id: SectionType.STORAGE_FABRIC_PLANNER_ABOUT,
    path: '/apps/storage-planner/about',
    component: load(import('@apps/StorageFabricPlannerAbout'), 'StorageFabricPlannerAbout'),
    parentId: SectionType.STORAGE_FABRIC_PLANNER,
    audience: 'Customer'
  },
  [SectionType.MODEL_SELECTOR_7280]: {
    id: SectionType.MODEL_SELECTOR_7280,
    path: '/apps/selector-7280',
    component: load(import('@apps/SwitchSelector7280'), 'SwitchSelector7280'),
    parentId: SectionType.APPS,
    audience: 'Internal'
  },
  [SectionType.MODEL_SELECTOR_7050]: {
    id: SectionType.MODEL_SELECTOR_7050,
    path: '/apps/selector-7050',
    component: load(import('@apps/SwitchSelector7050'), 'SwitchSelector7050'),
    parentId: SectionType.APPS,
    audience: 'Internal'
  },

  // --- ENABLEMENT & THEATER ---
  [SectionType.BRIEFING_THEATER]: {
    id: SectionType.BRIEFING_THEATER,
    path: '/theater',
    component: load(import('@apps/BriefingTheater'), 'BriefingTheater'),
    parentId: SectionType.HOME,
    audience: 'Internal'
  },
  [SectionType.DEMO_COMMAND]: {
    id: SectionType.DEMO_COMMAND,
    path: '/demo',
    component: load(import('@apps/DemoCommand'), 'DemoCommand'),
    parentId: SectionType.HOME,
    audience: 'Internal'
  },
  [SectionType.NARRATIVE_PLAYBOOK]: {
    id: SectionType.NARRATIVE_PLAYBOOK,
    path: '/delivery/playbook',
    component: load(import('@apps/NarrativePlaybookStudio'), 'NarrativePlaybookStudio'),
    parentId: SectionType.HOME,
    audience: 'Internal'
  },
  [SectionType.CLOUDVISION_ENABLEMENT]: {
    id: SectionType.CLOUDVISION_ENABLEMENT,
    path: '/enablement',
    component: load(import('@apps/CloudVisionEnablement'), 'CloudVisionEnablement'),
    parentId: SectionType.HOME,
    audience: 'Public'
  },
  [SectionType.PROTOCOLS]: {
    id: SectionType.PROTOCOLS,
    path: '/enablement/protocols',
    component: load(import('@apps/ProtocolsApp'), 'ProtocolsApp'),
    parentId: SectionType.HOME,
    audience: 'Public'
  },
  [SectionType.PROTOCOL_COLLISION_MAPPER]: {
    id: SectionType.PROTOCOL_COLLISION_MAPPER,
    path: '/apps/protocol-collision',
    component: load(import('@apps/ProtocolCollisionMapper'), 'ProtocolCollisionMapper'),
    parentId: SectionType.APPS,
    audience: 'Internal'
  },
  [SectionType.VALIDATED_DESIGN_NAVIGATOR]: {
    id: SectionType.VALIDATED_DESIGN_NAVIGATOR,
    path: '/apps/validated-designs',
    component: load(import('@apps/ValidatedDesignNavigator'), 'ValidatedDesignNavigator'),
    parentId: SectionType.APPS,
    audience: 'Customer'
  },
  [SectionType.SALES_PLAYBOOK_COACH]: {
    id: SectionType.SALES_PLAYBOOK_COACH,
    path: '/apps/sales-playbook',
    component: load(import('@apps/SalesPlaybookCoach'), 'SalesPlaybookCoach'),
    parentId: SectionType.APPS,
    audience: 'Customer'
  },
  [SectionType.LINKS_HUB]: {
    id: SectionType.LINKS_HUB,
    path: '/resources',
    component: load(import('@apps/ResourceHub'), 'ResourceHub'),
    parentId: SectionType.HOME,
    audience: 'Public'
  }
};
