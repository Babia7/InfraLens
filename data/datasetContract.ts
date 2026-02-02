
export const DATASET_VERSION = "2025.02.25";

export type DatasetContract = {
  version: string;
  families: Record<string, {
    expectedModels: string[];
    sourceDocs: string[];
  }>;
};

export const datasetContract: DatasetContract = {
  version: DATASET_VERSION,
  families: {
    "7050X3": {
      expectedModels: ["7050CX3-32S", "7050CX3-32C", "7050SX3-48C8", "7050SX3-48C8C", "7050TX3-48C8", "7050SX3-96YC8", "7050SX3-48YC12", "7050SX3-48YC8", "7050SX3-48YC8C", "7050SX3-24YC4C"],
      sourceDocs: ["Arista 7050X3 Series Datasheet"]
    },
    "7050X4": {
      expectedModels: ["7050DX4-32S", "7050PX4-32S", "7050DX4M-32S", "7050SDX4-48D8", "7050SPX4-48D8", "7050CX4-24D8", "7050CX4M-48D8", "7050X4-48Y-4DF"],
      sourceDocs: ["Arista 7050X4 Series Datasheet"]
    },
    "7060X5": {
      expectedModels: ["7060CX5-32P", "7060DX5-64S"],
      sourceDocs: ["Arista 7060X5 Series Datasheet"]
    },
    "7060X6": {
      expectedModels: ["7060X6-64PE", "7060X6-32PE"],
      sourceDocs: ["Arista 7060X6 Series Datasheet"]
    },
    "7280R3": {
      expectedModels: ["7280PR3-24", "7280PR3K-24", "7280DR3-24", "7280DR3K-24", "7280CR3-32P4", "7280CR3K-32P4", "7280CR3K-32P4A", "7280CR3-32D4", "7280CR3K-32D4", "7280CR3K-32D4A", "7280CR3-36S", "7280CR3K-36S", "7280CR3K-36A", "7280CR3-96", "7280CR3K-96", "7280SR3-48YC8", "7280SR3K-48YC8", "7280SR3K-48YC8A", "7280SR3-40YC6", "7280SR3E-40YC6-M", "7280TR3-40C6"],
      sourceDocs: ["Arista 7280R3 Series Datasheet"]
    },
    "7280R3A": {
      expectedModels: ["7280DR3A-54", "7280DR3A-36", "7280CR3A-24D12", "7280CR3A-48D6", "7280CR3A-72", "7280CR3A-32S", "7280SR3A-48YC8"],
      sourceDocs: ["Arista 7280R3A Series Datasheet"]
    },
    "7800R4": {
      expectedModels: ["7800R4-36PE", "7800R4C-36PE", "7800R4K-36PE"],
      sourceDocs: ["Arista 7800R4 Series AI Spine Switch Datasheet"]
    }
  }
};
