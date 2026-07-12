// ============================================
// ملف: server.js
// نقطة الدخول الرئيسية
// ============================================

// --- استيراد المكتبات ---
import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';

// --- استيراد الملفات المحلية ---
import User from './models/User.js';
import Queue from './models/Queue.js';
import auth from './middleware/auth.js';
import checkSubscription from './middleware/checkSubscription.js';

// ============================================
// الخطوة 1: تحميل متغيرات البيئة
// ============================================
dotenv.config();

// ============================================
// الخطوة 2: الاتصال بـ MongoDB
// ============================================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    
    // تشغيل السيرفر بعد الاتصال
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Error:', err);
    process.exit(1);
  });

// ============================================
// الخطوة 3: إنشاء التطبيق
// ============================================
const app = express();
const server = http.createServer(app);

// ============================================
// الخطوة 4: إعداد Socket.io
// ============================================
// FRONTEND_URL: رابط الفرونت اند بعد النشر (مثال: https://dorck.vercel.app)
// محلياً بنقبل أي origin (*) عشان التطوير يكون سهل
const allowedOrigin = process.env.FRONTEND_URL || '*';

const io = new Server(server, {
  cors: { origin: allowedOrigin }
});

// ============================================
// الخطوة 5: Middleware
// ============================================
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// ⬇️⬇️⬇️  حذفنا هذا السطر اللي يسبب المشكلة  ⬇️⬇️⬇️
// app.use('/api/queue', queueRoutes);  // ← ما فيه queueRoutes!

// جعل io متاح للـ Routes
app.set('io', io);

// ============================================
// الخطوة 6: دالة JWT
// ============================================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ============================================
// الخطوة 7: Routes
// ============================================

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'نظام دورك يعمل! 🇸🇦' });
});

