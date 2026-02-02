
/**
 * Optics Master - Knowledge Base Content
 * Structured data for technical modules.
 * Moved from constants/knowledgeModules.ts
 */

export const LEVEL_METADATA = {
  Basics: "No prior optics knowledge required.",
  Intermediate: "Assumes familiarity with fiber and form factors.",
  Advanced: "Assumes signaling + platform constraints context."
};

export const CONTEXTUAL_ACTIONS = {
  LOSS_BUDGET: { label: "Open Link Budget Calc", pageKey: "LINK_BUDGET" },
  DOM_SCALE: { label: "Interpret dBm", pageKey: "DBM_INTERPRETER" }
};

export const CONCEPT_DEFINITIONS: Record<string, string> = {
  FIBER_CORE: "Distinguishing between Singlemode (SMF) and Multimode (MMF) glass core diameters and their respective distance capabilities.",
  REACH_TABLE: "Standardized naming conventions (SR/DR/LR/ZR) that define the distance limits and optical wavelength grids for transceivers.",
  CLEANING: "Standard inspection and decontamination procedures to prevent signal loss or hardware damage caused by debris.",
  LOSS_BUDGET: "The calculation of total signal attenuation across a link to ensure the receiver receives sufficient light power.",
  SAFETY_RULES: "Physical mating constraints, specifically regarding the incompatible flat (UPC) and angled (APC) fiber polish types.",
  POLARITY: "The alignment of Tx and Rx fibers across a cable plant to ensure the laser on one end hits the detector on the other.",
  LANE_DENSITY: "Comparison of electrical lane counts (1, 4, or 8) used in different transceiver generations (100G-800G) to drive aggregate bandwidth.",
  FORM_FACTORS: "Physical module shapes (SFP/QSFP/OSFP) and their specific thermal and SerDes speed constraints.",
  BREAKOUT_LOGIC: "The ability of a single high-speed switch cage to be logically partitioned into multiple lower-speed host ports.",
  CONNECTOR_MAPPING: "Defining the required physical interface (LC vs MPO) based on the transceiver optics engine (Parallel vs WDM).",
  MODULATION: "The evolution from binary NRZ signaling (common in 100G) to multi-level PAM4 (400G+) to increase data throughput.",
  FEC_MODES: "Mathematical error correction algorithms used to maintain link stability on noise-sensitive high-speed links.",
  AI_STRATEGY: "Architectural guidelines for building lossless, low-latency fabrics for high-performance clusters.",
  OVERSUB: "Calculations for Spine-to-Leaf bandwidth ratios to prevent fabric congestion.",
  DOM_SCALE: "Reading transceiver telemetry including Tx/Rx power, bias current, and temperature metrics.",
  DEBUG_FLOW: "Structured step-by-step methodology for isolating physical layer link failures.",
  ZR_TECH: "Advanced coherent optics that eliminate the need for external DCI transponder systems."
};

export const KB_KEYWORDS: Record<string, string[]> = {
  FIBER_CORE: ["smf", "mmf", "yellow", "aqua", "core", "9um", "50um", "singlemode", "multimode", "om4", "om3", "os2"],
  REACH_TABLE: ["sr", "dr", "fr", "lr", "zr", "er", "distance", "reach", "10km", "100m", "500m", "40km", "suffix"],
  CLEANING: ["ibc", "dust", "scope", "cleaning", "contamination", "inspection", "end-face", "dirt", "click-cleaner"],
  LOSS_BUDGET: ["db", "dbm", "loss", "attenuation", "budget", "power", "link", "sensitivity", "margin", "padding"],
  SAFETY_RULES: ["apc", "upc", "polish", "green", "blue", "angled", "flat", "damage", "mating", "connector"],
  POLARITY: ["type b", "crossover", "flip", "mpo", "polarity", "alignment", "tx", "rx"],
  LANE_DENSITY: ["lanes", "serdes", "sfp", "qsfp", "osfp", "density", "1-lane", "4-lane", "8-lane", "octal", "100g", "400g"],
  FORM_FACTORS: ["sfp", "qsfp", "osfp", "heatsink", "form factor", "physical", "cage", "thermal", "dd", "double density"],
  BREAKOUT_LOGIC: ["breakout", "serdes", "4x100g", "8x100g", "split", "fanout", "channelization"],
  CONNECTOR_MAPPING: ["lc", "mpo", "duplex", "parallel", "connector", "patch", "mating", "psm4", "cwdm4"],
  MODULATION: ["nrz", "pam4", "symbol", "bit", "signaling", "modulation", "snr", "noise"],
  FEC_MODES: ["rs-fec", "firecode", "error correction", "fec", "latency", "bit error", "ber"],
  AI_STRATEGY: ["ai", "ml", "gpu", "leaf", "spine", "voq", "fabric", "h100", "clos", "non-blocking"],
  OVERSUB: ["oversubscription", "ratio", "spine", "fabric", "congestion", "blocking", "bandwidth"],
  DOM_SCALE: ["dom", "ddm", "monitoring", "telemetry", "rx power", "tx power", "bias", "health", "metrics"],
  DEBUG_FLOW: ["debug", "troubleshooting", "mttr", "failure", "isolate", "down", "flapping", "errors"],
  ZR_TECH: ["coherent", "zr", "dci", "long-haul", "80km", "16qam", "dsp", "amplification"]
};

