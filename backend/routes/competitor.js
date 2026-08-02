import express from 'express';
import CompetitorAnalysis from '../models/CompetitorAnalysis.js';
import { generateCompetitorAnalysis } from '../services/aiService.js';
import { getDbStatus } from '../config/db.js';

const router = express.Router();

// Memory store fallback if MongoDB is not running
const inMemoryCompetitors = [];

router.post('/', async (req, res) => {
  try {
    const { businessName, businessType, competitorNames } = req.body;
    
    if (!businessName || !businessType) {
      return res.status(400).json({ error: 'Business name and business type are required.' });
    }
    
    // Convert to array if string comma-separated
    const comps = Array.isArray(competitorNames)
      ? competitorNames
      : (competitorNames ? competitorNames.split(',').map(s => s.trim()) : []);
      
    const analysis = await generateCompetitorAnalysis(businessName, businessType, comps);
    
    const analysisData = {
      businessName,
      businessType,
      competitorNames: comps,
      swotAnalysis: analysis.swotAnalysis,
      recommendedFeatures: analysis.recommendedFeatures,
      marketTrends: analysis.marketTrends,
      createdAt: new Date()
    };
    
    if (getDbStatus()) {
      const newAnalysis = new CompetitorAnalysis(analysisData);
      await newAnalysis.save();
      return res.status(201).json(newAnalysis);
    } else {
      const mockDoc = { _id: 'mock_comp_' + Date.now(), ...analysisData };
      inMemoryCompetitors.push(mockDoc);
      return res.status(201).json({
        ...mockDoc,
        _dbWarning: true
      });
    }
  } catch (error) {
    console.error('Error generating competitor analysis:', error);
    res.status(500).json({ error: 'Failed to generate competitor analysis. Please try again.' });
  }
});

router.get('/', async (req, res) => {
  try {
    if (getDbStatus()) {
      const list = await CompetitorAnalysis.find().sort({ createdAt: -1 }).limit(10);
      res.json(list);
    } else {
      res.json([...inMemoryCompetitors].reverse().slice(0, 10));
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch competitor analyses.' });
  }
});

export default router;
