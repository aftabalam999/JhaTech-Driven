import express from 'express';
import Partner from '../models/Partner.js';
import { getPartnerAnswer } from '../services/aiService.js';
import { getDbStatus } from '../config/db.js';

const router = express.Router();

// Memory store fallback if MongoDB is not running
const inMemoryPartners = {};

const generateReferralCode = (name) => {
  const prefix = name.replace(/\s+/g, '').toUpperCase().slice(0, 4);
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randNum}`;
};

// Google Auth login check
router.post('/google-login', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required for Google login.' });
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    
    if (getDbStatus()) {
      const partner = await Partner.findOne({ email: normalizedEmail });
      if (partner) {
        return res.json({ exists: true, partner });
      } else {
        return res.json({ exists: false, email: normalizedEmail, name });
      }
    } else {
      const partner = Object.values(inMemoryPartners).find(p => p.email.toLowerCase() === normalizedEmail);
      if (partner) {
        return res.json({ exists: true, partner });
      } else {
        return res.json({ exists: false, email: normalizedEmail, name });
      }
    }
  } catch (error) {
    console.error('Google check error:', error);
    res.status(500).json({ error: 'Failed to authenticate Google account.' });
  }
});

// Register referral partner
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, upiId } = req.body;
    if (!name || !phone || !upiId) {
      return res.status(400).json({ error: 'Name, phone number, and UPI ID are required to join.' });
    }
    
    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    
    // Check for duplicate email
    if (normalizedEmail) {
      if (getDbStatus()) {
        const existing = await Partner.findOne({ email: normalizedEmail });
        if (existing) {
          return res.status(400).json({ error: 'A partner with this email is already registered.' });
        }
      } else {
        const existing = Object.values(inMemoryPartners).find(p => p.email.toLowerCase() === normalizedEmail);
        if (existing) {
          return res.status(400).json({ error: 'A partner with this email is already registered.' });
        }
      }
    }
    
    const referralCode = generateReferralCode(name);
    const partnerData = {
      name,
      phone,
      email: normalizedEmail,
      upiId,
      referralCode,
      referredSales: [],
      totalEarnings: 0,
      createdAt: new Date()
    };
    
    if (getDbStatus()) {
      const newPartner = new Partner(partnerData);
      await newPartner.save();
      return res.status(201).json(newPartner);
    } else {
      inMemoryPartners[referralCode] = { _id: 'mock_pt_' + Date.now(), ...partnerData };
      return res.status(201).json({
        ...inMemoryPartners[referralCode],
        _dbWarning: true
      });
    }
  } catch (error) {
    console.error('Partner register error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Retrieve partner status
router.get('/:referralCode', async (req, res) => {
  try {
    const { referralCode } = req.params;
    const cleanCode = referralCode.toUpperCase();
    
    if (getDbStatus()) {
      const partner = await Partner.findOne({ referralCode: cleanCode });
      if (!partner) {
        return res.status(404).json({ error: 'Partner not found with this code.' });
      }
      return res.json(partner);
    } else {
      const partner = inMemoryPartners[cleanCode];
      if (!partner) {
        return res.status(404).json({ error: 'Partner not found with this code.' });
      }
      return res.json(partner);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to load partner dashboard.' });
  }
});

// Partner chat AI Advisor
router.post('/query', async (req, res) => {
  try {
    const { partnerName, query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Please enter a message.' });
    }
    
    const response = await getPartnerAnswer(partnerName || 'Partner', query);
    res.json({ answer: response });
  } catch (error) {
    console.error('AI Bot query failure:', error);
    res.status(500).json({ error: 'Partner AI Support encountered an error.' });
  }
});

// Simulate a referral sale to test the ₹1,000 earning feature
router.post('/:referralCode/sale', async (req, res) => {
  try {
    const { referralCode } = req.params;
    const { businessName } = req.body;
    const cleanCode = referralCode.toUpperCase();
    
    if (!businessName) {
      return res.status(400).json({ error: 'Business name is required to log a sale.' });
    }
    
    const newSale = {
      businessName,
      status: 'Completed',
      saleAmount: 15000,
      payoutAmount: 1000,
      payoutStatus: 'Paid',
      dateAdded: new Date()
    };
    
    if (getDbStatus()) {
      const partner = await Partner.findOne({ referralCode: cleanCode });
      if (!partner) {
        return res.status(404).json({ error: 'Partner not found.' });
      }
      partner.referredSales.push(newSale);
      partner.totalEarnings += 1000;
      await partner.save();
      return res.json(partner);
    } else {
      const partner = inMemoryPartners[cleanCode];
      if (!partner) {
        return res.status(404).json({ error: 'Partner not found.' });
      }
      partner.referredSales.push({ _id: 'sale_' + Date.now(), ...newSale });
      partner.totalEarnings += 1000;
      return res.json(partner);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to register sale.' });
  }
});

// Update partner UPI ID
router.put('/:referralCode/upi', async (req, res) => {
  try {
    const { referralCode } = req.params;
    const { upiId } = req.body;
    const cleanCode = referralCode.toUpperCase();
    
    if (!upiId) {
      return res.status(400).json({ error: 'UPI ID is required.' });
    }
    
    if (getDbStatus()) {
      const partner = await Partner.findOne({ referralCode: cleanCode });
      if (!partner) {
        return res.status(404).json({ error: 'Partner profile not found.' });
      }
      partner.upiId = upiId;
      await partner.save();
      return res.json(partner);
    } else {
      const partner = inMemoryPartners[cleanCode];
      if (!partner) {
        return res.status(404).json({ error: 'Partner profile not found.' });
      }
      partner.upiId = upiId;
      return res.json(partner);
    }
  } catch (error) {
    console.error('Failed to update UPI ID:', error);
    res.status(500).json({ error: 'Failed to update UPI ID. Please try again.' });
  }
});

export default router;
