import React, { createContext, useContext, useState } from 'react';
import { getAlternateRecommendations } from '../services/nexarApi';
import { Cpu, Smartphone, MonitorPlay, Watch, Video, Camera } from 'lucide-react';

const ProductContext = createContext();

const INITIAL_PRODUCTS = [
  { id: '1', name: 'Pixel 8 Pro', category: 'Smartphone', iconName: 'Smartphone', color: '#ff6b35' },
  { id: '2', name: 'Google Home', category: 'Smart Home', iconName: 'MonitorPlay', color: '#e71d36' },
  { id: '3', name: 'Pixel Watch 2', category: 'Wearables', iconName: 'Watch', color: '#ff9f1c' },
  { id: '4', name: 'Chromecast with GTV', category: 'Media', iconName: 'MonitorPlay', color: '#4cc9f0' },
  { id: '5', name: 'Chromebook Plus', category: 'Computing', iconName: 'Cpu', color: '#4361ee' },
  { id: '6', name: 'Google TV Streamer', category: 'Media', iconName: 'MonitorPlay', color: '#e71d36' },
  { id: '7', name: 'Pixel Buds Pro', category: 'Audio', iconName: 'Watch', color: '#ff9f1c' },
  { id: '8', name: 'Pixel Tablet', category: 'Computing', iconName: 'Smartphone', color: '#4cc9f0' },
  { id: '9', name: 'Nest Thermostat', category: 'Smart Home', iconName: 'Cpu', color: '#ff6b35' },
  { id: '10', name: 'Nest Wifi Router', category: 'Smart Home', iconName: 'MonitorPlay', color: '#4361ee' }
];

