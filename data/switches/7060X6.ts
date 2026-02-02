import type { SwitchSpec } from '../../types';

export const family7060X6: SwitchSpec[] = [
  {
    "id": "7060X6-64PE",
    "model": "7060X6-64PE",
    "series": "7060X6",
    "description": "64x 800G OSFP & 2x SFP+. Ultra-high density AI spine.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "800": 64,
      "400": 128,
      "100": 256,
      "10": 2
    },
    "interfaces": [
      { "speedGbps": 800, "physicalPorts": 64, "formFactor": "OSFP", "breakout": { "supported": true, "notes": "Supports 2x400G or 8x100G breakout modes per port." } },
      { "speedGbps": 10, "physicalPorts": 2, "formFactor": "SFP+", "breakout": { "supported": false } }
    ],
    "throughputTbps": 51.2,
    "pps": "21.2 Bpps",
    "latency": "700 ns",
    "cpu": "Multi-Core x86",
    "memory": "32 Gigabytes",
    "buffer": "165 MB",
    "powerDraw": "640W / 2218W",
    "size": "2RU",
    "weight": "46 lbs (20.8 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 4,
    "datasheetUrl": "https://www.arista.com/en/products/7060x-series",
    "source": { "document": "Arista 7060X6 Datasheet", "page": 5, "table": "Model Comparison" }
  },
  {
    "id": "7060X6-32PE",
    "model": "7060X6-32PE",
    "series": "7060X6",
    "description": "32x 800G OSFP & 2x SFP+. Compact 800G platform.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "800": 32,
      "400": 64,
      "100": 128,
      "10": 2
    },
    "interfaces": [
      { "speedGbps": 800, "physicalPorts": 32, "formFactor": "OSFP", "breakout": { "supported": true, "notes": "Full OSFP800 breakout support." } },
      { "speedGbps": 10, "physicalPorts": 2, "formFactor": "SFP+", "breakout": { "supported": false } }
    ],
    "throughputTbps": 25.6,
    "pps": "10.6 Bpps",
    "latency": "700 ns",
    "cpu": "Multi-Core x86",
    "memory": "32 Gigabytes",
    "buffer": "165 MB",
    "powerDraw": "348W / 1136W",
    "size": "1RU",
    "weight": "29.2 lbs (13.2 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 3,
    "datasheetUrl": "https://www.arista.com/en/products/7060x-series",
    "source": { "document": "Arista 7060X6 Datasheet", "page": 5, "table": "Model Comparison" }
  }
];