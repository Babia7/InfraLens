import type { SwitchSpec } from '../../types';

export const family7060X5: SwitchSpec[] = [
  {
    "id": "7060CX5-32P",
    "model": "7060CX5-32P",
    "series": "7060X5",
    "description": "32x 400G QSFP-DD & 2x SFP+. Compact 400G spine/leaf.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "400": 32,
      "200": 64,
      "100": 128,
      "50": 128,
      "40": 32,
      "25": 128,
      "10": 130
    },
    "interfaces": [
      { "speedGbps": 400, "physicalPorts": 32, "formFactor": "QSFP-DD", "breakout": { "supported": true, "notes": "Supports breakout to 2x200G, 4x100G or 8x50G." } },
      { "speedGbps": 10, "physicalPorts": 2, "formFactor": "SFP+", "breakout": { "supported": false } }
    ],
    "throughputTbps": 12.8,
    "pps": "5.3 Bpps",
    "latency": "900 ns",
    "cpu": "Multi-Core x86",
    "memory": "32 Gigabytes",
    "buffer": "132 MB",
    "powerDraw": "380W / 820W",
    "size": "1RU",
    "weight": "19.5 lbs (8.85 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 4,
    "datasheetUrl": "https://www.arista.com/en/products/7060x-series",
    "source": { "document": "Arista 7060X5 Datasheet", "page": 4, "table": "Model Comparison" }
  },
  {
    "id": "7060DX5-64S",
    "model": "7060DX5-64S",
    "series": "7060X5",
    "description": "64x 400G QSFP-DD & 2x SFP+. High-density 400G spine.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "400": 64,
      "200": 128,
      "100": 256,
      "50": 256,
      "10": 2
    },
    "interfaces": [
      { "speedGbps": 400, "physicalPorts": 64, "formFactor": "QSFP-DD", "breakout": { "supported": true, "notes": "High density 400G spine with full breakout support." } },
      { "speedGbps": 10, "physicalPorts": 2, "formFactor": "SFP+", "breakout": { "supported": false } }
    ],
    "throughputTbps": 25.6,
    "pps": "10.6 Bpps",
    "latency": "900 ns",
    "cpu": "Multi-Core x86",
    "memory": "32 Gigabytes",
    "buffer": "132 MB",
    "powerDraw": "450W / 980W",
    "size": "2RU",
    "weight": "38.5 lbs (17.5 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 4,
    "datasheetUrl": "https://www.arista.com/en/products/7060x-series",
    "source": { "document": "Arista 7060X5 Datasheet", "page": 4, "table": "Model Comparison" }
  }
];