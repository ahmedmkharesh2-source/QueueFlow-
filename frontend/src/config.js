// ============================================
// ملف: config.js
// الغرض: رابط الـ API بشكل مرن (يشتغل محلياً + بعد النشر أونلاين)
// ============================================
// محلياً: يرجع http://localhost:5000 تلقائياً
// بعد النشر: حط متغير البيئة VITE_API_URL في إعدادات Vercel
// (مثال: https://dorck-backend.onrender.com)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
