import type { SwitchSpec } from '../../types';

export const family7280R3A: SwitchSpec[] = [
  {
    "id": "7280DR3A-54",
    "model": "7280DR3A-54",
    "series": "7280R3A",
    "description": "54x 400G QSFP-DD deep buffer router.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "400": 54,
      "100": 216,
      "50": 432,
      "25": 432,
      "10": 432
    },
    "interfaces": [
      {
        "speedGbps": 400,
        "physicalPorts": 54,
        "formFactor": "QSFP-DD",
        "breakout": { "supported": true, "notes": "Supports high density breakout for cloud scale." }
      }
    ],
    "throughputTbps": 21.6,
    "pps": "8.1 Bpps",
    "latency": "3.8 µs",
    "cpu": "Eight-Core x86",
    "memory": "64 Gigabytes",
    "buffer": "24 GB",
    "powerDraw": "933W / 1715W",
    "size": "2RU",
    "weight": "61.6 lbs (27.9 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 4,
    "datasheetUrl": "https://www.arista.com/en/products/7280r3-series",
    "source": { "document": "Arista 7280R3A Datasheet", "page": 9, "table": "Model Comparison" }
  },
  {
    "id": "7280DR3A-36",
    "model": "7280DR3A-36",
    "series": "7280R3A",
    "description": "36x 400G QSFP-DD deep buffer router.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "400": 36,
      "100": 144,
      "50": 288,
      "25": 288,
      "10": 288
    },
    "interfaces": [
      {
        "speedGbps": 400,
        "physicalPorts": 36,
        "formFactor": "QSFP-DD",
        "breakout": { "supported": true, "notes": "Flexible 400G interface with deep buffering." }
      }
    ],
    "throughputTbps": 14.4,
    "pps": "5.4 Bpps",
    "latency": "3.8 µs",
    "cpu": "Eight-Core x86",
    "memory": "64 Gigabytes",
    "buffer": "16 GB",
    "powerDraw": "643W / 1283W",
    "size": "2RU",
    "weight": "53.1 lbs (24.1 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 4,
    "datasheetUrl": "https://www.arista.com/en/products/7280r3-series",
    "source": { "document": "Arista 7280R3A Datasheet", "page": 10, "table": "Model Comparison" }
  },
  {
    "id": "7280CR3A-24D12",
    "model": "7280CR3A-24D12",
    "series": "7280R3A",
    "description": "24x 100G QSFP & 12x 400G QSFP-DD aggregation platform.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "400": 12,
      "100": 72,
      "50": 144,
      "25": 144,
      "10": 144
    },
    "interfaces": [
      {
        "speedGbps": 100,
        "physicalPorts": 24,
        "formFactor": "QSFP100",
        "breakout": { "supported": false }
      },
      {
        "speedGbps": 400,
        "physicalPorts": 12,
        "formFactor": "QSFP-DD",
        "breakout": { "supported": true, "notes": "400G ports support 4x100G breakouts." }
      }
    ],
    "throughputTbps": 7.2,
    "pps": "2.7 Bpps",
    "latency": "3.8 µs",
    "cpu": "Eight-Core x86",
    "memory": "64 Gigabytes",
    "buffer": "8 GB",
    "powerDraw": "346W / 845W",
    "size": "1RU",
    "weight": "32.6 lbs (14.8 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 3,
    "datasheetUrl": "https://www.arista.com/en/products/7280r3-series",
    "source": { "document": "Arista 7280R3A Datasheet", "page": 11, "table": "Model Comparison" }
  },
  {
    "id": "7280CR3A-48D6",
    "model": "7280CR3A-48D6",
    "series": "7280R3A",
    "description": "48x 100G QSFP & 6x 400G QSFP-DD router.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "400": 6,
      "100": 72,
      "50": 144,
      "25": 144,
      "10": 144
    },
    "interfaces": [
      {
        "speedGbps": 100,
        "physicalPorts": 48,
        "formFactor": "QSFP100",
        "breakout": { "supported": false }
      },
      {
        "speedGbps": 400,
        "physicalPorts": 6,
        "formFactor": "QSFP-DD",
        "breakout": { "supported": true, "notes": "High density 100G with 400G uplinks." }
      }
    ],
    "throughputTbps": 7.2,
    "pps": "2.7 Bpps",
    "latency": "3.8 µs",
    "cpu": "Eight-Core x86",
    "memory": "64 Gigabytes",
    "buffer": "8 GB",
    "powerDraw": "388W / 979W",
    "size": "2RU",
    "weight": "48.6 lbs (22.0 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 3,
    "datasheetUrl": "https://www.arista.com/en/products/7280r3-series",
    "source": { "document": "Arista 7280R3A Datasheet", "page": 12, "table": "Model Comparison" }
  },
  {
    "id": "7280CR3A-72",
    "model": "7280CR3A-72",
    "series": "7280R3A",
    "description": "72x 100G QSFP ultra-high density router.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "100": 72,
      "50": 144,
      "25": 144,
      "10": 144
    },
    "interfaces": [
      {
        "speedGbps": 100,
        "physicalPorts": 72,
        "formFactor": "QSFP100",
        "breakout": { "supported": true, "notes": "Supports breakout to 2x50G or 4x10/25G on all ports." }
      }
    ],
    "throughputTbps": 7.2,
    "pps": "2.7 Bpps",
    "latency": "3.8 µs",
    "cpu": "Eight-Core x86",
    "memory": "64 Gigabytes",
    "buffer": "8 GB",
    "powerDraw": "406W / 754W",
    "size": "2RU",
    "weight": "49.4 lbs (22.4 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 3,
    "datasheetUrl": "https://www.arista.com/en/products/7280r3-series",
    "source": { "document": "Arista 7280R3A Datasheet", "page": 13, "table": "Model Comparison" }
  },
  {
    "id": "7280CR3A-32S",
    "model": "7280CR3A-32S",
    "series": "7280R3A",
    "description": "30x QSFP100/200 & 2x QSFP-DD router.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "400": 2,
      "200": 32,
      "100": 38,
      "50": 128,
      "25": 128,
      "10": 128
    },
    "interfaces": [
      {
        "speedGbps": 100,
        "physicalPorts": 30,
        "formFactor": "QSFP200",
        "breakout": { "supported": true, "notes": "Supports 200G native or breakout to 4x50G." }
      },
      {
        "speedGbps": 400,
        "physicalPorts": 2,
        "formFactor": "QSFP-DD",
        "breakout": { "supported": true, "notes": "Supports 400G native or breakout." }
      }
    ],
    "throughputTbps": 3.6,
    "pps": "1.35 Bpps",
    "latency": "3.8 µs",
    "cpu": "Eight-Core x86",
    "memory": "64 Gigabytes",
    "buffer": "4 GB",
    "powerDraw": "302W / 481W",
    "size": "1RU",
    "weight": "28.25 lbs (12.8 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 3,
    "datasheetUrl": "https://www.arista.com/en/products/7280r3-series",
    "source": { "document": "Arista 7280R3A Datasheet", "page": 14, "table": "Model Comparison" }
  },
  {
    "id": "7280SR3A-48YC8",
    "model": "7280SR3A-48YC8",
    "series": "7280R3A",
    "description": "48x 50G SFP & 8x QSFP (mixed speed) router.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "200": 4,
      "100": 12,
      "50": 80,
      "25": 80,
      "10": 80
    },
    "interfaces": [
      {
        "speedGbps": 50,
        "physicalPorts": 48,
        "formFactor": "SFP50",
        "breakout": { "supported": false }
      },
      {
        "speedGbps": 200,
        "physicalPorts": 4,
        "formFactor": "QSFP200",
        "breakout": { "supported": false }
      },
      {
        "speedGbps": 100,
        "physicalPorts": 4,
        "formFactor": "QSFP100",
        "breakout": { "supported": true, "notes": "Mixed QSFP speed configuration." }
      }
    ],
    "throughputTbps": 3.6,
    "pps": "1.35 Bpps",
    "latency": "3.8 µs",
    "cpu": "Eight-Core x86",
    "memory": "64 Gigabytes",
    "buffer": "4 GB",
    "powerDraw": "290W / 391W",
    "size": "1RU",
    "weight": "24.75 lbs (11.2 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 3,
    "datasheetUrl": "https://www.arista.com/en/products/7280r3-series",
    "source": { "document": "Arista 7280R3A Datasheet", "page": 15, "table": "Model Comparison" }
  }
];