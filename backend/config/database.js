// ============================================
// ملف: config/database.js
// الغرض: الاتصال بقاعدة بيانات MongoDB
// ============================================

// استيراد مكتبة Mongoose
// Mongoose = ODM (Object Document Mapper)
// تترجم بين JavaScript Objects و MongoDB Documents
import mongoose from 'mongoose';

// ============================================
// دالة الاتصال — async/await
// ============================================
export const connectDB = async () => {
  try {
    // process.env = متغيرات البيئة (من ملف .env)
    // MONGODB_URI = رابط الاتصال بقاعدة البيانات
    const uri = process.env.MONGODB_URI;

    console.log('🔌 جاري الاتصال بقاعدة البيانات...');
    console.log('📍 الرابط:', uri.replace(/:([^@]+)@/, ':****@')); // نخفي الباسورد

    // ==========================================
    // الاتصال بـ MongoDB — مرة واحدة فقط!
    // ==========================================
    // await = انتظر حتى يكتمل الاتصال
    // mongoose.connect() = يفتح قناة اتصال مع MongoDB
    const conn = await mongoose.connect(uri);

    // conn.connection.host = عنوان السيرفر المتصل
    console.log(`✅ تم الاتصال بنجاح: ${conn.connection.host}`);
    console.log(`📊 قاعدة البيانات: ${conn.connection.name}`);

  } catch (error) {
    // catch = لو فشل الاتصال
    console.error(`❌ فشل الاتصال: ${error.message}`);

    // نرمي الخطأ للأعلى — السيرفر يتوقف
    // (لأن بدون قاعدة بيانات النظام ما يشتغل)
    throw error;
  }
};