
// =============
// جديد
// =============
// ============================================
// ملف: Display.jsx
// الغرض: شاشة عرض كبيرة للزبائن في المحل
// تُعرض على TV أو شاشة كبيرة
// ============================================

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../App.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Clock, Calendar, Users, Bell } from 'lucide-react';


// ============================================
// المكون الرئيسي — شاشة العرض
// ============================================
const Display = () => {
  
  // ------------------------------------------
  // قراءة معرف المحل من الرابط
  // مثال: /display/12345 → shopId = "12345"
  // ------------------------------------------
  const { shopId } = useParams();
  
  // ------------------------------------------
  // الاتصال بالسيرفر (WebSocket)
  // للتحديثات الفورية بدون تحديث الصفحة
  // ------------------------------------------
  const socket = useContext(SocketContext);
  
  // ------------------------------------------
  // الحالات (State)
  // ------------------------------------------
  
  // الدور الحالي المعروض بشكل كبير
  const [currentTicket, setCurrentTicket] = useState(null);
  
  // قائمة آخر 5 نداءات
  const [recentCalls, setRecentCalls] = useState([]);
  
  // عدد الزبائن في الانتظار
  const [queueCount, setQueueCount] = useState(0);
  
  // هل يوجد رسوم متحركة الآن؟
  const [animation, setAnimation] = useState(false);
  
  // معلومات المحل
  const [shopInfo, setShopInfo] = useState({ shopName: 'نظام دورك' });
  
  // ✅ الساعة الحقيقية — تتحدث كل ثانية!
  const [currentTime, setCurrentTime] = useState(new Date());

  // ==========================================
  // useEffect 1: تحديث الساعة كل ثانية
  // ==========================================
  useEffect(() => {
    // setInterval: ينفذ دالة كل فترة محددة
    // هنا: كل 1000 ملي ثانية = 1 ثانية
    const timer = setInterval(() => {
      setCurrentTime(new Date()); // تحديث الوقت الحالي
    }, 1000);

// ==========================================
// دالة: نسخ رابط الزبائن مع الـ ID الصحيح
// ==========================================
const copyLink = () => {
  // الحصول على ID المستخدم من localStorage
  const userData = JSON.parse(localStorage.getItem('user'));
  const shopId = userData?.id;  // ← ID الحقيقي من MongoDB!
  
  // بناء الرابط الكامل
  const link = `${window.location.origin}/join/${shopId}`;
  
  // نسخ للحافظة
  navigator.clipboard.writeText(link);
  
  // إظهار تأكيد
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

    // return: تنظيف عند إغلاق المكون
    // مهم! يمنع تسرب الذاكرة (Memory Leak)
    return () => clearInterval(timer);
  }, []); // [] = ينفذ مرة واحدة عند التحميل

  // ==========================================
  // useEffect 2: الاتصال بالسيرفر والاستماع
  // ==========================================
  useEffect(() => {
    // تحديد معرف المحل (demo للتجربة)
    const targetShopId = shopId === 'demo' ? 'demo-shop-123' : shopId;
    
    // الانضمام لغرفة المحل في Socket.io
    // "غرفة" = Room: مجموعة من المتصلين بنفس المعرف
    socket.emit('join-shop', targetShopId);

    // ------------------------------------------
    // استقبال حدث: نداء دور جديد
    // ------------------------------------------
    socket.on('ticket-called', (data) => {
      // تخزين الدور الحالي (يُعرض بشكل كبير)
      setCurrentTicket(data);
      
      // تفعيل الرسوم المتحركة (الوميض)
      setAnimation(true);
      
      // إضافة للقائمة (5 آخرين فقط)
      // [...prev] = نسخة جديدة من المصفوفة
      setRecentCalls(prev => [data, ...prev].slice(0, 5));
      
      // ------------------------------------------
      // تحويل النص لكلام (TTS) — بالعربي!
      // ------------------------------------------
      if ('speechSynthesis' in window) {
        // إنشاء كائن الكلام
        const utterance = new SpeechSynthesisUtterance(
          `حان دور ${data.customerName}، رقم ${data.ticketNumber}، إلى كاونتر رقم ${data.counter}`
        );
        
        // إعدادات الكلام
        utterance.lang = 'ar-SA';      // اللغة: العربية السعودية
        utterance.rate = 0.85;          // سرعة الكلام (أبطأ قليلاً)
        utterance.pitch = 1.1;          // نبرة الصوت (أعلى قليلاً)
        utterance.volume = 1;           // مستوى الصوت (الأقصى)
        
        // تشغيل الكلام!
        speechSynthesis.speak(utterance);
      }
      
      // إيقاف الرسوم المتحركة بعد 4 ثواني
      setTimeout(() => setAnimation(false), 4000);
    });

    // ------------------------------------------
    // استقبال حدث: زبون جديد انضم
    // ------------------------------------------
    socket.on('new-ticket', (data) => {
      // تحديث عدد المنتظرين
      setQueueCount(data.position);
    });

    // ------------------------------------------
    // استقبال حدث: لا يوجد زبائن
    // ------------------------------------------
    socket.on('queue-empty', () => {
      setCurrentTicket(null); // إخفاء الدور الحالي
    });

    // تنظيف عند إغلاق المكون
    return () => {
      socket.off('ticket-called');
      socket.off('new-ticket');
      socket.off('queue-empty');
    };
  }, [socket, shopId]); // يعيد التنفيذ لو تغير socket أو shopId

  // ==========================================
  // تنسيق الوقت والتاريخ — بالعربي!
  // ==========================================
  
  // ✅ الساعة الحقيقية — تتحدث كل ثانية!
  const timeString = currentTime.toLocaleTimeString('ar-SA', { 
    hour: '2-digit',      // الساعة (رقمين)
    minute: '2-digit',   // الدقيقة (رقمين)
    second: '2-digit'     // الثانية (رقمين) ← الجديد!
  });
  
  // التاريخ بالعربي — اليوم، الشهر، السنة
  const dateString = currentTime.toLocaleDateString('ar-SA', { 
    weekday: 'long',     // اسم اليوم كامل (الأربعاء)
    year: 'numeric',     // السنة (2026)
    month: 'long',       // اسم الشهر (يونيو)
    day: 'numeric'       // اليوم (3)
  });

  // ============================================
  // واجهة المستخدم (JSX)
  // ============================================
  
  return (
    // الحاوية الرئيسية — خلفية داكنة
    // min-h-screen: ارتفاع كامل الشاشة
    // select-none: منع تحديد النص (للشاشات العامة)
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-y-auto select-none">

      {/* ====================================== */}
      {/* الشريط العلوي — شعار المحل + الساعة */}
      {/* ====================================== */}
      <div className="bg-slate-900/80 backdrop-blur border-b border-slate-800 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* --- الشعار والاسم (اليمين) --- */}
          <div className="flex items-center gap-4">
            {/* دائرة الشعار */}
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {shopInfo.shopName}
              </h1>
              <p className="text-slate-400">نظام إدارة الدور الذكي</p>
            </div>
          </div>
          
          {/* --- الساعة (اليسار) --- */}
          <div className="text-left">
            {/* ✅ الساعة الحقيقية — تمشي كل ثانية! */}
            <div className="flex items-center gap-3 text-3xl font-bold font-mono tabular-nums">
              <Clock className="w-7 h-7 text-emerald-400" />
              {timeString}
            </div>
            {/* التاريخ */}
            <div className="flex items-center gap-2 text-slate-400 mt-2 text-lg">
              <Calendar className="w-5 h-5" />
              {dateString}
            </div>
          </div>
        </div>
      </div>

      {/* ====================================== */}
      {/* الجزء الرئيسي — عمودين */}
      {/* ====================================== */}
      <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-140px)]">
        
        {/* ==================================== */}
        {/* العمود الأيسر — الدور الحالي (كبير) */}
        {/* ==================================== */}
        <div className="relative">
          
          {/* AnimatePresence: للانتقالات الجميلة */}
          <AnimatePresence mode="wait">
            
            {/* --- لو فيه دور معروض --- */}
            {currentTicket ? (
              <motion.div
                key={currentTicket.ticketNumber} // مفتاح فريد للحركة
                initial={{ scale: 0.8, opacity: 0 }} // بداية الحركة (صغير + شفاف)
                animate={{ scale: 1, opacity: 1 }}   // نهاية الحركة (طبيعي)
                className={`h-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl border-2 ${
                  animation 
                    ? 'border-emerald-400 animate-pulse-ring' // وامض عند النداء
                    : 'border-emerald-500/50'
                } p-8 flex flex-col items-center justify-center text-center relative overflow-hidden`}
              >
                {/* تأثير الوميض عند النداء */}
                {animation && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10"
                    animate={{ x: ['-100%', '100%'] }} // حركة من اليسار لليمين
                    transition={{ repeat: 2, duration: 1 }} // تكرار مرتين
                  />
                )}

                {/* الرقم الكبير */}
                <motion.div
                  animate={animation ? { scale: [1, 1.1, 1] } : {}} // تكبير عند النداء
                  transition={{ repeat: animation ? 3 : 0, duration: 0.4 }}
                >
                  <p className="text-slate-400 text-3xl mb-6 font-medium">حان الدور</p>
                  <h2 className="text-9xl font-black text-emerald-400 mb-6 tracking-wider">
                    {currentTicket.ticketNumber}
                  </h2>
                  <p className="text-4xl font-bold mb-2">{currentTicket.customerName}</p>
                </motion.div>

                {/* الكاونتر */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-10 bg-slate-900/80 rounded-3xl px-12 py-6 border border-slate-700"
                >
                  <p className="text-slate-400 text-2xl mb-3">الرجاء التوجه إلى</p>
                  <p className="text-7xl font-black text-white">كاونتر {currentTicket.counter}</p>
                </motion.div>

                {/* أيقونة الصوت */}
                <div className="absolute top-6 right-6">
                  <Volume2 className={`w-10 h-10 ${
                    animation ? 'text-emerald-400 animate-bounce' : 'text-slate-600'
                  }`} />
                </div>
              </motion.div>
              
            ) : (
              /* --- لو ما فيه دور — شاشة الانتظار --- */
              <div className="h-full bg-slate-800/30 rounded-3xl border border-slate-700 p-8 flex flex-col items-center justify-center text-center">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                  <Clock className="w-24 h-24 text-slate-600 mb-6" />
                </motion.div>
                <p className="text-3xl text-slate-500 font-medium">في انتظار النداء التالي...</p>
                <p className="text-slate-600 mt-4 text-xl">نظام دورك - راحة الزبائن أولاً</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* ==================================== */}
        {/* العمود الأيمن — الإحصائيات والنداءات */}
        {/* ==================================== */}
        <div className="space-y-6 flex flex-col h-full">
          
          {/* --- حالة الانتظار --- */}
          <div className="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700 p-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
              حالة الانتظار
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {/* عدد المنتظرين */}
              <div className="bg-slate-900/60 rounded-2xl p-6 text-center border border-slate-700">
                <Users className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <p className="text-slate-400 text-lg mb-2">المنتظرين</p>
                <p className="text-6xl font-black text-emerald-400">{queueCount}</p>
              </div>
              {/* متوسط الانتظار */}
              <div className="bg-slate-900/60 rounded-2xl p-6 text-center border border-slate-700">
                <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <p className="text-slate-400 text-lg mb-2">متوسط الانتظار</p>
                <p className="text-6xl font-black text-blue-400">
                  5<span className="text-2xl text-slate-500 mr-2">د</span>
                </p>
              </div>
            </div>
          </div>

          {/* --- آخر النداءات --- */}
          <div className="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700 p-6 flex-1 overflow-hidden">
            <h3 className="text-2xl font-bold mb-4">آخر النداءات</h3>
            <div className="space-y-3 overflow-y-auto max-h-[300px]">
              <AnimatePresence>
                {recentCalls.map((call, index) => (
                  <motion.div
                    key={call.ticketNumber + index}
                    initial={{ opacity: 0, x: 50 }} // دخول من اليمين
                    animate={{ opacity: 1, x: 0 }}   // وقف في المكان
                    className="flex items-center justify-between bg-slate-900/60 rounded-xl p-4 border border-slate-700"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-emerald-400 w-20">
                        {call.ticketNumber}
                      </span>
                      <span className="text-xl text-slate-300">{call.customerName}</span>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-lg font-bold border border-emerald-500/30">
                      كاونتر {call.counter}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {recentCalls.length === 0 && (
                <div className="text-center text-slate-600 py-12">
                  <p className="text-xl">لا توجد نداءات حديثة</p>
                </div>
              )}
            </div>
          </div>

          {/* --- الشعار السفلي --- */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-4 border border-emerald-500/20 text-center">
            <p className="text-emerald-400 font-bold text-lg">نظام دورك - حلول ذكية لإدارة الانتظار</p>
            <p className="text-slate-500 text-sm mt-1">www.dorck.sa | دعم فني: 9200XXXX</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// // تصدير المكون لاستخدامه في App.jsx
export default Display;
// -----------new--------==============================
// ============================================
// ملف: Dashboard.jsx
// الغرض: لوحة تحكم صاحب المحل مع Sidebar
// ============================================

// // ============================================
// // ملف: Dashboard.jsx
// // الغرض: لوحة تحكم صاحب المحل (3 صفحات)
// // ============================================

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { QRCodeSVG } from 'qrcode.react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Bell, Users, LogOut, Plus, SkipForward, Clock, QrCode,
//   Copy, Check, UserPlus, X, Home, History, Settings,
//   Search, Filter, Download, Calendar, ChevronLeft,
//   Phone, User, Hash, Monitor
// } from 'lucide-react';

// // ============================================
// // المكون الرئيسي
// // ============================================
// const Dashboard = () => {
//   // ------------------------------------------
//   // الحالات (State)
//   // ------------------------------------------
//   const [user, setUser] = useState(null);
//   const [queues, setQueues] = useState([]);
//   const [stats, setStats] = useState({ waiting: 0, completed: 0, totalToday: 0 });
//   const [activeCounter, setActiveCounter] = useState(1);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('home'); // 'home' | 'history' | 'qr'
  
//   // بيانات السجل (تاريخي)
//   const [history, setHistory] = useState([]);
//   const [historyFilter, setHistoryFilter] = useState('all'); // 'all' | 'today' | 'week' | 'month'
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // نموذج الزبون الجديد
//   const [newCustomer, setNewCustomer] = useState({
//     name: '', phone: '', serviceType: 'عام', priority: 'normal'
//   });

//   const navigate = useNavigate();

//   // ------------------------------------------
//   // useEffect: التحقق من تسجيل الدخول
//   // ------------------------------------------
//   useEffect(() => {
//     const stored = localStorage.getItem('user');
//     const token = localStorage.getItem('token');
//     if (!stored || !token) {
//       navigate('/login');
//       return;
//     }
//     setUser(JSON.parse(stored));
//   }, [navigate]);

//   // ------------------------------------------
//   // useEffect: جلب قائمة الانتظار
//   // ------------------------------------------
//   useEffect(() => {
//     if (!user) return;
//     const fetchQueues = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/queue/${user.id}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setQueues(res.data.queues || []);
//         setStats(prev => ({ ...prev, waiting: res.data.total || 0 }));
//       } catch (error) { console.error('Error:', error); }
//     };
//     fetchQueues();
//     const interval = setInterval(fetchQueues, 3000);
//     return () => clearInterval(interval);
//   }, [user]);

//   // ------------------------------------------
//   // useEffect: جلب السجل (محاكاة)
//   // ------------------------------------------
//   useEffect(() => {
//     if (!user || activeTab !== 'history') return;
    
//     // محاكاة بيانات السجل (لاحقاً من API)
//     const mockHistory = [
//       { id: 1, ticket: 'A-001', name: 'محمد', phone: '0501234567', status: 'completed', counter: 1, date: '2026-06-07', time: '14:30', waitTime: 5 },
//       { id: 2, ticket: 'A-002', name: 'أحمد', phone: '0507654321', status: 'completed', counter: 2, date: '2026-06-07', time: '14:45', waitTime: 8 },
//       { id: 3, ticket: 'A-003', name: 'خالد', phone: '0501112222', status: 'cancelled', counter: 1, date: '2026-06-07', time: '15:00', waitTime: 0 },
//       { id: 4, ticket: 'A-004', name: 'سعد', phone: '0503334444', status: 'completed', counter: 1, date: '2026-06-06', time: '10:15', waitTime: 12 },
//       { id: 5, ticket: 'A-005', name: 'فهد', phone: '0505556666', status: 'no-show', counter: 2, date: '2026-06-06', time: '11:30', waitTime: 0 },
//     ];
//     setHistory(mockHistory);
//   }, [user, activeTab]);

//   // ------------------------------------------
//   // دالة: نداء التالي
//   // ------------------------------------------
//   const callNext = async () => {
//     if (queues.length === 0) return;
//     setLoading(true);
//     try {
//       await axios.post(
//         'http://localhost:5000/api/queue/call-next',
//         { shopId: user.id, counter: activeCounter },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setQueues(prev => prev.slice(1));
//       setStats(prev => ({ ...prev, waiting: Math.max(0, prev.waiting - 1) }));
//     } catch (error) { alert('حدث خطأ في النداء'); }
//     finally { setLoading(false); }
//   };

//   // ------------------------------------------
//   // دالة: إضافة زبون
//   // ------------------------------------------
//   const addCustomer = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/api/queue/join', {
//         shopId: user.id, ...newCustomer
//       });
//       setShowAddModal(false);
//       setNewCustomer({ name: '', phone: '', serviceType: 'عام', priority: 'normal' });
//     } catch (error) { alert('حدث خطأ'); }
//   };

//   // ------------------------------------------
//   // دالة: نسخ الرابط
//   // ------------------------------------------
//   const copyLink = () => {
//     navigator.clipboard.writeText(`${window.location.origin}/join/${user?.id}`);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   // ------------------------------------------
//   // دالة: تسجيل الخروج
//   // ------------------------------------------
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/');
//   };

//   // ------------------------------------------
//   // فلترة السجل
//   // ------------------------------------------
//   const filteredHistory = history.filter(item => {
//     const matchesSearch = item.name.includes(searchQuery) || 
//                          item.phone.includes(searchQuery) || 
//                          item.ticket.includes(searchQuery);
//     const matchesFilter = historyFilter === 'all' ? true :
//                          historyFilter === 'today' ? item.date === '2026-06-07' :
//                          historyFilter === 'week' ? true : // محاكاة
//                          historyFilter === 'month' ? true : true;
//     return matchesSearch && matchesFilter;
//   });

//   // ------------------------------------------
//   // لون حالة الدور
//   // ------------------------------------------
//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
//       case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
//       case 'no-show': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
//       default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
//     }
//   };

//   const getStatusText = (status) => {
//     switch(status) {
//       case 'completed': return 'تم';
//       case 'cancelled': return 'ملغي';
//       case 'no-show': return 'لم يحضر';
//       default: return 'مجهول';
//     }
//   };

//   // ------------------------------------------
//   // تحميل QR كـ PNG
//   // ------------------------------------------
//   const downloadQR = () => {
//     const svg = document.getElementById('shop-qr-code');
//     if (!svg) return;
    
//     const svgData = new XMLSerializer().serializeToString(svg);
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     const img = new Image();
    
//     img.onload = () => {
//       canvas.width = 400;
//       canvas.height = 400;
//       ctx.fillStyle = 'white';
//       ctx.fillRect(0, 0, 400, 400);
//       ctx.drawImage(img, 0, 0, 400, 400);
      
//       const link = document.createElement('a');
//       link.download = `dorck-qr-${user?.shopName || 'shop'}.png`;
//       link.href = canvas.toDataURL('image/png');
//       link.click();
//     };
    
//     img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
//   };

//   // ==========================================
//   // لو التحميل
//   // ==========================================
//   if (!user) {
//     return (
//       <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p>جاري التحميل...</p>
//         </div>
//       </div>
//     );
//   }
// };  

//   // ==========================================
 