export const CONCEPT_TAB_MAP: Record<string, string> = {
  FIBER_CORE: "CONNECTIVITY", REACH_TABLE: "CONNECTIVITY", CLEANING: "CONNECTIVITY", LOSS_BUDGET: "CONNECTIVITY", SAFETY_RULES: "CONNECTIVITY", POLARITY: "CONNECTIVITY",
  LANE_DENSITY: "HARDWARE", FORM_FACTORS: "HARDWARE", BREAKOUT_LOGIC: "HARDWARE", CONNECTOR_MAPPING: "HARDWARE",
  MODULATION: "SIGNALING", FEC_MODES: "SIGNALING",
  AI_STRATEGY: "STRATEGY", OVERSUB: "STRATEGY",
  DOM_SCALE: "OPERATIONS", DEBUG_FLOW: "OPERATIONS",
  ZR_TECH: "UPGRADES"
};

export const RULES_OF_THUMB: Record<string, string[]> = {
  FIBER_CORE: ["SMF (Yellow) = 9µm core for long distance.", "MMF (Aqua/Violet) = 50µm core for short distance.", "Never mix SMF transceivers with MMF fiber."],
  REACH_TABLE: ["SR = Short Reach (100m).", "DR = Datacenter Reach (500m).", "LR = Long Reach (10km).", "ZR = Coherent DCI (80km+)."],
  CLEANING: ["Always 'Inspect Before Connect' (IBC).", "Dry cleaning is preferred over wet cleaning.", "One contaminated connector can damage the transceiver OSA."],
  LOSS_BUDGET: ["Budget (dB) = Tx Power (dBm) - Rx Sensitivity (dBm).", "Allow ~0.5dB loss per mated connector pair.", "Always include a 1-2dB safety margin."],
  SAFETY_RULES: ["APC (Green) is angled at 8 degrees.", "UPC (Blue) is flat.", "Mating APC to UPC causes permanent glass core pits."],
  POLARITY: ["Type B (Crossover) is the standard for MPO parallel trunks.", "Tx must always land on Rx.", "Incorrect polarity is a top cause of 'down/down' links."],
  LANE_DENSITY: ["SFP = 1 Lane.", "QSFP = 4 Lanes.", "OSFP = 8 Lanes.", "100G QSFP28 uses 4x 25G NRZ lanes."],
  FORM_FACTORS: ["OSFP handles higher heat than QSFP-DD.", "QSFP-DD is backward compatible with QSFP28.", "800G requires 112G SerDes lanes."],
  BREAKOUT_LOGIC: ["400G can split to 4x 100G.", "800G can split to 2x 400G or 8x 100G.", "Breakout requires compatible software configuration."],
  CONNECTOR_MAPPING: ["100G-PSM4 uses MPO-12 (Parallel).", "100G-CWDM4 uses Duplex LC (WDM).", "Always check the connector type before ordering patch cords."],
  MODULATION: ["NRZ = 1 bit per symbol (Standard for 100G legacy).", "PAM4 = 2 bits per symbol (Standard for 400G+).", "PAM4 is more sensitive to noise (SNR penalty)."],
  FEC_MODES: ["RS-FEC is mandatory for PAM4 links.", "100G links may use Firecode or No-FEC depending on reach.", "FEC adds ~100-200ns of fixed latency."]
};

