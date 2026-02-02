
import type { SwitchSpec } from '../../types';

/**
 * 7800R4 Series Scope Lock
 * Allowed Models: 7800R4-36PE, 7800R4C-36PE, 7800R4K-36PE
 * Note: 800G density is achieved via OSFP800 (PE suffix).
 */
export const family7800R4: SwitchSpec[] = [
  {
    "id": "7800R4C-36PE",
    "model": "7800R4C-36PE",
    "series": "7800R4",
    "description": "36 port 800GbE OSFP line card optimized for AI/ML compute clusters.",
    "type": "Line Card",
    "maxPortsBySpeedGbps": {
      "800": 36,
      "400": 72,
      "100": 288
    },
    "interfaces": [
      {
        "speedGbps": 800,
        "physicalPorts": 36,
        "formFactor": "OSFP800",
        "breakout": { 
          "supported": true, 
          "notes": "Supports 2x400G or 8x100G breakout modes per port for massive radix expansion." 
        }
      }
    ],
    "throughputTbps": 28.8,
    "pps": "10.8 Bpps",
    "latency": "2.8 µs",
    "cpu": "N/A",
    "memory": "N/A",
    "buffer": "32 GB",
    "powerDraw": "904W Typical / 1088W Max",
    "size": "Line Card",
    "weight": "26.7 lbs (12.1 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 4,
    "datasheetUrl": "https://www.arista.com/en/products/7800-series",
    "source": { "document": "Arista 7800R4 Series AI Spine Switch Datasheet", "page": 8, "table": "Line Card Technical Specifications" },
    "compatibleChassis": ["7804R", "7808R", "7812R", "7816LR"]
  },
  {
    "id": "7800R4-36PE",
    "model": "7800R4-36PE",
    "series": "7800R4",
    "description": "36 port 800GbE OSFP universal spine line card.",
    "type": "Line Card",
    "maxPortsBySpeedGbps": {
      "800": 36,
      "400": 72,
      "100": 288
    },
    "interfaces": [
      {
        "speedGbps": 800,
        "physicalPorts": 36,
        "formFactor": "OSFP800",
        "breakout": { 
          "supported": true, 
          "notes": "Supports 2x400G or 8x100G breakout modes." 
        }
      }
    ],
    "throughputTbps": 28.8,
    "pps": "10.8 Bpps",
    "latency": "3.8 µs",
    "cpu": "N/A",
    "memory": "N/A",
    "buffer": "32 GB",
    "powerDraw": "915W Typical / 1110W Max",
    "size": "Line Card",
    "weight": "26.7 lbs (12.1 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 4,
    "datasheetUrl": "https://www.arista.com/en/products/7800-series",
    "source": { "document": "Arista 7800R4 Series AI Spine Switch Datasheet", "page": 8, "table": "Line Card Technical Specifications" },
    "compatibleChassis": ["7804R", "7808R", "7812R", "7816LR"]
  },
  {
    "id": "7800R4K-36PE",
    "model": "7800R4K-36PE",
    "series": "7800R4",
    "description": "36 port 800GbE OSFP line card with TunnelSec and large scale routing (K-variant).",
    "type": "Line Card",
    "maxPortsBySpeedGbps": {
      "800": 36,
      "400": 72,
      "100": 288
    },
    "interfaces": [
      {
        "speedGbps": 800,
        "physicalPorts": 36,
        "formFactor": "OSFP800",
        "breakout": { 
          "supported": true, 
          "notes": "Supports 2x400G or 8x100G breakout modes. Wire-speed encryption via TunnelSec." 
        }
      }
    ],
    "throughputTbps": 28.8,
    "pps": "10.8 Bpps",
    "latency": "3.8 µs",
    "cpu": "N/A",
    "memory": "N/A",
    "buffer": "32 GB",
    "powerDraw": "921W Typical / 1125W Max",
    "size": "Line Card",
    "weight": "26.7 lbs (12.1 kg)",
    "eosLicense": "N/A",
    "eosLicenseGroup": 4,
    "datasheetUrl": "https://www.arista.com/en/products/7800-series",
    "source": { "document": "Arista 7800R4 Series AI Spine Switch Datasheet", "page": 8, "table": "Line Card Technical Specifications" },
    "compatibleChassis": ["7804R", "7808R", "7812R", "7816LR"]
  }
];
