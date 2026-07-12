import mongoose from 'mongoose';

const queueSchema = new mongoose.Schema({
  shopId: {
    type: String,  // ← String (مو ObjectId)
    required: true,
    index: true
  },
  shopName: {
    type: String,
    default: 'المحل'
  },
  customer: {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    phone: { 
      type: String, 
      required: true,
      trim: true
    },
    ticketNumber: { 
      type: String, 
      required: true
      // ⬇️ شلنا unique: true من هنا لأنه كان يسبب مشكلة تكرار الرقم بين الأدوار
      // بعد ما ينادى على الزبون الأول، العداد يرجع صفر ويطلع نفس الرقم A001
      // مرة ثانية، وبما إنه unique عالمي (بين كل المحلات كمان) كان يفشل الحفظ.
      // الحل: نخليه فريد بس ضمن نفس المحل (compound index تحت).
    },
    serviceType: { 
      type: String, 
      default: 'عام',
      enum: ['عام', 'استشارة', 'صيانة', 'استلام', 'VIP']
    },
    priority: { 
      type: String, 
      default: 'normal',
      enum: ['normal', 'vip', 'elderly', 'disabled']
    },
  },
  status: { 
    type: String, 
    default: 'waiting',
    enum: ['waiting', 'called', 'completed', 'skipped']
  },
  initialPosition: {
    type: Number,
    default: 1
  },
  counter: {
    type: Number,
    default: 1
  },
  timestamps: {
    joinedAt: { type: Date, default: Date.now },
    calledAt: Date,
    completedAt: Date,
  },
});

// Index للبحث السريع
queueSchema.index({ shopId: 1, status: 1 });

// ⬇️ رقم التذكرة فريد بس ضمن نفس المحل (مو بين كل المحلات)
queueSchema.index({ shopId: 1, 'customer.ticketNumber': 1 }, { unique: true });

export default mongoose.model('Queue', queueSchema);