export const DECISION_IMPACTS = {
  FIBER_CORE: "Decision impact: Core choice determines reuse potential for 100G/400G/800G. USED IN: Part Finder",
  REACH_TABLE: "Decision impact: Suffix selection is the primary filter for 100G+ catalog. USED IN: Part Finder",
  CLEANING: "Decision impact: Prevents signal degradation on sensitive 100G+ links. USED IN: Engineering Ops",
  LOSS_BUDGET: "Decision impact: Prevents 'no-link' on extended 100G/400G spans. USED IN: Link Budget Calc",
  SAFETY_RULES: "Decision impact: Prevents non-reversible hardware damage. USED IN: Compatibility Matrix",
  POLARITY: "Decision impact: Corrects Rx/Tx mismatch for 100G/400G MPO links. USED IN: Compatibility Matrix",
  LANE_DENSITY: "Decision impact: Determines breakout options (e.g., 100G to 4x25G). USED IN: Cable Configurator",
  FORM_FACTORS: "Decision impact: Dictates platform compatibility (QSFP28 vs QSFP-DD). USED IN: Part Finder",
  BREAKOUT_LOGIC: "Decision impact: Maps high-speed switch cages to server ports. USED IN: Cable Configurator",
  CONNECTOR_MAPPING: "Decision impact: Defines exact patch cable for the BOM. USED IN: Cable Configurator",
  MODULATION: "Decision impact: Matches 100G NRZ vs 100G Single Lambda (PAM4). USED IN: Compatibility Matrix",
  FEC_MODES: "Decision impact: Prevents 'light but no link' scenarios. USED IN: Compatibility Matrix",
  AI_STRATEGY: "Decision impact: Optimizes 100G/400G GPU fabrics. USED IN: Architecture Lab",
  OVERSUB: "Decision impact: Determines Spine count for 100G+ fabrics. USED IN: Architecture Lab",
  DOM_SCALE: "Decision impact: Primary source for 100G+ health alerts. USED IN: Engineering Ops",
  DEBUG_FLOW: "Decision impact: Reduces MTTR on 100G+ datacenter fabrics.",
  ZR_TECH: "Decision impact: Simplifies 100G/400G/800G long-haul design. USED IN: Part Finder"
};

export const ADVANCED_NOTES: Record<string, string[]> = {
  FIBER_CORE: [
    "MMF uses OM3/OM4/OM5 standards where OM5 (Lime) supports WBMMF for BIDI applications.",
    "SMF attenuation is typically ~0.35dB/km at 1310nm.",
    "100G-SR4 is limited to 100m over OM4 due to modal dispersion."
  ],
  REACH_TABLE: [
    "100G-CWDM4 (2km) vs 100G-LR4 (10km) use different WDM grids (20nm vs 4.5nm spacing).",
    "Single Lambda 100G (DR/FR/LR) uses PAM4 modulation to reduce lane count to one.",
    "100G-PSM4 uses 8 fibers (4 Tx, 4 Rx) over parallel SMF."
  ],
  FORM_FACTORS: [
    "QSFP28 is the standard for 100G; QSFP-DD adds a second row of contacts for 400G+.",
    "100G Single Lambda modules allow high-density 400G-to-100G breakouts.",
    "DSFP (Dual SFP) provides two 100G lanes in an SFP footprint for specific high-density applications."
  ],
  MODULATION: [
    "100G NRZ (4x25G) vs 100G PAM4 (1x100G) are electrically incompatible.",
    "PAM4 maps 2 bits into one symbol, requiring better SNR than NRZ.",
    "The 9.5dB SNR penalty of PAM4 necessitates FEC on most links."
  ],
  FEC_MODES: [
    "100GBASE-LR4 (NRZ) typically requires NO FEC.",
    "100GBASE-DR (PAM4) REQUIRE RS-FEC (544, 514).",
    "Mismatched FEC results in 100% frame loss even with perfect light."
  ]
};

