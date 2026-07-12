import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // ⬇️⬇️⬇️  شل shopId اليدوي  ⬇️⬇️⬇️
  // shopId: { type: String, ... },  // ← احذف هذا
  
  shopOwner: {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    shopName: { type: String, required: true },
    shopType: { type: String, default: 'أخرى' },
    city: { type: String, required: true },
  },
  password: { type: String, required: true },
  subscription: {
    plan: { type: String, default: 'free' },
    status: { type: String, default: 'trial' },
    trialEndsAt: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  },
  createdAt: { type: Date, default: Date.now },
});

// ⬇️⬇️⬇️  أضف هذا - حوّل _id لـ String دائماً  ⬇️⬇️⬇️
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret._id = ret._id.toString();
    ret.id = ret._id.toString();
    delete ret.__v;
    delete ret.password;
    return ret;
  }
});

export default mongoose.model('User', userSchema);