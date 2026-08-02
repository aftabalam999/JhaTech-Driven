import mongoose from 'mongoose';

const competitorAnalysisSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
  },
  businessType: {
    type: String,
    required: true,
  },
  competitorNames: {
    type: [String],
    default: [],
  },
  swotAnalysis: {
    strengths: [String],
    weaknesses: [String],
    opportunities: [String],
    threats: [String],
  },
  recommendedFeatures: [
    {
      featureName: String,
      description: String,
      marketTrendDriver: String, // e.g. "Virtual try-ons", "Instant checkout"
      complexity: String, // Low, Medium, High
    }
  ],
  marketTrends: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('CompetitorAnalysis', competitorAnalysisSchema);