export const FAILURE_SYMPTOMS: Record<string, string[]> = {
  FIBER_CORE: [
    "Unexpected reach failures or signal dropouts",
    "High attenuation on MMF spans exceeding 100m",
    "Total link loss if SMF transceivers mate with MMF plant"
  ],
  SAFETY_RULES: [
    "Severe optical back-reflection and link instability",
    "Permanent physical damage to fiber end-faces",
    "Consistently low Rx power despite new optics"
  ],
  POLARITY: [
    "Link status remains 'Down' (Tx hitting Tx)",
    "Correct light levels observed but zero traffic flow",
    "Mismatched lane assignments on parallel breakouts"
  ],
  MODULATION: [
    "No Link Up due to SerDes signaling mismatch (e.g., NRZ vs PAM4)",
    "High BER (Bit Error Rate) if SNR is insufficient",
    "Flapping links during initial clock recovery"
  ],
  FEC_MODES: [
    "Link Up state but 100% packet loss (Zero throughput)",
    "Incrementing Pre-FEC error counts in interface counters",
    "Total failure to establish link at 100G/400G speeds"
  ]
};

/**
 * Shared utility for Knowledge Base formatting.
 */
export const formatConceptNote = (id: string, level: string, title: string) => {
  const concept = CONCEPT_DEFINITIONS[id] || "";
  const rules = RULES_OF_THUMB[id] || [];
  const impactText = DECISION_IMPACTS[id as keyof typeof DECISION_IMPACTS] || "";
  const symptoms = FAILURE_SYMPTOMS[id] || [];

  const [impactProse, toolPart] = impactText.split("USED IN:");
  const tools = toolPart ? toolPart.trim() : "";

  let note = `${title.toUpperCase()}\n`;
  note += `Level: ${level}\n\n`;
  note += `Concept: ${concept}\n\n`;
  
  if (rules.length > 0) {
    note += `Rules of thumb:\n`;
    rules.forEach(r => note += `• ${r}\n`);
    note += `\n`;
  }

  note += `Decision impact: ${impactProse.trim()}\n`;
  
  if (symptoms.length > 0) {
    note += `\nIf this breaks:\n`;
    symptoms.forEach(s => note += `• ${s}\n`);
  }

  if (tools) {
    note += `\nUsed in: ${tools}\n`;
  }

  return note.trim();
};

export const TRANSITION_TEXTS = {
  CONNECTIVITY_1: "Understanding fiber types is a prerequisite for calculating 100G+ physical link reach.",
  CONNECTIVITY_2: "Maintenance and budget planning are critical for stable high-speed 100G/400G operation.",
  CONNECTIVITY_3: "Final layer validation ensures physical connectors and polarity match for the chosen optic.",
  HARDWARE_1: "Form factor evolution (QSFP28 to OSFP) informs platform density and power envelopes.",
  HARDWARE_2: "Breakout logic enables mapping of 400G/800G ports to 100G host interfaces.",
  SIGNALING_1: "Signaling evolution from 100G NRZ to PAM4 requires new error correction logic.",
  OPERATIONS_1: "Standardized workflows reduce downtime on mission-critical 100G+ datacenter fabrics.",
  UPGRADES_1: "Foundational knowledge scales to advanced long-haul and AI-driven networking breakthroughs."
};

export const TERMINOLOGY_MAP = [
  { term: 'dB', type: 'Ratio', desc: 'Relative unit measuring loss or gain. (e.g., -2.0 dB loss)' },
  { term: 'dBm', type: 'Power', desc: 'Absolute unit measuring optical power relative to 1mW. (e.g., +3.0 dBm Tx)' },
  { term: 'SMF', type: 'Media', desc: 'Singlemode (9µm). Yellow jacket. Standard for 100G+ long-reach.' },
  { term: 'MMF', type: 'Media', desc: 'Multimode (50µm). Aqua/Violet jacket. Used for 100G/400G short-reach.' },
  { term: 'LC', type: 'Conn.', desc: 'Duplex connector used for single fiber pairs (e.g. 100G-CWDM4).' },
  { term: 'MPO', type: 'Conn.', desc: 'Multi-fiber Push-On. Parallel fibers for 100G-SR4 / 400G-DR4.' }
];

