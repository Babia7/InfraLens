import type { SwitchSpec } from '../../types';

export const family7050X4: SwitchSpec[] = [
  {
    "id": "7050DX4-32S",
    "model": "7050DX4-32S",
    "series": "7050X4",
    "description": "32x 400G QSFP-DD & 2x SFP+. High performance 400G data center platform.",
    "type": "Switch",
    "maxPortsBySpeedGbps": { "400": 32, "100": 128, "50": 128, "40": 32, "25": 128, "10": 130 },
    "interfaces": [
      {
        "speedGbps": 400,
        "physicalPorts": 32,
        "formFactor": "QSFP-DD",
        "breakout": {
          "supported": true,
          "notes": "Supports up to 144 logical ports using breakouts; subject to transceiver/cable capabilities."
        }
      },
      {
        "speedGbps": 10,
        "physicalPorts": 2,
        "formFactor": "SFP+",
        "breakout": { "supported": false }
      }
    ],
    "throughputTbps": 12.8,
    "pps": "5.3 Bpps",
    "latency": "900 ns",
    "cpu": "Quad-Core x86",
    "memory": "16 Gigabytes",
    "buffer": "132 MB",
    "powerDraw": "353W / 880W",
    "size": "1RU",
    "weight": "24.4 lbs (11.1kgs)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 3,
    "datasheetUrl": "https://www.arista.com/en/products/7050x4-series",
    "source": { "document": "Arista 7050X4 Series Datasheet", "page": 8, "table": "Model Comparison" }
  },
  {
    "id": "7050PX4-32S",
    "model": "7050PX4-32S",
    "series": "7050X4",
    "description": "32x 400G OSFP & 2x SFP+. Optimized for high performance OSFP systems.",
    "type": "Switch",
    "maxPortsBySpeedGbps": { "400": 32, "100": 128, "50": 128, "40": 32, "25": 128, "10": 130 },
    "interfaces": [
      {
        "speedGbps": 400,
        "physicalPorts": 32,
        "formFactor": "OSFP",
        "breakout": {
          "supported": true,
          "notes": "Supports up to 144 logical ports using breakouts."
        }
      },
      {
        "speedGbps": 10,
        "physicalPorts": 2,
        "formFactor": "SFP+",
        "breakout": { "supported": false }
      }
    ],
    "throughputTbps": 12.8,
    "pps": "5.3 Bpps",
    "latency": "900 ns",
    "cpu": "Quad-Core x86",
    "memory": "16 Gigabytes",
    "buffer": "132 MB",
    "powerDraw": "353W / 880W",
    "size": "1RU",
    "weight": "26.6 lbs (12.1kgs)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 3,
    "datasheetUrl": "https://www.arista.com/en/products/7050x4-series",
    "source": { "document": "Arista 7050X4 Series Datasheet", "page": 8, "table": "Model Comparison" }
  },
  {
    "id": "7050DX4M-32S",
    "model": "7050DX4M-32S",
    "series": "7050X4",
    "description": "32x 400G QSFP-DD with MACsec support on 16 ports.",
    "type": "Switch",
    "maxPortsBySpeedGbps": { "400": 32, "100": 128, "50": 128, "40": 32, "25": 128, "10": 130 },
    "interfaces": [
      {
        "speedGbps": 400,
        "physicalPorts": 32,
        "formFactor": "QSFP-DD",
        "breakout": {
          "supported": true,
          "notes": "MACsec encryption supported on ports 1-8 and 25-32. Supports up to 144 logical ports using breakouts."
        }
      },
      {
        "speedGbps": 10,
        "physicalPorts": 2,
        "formFactor": "SFP+",
        "breakout": { "supported": false }
      }
    ],
    "throughputTbps": 12.8,
    "pps": "5.3 Bpps",
    "latency": "900 ns",
    "cpu": "Quad-Core x86",
    "memory": "16 Gigabytes",
    "buffer": "132 MB",
    "powerDraw": "423W / 1208W",
    "size": "1RU",
    "weight": "24.4 lbs (11.1kgs)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 3,
    "datasheetUrl": "https://www.arista.com/en/products/7050x4-series",
    "source": { "document": "Arista 7050X4 Series Datasheet", "page": 8, "table": "Model Comparison" }
  },
  {
    "id": "7050SDX4-48D8",
    "model": "7050SDX4-48D8",
    "series": "7050X4",
    "description": "48x 100G SFP-DD & 8x 400G QSFP-DD. High density 100G edge.",
    "type": "Switch",
    "maxPortsBySpeedGbps": { "400": 8, "100": 80, "50": 160, "25": 160, "10": 160 },
    "interfaces": [
      {
        "speedGbps": 100,
        "physicalPorts": 48,
        "formFactor": "SFP-DD",
        "breakout": {
          "supported": true,
          "notes": "SFP-DD ports support flexible configuration between 100GbE, 50GbE, 25GbE and 10GbE."
        }
      },
      {
        "speedGbps": 400,
        "physicalPorts": 8,
        "formFactor": "QSFP-DD",
        "breakout": {
          "supported": true,
          "notes": "QSFP-DD ports support 400GbE, 200GbE, 100GbE and 40GbE modes."
        }
      }
    ],
    "throughputTbps": 8.0,
    "pps": "2.7 Bpps",
    "latency": "900 ns",
    "cpu": "Quad-Core x86",
    "memory": "16 Gigabytes",
    "buffer": "82 MB",
    "powerDraw": "165W / 520W",
    "size": "1RU",
    "weight": "23 lbs (10.4kgs)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 3,
    "datasheetUrl": "https://www.arista.com/en/products/7050x4-series",
    "source": { "document": "Arista 7050X4 Series Datasheet", "page": 9, "table": "Technical Specifications" }
  },
  {
    "id": "7050SPX4-48D8",
    "model": "7050SPX4-48D8",
    "series": "7050X4",
    "description": "48x 100G DSFP & 8x 400G QSFP-DD. Optimized for DSFP efficiency.",
    "type": "Switch",
    "maxPortsBySpeedGbps": { "400": 8, "100": 80, "50": 160, "25": 160 },
    "interfaces": [
      {
        "speedGbps": 100,
        "physicalPorts": 48,
        "formFactor": "DSFP",
        "breakout": {
          "supported": true,
          "notes": "DSFP ports support 100GbE, 50GbE and 25GbE modes."
        }
      },
      {
        "speedGbps": 400,
        "physicalPorts": 8,
        "formFactor": "QSFP-DD",
        "breakout": {
          "supported": true,
          "notes": "QSFP-DD ports support up to 72 logical ports using breakouts."
        }
      }
    ],
    "throughputTbps": 8.0,
    "pps": "2.7 Bpps",
    "latency": "900 ns",
    "cpu": "Quad-Core x86",
    "memory": "16 Gigabytes",
    "buffer": "82 MB",
    "powerDraw": "156W / 520W",
    "size": "1RU",
    "weight": "23 lbs (10.4kgs)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 3,
    "datasheetUrl": "https://www.arista.com/en/products/7050x4-series",
    "source": { "document": "Arista 7050X4 Series Datasheet", "page": 9, "table": "Technical Specifications" }
  },
  {
    "id": "7050CX4-24D8",
    "model": "7050CX4-24D8",
    "series": "7050X4",
    "description": "24x 200G QSFP-56, 8x 400G QSFP-DD & 2x SFP+. Ideal for 200G aggregation.",
    "type": "Switch",
    "maxPortsBySpeedGbps": { "400": 8, "200": 24, "100": 80, "50": 128, "25": 128, "10": 130 },
    "interfaces": [
      {
        "speedGbps": 200,
        "physicalPorts": 24,
        "formFactor": "QSFP-56",
        "breakout": {
          "supported": true,
          "notes": "QSFP-56 200G ports support 24x 200GbE or 48x 100GbE logical ports."
        }
      },
      {
        "speedGbps": 400,
        "physicalPorts": 8,
        "formFactor": "QSFP-DD",
        "breakout": {
          "supported": true,
          "notes": "QSFP-DD ports support up to total 72 logical ports."
        }
      },
      {
        "speedGbps": 10,
        "physicalPorts": 2,
        "formFactor": "SFP+",
        "breakout": { "supported": false }
      }
    ],
    "throughputTbps": 8.0,
    "pps": "2.7 Bpps",
    "latency": "900 ns",
    "cpu": "Quad-Core x86",
    "memory": "16 Gigabytes",
    "buffer": "82 MB",
    "powerDraw": "226W / 465W",
    "size": "1RU",
    "weight": "23 lbs (10.4kgs)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 3,
    "datasheetUrl": "https://www.arista.com/en/products/7050x4-series",
    "source": { "document": "Arista 7050X4 Series Datasheet", "page": 9, "table": "Technical Specifications" }
  },
  {
    "id": "7050CX4M-48D8",
    "model": "7050CX4M-48D8",
    "series": "7050X4",
    "description": "48x 100G QSFP-100, 8x 400G QSFP-DD & 2x SFP+. High density 100G with MACsec.",
    "type": "Switch",
    "maxPortsBySpeedGbps": { "400": 8, "100": 80, "50": 160, "25": 160, "10": 162 },
    "interfaces": [
      {
        "speedGbps": 100,
        "physicalPorts": 48,
        "formFactor": "QSFP-100",
        "breakout": {
          "supported": true,
          "notes": "MACsec encryption support. QSFP-100 ports support 100GbE, 50GbE, 25GbE and 10GbE modes."
        }
      },
      {
        "speedGbps": 400,
        "physicalPorts": 8,
        "formFactor": "QSFP-DD",
        "breakout": {
          "supported": true,
          "notes": "QSFP-DD ports support up to total 72 logical ports."
        }
      },
      {
        "speedGbps": 10,
        "physicalPorts": 2,
        "formFactor": "SFP+",
        "breakout": { "supported": false }
      }
    ],
    "throughputTbps": 8.0,
    "pps": "2.7 Bpps",
    "latency": "900 ns",
    "cpu": "Quad-Core x86",
    "memory": "16 Gigabytes",
    "buffer": "82 MB",
    "powerDraw": "390W / 740W",
    "size": "2RU",
    "weight": "35.1 lbs (16.0kgs)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 3,
    "datasheetUrl": "https://www.arista.com/en/products/7050x4-series",
    "source": { "document": "Arista 7050X4 Series Datasheet", "page": 9, "table": "Technical Specifications" }
  },
  {
    "id": "7050X4-48Y-4DF",
    "model": "7050X4-48Y-4DF",
    "series": "7050X4",
    "description": "48x 25G SFP25 & 4x 400G QSFP-DD. High performance 25G access.",
    "type": "Switch",
    "maxPortsBySpeedGbps": { "400": 4, "100": 16, "50": 32, "25": 64, "10": 64 },
    "interfaces": [
      {
        "speedGbps": 25,
        "physicalPorts": 48,
        "formFactor": "SFP25",
        "breakout": {
          "supported": true,
          "notes": "SFP25 ports support 25GbE, 10GbE and 1GbE modes."
        }
      },
      {
        "speedGbps": 400,
        "physicalPorts": 4,
        "formFactor": "QSFP-DD",
        "breakout": {
          "supported": true,
          "notes": "QSFP-DD ports support up to total 72 logical ports using breakouts."
        }
      }
    ],
    "throughputTbps": 2.8,
    "pps": "2.7 Bpps",
    "latency": "900 ns",
    "cpu": "Quad-Core x86",
    "memory": "16 Gigabytes",
    "buffer": "82 MB",
    "powerDraw": "120W / 223W",
    "size": "1RU",
    "weight": "21 lbs (9.52kgs)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 2,
    "datasheetUrl": "https://www.arista.com/en/products/7050x4-series",
    "source": { "document": "Arista 7050X4 Series Datasheet", "page": 9, "table": "Technical Specifications" }
  }
];