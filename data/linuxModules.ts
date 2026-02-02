import { LINUX_CARDS, LinuxCard } from './linuxContent';

export interface LabModuleContent {
  heading: string;
  description: string;
  command: string;
  explanation: string;
  insight: string;
}

export interface LabModule {
  id: string;
  title: string;
  summary: string;
  icon: any;
  content: LabModuleContent[];
}

// Compatibility adapter: derive legacy LAB_MODULES from unified Linux cards.
export const LAB_MODULES: LabModule[] = LINUX_CARDS.map((card: LinuxCard) => ({
  id: card.id,
  title: card.title,
  summary: card.summary,
  icon: card.icon,
  content: card.commands.map((cmd) => ({
    heading: cmd.title,
    description: cmd.why,
    command: cmd.snippet,
    explanation: cmd.why,
    insight: cmd.insight
  }))
}));
