// ============================================
// ملف: Ticket.jsx
// الغرض: صفحة الزبون لمتابعة تذكرته
// الرابط: /ticket/:queueId
// ============================================

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { SocketContext } from '../App.jsx';
import {
  Ticket, Clock, Users, Bell, Volume2,
  MapPin, ChevronRight, Share2, Printer,
  QrCode, ArrowLeft, RefreshCw, PartyPopper
} from 'lucide-react';

// ============================================
// مكوّن الاحتفال (ألعاب نارية / كونفيتي)
// ============================================
const Fireworks = () => {
  const colors = ['#34d399', '#fbbf24', '#f472b6', '#60a5fa', '#a78bfa', '#fb7185'];
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.2,
    duration: 2.5 + Math.random() * 1.5,
    color: colors[i % colors.length],
    size: 6 + Math.random() * 8,
    rotate: Math.random() * 360,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.left}vw`, opacity: 1, rotate: 0 }}
          animate={{
            y: '110vh',
            rotate: p.rotate + 360,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size * 0.4,
            backgroundColor: p.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
};

const TicketPage = () => {
  const { queueId } = useParams();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  const [ticket, setTicket] = useState(null);
  const [position, setPosition] = useState(null);
  const [status, setStatus] = useState('waiting');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [now, setNow] = useState(new Date());

  // ساعة حية تتحدث كل ثانية (مستقلة عن جلب البيانات من السيرفر)
  useEffect(() => {
    const clockInterval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);
  const prevStatusRef = React.useRef('waiting');

  // Polling (احتياطي) + تحديث فوري عبر Socket.io
  useEffect(() => {
    if (!queueId) return;
    
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/queue/status/${queueId}`);
        
        setTicket(res.data);
        setPosition(res.data.position);
        setStatus(res.data.status);
        setLastUpdated(new Date());

        // ننضم لغرفة المحل عشان نستقبل التحديثات الفورية بعد أول جلب ناجح
        if (socket && res.data.shopId) {
          socket.emit('join-shop', res.data.shopId);
        }
        
      } catch (error) {
        console.error('Error:', error);
        setError('التذكرة غير موجودة أو انتهت صلاحيتها');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatus();

    // فحص احتياطي كل 15 ثانية (fallback) بحال الـ Socket انقطع
    const interval = setInterval(() => {
      if (status !== 'completed') fetchStatus();
    }, 15000);

    // تحديث فوري لما يوصل حدث من صاحب المحل (نداء، تخطي، إكمال...)
    const handleSocketUpdate = () => {
      if (status !== 'completed') fetchStatus();
    };
    socket?.on('queue-update', handleSocketUpdate);

    return () => {
      clearInterval(interval);
      socket?.off('queue-update', handleSocketUpdate);
    };
  }, [queueId, status, socket]);

  // ⬇️ آثار جانبية (صوت + اهتزاز) بمكانها الصحيح، منفصلة تماماً عن تحديث الحالة
  // هذا يمنع أي تعارض أو انهيار صامت بالصفحة لما تتغير الحالة على أجهزة معينة
  useEffect(() => {
    if (status === 'called' && prevStatusRef.current !== 'called') {
      playNotificationSound(ticket);
      vibratePhone();
    }
    prevStatusRef.current = status;
  }, [status]);

  // اهتزاز الجوال (يدعمه أغلب متصفحات أندرويد؛ آيفون/سفاري ما يدعمه للأسف)
  const vibratePhone = () => {
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate([300, 100, 300, 100, 300]);
      }
    } catch (e) {}
  };

  // صوت الإشعار
  const playNotificationSound = (ticketData) => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVanu87plHQUuh9Dz2YU2Bhxpv+zplkcODVGm5O+4ZSAEMYrO89GFNwYdcfDr4ZdJDQtPp+XysWUeBjiS1/LNfi0GI33R8tOENAcdcO/r4phJDQxPp+XyxGUhBDeOzvPVhjYGHG3A7+SaSQ0MTKjl8bllHwU2jc7z1YU1Bxtw8OzhmUgNC1Ko5fG+ZSAF');
      audio.play().catch(() => {});
    } catch (e) {}
    
    // إشعار المتصفح — محاط بـ try/catch لأن Chrome على أندرويد يرفض
    // استدعاء new Notification() مباشرة بالصفحات العادية ويرمي خطأ
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('دورك!', {
          body: `تذكرة ${ticketData?.ticketNumber || ''} - اذهب إلى الكاونتر ${ticketData?.counter || 1}`,
          icon: '/logo.png'
        });
      }
    } catch (e) {
      console.warn('Browser notification not supported on this device:', e);
    }
  };

  // طلب إذن الإشعارات
  useEffect(() => {
    try {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    } catch (e) {}
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ticket className="w-10 h-10 text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">التذكرة غير موجودة</h2>
          <p className="text-slate-400 mb-8">{error || 'رقم التذكرة غير صحيح أو انتهت صلاحيتها'}</p>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 rounded-2xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <QrCode className="w-5 h-5" />
              <span>مسح QR جديد</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl transition border border-slate-700 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // شاشة "تمت خدمتك!" (اكتملت الخدمة) 🎉
  // ==========================================
  if (status === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative">
        <Fireworks />
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14 }}
          className="text-center max-w-md w-full relative z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, -8, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/50"
          >
            <PartyPopper className="w-16 h-16 text-white" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-black text-white mb-3"
          >
            تمت خدمتك! 🎉
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-emerald-300 text-lg mb-8"
          >
            شكراً لك، نتمنى نشوفك قريباً في {ticket.shopName || 'المحل'}
          </motion.p>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate('/')}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 rounded-2xl transition shadow-lg shadow-emerald-500/20"
          >
            العودة للرئيسية
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // شاشة "تم تخطي دورك" (skipped)
  // ==========================================
  if (status === 'skipped') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md w-full"
        >
          <div className="w-28 h-28 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="w-14 h-14 text-amber-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">تم تخطي دورك</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            يبدو إنك ما كنت موجود وقت النداء عليك. توجه لموظف الاستقبال في {ticket.shopName || 'المحل'} أو سجّل من جديد للحصول على رقم جديد.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 rounded-2xl transition shadow-lg shadow-emerald-500/20"
          >
            تسجيل من جديد
          </button>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // شاشة "دورك الآن!" (تم النداء)
  // ==========================================
  if (status === 'called') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="text-center max-w-md w-full"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/50"
          >
            <Volume2 className="w-16 h-16 text-white" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-black text-white mb-4"
          >
            دورك الآن!
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-400 text-xl mb-8"
          >
            تذكرة رقم {ticket?.ticketNumber}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mb-6"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin className="w-8 h-8 text-emerald-400" />
              <span className="text-3xl font-bold text-white">كاونتر {ticket.counter || 1}</span>
            </div>
            <p className="text-slate-400">توجه إلى الكاونتر فوراً</p>
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate('/')}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 rounded-2xl transition shadow-lg shadow-emerald-500/20"
          >
            تم - شكراً
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // شاشة التذكرة (انتظار)
  // ==========================================
  const isNear = position <= 3;
  const isOneAway = position === 2; // باقي واحد بس قبلك
  const progress = Math.max(0, Math.min(100, ((ticket.initialPosition - position) / ticket.initialPosition) * 100));

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* شريط الحالة العلوي */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isNear ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-slate-300 text-sm font-medium">
              {isNear ? '⚡ اقترب دورك!' : '✓ في الانتظار'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs">
              {now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <button
              onClick={() => window.location.reload()}
              className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* التذكرة الرئيسية */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-emerald-900/50"
        >
          {/* تأثيرات خلفية */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

          {/* QR صغير */}
          <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-xl p-2 shadow-lg">
            <QrCode className="w-full h-full text-slate-900" />
          </div>

          {/* رقم التذكرة */}
          <div className="text-center relative z-10 pt-8">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-emerald-100 text-sm mb-2 font-medium"
            >
              رقم تذكرتك
            </motion.p>
            <motion.h1
              key={ticket?.ticketNumber}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="text-8xl font-black text-white mb-6 tracking-wider"
            >
              {ticket?.ticketNumber}
            </motion.h1>

            {/* شريط التقدم */}
            <div className="bg-white/10 rounded-full h-3 mb-6 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
                className="bg-white h-full rounded-full"
              />
            </div>

            {/* خط منقط */}
            <div className="border-t-2 border-dashed border-white/30 my-6" />

            {/* معلومات */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <Users className="w-6 h-6 text-white/70 mx-auto mb-2" />
                <p className="text-white/60 text-xs mb-1">موقعك</p>
                <motion.p
                  key={position}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-bold text-white"
                >
                  #{position}
                </motion.p>
                <p className="text-white/40 text-xs mt-1">من {ticket.totalWaiting || '?'} زبون</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <Clock className="w-6 h-6 text-white/70 mx-auto mb-2" />
                <p className="text-white/60 text-xs mb-1">الانتظار</p>
                <p className="text-4xl font-bold text-white">
                  ~{position * 5}د
                </p>
                <p className="text-white/40 text-xs mt-1">تقديري</p>
              </div>
            </div>
          </div>

          {/* شريط المحل */}
          <div className="mt-6 bg-white/10 rounded-xl p-4 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-lg">{ticket.shopName || 'المحل'}</p>
                <p className="text-white/60 text-sm">{ticket.serviceType || 'عام'}</p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-white/40 text-xs">الوقت</p>
              <p className="text-white font-mono text-lg">
                {new Date(ticket.joinedAt || Date.now()).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* تنبيه اقترب الدور */}
        <AnimatePresence>
          {isNear && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="mt-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6 text-amber-400 animate-bounce" />
              </div>
              <div>
                <p className="text-amber-300 font-bold text-lg">
                  {isOneAway ? 'باقي واحد بس قبلك! ⏳' : 'اقترب دورك!'}
                </p>
                <p className="text-amber-400/70 text-sm">كن جاهزاً بالقرب من الكاونتر</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* أزرار التحكم */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl transition border border-slate-700 font-medium"
          >
            <Printer className="w-5 h-5" />
            <span>طباعة</span>
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('تم نسخ رابط التذكرة!');
            }}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl transition border border-slate-700 font-medium"
          >
            <Share2 className="w-5 h-5" />
            <span>مشاركة</span>
          </button>
        </div>

        {/* زر تذكرة جديدة */}
        <button
          onClick={() => navigate('/')}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 rounded-2xl transition shadow-lg shadow-emerald-500/20"
        >
          <ChevronRight className="w-5 h-5" />
          <span>تذكرة جديدة</span>
        </button>

        {/* تلميح */}
        <div className="mt-4 text-center">
          <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
            <Volume2 className="w-4 h-4" />
            سيتم إشعارك عندما يحين دورك
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;