// ============================================
// ملف: Join.jsx
// ============================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_URL } from '../config.js';
import {
  QrCode, User, Phone, ArrowLeft, CheckCircle,
  Store, MapPin
} from 'lucide-react';

const Join = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceType: 'عام',
    priority: 'normal'
  });
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // التحقق من shopId
  useEffect(() => {
    console.log('shopId from URL:', shopId);
    if (!shopId) {
      setError('رابط غير صحيح - لا يوجد معرف للمحل');
    }
  }, [shopId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!shopId) {
      setError('رابط المحل غير صحيح - لا يمكن التسجيل');
      return;
    }
    
    // التحقق من البيانات
    if (!formData.name.trim()) {
      setError('الاسم مطلوب');
      return;
    }
    
    if (!formData.phone.trim()) {
      setError('رقم الجوال مطلوب');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      console.log('Sending data:', { shopId, ...formData });
      
      const res = await axios.post(
        `${API_URL}/api/queue/join`,
        {
          shopId: shopId,
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          serviceType: formData.serviceType,
          priority: formData.priority
        }
      );

      console.log('Response:', res.data);

      if (res.data.success) {
        setTicket(res.data);
        setStep('success');
        
        // ⬇️⬇️⬇️  الانتقال لصفحة التذكرة بعد 2 ثانية  ⬇️⬇️⬇️
        setTimeout(() => {
          navigate(`/ticket/${res.data.queueId}`, { 
            state: { 
              ticketData: res.data,
              customerData: formData 
            } 
          });
        }, 2000);
      }

    } catch (error) {
      console.error('Join error:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('form');
    setFormData({
      name: '',
      phone: '',
      serviceType: 'عام',
      priority: 'normal'
    });
    setTicket(null);
    setError('');
  };

  // ==========================================
  // شاشة النجاح (مؤقتة - قبل الانتقال)
  // ==========================================
  if (step === 'success' && ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-2">تم التسجيل بنجاح!</h2>
          <p className="text-slate-400 mb-8">جاري تحويلك لتذكرتك...</p>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">رقم تذكرتك</p>
            <h1 className="text-6xl font-black text-emerald-400 mb-4 tracking-widest">
              {ticket.ticketNumber}
            </h1>
            <div className="h-px bg-slate-700 my-4" />
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-slate-500">موقعك</p>
                <p className="text-2xl font-bold text-white">#{ticket.position}</p>
              </div>
              <div>
                <p className="text-slate-500">الانتظار</p>
                <p className="text-2xl font-bold text-blue-400">~{ticket.estimatedWait}د</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // نموذج الانضمام (Form)
  // ==========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* شعار المحل */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
              <QrCode className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">انضم للدور</h1>
            <p className="text-slate-400">املأ بياناتك للحصول على رقم الدور</p>
            
            {/* معلومات المحل */}
            {shopId && (
              <div className="mt-3 flex items-center justify-center gap-2 text-emerald-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>محل: {shopId.substring(0, 8)}...</span>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-8 space-y-5"
          >
            {/* رسالة الخطأ */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {/* حقل: الاسم */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                الاسم <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute right-3 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3.5 pr-10 pl-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  placeholder="محمد أحمد"
                  dir="rtl"
                />
              </div>
            </div>

            {/* حقل: رقم الجوال */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                رقم الجوال <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="tel"
                  required
                  pattern="05[0-9]{8}"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3.5 pr-10 pl-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                سنستخدمه للإشعارات عندما يحين دورك
              </p>
            </div>

            {/* صف: نوع الخدمة + الأولوية */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* نوع الخدمة */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  نوع الخدمة
                </label>
                <select
                  value={formData.serviceType}
                  onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value="عام">عام</option>
                  <option value="استشارة">استشارة</option>
                  <option value="صيانة">صيانة</option>
                  <option value="استلام">استلام</option>
                </select>
              </div>

              {/* الأولوية */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  الأولوية
                </label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value="normal">عادي</option>
                  <option value="vip">VIP ⭐</option>
                  <option value="elderly">كبار سن 👴</option>
                  <option value="disabled">ذوي احتياجات ♿</option>
                </select>
              </div>
            </div>

            {/* زر الإرسال */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري التسجيل...
                </>
              ) : (
                <>
                  <span>الحصول على رقم الدور</span>
                  <ArrowLeft className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* الشعار السفلي */}
          <p className="text-center text-slate-500 text-sm mt-6">
            <Store className="w-4 h-4 inline ml-1" />
            مدعوم بنظام دورك - راحة الزبائن أولاً
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Join;