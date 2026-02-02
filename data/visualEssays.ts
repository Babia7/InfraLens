import { ConceptExplainer } from '../types';

export const visualEssays: ConceptExplainer[] = [
  {
    id: 'c-why-arista',
    title: 'Why Arista?',
    subtitle: 'The Software-Defined Revolution.',
    tags: ['EOS', 'SysDB', 'Strategy'],
    sections: [
      {
        heading: 'The Unified Image',
        body: 'Arista ships one binary across every platform. This eliminates version-drift and simplifies testing cycles. When you qualify EOS on one device, you qualify it for the whole fabric.',
        visualPrompt: 'A single glowing sphere representing a unified binary source.'
      },
      {
        heading: 'SysDB: State-Sharing',
        body: 'Processes communicate through a central state database, enabling hitless restarts and unparalleled reliability. State is decoupled from protocol logic.',
        visualPrompt: 'A central core with multiple nodes syncing state.'
      },
      {
        heading: 'Open Programmability',
        body: 'Built on an unmodified Linux kernel. Access a real bash shell, run Python on-box, and leverage eAPI for seamless integration with modern DevOps toolchains.',
        visualPrompt: 'Code brackets and terminal symbols pulsing with light.'
      },
      {
        heading: 'Cognitive Telemetry',
        body: 'Move from SNMP polling to state-streaming. CloudVision captures every state change in real-time, providing a "time-machine" for network forensics.',
        visualPrompt: 'A radar sweep across a field of data points.'
      }
    ]
  },
  {
    id: 'c-polymathos',
    title: 'Nexus of Craft',
    subtitle: 'The collective behind InfraLens.',
    tags: ['PolymathOS', 'Design Ethos', 'Calm Tech'],
    sections: [
      {
        heading: 'The Polymathic Mandate',
        body: 'In a hyper-specialized world, we choose breadth as a deliberate edge. InfraLens exists to connect ideas where fields overlap.',
        visualPrompt: 'Intersecting geometric bands with a calm central glow; muted gradient, minimal noise.'
      },
      {
        heading: 'Bridge: PolymathOS → InfraLens',
        body: 'InfraLens is the PolymathOS thought experiment for the field—turning cross-domain synthesis into tools you can actually use.',
        visualPrompt: 'Two overlapping planes labeled PolymathOS and InfraLens converging into a single focused beam; clean, minimal lines.'
      },
      {
        heading: 'Engineering Aesthetics',
        body: 'Code is not just logic; it is a medium for art. InfraLens embraces “Calm Technology”—interfaces that respect attention, with predictable loading and composed motion.',
        visualPrompt: 'Minimal circuit silhouette under a soft glassy gradient with a single accent glow; restrained motion implied.'
      },
      {
        heading: 'The Infinite Game',
        body: 'We build for the long-term. PolymathOS is a living organism; InfraLens evolves alongside you with versioned modules and essays that grow, not reset.',
        visualPrompt: 'A looping pathway in low-saturation tones with a single accent glow, suggesting continuous growth.'
      },
      {
        heading: 'Craft Principles',
        body: 'Breadth over silos. Calm over spectacle. Durable over disposable.',
        visualPrompt: 'Three simple pillars with soft edge lighting, each labeled with a principle; neutral palette with one accent hue.'
      }
    ]
  }
];
