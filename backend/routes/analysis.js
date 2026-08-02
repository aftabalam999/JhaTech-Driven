import express from 'express';
import BusinessAnalysis from '../models/BusinessAnalysis.js';
import { generateBusinessReport } from '../services/aiService.js';
import { getDbStatus } from '../config/db.js';

const router = express.Router();

// Local store fallback if MongoDB is not running
const inMemoryAnalyses = [];

router.post('/', async (req, res) => {
  try {
    const { ownerName, businessName, businessType, phone, challenges, customChallenges, digitalPresence } = req.body;
    
    if (!ownerName || !businessName || !businessType || !phone) {
      return res.status(400).json({ error: 'Please provide all required business details.' });
    }
    
    const report = await generateBusinessReport(
      ownerName,
      businessName,
      businessType,
      challenges || [],
      customChallenges || '',
      digitalPresence || 'None'
    );
    
    const analysisData = {
      ownerName,
      businessName,
      businessType,
      phone,
      challenges: challenges || [],
      customChallenges: customChallenges || '',
      digitalPresence: digitalPresence || 'None',
      aiReport: report,
      createdAt: new Date()
    };
    
    if (getDbStatus()) {
      const newAnalysis = new BusinessAnalysis(analysisData);
      await newAnalysis.save();
      return res.status(201).json(newAnalysis);
    } else {
      const mockDoc = { _id: 'mock_an_' + Date.now(), ...analysisData };
      inMemoryAnalyses.push(mockDoc);
      return res.status(201).json({
        ...mockDoc,
        _dbWarning: true
      });
    }
  } catch (error) {
    console.error('Error in pain point analysis endpoint:', error);
    res.status(500).json({ error: 'Failed to complete analysis. Please try again.' });
  }
});

router.get('/', async (req, res) => {
  try {
    if (getDbStatus()) {
      const list = await BusinessAnalysis.find().sort({ createdAt: -1 }).limit(10);
      res.json(list);
    } else {
      res.json([...inMemoryAnalyses].reverse().slice(0, 10));
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve analyses.' });
  }
});

export default router;
