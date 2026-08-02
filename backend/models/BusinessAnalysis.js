import mongoose from 'mongoose';

const businessAnalysisSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: true,
  },
  businessName: {
    type: String,
    required: true,
  },
  businessType: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  challenges: {
    type: [String],
    default: [],
  },
  customChallenges: {
    type: String,
    default: '',
  },
  digitalPresence: {
    type: String,
    default: 'None',
  },
  aiReport: {
    summary: String,
    websiteRecommendations: [
      {
        featureName: String,
        description: String,
        priority: String, // High, Medium, Low
        valueAdd: String,
      }
    ],
    marketingStrategy: [
      {
        channel: String,
        tactic: String,
        roiExpectation: String,
      }
    ],
    estimatedCosts: {
      websiteDevelopment: Number,
      monthlyMarketing: Number,
    },
    nextSteps: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('BusinessAnalysis', businessAnalysisSchema);
