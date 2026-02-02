import type { SwitchSpec } from '../../types';

export const family7050X3: SwitchSpec[] = [
  {
    "id": "7050CX3-32S",
    "model": "7050CX3-32S",
    "series": "7050X3",
    "description": "32x 100G QSFP & 2x SFP+. High density 100G platform.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "100": 32,
      "50": 64,
      "40": 32,
      "25": 128,
      "10": 130
    },
    "interfaces": [
      {
        "speedGbps": 100,
        "physicalPorts": 32,
        "formFactor": "QSFP100",
        "breakout": { "supported": true, "notes": "Supports 4x25G or 2x50G breakout modes." }
      },
      {
        "speedGbps": 10,
        "physicalPorts": 2,
        "formFactor": "SFP+",
        "breakout": { "supported": false }
      }
    ],
    "throughputTbps": 3.2,
    "pps": "2 Bpps",
    "latency": "800 ns",
    "cpu": "Quad-Core x86",
    "memory": "8 Gigabytes",
    "buffer": "32 MB",
    "powerDraw": "168W / 343W",
    "size": "1RU",
    "weight": "20 lbs (9.1 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 2,
    "datasheetUrl": "https://www.arista.com/en/products/7050x3-series",
    "source": { "document": "Arista 7050X3 Series Datasheet", "page": 8, "table": "Technical Specifications" }
  },
  {
    "id": "7050CX3-32C",
    "model": "7050CX3-32C",
    "series": "7050X3",
    "description": "32x 100G QSFP & 2x SFP+. Optimized for cloud deployments.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "100": 32,
      "50": 64,
      "40": 32,
      "25": 128,
      "10": 130
    },
    "interfaces": [
      {
        "speedGbps": 100,
        "physicalPorts": 32,
        "formFactor": "QSFP100",
        "breakout": { "supported": true, "notes": "Flexible port configuration with breakout support." }
      },
      {
        "speedGbps": 10,
        "physicalPorts": 2,
        "formFactor": "SFP+",
        "breakout": { "supported": false }
      }
    ],
    "throughputTbps": 3.2,
    "pps": "2 Bpps",
    "latency": "800 ns",
    "cpu": "Quad-Core x86",
    "memory": "16 Gigabytes",
    "buffer": "32 MB",
    "powerDraw": "165W / 334W",
    "size": "1RU",
    "weight": "21 lbs (9.45 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 2,
    "datasheetUrl": "https://www.arista.com/en/products/7050x3-series",
    "source": { "document": "Arista 7050X3 Series Datasheet", "page": 8, "table": "Technical Specifications" }
  },
  {
    "id": "7050SX3-48C8",
    "model": "7050SX3-48C8",
    "series": "7050X3",
    "description": "48x 10G SFP+ & 8x 100G QSFP. Standard 10G leaf platform.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "100": 8,
      "50": 16,
      "40": 8,
      "25": 32,
      "10": 80
    },
    "interfaces": [
      {
        "speedGbps": 10,
        "physicalPorts": 48,
        "formFactor": "SFP+",
        "breakout": { "supported": false }
      },
      {
        "speedGbps": 100,
        "physicalPorts": 8,
        "formFactor": "QSFP100",
        "breakout": { "supported": true, "notes": "QSFP100 ports support breakout to 4x10/25G." }
      }
    ],
    "throughputTbps": 1.28,
    "pps": "1 Bpps",
    "latency": "800 ns",
    "cpu": "Quad-Core x86",
    "memory": "8 Gigabytes",
    "buffer": "32 MB",
    "powerDraw": "106W / 285W",
    "size": "1RU",
    "weight": "21 lbs (9.45 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 1,
    "datasheetUrl": "https://www.arista.com/en/products/7050x3-series",
    "source": { "document": "Arista 7050X3 Series Datasheet", "page": 8, "table": "Technical Specifications" }
  },
  {
    "id": "7050SX3-48C8C",
    "model": "7050SX3-48C8C",
    "series": "7050X3",
    "description": "48x 10G SFP+ & 8x 100G QSFP. Compact internal variant.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "100": 8,
      "50": 16,
      "40": 8,
      "25": 32,
      "10": 80
    },
    "interfaces": [
      {
        "speedGbps": 10,
        "physicalPorts": 48,
        "formFactor": "SFP+",
        "breakout": { "supported": false }
      },
      {
        "speedGbps": 100,
        "physicalPorts": 8,
        "formFactor": "QSFP100",
        "breakout": { "supported": true }
      }
    ],
    "throughputTbps": 1.28,
    "pps": "1 Bpps",
    "latency": "800 ns",
    "cpu": "Quad-Core x86",
    "memory": "16 Gigabytes",
    "buffer": "32 MB",
    "powerDraw": "106W / 285W",
    "size": "1RU",
    "weight": "N/A",
    "eosLicense": "N/A",
    "eosLicenseGroup": 1,
    "datasheetUrl": "https://www.arista.com/en/products/7050x3-series",
    "source": { "document": "Arista 7050X3 Series Datasheet", "page": 8, "table": "Technical Specifications" }
  },
  {
    "id": "7050TX3-48C8",
    "model": "7050TX3-48C8",
    "series": "7050X3",
    "description": "48x 10GBASE-T & 8x 100G QSFP. 10G copper access platform.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "100": 8,
      "50": 16,
      "40": 8,
      "25": 32,
      "10": 80
    },
    "interfaces": [
      {
        "speedGbps": 10,
        "physicalPorts": 48,
        "formFactor": "10G-T",
        "breakout": { "supported": false }
      },
      {
        "speedGbps": 100,
        "physicalPorts": 8,
        "formFactor": "QSFP100",
        "breakout": { "supported": true, "notes": "QSFP100 ports support breakout modes." }
      }
    ],
    "throughputTbps": 1.28,
    "pps": "1 Bpps",
    "latency": "3 µs",
    "cpu": "Quad-Core x86",
    "memory": "8 Gigabytes",
    "buffer": "32 MB",
    "powerDraw": "212W / 346W",
    "size": "1RU",
    "weight": "20.6 lbs (9.36 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 2,
    "datasheetUrl": "https://www.arista.com/en/products/7050x3-series",
    "source": { "document": "Arista 7050X3 Series Datasheet", "page": 8, "table": "Technical Specifications" }
  },
  {
    "id": "7050SX3-96YC8",
    "model": "7050SX3-96YC8",
    "series": "7050X3",
    "description": "96x 25G SFP & 8x 100G QSFP. High density 25G leaf.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "100": 8,
      "50": 16,
      "25": 128,
      "10": 130
    },
    "interfaces": [
      {
        "speedGbps": 25,
        "physicalPorts": 96,
        "formFactor": "SFP25",
        "breakout": { "supported": false }
      },
      {
        "speedGbps": 100,
        "physicalPorts": 8,
        "formFactor": "QSFP100",
        "breakout": { "supported": true, "notes": "QSFP ports support breakout to 4x10/25G." }
      },
      {
        "speedGbps": 10,
        "physicalPorts": 2,
        "formFactor": "SFP+",
        "breakout": { "supported": false }
      }
    ],
    "throughputTbps": 3.2,
    "pps": "2 Bpps",
    "latency": "800 ns",
    "cpu": "Quad-Core x86",
    "memory": "8 Gigabytes",
    "buffer": "32 MB",
    "powerDraw": "218W / 453W",
    "size": "2RU",
    "weight": "43 lbs (19.5 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 2,
    "datasheetUrl": "https://www.arista.com/en/products/7050x3-series",
    "source": { "document": "Arista 7050X3 Series Datasheet", "page": 9, "table": "Technical Specifications" }
  },
  {
    "id": "7050SX3-48YC12",
    "model": "7050SX3-48YC12",
    "series": "7050X3",
    "description": "48x 25G SFP & 12x 100G QSFP. 25G leaf with high uplink density.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "100": 12,
      "50": 24,
      "25": 96,
      "10": 96
    },
    "interfaces": [
      {
        "speedGbps": 25,
        "physicalPorts": 48,
        "formFactor": "SFP25",
        "breakout": { "supported": false }
      },
      {
        "speedGbps": 100,
        "physicalPorts": 12,
        "formFactor": "QSFP100",
        "breakout": { "supported": true, "notes": "Breakout support on all QSFP100 ports." }
      }
    ],
    "throughputTbps": 2.4,
    "pps": "2 Bpps",
    "latency": "800 ns",
    "cpu": "Quad-Core x86",
    "memory": "8 Gigabytes",
    "buffer": "32 MB",
    "powerDraw": "170W / 325W",
    "size": "1RU",
    "weight": "20.3 lbs (9.22 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 2,
    "datasheetUrl": "https://www.arista.com/en/products/7050x3-series",
    "source": { "document": "Arista 7050X3 Series Datasheet", "page": 9, "table": "Technical Specifications" }
  },
  {
    "id": "7050SX3-48YC8",
    "model": "7050SX3-48YC8",
    "series": "7050X3",
    "description": "48x 25G SFP & 8x 100G QSFP. Mainstream 25G leaf.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "100": 8,
      "50": 16,
      "25": 80,
      "10": 80
    },
    "interfaces": [
      {
        "speedGbps": 25,
        "physicalPorts": 48,
        "formFactor": "SFP25",
        "breakout": { "supported": false }
      },
      {
        "speedGbps": 100,
        "physicalPorts": 8,
        "formFactor": "QSFP100",
        "breakout": { "supported": true, "notes": "Breakout support on QSFP ports." }
      }
    ],
    "throughputTbps": 2.0,
    "pps": "1 Bpps",
    "latency": "800 ns",
    "cpu": "Quad-Core x86",
    "memory": "8 Gigabytes",
    "buffer": "32 MB",
    "powerDraw": "124W / 301W",
    "size": "1RU",
    "weight": "21 lbs (9.45 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 2,
    "datasheetUrl": "https://www.arista.com/en/products/7050x3-series",
    "source": { "document": "Arista 7050X3 Series Datasheet", "page": 9, "table": "Technical Specifications" }
  },
  {
    "id": "7050SX3-48YC8C",
    "model": "7050SX3-48YC8C",
    "series": "7050X3",
    "description": "48x 25G SFP & 8x 100G QSFP. Enhanced internal variant.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "100": 8,
      "50": 16,
      "25": 80,
      "10": 80
    },
    "interfaces": [
      {
        "speedGbps": 25,
        "physicalPorts": 48,
        "formFactor": "SFP25",
        "breakout": { "supported": false }
      },
      {
        "speedGbps": 100,
        "physicalPorts": 8,
        "formFactor": "QSFP100",
        "breakout": { "supported": true }
      }
    ],
    "throughputTbps": 2.0,
    "pps": "1 Bpps",
    "latency": "800 ns",
    "cpu": "Quad-Core x86",
    "memory": "16 Gigabytes",
    "buffer": "32 MB",
    "powerDraw": "124W / 301W",
    "size": "1RU",
    "weight": "N/A",
    "eosLicense": "N/A",
    "eosLicenseGroup": 2,
    "datasheetUrl": "https://www.arista.com/en/products/7050x3-series",
    "source": { "document": "Arista 7050X3 Series Datasheet", "page": 9, "table": "Technical Specifications" }
  },
  {
    "id": "7050SX3-24YC4C",
    "model": "7050SX3-24YC4C",
    "series": "7050X3",
    "description": "24x 25G SFP & 4x 100G QSFP. Entry level 25G leaf.",
    "type": "Switch",
    "maxPortsBySpeedGbps": {
      "100": 4,
      "50": 8,
      "25": 40,
      "10": 40
    },
    "interfaces": [
      {
        "speedGbps": 25,
        "physicalPorts": 24,
        "formFactor": "SFP25",
        "breakout": { "supported": false }
      },
      {
        "speedGbps": 100,
        "physicalPorts": 4,
        "formFactor": "QSFP100",
        "breakout": { "supported": true, "notes": "Supports breakout to 4x10/25G." }
      }
    ],
    "throughputTbps": 1.0,
    "pps": "1 Bpps",
    "latency": "800 ns",
    "cpu": "Quad-Core x86",
    "memory": "16 Gigabytes",
    "buffer": "32 MB",
    "powerDraw": "88W / 178W",
    "size": "1RU",
    "weight": "N/A",
    "eosLicense": "N/A",
    "eosLicenseGroup": 1,
    "datasheetUrl": "https://www.arista.com/en/products/7050x3-series",
    "source": { "document": "Arista 7050X3 Series Datasheet", "page": 9, "table": "Technical Specifications" }
  }
];