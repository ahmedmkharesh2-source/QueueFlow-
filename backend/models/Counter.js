import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  shopId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  counterNumber: { type: Number, required: true },
  name: { type: String, default: 'شاشة رئيسية' },
  isActive: { type: Boolean, default: true },
  currentTicket: { type: String, default: null },
  currentCustomer: String,
  lastCalledAt: Date,
  totalServed: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

counterSchema.index({ shopId: 1, counterNumber: 1 }, { unique: true });

export default mongoose.model('Counter', counterSchema);