// --- حالة الاشتراك/التجربة المجانية (لصاحب المحل) ---
app.get('/api/auth/subscription', auth, async (req, res) => {
  try {
    const sub = req.user.subscription || {};
    const trialEndsAt = sub.trialEndsAt ? new Date(sub.trialEndsAt) : null;
    const now = new Date();

    const msLeft = trialEndsAt ? trialEndsAt - now : 0;
    const daysLeft = Math.ceil(msLeft / (24 * 60 * 60 * 1000));

    const isExpired = sub.status !== 'active' && (!trialEndsAt || now >= trialEndsAt);

    res.json({
      success: true,
      status: sub.status || 'trial',
      trialEndsAt,
      daysLeft: Math.max(0, daysLeft),
      isExpired,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- تسجيل محل جديد ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, phone, shopName, shopType, city, password } = req.body;

    if (!name || !phone || !shopName || !city || !password) {
      return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
    }

    const existingUser = await User.findOne({ 'shopOwner.phone': phone });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'رقم الجوال مسجل مسبقاً' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      shopOwner: { name, phone, shopName, shopType, city },
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.shopOwner.name,
        shopName: user.shopOwner.shopName,
        phone: user.shopOwner.phone,
      },
      message: 'تم التسجيل! 14 يوم تجربة مجانية'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- تسجيل الدخول ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ success: false, message: 'البيانات ناقصة' });
    }

    const user = await User.findOne({ 'shopOwner.phone': phone });
    if (!user) {
      return res.status(400).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.shopOwner.name,
        shopName: user.shopOwner.shopName,
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- إضافة زبون للدور ---
app.post('/api/queue/join', async (req, res) => {
  try {
    const { shopId, name, phone, serviceType = 'عام', priority = 'normal' } = req.body;

    if (!shopId || !name || !phone) {
      return res.status(400).json({ success: false, message: 'البيانات ناقصة' });
    }

    // التحقق من المحل
    const shop = await User.findById(shopId);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'المحل غير موجود' });
    }

    // عدد المنتظرين حالياً (يحدد موقعك بالطابور)
    const waitingCount = await Queue.countDocuments({ shopId, status: 'waiting' });

    // ⬇️ إجمالي كل التذاكر اللي طلعت لهذا المحل من الأول (بكل الحالات)
    // نستخدم هذا الرقم لتوليد رقم التذكرة عشان ما يتكرر أبداً حتى لو
    // الزبون الأول خلص دوره وصار عدد المنتظرين صفر
    const totalCount = await Queue.countDocuments({ shopId });

    // إنشاء رقم التذكرة
    const ticketNumber = `A${String(totalCount + 1).padStart(3, '0')}`;

    // إنشاء الدور
    const queue = await Queue.create({
      shopId,
      shopName: shop.shopOwner?.shopName || 'المحل',
      customer: { name, phone, ticketNumber, serviceType, priority },
      status: 'waiting',
      initialPosition: waitingCount + 1,
      timestamps: { joinedAt: new Date() }
    });

    // إرسال إشعار فوري
    io.to(shopId).emit('queue-update', {
      type: 'new-ticket',
      ticketNumber,
      position: waitingCount + 1,
    });

    res.status(201).json({
      success: true,
      ticketNumber,
      position: waitingCount + 1,
      estimatedWait: (waitingCount + 1) * 5,
      queueId: queue._id,
      shopName: queue.shopName,
      customer: queue.customer,
      message: 'تم التسجيل بنجاح'
    });

  } catch (error) {
    console.error('Join error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- متابعة التذكرة (للزبون) - بالمعرّف الفريد queueId ---
// ملاحظة: نستخدم الـ _id الفريد من MongoDB بدل رقم التذكرة (A001, A002..)
// لأن رقم التذكرة يتكرر بين المحلات المختلفة (كل محل يبدأ ترقيمه من A001)
app.get('/api/queue/status/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Queue.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'التذكرة غير موجودة' });
    }

    const ahead = await Queue.countDocuments({
      shopId: ticket.shopId,
      status: 'waiting',
      'timestamps.joinedAt': { $lt: ticket.timestamps.joinedAt }
    });

    const totalWaiting = await Queue.countDocuments({
      shopId: ticket.shopId,
      status: 'waiting'
    });

    res.json({
      success: true,
      ticketNumber: ticket.customer.ticketNumber,
      name: ticket.customer.name,
      shopId: ticket.shopId,
      shopName: ticket.shopName,
      serviceType: ticket.customer.serviceType,
      position: ahead + 1,
      totalWaiting,
      initialPosition: ticket.initialPosition,
      status: ticket.status,
      counter: ticket.counter,
      estimatedWait: (ahead + 1) * 5,
      joinedAt: ticket.timestamps.joinedAt
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- متابعة التذكرة (للزبون) - القديمة، محتفظين فيها للتوافق فقط ---
app.get('/api/queue/ticket/:ticketNumber', async (req, res) => {
  try {
    const { ticketNumber } = req.params;

    const ticket = await Queue.findOne({ 'customer.ticketNumber': ticketNumber });
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'التذكرة غير موجودة' });
    }

    // حساب الموقع الحالي
    const ahead = await Queue.countDocuments({
      shopId: ticket.shopId,
      status: 'waiting',
      'timestamps.joinedAt': { $lt: ticket.timestamps.joinedAt }
    });

    // إجمالي عدد المنتظرين حالياً في نفس المحل
    const totalWaiting = await Queue.countDocuments({
      shopId: ticket.shopId,
      status: 'waiting'
    });

    res.json({
      success: true,
      ticketNumber: ticket.customer.ticketNumber,
      name: ticket.customer.name,
      shopName: ticket.shopName,
      serviceType: ticket.customer.serviceType,
      position: ahead + 1,
      totalWaiting,
      initialPosition: ticket.initialPosition,
      status: ticket.status,
      counter: ticket.counter,
      estimatedWait: (ahead + 1) * 5,
      joinedAt: ticket.timestamps.joinedAt
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- نداء التالي ---
app.post('/api/queue/call-next', auth, checkSubscription, async (req, res) => {
  try {
    const { shopId, counter = 1 } = req.body;

    const next = await Queue.findOne({ shopId, status: 'waiting' })
      .sort({ 'timestamps.joinedAt': 1 });

    if (!next) {
      io.to(shopId).emit('queue-update', { type: 'queue-empty', counter });
      return res.json({ success: true, empty: true, message: 'لا يوجد زبائن' });
    }

    next.status = 'called';
    next.counter = counter;
    next.timestamps.calledAt = new Date();
    await next.save();

    io.to(shopId).emit('queue-update', {
      type: 'ticket-called',
      ticketNumber: next.customer.ticketNumber,
      customerName: next.customer.name,
      counter,
    });

    res.json({
      success: true,
      ticket: {
        ticketNumber: next.customer.ticketNumber,
        name: next.customer.name,
        serviceType: next.customer.serviceType,
        counter,
      },
      message: `تم نداء ${next.customer.name}`
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- إكمال الدور ---
app.post('/api/queue/complete/:id', auth, checkSubscription, async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) {
      return res.status(404).json({ success: false, message: 'الدور غير موجود' });
    }

    queue.status = 'completed';
    queue.timestamps.completedAt = new Date();
    await queue.save();

    // إشعار فوري لصاحب المحل (تحديث لوحة التحكم)
    io.to(queue.shopId).emit('queue-update', {
      type: 'ticket-completed',
      ticketNumber: queue.customer.ticketNumber,
    });

    res.json({ success: true, message: 'تم إكمال الدور' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- تخطي الزبون (كان ناقص بالكامل، مضاف الآن) ---
app.post('/api/queue/skip', auth, checkSubscription, async (req, res) => {
  try {
    const { ticketId } = req.body;

    const ticket = await Queue.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'التذكرة غير موجودة' });
    }

    ticket.status = 'skipped';
    ticket.timestamps.completedAt = new Date();
    await ticket.save();

    io.to(ticket.shopId).emit('queue-update', {
      type: 'ticket-skipped',
      ticketNumber: ticket.customer.ticketNumber,
    });

    res.json({ success: true, message: 'تم تخطي الزبون' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- قائمة الانتظار ---
app.get('/api/queue/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;

    const queues = await Queue.find({ shopId, status: 'waiting' })
      .sort({ 'timestamps.joinedAt': 1 });

    res.json({
      success: true,
      total: queues.length,
      queues: queues.map(q => ({
        id: q._id,
        name: q.customer.name,
        phone: q.customer.phone,
        ticketNumber: q.customer.ticketNumber,
        serviceType: q.customer.serviceType,
        priority: q.customer.priority,
        joinedAt: q.timestamps.joinedAt
      }))
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- إحصائيات ---
app.get('/api/queue/stats/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;

    const [waiting, completed, skipped, totalToday] = await Promise.all([
      Queue.countDocuments({ shopId, status: 'waiting' }),
      Queue.countDocuments({ shopId, status: 'completed' }),
      Queue.countDocuments({ shopId, status: 'skipped' }),
      Queue.countDocuments({ shopId }),
    ]);

    res.json({ success: true, waiting, completed, skipped, totalToday });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- سجل النداءات ---
app.get('/api/queue/history/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;

    const history = await Queue.find({ 
      shopId, 
      status: { $in: ['completed', 'skipped'] }
    })
    .sort({ 'timestamps.completedAt': -1 })
    .limit(50);

    res.json({
      success: true,
      history: history.map(h => ({
        id: h._id,
        ticketNumber: h.customer.ticketNumber,
        customerName: h.customer.name,
        status: h.status,
        counter: h.counter,
        calledAt: h.timestamps.calledAt,
        completedAt: h.timestamps.completedAt,
        waitTime: h.timestamps.calledAt && h.timestamps.joinedAt 
          ? Math.round((h.timestamps.calledAt - h.timestamps.joinedAt) / 60000) 
          : 0
      }))
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// الخطوة 8: Socket.io Events
// ============================================
io.on('connection', (socket) => {
  console.log(`🔌 Client متصل: ${socket.id}`);
  
  socket.on('join-shop', (shopId) => {
    socket.join(shopId);
    console.log(`Socket ${socket.id} انضم للمحل ${shopId}`);
  });
  
  socket.on('leave-shop', (shopId) => {
    socket.leave(shopId);
  });
  
  socket.on('disconnect', () => {
    console.log(`🔌 Client انفصل: ${socket.id}`);
  });
});