const INITIAL_BOM_DATA = {
  '1': {
    name: 'Pixel 8 Pro',
    category: 'Smartphone',
    bom: [
      { part: 'Tensor G3 SoC', mpn: 'MPN-GOO-TG3-01', qty: 1, manufacturer: 'Samsung Foundry', status: 'Approved', unitCost: 65.50 },
      { part: '6.7" LTPO OLED Display', mpn: 'MPN-SAM-OLED-67', qty: 1, manufacturer: 'Samsung Display', status: 'Approved', unitCost: 82.00 },
      { part: '50MP Primary Camera Sensor', mpn: 'MPN-SON-IMX989-50', qty: 1, manufacturer: 'Sony', status: 'Pending Review', unitCost: 35.25 },
      { part: '5050mAh Battery Cell', mpn: 'MPN-AMP-5050-LIP', qty: 1, manufacturer: 'Amperex', status: 'Approved', unitCost: 12.80 },
      { part: '12GB LPDDR5X RAM', mpn: 'MPN-MIC-LPD5X-12', qty: 1, manufacturer: 'Micron', status: 'Approved', unitCost: 45.00 },
      { part: 'SMD Ceramic Capacitor 0.1uF 10V', mpn: 'MPN-CAP-CER-01U', qty: 145, manufacturer: 'Murata', status: 'Approved', unitCost: 0.02 },
      { part: 'SMD Resistor 10K Ohm 1%', mpn: 'MPN-RES-10K-01', qty: 82, manufacturer: 'Yageo', status: 'Approved', unitCost: 0.01 },
      { part: 'Power Management IC (PMIC)', mpn: 'MPN-QAL-PMIC-88', qty: 2, manufacturer: 'Qualcomm', status: 'Approved', unitCost: 4.50 },
      { part: 'Aluminum Frame CNC', mpn: 'MPN-FOX-ALU-P8P', qty: 1, manufacturer: 'Foxconn', status: 'Tooling', unitCost: 28.50 }
    ],
    suppliers: [
      { name: 'Samsung Semiconductor', rating: '98%', risk: 'Low', location: 'South Korea' },
      { name: 'Murata Manufacturing', rating: '99%', risk: 'Low', location: 'Japan' },
      { name: 'Amperex Technology', rating: '88%', risk: 'Medium', location: 'China' }
    ],
    cost: { targetBOM: '$415.00', currentEstimates: '$422.50', variance: '+$7.50 (+1.8%)' },
    variants: [
      { sku: 'GOO-P8P-US-OBS-128', region: 'US', color: 'Obsidian Grey', memory: '128GB', channel: 'Online/Retail' },
      { sku: 'GOO-P8P-US-POR-256', region: 'US', color: 'Porcelain White', memory: '256GB', channel: 'Online/Retail' },
      { sku: 'GOO-P8P-UK-BAY-128', region: 'UK', color: 'Bay Blue', memory: '128GB', channel: 'Online' },
      { sku: 'GOO-P8P-JP-OBS-512', region: 'JP', color: 'Obsidian Grey', memory: '512GB', channel: 'Online/Retail' },
      { sku: 'GOO-P8P-IND-POR-128', region: 'IND', color: 'Porcelain White', memory: '128GB', channel: 'Online' },
      { sku: 'GOO-P8P-CA-BAY-256', region: 'CA', color: 'Bay Blue', memory: '256GB', channel: 'Retail' },
      { sku: 'GOO-P8P-MX-OBS-128-REF', region: 'MX', color: 'Obsidian Grey', memory: '128GB', channel: 'Refurbished' },
      { sku: 'GOO-P8P-ROW-OBS-128', region: 'ROW', color: 'Obsidian Grey', memory: '128GB', channel: 'Online' }
    ]
  },
  '2': {
    name: 'Google Home',
    category: 'Smart Home',
    bom: [
      { part: 'MediaTek SoC MT8516', mpn: 'MPN-MTK-8516', qty: 1, manufacturer: 'MediaTek', status: 'Approved', unitCost: 12.50 },
      { part: 'High-Excursion Speaker Driver', mpn: 'MPN-TYM-SPK-01', qty: 1, manufacturer: 'Tymphany', status: 'Approved', unitCost: 8.75 },
      { part: 'Dual Microphone Array PCB', mpn: 'MPN-KNS-MIC-02', qty: 1, manufacturer: 'Knowles', status: 'Sourcing', unitCost: 3.40 },
      { part: 'SMD Ceramic Capacitor 10uF 16V', mpn: 'MPN-CAP-CER-10U', qty: 45, manufacturer: 'Taiyo Yuden', status: 'Approved', unitCost: 0.05 },
      { part: 'SMD Resistor 4.7K Ohm 5%', mpn: 'MPN-RES-4K7-05', qty: 32, manufacturer: 'Vishay', status: 'Approved', unitCost: 0.02 }
    ],
    suppliers: [
      { name: 'MediaTek', rating: '95%', risk: 'Low', location: 'Taiwan' },
      { name: 'Tymphany', rating: '90%', risk: 'Medium', location: 'China' },
      { name: 'Knowles', rating: '98%', risk: 'Low', location: 'USA' }
    ],
    cost: { targetBOM: '$45.00', currentEstimates: '$42.10', variance: '-$2.90 (-6.4%)' },
    variants: [
      { sku: 'GOO-GH-US-CHALK', region: 'US', color: 'Chalk', memory: 'N/A', channel: 'Online/Retail' },
      { sku: 'GOO-GH-US-CHAR', region: 'US', color: 'Charcoal', memory: 'N/A', channel: 'Online/Retail' },
      { sku: 'GOO-GH-UK-CHALK', region: 'UK', color: 'Chalk', memory: 'N/A', channel: 'Online/Retail' },
      { sku: 'GOO-GH-CA-CHAR', region: 'CA', color: 'Charcoal', memory: 'N/A', channel: 'Retail' },
      { sku: 'GOO-GH-ROW-CHALK-REF', region: 'ROW', color: 'Chalk', memory: 'N/A', channel: 'Refurbished' }
    ]
  },
  '3': {
    name: 'Pixel Watch 2',
    category: 'Wearables',
    bom: [
      { part: 'Snapdragon W5 Gen 1', mpn: 'MPN-QAL-W5G1', qty: 1, manufacturer: 'Qualcomm', status: 'Approved', unitCost: 28.00 },
      { part: '1.2" Circular AMOLED', mpn: 'MPN-BOE-AMO12', qty: 1, manufacturer: 'BOE', status: 'Approved', unitCost: 35.50 },
      { part: 'Multi-path Optical Heart Rate Sensor', mpn: 'MPN-MAX-OHR-44', qty: 1, manufacturer: 'Maxim Integrated', status: 'Testing', unitCost: 14.20 },
      { part: '306mAh Li-Ion Battery', mpn: 'MPN-SUN-306-BAT', qty: 1, manufacturer: 'Sunwoda', status: 'Approved', unitCost: 6.80 },
      { part: '0201 SMT Capacitor 0.22uF', mpn: 'MPN-CAP-0201-22N', qty: 94, manufacturer: 'Murata', status: 'Approved', unitCost: 0.03 },
      { part: 'Haptic Linear Resonant Actuator', mpn: 'MPN-AAC-LRA-01', qty: 1, manufacturer: 'AAC Technologies', status: 'Approved', unitCost: 4.10 }
    ],
    suppliers: [
      { name: 'Qualcomm', rating: '99%', risk: 'Low', location: 'USA' },
      { name: 'BOE Technology', rating: '94%', risk: 'Medium', location: 'China' }
    ],
    cost: { targetBOM: '$125.00', currentEstimates: '$132.80', variance: '+$7.80 (+6.2%)' },
    variants: [
      { sku: 'GOO-PW2-US-MAT-WIFI', region: 'US', color: 'Matte Black', memory: '32GB', channel: 'Online/Retail' },
      { sku: 'GOO-PW2-US-POL-LTE', region: 'US', color: 'Polished Silver', memory: '32GB', channel: 'Carrier' },
      { sku: 'GOO-PW2-UK-MAT-WIFI', region: 'UK', color: 'Matte Black', memory: '32GB', channel: 'Online' },
      { sku: 'GOO-PW2-JP-CHA-LTE', region: 'JP', color: 'Champagne Gold', memory: '32GB', channel: 'Carrier' }
    ]
  },
  '4': {
    name: 'Chromecast with GTV',
    category: 'Media',
    bom: [
      { part: 'Amlogic S905D3G SoC', mpn: 'MPN-AML-S905', qty: 1, manufacturer: 'Amlogic', status: 'Approved', unitCost: 8.50 },
      { part: '2GB DDR3 RAM', mpn: 'MPN-SKH-DDR3-2G', qty: 1, manufacturer: 'SK Hynix', status: 'Approved', unitCost: 4.20 },
      { part: '8GB eMMC Storage', mpn: 'MPN-SAM-EMMC-8G', qty: 1, manufacturer: 'Samsung', status: 'Approved', unitCost: 3.10 },
      { part: 'HDMI 2.1 Connector', mpn: 'MPN-MOL-HDMI-21', qty: 1, manufacturer: 'Molex', status: 'Approved', unitCost: 0.85 },
      { part: 'Wi-Fi/BT Combo Module', mpn: 'MPN-BRO-WFM-05', qty: 1, manufacturer: 'Broadcom', status: 'Approved', unitCost: 3.75 }
    ],
    suppliers: [
      { name: 'Amlogic', rating: '92%', risk: 'Low', location: 'USA/China' },
      { name: 'SK Hynix', rating: '97%', risk: 'Low', location: 'South Korea' }
    ],
    cost: { targetBOM: '$22.00', currentEstimates: '$20.40', variance: '-$1.60 (-7.2%)' },
    variants: [
      { sku: 'GOO-CCV-US-SNO', region: 'US', color: 'Snow', memory: '8GB', channel: 'Retail' },
      { sku: 'GOO-CCV-UK-SNO', region: 'UK', color: 'Snow', memory: '8GB', channel: 'Retail' },
      { sku: 'GOO-CCV-US-SKY', region: 'US', color: 'Sky', memory: '8GB', channel: 'Online' }
    ]
  },
  '5': {
    name: 'Chromebook Plus',
    category: 'Computing',
    bom: [
      { part: 'Intel Core i3-1215U', mpn: 'MPN-INT-I3-1215U', qty: 1, manufacturer: 'Intel', status: 'Approved', unitCost: 110.00 },
      { part: '14" FHD IPS Display Panel', mpn: 'MPN-LGD-14FHD', qty: 1, manufacturer: 'LG Display', status: 'Approved', unitCost: 45.00 },
      { part: '8GB LPDDR5 RAM', mpn: 'MPN-MIC-LPD5-8G', qty: 1, manufacturer: 'Micron', status: 'Approved', unitCost: 28.50 },
      { part: '128GB PCIe NVMe SSD', mpn: 'MPN-WDC-SN530-128', qty: 1, manufacturer: 'Western Digital', status: 'Approved', unitCost: 18.00 },
      { part: '50Wh Lithium Polymer Battery', mpn: 'MPN-BYD-50WH-LP', qty: 1, manufacturer: 'BYD', status: 'Approved', unitCost: 22.50 },
      { part: 'Backlit Keyboard Assembly', mpn: 'MPN-CHY-KBD-BKL', qty: 1, manufacturer: 'Chicony', status: 'Approved', unitCost: 15.00 }
    ],
    suppliers: [
      { name: 'Intel', rating: '99%', risk: 'Low', location: 'USA' },
      { name: 'LG Display', rating: '96%', risk: 'Low', location: 'South Korea' },
      { name: 'BYD', rating: '91%', risk: 'Medium', location: 'China' }
    ],
    cost: { targetBOM: '$280.00', currentEstimates: '$239.00', variance: '-$41.00 (-14.6%)' },
    variants: [
      { sku: 'GOO-CBP-US-GRY-128', region: 'US', color: 'Storm Grey', memory: '128GB', channel: 'Retail' },
      { sku: 'GOO-CBP-UK-SIL-256', region: 'UK', color: 'Lunar Silver', memory: '256GB', channel: 'Online' },
      { sku: 'GOO-CBP-JP-GRY-128', region: 'JP', color: 'Storm Grey', memory: '128GB', channel: 'Retail' }
    ]
  },
  '6': {
    name: 'Google TV Streamer',
    category: 'Media',
    bom: [
      { part: 'MediaTek MT8696T SoC', mpn: 'MPN-MTK-8696T', qty: 1, manufacturer: 'MediaTek', status: 'Approved', unitCost: 14.50 },
      { part: '4GB LPDDR4 RAM', mpn: 'MPN-MIC-LPD4-4G', qty: 1, manufacturer: 'Micron', status: 'Approved', unitCost: 8.50 },
      { part: '32GB eMMC Storage', mpn: 'MPN-SAM-EMMC-32', qty: 1, manufacturer: 'Samsung', status: 'Approved', unitCost: 6.20 },
      { part: 'Gigabit Ethernet PHY', mpn: 'MPN-RTL-8211F', qty: 1, manufacturer: 'Realtek', status: 'Approved', unitCost: 1.10 },
      { part: 'Thread/Matter Radio Co-processor', mpn: 'MPN-NXP-K32W', qty: 1, manufacturer: 'NXP', status: 'Testing', unitCost: 3.80 },
      { part: 'Thermally Conductive Enclosure Base', mpn: 'MPN-FOX-BASE-TV', qty: 1, manufacturer: 'Foxconn', status: 'Tooling', unitCost: 5.50 }
    ],
    suppliers: [
      { name: 'MediaTek', rating: '95%', risk: 'Low', location: 'Taiwan' },
      { name: 'Foxconn', rating: '98%', risk: 'Low', location: 'Taiwan/China' }
    ],
    cost: { targetBOM: '$48.00', currentEstimates: '$39.60', variance: '-$8.40 (-17.5%)' },
    variants: [
      { sku: 'GOO-TVS-US-POR-32', region: 'US', color: 'Porcelain', memory: '32GB', channel: 'Online/Retail' },
      { sku: 'GOO-TVS-UK-POR-32', region: 'UK', color: 'Porcelain', memory: '32GB', channel: 'Retail' },
      { sku: 'GOO-TVS-US-HAZ-32', region: 'US', color: 'Hazel', memory: '32GB', channel: 'Online' }
    ]
  },
  '7': {
    name: 'Pixel Buds Pro',
    category: 'Audio',
    bom: [
      { part: 'Custom 6-Core Audio Chip', mpn: 'MPN-GOO-AUD-06', qty: 2, manufacturer: 'TSMC', status: 'Approved', unitCost: 18.00 },
      { part: '11mm Driver Unit', mpn: 'MPN-SON-DRV-11', qty: 2, manufacturer: 'Sony', status: 'Approved', unitCost: 6.50 },
      { part: 'MEMS Microphone Array (3 per bud)', mpn: 'MPN-KNS-MEMS-3', qty: 6, manufacturer: 'Knowles', status: 'Approved', unitCost: 1.20 },
      { part: 'VPU (Voice Pickup Unit) Sensor', mpn: 'MPN-BOS-VPU-01', qty: 2, manufacturer: 'Bosch', status: 'Approved', unitCost: 2.10 },
      { part: 'Button Cell Battery (Bud)', mpn: 'MPN-VAR-COIN-60', qty: 2, manufacturer: 'Varta', status: 'Approved', unitCost: 3.50 },
      { part: 'Charging Case PCBA', mpn: 'MPN-GOO-CASE-PCB', qty: 1, manufacturer: 'Pegatron', status: 'Approved', unitCost: 12.00 }
    ],
    suppliers: [
      { name: 'TSMC', rating: '99%', risk: 'Low', location: 'Taiwan' },
      { name: 'Knowles', rating: '98%', risk: 'Low', location: 'USA' },
      { name: 'Varta', rating: '92%', risk: 'Medium', location: 'Germany' }
    ],
    cost: { targetBOM: '$75.00', currentEstimates: '$71.60', variance: '-$3.40 (-4.5%)' },
    variants: [
      { sku: 'GOO-PBP-US-CHA', region: 'US', color: 'Charcoal', memory: 'N/A', channel: 'Online/Retail' },
      { sku: 'GOO-PBP-US-FOG', region: 'US', color: 'Fog', memory: 'N/A', channel: 'Online/Retail' },
      { sku: 'GOO-PBP-UK-LEM', region: 'UK', color: 'Lemongrass', memory: 'N/A', channel: 'Online' },
      { sku: 'GOO-PBP-JP-COR', region: 'JP', color: 'Coral', memory: 'N/A', channel: 'Retail' }
    ]
  },
  '8': {
    name: 'Pixel Tablet',
    category: 'Computing',
    bom: [
      { part: 'Tensor G2 SoC', mpn: 'MPN-GOO-TG2-01', qty: 1, manufacturer: 'Samsung Foundry', status: 'Approved', unitCost: 55.00 },
      { part: '10.95" LCD Display (2560x1600)', mpn: 'MPN-BOE-LCD-11', qty: 1, manufacturer: 'BOE', status: 'Approved', unitCost: 68.00 },
      { part: '8GB LPDDR5 RAM', mpn: 'MPN-SAM-LPD5-8', qty: 1, manufacturer: 'Samsung', status: 'Approved', unitCost: 32.00 },
      { part: '27Wh Lithium-Ion Battery', mpn: 'MPN-ATL-27WH', qty: 1, manufacturer: 'ATL', status: 'Approved', unitCost: 16.50 },
      { part: 'Quad Speaker Array', mpn: 'MPN-AAC-SPK-Q4', qty: 1, manufacturer: 'AAC Technologies', status: 'Approved', unitCost: 11.20 },
      { part: 'Pogo Pin Power Connector', mpn: 'MPN-CNT-POGO-4', qty: 1, manufacturer: 'Connectec', status: 'Approved', unitCost: 1.50 },
      { part: 'Charging Speaker Dock PCBA', mpn: 'MPN-GOO-DOCK-PCB', qty: 1, manufacturer: 'Compal', status: 'Approved', unitCost: 24.00 }
    ],
    suppliers: [
      { name: 'Samsung Foundry', rating: '98%', risk: 'Low', location: 'South Korea' },
      { name: 'BOE Technology', rating: '94%', risk: 'Medium', location: 'China' },
      { name: 'Compal Electronics', rating: '96%', risk: 'Low', location: 'Taiwan' }
    ],
    cost: { targetBOM: '$220.00', currentEstimates: '$208.20', variance: '-$11.80 (-5.3%)' },
    variants: [
      { sku: 'GOO-PT-US-POR-128', region: 'US', color: 'Porcelain', memory: '128GB', channel: 'Online/Retail' },
      { sku: 'GOO-PT-US-HAZ-256', region: 'US', color: 'Hazel', memory: '256GB', channel: 'Online/Retail' },
      { sku: 'GOO-PT-UK-ROS-128', region: 'UK', color: 'Rose', memory: '128GB', channel: 'Online' },
      { sku: 'GOO-PT-CA-POR-256', region: 'CA', color: 'Porcelain', memory: '256GB', channel: 'Retail' }
    ]
  },
  '9': {
    name: 'Nest Thermostat',
    category: 'Smart Home',
    bom: [
      { part: 'Wireless MCU Combo (Wi-Fi/BT/Matter)', mpn: 'MPN-SIL-EFR32', qty: 1, manufacturer: 'Silicon Labs', status: 'Approved', unitCost: 6.50 },
      { part: '2.4" IPS IPS Screen', mpn: 'MPN-TRU-IPS-024', qty: 1, manufacturer: 'Truly', status: 'Approved', unitCost: 9.80 },
      { part: 'Soli Radar Sensor IC', mpn: 'MPN-INF-SOLI-60G', qty: 1, manufacturer: 'Infineon', status: 'Approved', unitCost: 8.50 },
      { part: 'Digital Temperature/Humidity Sensor', mpn: 'MPN-SEN-SHT40', qty: 1, manufacturer: 'Sensirion', status: 'Approved', unitCost: 1.20 },
      { part: 'HVAC Relay Board (24VAC)', mpn: 'MPN-GOO-RLY-24V', qty: 1, manufacturer: 'Flex', status: 'Approved', unitCost: 5.40 },
      { part: 'Mirrored Glass Lens', mpn: 'MPN-GLS-MIR-01', qty: 1, manufacturer: 'Corning', status: 'Tooling', unitCost: 4.20 }
    ],
    suppliers: [
      { name: 'Silicon Labs', rating: '97%', risk: 'Low', location: 'USA' },
      { name: 'Infineon', rating: '98%', risk: 'Low', location: 'Germany' },
      { name: 'Flex', rating: '95%', risk: 'Low', location: 'Mexico/China' }
    ],
    cost: { targetBOM: '$45.00', currentEstimates: '$35.60', variance: '-$9.40 (-20.8%)' },
    variants: [
      { sku: 'GOO-NT-US-SNO', region: 'US', color: 'Snow', memory: 'N/A', channel: 'Online/Retail' },
      { sku: 'GOO-NT-US-SAN', region: 'US', color: 'Sand', memory: 'N/A', channel: 'Online/Retail' },
      { sku: 'GOO-NT-CA-FOG', region: 'CA', color: 'Fog', memory: 'N/A', channel: 'Retail' },
      { sku: 'GOO-NT-UK-CHA', region: 'UK', color: 'Charcoal', memory: 'N/A', channel: 'Online' },
      { sku: 'GOO-NT-US-SNO-PRO', region: 'US', color: 'Snow', memory: 'N/A', channel: 'Professional Installers' }
    ]
  },
  '10': {
    name: 'Nest Wifi Router',
    category: 'Smart Home',
    bom: [
      { part: 'Wi-Fi 6E Tri-Band Network SoC', mpn: 'MPN-QAL-IPQ5018', qty: 1, manufacturer: 'Qualcomm', status: 'Approved', unitCost: 18.50 },
      { part: '1GB DDR4 RAM', mpn: 'MPN-NAN-DDR4-1G', qty: 1, manufacturer: 'Nanya', status: 'Approved', unitCost: 3.80 },
      { part: '4GB eMMC Flash', mpn: 'MPN-KIO-EMMC-4G', qty: 1, manufacturer: 'Kioxia', status: 'Approved', unitCost: 2.10 },
      { part: '2.4GHz/5GHz/6GHz FEM Modules', mpn: 'MPN-QOR-FEM-6E', qty: 3, manufacturer: 'Qorvo', status: 'Testing', unitCost: 9.60 },
      { part: 'Dual Gigabit Ethernet PHY', mpn: 'MPN-RTL-8211FS', qty: 2, manufacturer: 'Realtek', status: 'Approved', unitCost: 2.40 },
      { part: 'Custom Omni-directional Antenna Array', mpn: 'MPN-AMP-ANT-TR', qty: 1, manufacturer: 'Amphenol', status: 'Approved', unitCost: 5.50 }
    ],
    suppliers: [
      { name: 'Qualcomm', rating: '99%', risk: 'Low', location: 'USA' },
      { name: 'Qorvo', rating: '93%', risk: 'Medium', location: 'USA' },
      { name: 'Amphenol', rating: '96%', risk: 'Low', location: 'USA/China' }
    ],
    cost: { targetBOM: '$55.00', currentEstimates: '$41.90', variance: '-$13.10 (-23.8%)' },
    variants: [
      { sku: 'GOO-NWF-US-SNO-1PK', region: 'US', color: 'Snow', memory: 'N/A', channel: 'Retail' },
      { sku: 'GOO-NWF-US-SNO-2PK', region: 'US', color: 'Snow', memory: 'N/A', channel: 'Retail' },
      { sku: 'GOO-NWF-UK-SNO-1PK', region: 'UK', color: 'Snow', memory: 'N/A', channel: 'Online' },
      { sku: 'GOO-NWF-JP-SNO-2PK', region: 'JP', color: 'Snow', memory: 'N/A', channel: 'Retail' },
      { sku: 'GOO-NWF-ROW-SNO-1PK', region: 'ROW', color: 'Snow', memory: 'N/A', channel: 'Online' }
    ]
  }
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [bomData, setBomData] = useState(INITIAL_BOM_DATA);

  const addProduct = (product, details) => {
    setProducts(prev => [...prev, product]);
    setBomData(prev => ({ ...prev, [product.id]: details }));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setBomData(prev => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
  };

  const [isReviewing, setIsReviewing] = useState({});

  const reviewBOM = async (productId) => {
    if (!bomData[productId]) return;
    
    setIsReviewing(prev => ({ ...prev, [productId]: true }));
    
    try {
      const currentBom = bomData[productId].bom;
      const reviewedBom = await Promise.all(
        currentBom.map(async (item) => {
          // Send the generic part name/description to Nexar to find alternate recommendations
          const searchTerm = item.part.split(' ').slice(0, 3).join(' '); // Use first 3 words to broaden search
          const recommendations = await getAlternateRecommendations(searchTerm);
          
          return {
            ...item,
            recommendations: recommendations || []
          };
        })
      );

      setBomData(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          bom: reviewedBom,
          lastReviewed: new Date().toISOString()
        }
      }));
    } catch (e) {
      console.error("Failed to review BOM via Nexar", e);
    } finally {
      setIsReviewing(prev => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <ProductContext.Provider value={{ products, bomData, addProduct, deleteProduct, reviewBOM, isReviewing }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
