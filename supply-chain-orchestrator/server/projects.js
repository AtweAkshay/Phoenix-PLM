const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

// Helper function to read data from db.json
const readDb = () => {
  const dbJson = fs.readFileSync(dbPath);
  return JSON.parse(dbJson);
};

// Helper function to write data to db.json
const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Get all projects
router.get('/', (req, res) => {
  const db = readDb();
  res.json(db.projects);
});

// Create a new project
router.post('/', (req, res) => {
  const db = readDb();
  const newProject = {
    id: Date.now(),
    name: req.body.name,
    brd: '',
    bom: [],
  };
  db.projects.push(newProject);
  writeDb(db);
  res.status(201).json(newProject);
});

// Mock BOM generation logic
const generateBom = (brd) => {
    const bom = [];
    const keywords = {
        'display': { name: 'Display', cost: 100 },
        'semiconductor': { name: 'Semiconductor', cost: 50 },
        'memory': { name: 'Memory', cost: 30 },
        'housing': { name: 'Housing', cost: 40 },
        'software': { name: 'Software License', cost: 1000 }
    };

    for (const keyword in keywords) {
        if (brd.toLowerCase().includes(keyword)) {
            bom.push({
                item: keywords[keyword].name,
                quantity: 1,
                cost: keywords[keyword].cost
            });
        }
    }
    return bom;
};

// Add/Update BRD and generate BOM
router.post('/:id/brd', (req, res) => {
    const db = readDb();
    const project = db.projects.find(p => p.id === parseInt(req.params.id));
    if (!project) {
        return res.status(404).send('Project not found');
    }

    project.brd = req.body.brd;
    project.bom = generateBom(project.brd);
    writeDb(db);

    res.json(project);
});

// Simulate EMS collaboration
router.post('/:id/ems', (req, res) => {
    const db = readDb();
    const project = db.projects.find(p => p.id === parseInt(req.params.id));
    if (!project) {
        return res.status(404).send('Project not found');
    }

    // Simulate a finalized BOM from EMS
    project.finalizedBom = project.bom.map(item => ({
        ...item,
        cost: item.cost * 1.1 // Increase cost by 10%
    }));

    writeDb(db);
    res.json(project);
});

// Generate purchase orders from forecast
router.post('/:id/forecast', (req, res) => {
    const db = readDb();
    const project = db.projects.find(p => p.id === parseInt(req.params.id));
    if (!project) {
        return res.status(404).send('Project not found');
    }

    const forecast = req.body.forecast;
    if (!forecast) {
        return res.status(400).send('Forecast is required');
    }

    // Generate mock purchase orders
    project.purchaseOrders = project.finalizedBom.map(item => ({
        item: item.item,
        quantity: item.quantity * forecast,
        totalCost: item.cost * forecast
    }));

    project.status = 'In Production';
    writeDb(db);
    res.json(project);
});

module.exports = router;
