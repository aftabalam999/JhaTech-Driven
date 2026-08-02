import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: '',
  },
  upiId: {
    type: String,
    required: true, // For processing the ₹1,000 commission payout
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
  },
  referredSales: [
    {
      businessName: String,
      status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending',
      },
      saleAmount: Number,
      payoutAmount: {
        type: Number,
        default: 1000, // Flat ₹1,000 commission
      },
      payoutStatus: {
        type: String,
        enum: ['Unpaid', 'Paid'],
        default: 'Unpaid',
      },
      dateAdded: {
        type: Date,
        default: Date.now,
      },
    }
  ],
  totalEarnings: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Partner', partnerSchema);