export const REACH_SUFFIXES = [
  { suffix: 'SR / SR4 / SR8', name: 'Short Reach', typical: '70m - 100m', fiber: 'Multimode (OM3/OM4)', tech: '850nm VCSEL' },
  { suffix: 'DR / DR4', name: 'Datacenter Reach', typical: '500m', fiber: 'Singlemode (OS2)', tech: '1310nm Parallel' },
  { suffix: 'FR / FR4 / CWDM4', name: 'Campus Reach', typical: '2km', fiber: 'Singlemode (OS2)', tech: '1310nm / CWDM' },
  { suffix: 'LR / LR4', name: 'Long Reach', typical: '10km', fiber: 'Singlemode (OS2)', tech: '1310nm / LAN-WDM' },
  { suffix: 'ER / ER4', name: 'Extended Reach', typical: '40km', fiber: 'Singlemode (OS2)', tech: '1310nm + SOA' },
  { suffix: 'ZR', name: 'Coherent Reach', typical: '80km - 120km', fiber: 'Singlemode (OS2)', tech: 'Coherent (DCI)' },
];

export const COPPER_STANDARDS = [
  { cat: 'Cat 6', speed: '1 Gbps', distance: '100m', note: 'Typical Enterprise baseline' },
  { cat: 'Cat 6A', speed: '10 Gbps', distance: '100m', note: 'Generally recommended for 10GBASE-T' },
  { cat: 'Cat 8', speed: '25/40 Gbps', distance: 'Typical 30m', note: 'ToR only for 25G+ over Copper' },
];

export const DDM_METRICS = [
  { metric: 'Tx Power', unit: 'dBm / mW', desc: 'Optical output power from the laser' },
  { metric: 'Rx Power', unit: 'dBm / mW', desc: 'Optical power received at the photo-detector' },
  { metric: 'Temperature', unit: '°C', desc: 'Internal module temperature' },
  { metric: 'Bias Current', unit: 'mA', desc: 'Laser drive current (health indicator)' },
  { metric: 'Voltage', unit: 'V', desc: 'Supply voltage to the module' },
];

export const POLARITY_MODES = [
  { type: 'Type A', logic: 'Straight-through', usage: 'Common for Duplex LC / 100G-LR4' },
  { type: 'Type B', logic: 'Flipped / Crossover', usage: 'Standard for MPO parallel trunks (SR4/DR4)' },
  { type: 'Type C', logic: 'Pair-flipped', usage: 'Used in specific legacy structured cabling' },
];

export const CLEANING_RULES = [
  { title: 'Inspect Before Connect (IBC)', rule: 'Standard practice for all high-speed 100G+ links.' },
  { title: 'Dry Cleaning First', rule: 'Uses click-style cleaners. Avoid solvents unless required.' },
  { title: 'Zero Trust Policy', rule: 'Contamination is the #1 cause of 100G+ link instability.' }
];

export const LOSS_BUDGET_FACTORS = [
  { factor: 'Fiber Attenuation', typical: '0.35 dB/km (SMF)', desc: 'Typical loss over distance.' },
  { factor: 'Mated Connectors', typical: '0.2 - 0.75 dB', desc: 'Loss at patch points.' },
  { factor: 'Fusion Splices', typical: '0.05 - 0.1 dB', desc: 'Loss at fiber joints.' },
  { factor: 'Safety Margin', typical: '2.0 dB', desc: 'Recommended padding for aging plant.' }
];

export const FEC_TYPES = [
  { mode: 'No FEC', usage: 'Legacy 1G/10G / 100G-LR4', desc: 'Direct signaling with zero overhead.' },
  { mode: 'Base-R FEC (Firecode)', usage: '25G/40G / 100G-SR4', desc: 'Lightweight error correction.' },
  { mode: 'RS-FEC (Reed-Solomon)', usage: '100G (PAM4) / 400G / 800G', desc: 'Standard for PAM4 signaling.' }
];
