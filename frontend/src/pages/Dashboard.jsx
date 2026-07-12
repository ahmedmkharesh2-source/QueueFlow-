// ============================================
// ملف: Dashboard.jsx (مُعدّل كامل - 100%)
// ============================================

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { API_URL } from '../config.js';
import {
  Bell, Users, LogOut, Plus, SkipForward,
  Volume2, VolumeX, Clock, QrCode, Copy, Check,
  UserPlus, X, Home, History, BarChart3, Menu,
  TrendingUp, Calendar, ArrowLeft, Trash2,
  Printer, Download, Filter, ChevronDown, Search
} from 'lucide-react';

// ============================================
// مكون منفصل: مودال إضافة الزبون (React.memo)
// ============================================
const AddCustomerModal = memo(({ show, onClose, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceType: 'عام',
    priority: 'normal'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    const shopId = user?._id || user?.id;
    if (!shopId) {
      alert('معرف المحل غير موجود');
      return;
    }
    
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/queue/join`, {
        shopId: shopId,
        ...formData
      });
      setFormData({ name: '', phone: '', serviceType: 'عام', priority: 'normal' });
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ');
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
        className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-700"
      >
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">إضافة زبون يدوياً</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">الاسم</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition placeholder:text-slate-500"
              placeholder="اسم الزبون"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">رقم الجوال</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => handleChange('phone', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition placeholder:text-slate-500"
              placeholder="05xxxxxxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">نوع الخدمة</label>
            <select
              value={formData.serviceType}
              onChange={e => handleChange('serviceType', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            >
              <option value="عام">عام</option>
              <option value="استشارة">استشارة</option>
              <option value="صيانة">صيانة</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">الأولوية</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleChange('priority', 'normal')}
                className={`flex-1 py-3 rounded-xl border-2 transition font-semibold ${
                  formData.priority === 'normal'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-slate-600 text-slate-400 hover:border-slate-500'
                }`}
              >
                عادي
              </button>
              <button
                type="button"
                onClick={() => handleChange('priority', 'vip')}
                className={`flex-1 py-3 rounded-xl border-2 transition font-semibold ${
                  formData.priority === 'vip'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                    : 'border-slate-600 text-slate-400 hover:border-slate-500'
                }`}
              >
                VIP
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 text-slate-900 py-3 rounded-xl font-bold transition shadow-lg shadow-emerald-500/20 mt-6"
          >
            {submitting ? 'جاري الإضافة...' : 'إضافة للقائمة'}
          </button>
        </form>
      </motion.div>
    </div>
  );
});

AddCustomerModal.displayName = 'AddCustomerModal';

// ============================================
// Dashboard الرئيسي
// ============================================
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [queues, setQueues] = useState([]);
  const [stats, setStats] = useState({ waiting: 0, completed: 0, totalToday: 0, skipped: 0 });
  const [activeCounter, setActiveCounter] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subscription, setSubscription] = useState(null); // { status, daysLeft, isExpired, trialEndsAt }
  const [history, setHistory] = useState([]);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [queueFilter, setQueueFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const qrRef = useRef(null);
  const navigate = useNavigate();

  const getShopId = useCallback(() => {
    return user?._id || user?.id;
  }, [user]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!stored || !token) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(stored);
      const userId = parsedUser?._id || parsedUser?.id;
      
      if (!userId) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      setUser({
        ...parsedUser,
        _id: userId,
        id: userId
      });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchSubscription = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/subscription`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSubscription(res.data);
      } catch (error) {
        console.error('Subscription check error:', error);
      }
    };

    fetchSubscription();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    const shopId = getShopId();
    if (!shopId) return;
    
    const fetchQueues = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/queue/${shopId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setQueues(res.data.queues || []);
        setStats(prev => ({ ...prev, waiting: res.data.total || 0 }));
      } catch (error) { 
        console.error('Error fetching queues:', error);
      }
    };
    
    fetchQueues();
    const interval = setInterval(fetchQueues, 3000);
    return () => clearInterval(interval);
  }, [user, getShopId]);

  useEffect(() => {
    if (!user) return;
    
    const shopId = getShopId();
    if (!shopId) return;
    
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/queue/stats/${shopId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStats(res.data);
      } catch (error) { console.error('Error:', error); }
    };
    // ---------------------------
    // جديد
    // ---------------------------
    // في Dashboard.jsx - قائمة الانتظار
{queues.map((queue, index) => (
  <div
    key={queue.id || index}
    className={`p-4 flex items-center justify-between transition-colors hover:bg-slate-700/20 ${
      index === 0 ? 'bg-emerald-500/5 border-r-4 border-emerald-500' : ''
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
        index === 0 ? 'bg-emerald-500 text-slate-900' : 'bg-slate-700 text-slate-400'
      }`}>
        {index + 1}
      </div>
      <div>
        {/* ⬇️⬇️⬇️  الاسم الحقيقي  ⬇️⬇️⬇️ */}
        <p className="font-semibold text-white">{queue.name || 'زبون'}</p>
        <p className="text-sm text-slate-400">
          {queue.ticketNumber} • {queue.serviceType || 'عام'}
          {/* ⬇️⬇️⬇️  نوع الخدمة  ⬇️⬇️⬇️ */}
          {queue.priority === 'vip' && (
            <span className="mr-2 bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full">VIP</span>
          )}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={() => skipCustomer(queue.id)}
        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
        title="لم يحضر"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
))}
// --------------------------------------------------------------------
// Dashboard.jsx - QRContent
const QRContent = () => {
  const shopId = getShopId();
  
  if (!shopId) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
          <p className="text-red-400">خطأ: معرف المحل غير موجود</p>
          <p className="text-slate-400 text-sm mt-2">يرجى تسجيل الخروج وإعادة تسجيل الدخول</p>
        </div>
      </div>
    );
  }
  
  // ⬇️⬇️⬇️  IP الجهاز على الشبكة  ⬇️⬇️⬇️
  const getBaseUrl = () => {
    const { protocol, host } = window.location;
    
    // إذا localhost، استخدم IP للجوال
    if (host.includes('localhost')) {
      // غيّر هذا لـ IP حقك
      return 'http://10.102.17.80:5173'; // ⬅️ غيّر IP
    }
    
    return `${protocol}//${host}`;
  };
  
  const baseUrl = getBaseUrl();
  const link = `${baseUrl}/join/${shopId}`;
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm text-center">
        
        {/* IP للمستخدم */}
        <div className="mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
          <p className="text-amber-400 text-sm">
            📱 للجوال: تأكد من نفس شبكة WiFi
          </p>
          <p className="text-amber-300 text-xs mt-1 font-mono">
            {baseUrl}
          </p>
        </div>

        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
          <QrCode className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">رمز QR للزبائن</h2>
        <p className="text-slate-400 mb-8">امسح الرمز للانضمام لقائمة الانتظار</p>

        <div 
          ref={qrRef}
          className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-600 inline-block mb-6"
        >
          <QRCodeSVG
            value={link}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>

        <div className="flex items-center gap-3 max-w-md mx-auto mb-6">
          <div className="flex-1 bg-slate-700 rounded-xl px-4 py-3 text-left text-sm text-slate-300 truncate dir-ltr border border-slate-600">
            {link}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(link);
              alert('تم نسخ الرابط!');
            }}
            className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handlePrintQR}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 rounded-xl transition border border-slate-600 font-semibold"
          >
            <Printer className="w-5 h-5" />
            <span>طباعة</span>
          </button>
          <button
            onClick={handleDownloadQR}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-5 py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 font-semibold"
          >
            <Download className="w-5 h-5" />
            <span>تحميل PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
// ---------------------------------------
    
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [user, getShopId]);

  useEffect(() => {
    if (!user || activeTab !== 'history') return;
    
    const shopId = getShopId();
    if (!shopId) return;
    
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/queue/history/${shopId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setHistory(res.data.history || []);
      } catch (error) {
        console.error('Error fetching history:', error);
        setHistory([]);
      }
    };
    
    fetchHistory();
  }, [user, activeTab, getShopId]);

  const callNext = async () => {
    if (queues.length === 0) return;
    
    const shopId = getShopId();
    if (!shopId) {
      alert('معرف المحل غير موجود');
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/queue/call-next`,
        { shopId: shopId, counter: activeCounter },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      if (res.data.success) {
        setQueues(prev => prev.slice(1));
        setStats(prev => ({
          ...prev,
          waiting: Math.max(0, prev.waiting - 1),
          completed: prev.completed + 1
        }));
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 402) {
        setSubscription(prev => ({ ...prev, isExpired: true }));
      } else {
        alert('حدث خطأ في النداء');
      }
    } finally { setLoading(false); }
  };

  const skipCustomer = async (ticketId) => {
    const shopId = getShopId();
    if (!shopId) return;
    
    try {
      await axios.post(
        `${API_URL}/api/queue/skip`,
        { shopId: shopId, ticketId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setQueues(prev => prev.filter(q => q.id !== ticketId));
      setStats(prev => ({ ...prev, skipped: (prev.skipped || 0) + 1 }));
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 402) {
        setSubscription(prev => ({ ...prev, isExpired: true }));
      }
    }
  };

  const copyLink = () => {
    const shopId = getShopId();
    if (!shopId) {
      alert('معرف المحل غير موجود');
      return;
    }
    
    const link = `${window.location.origin}/join/${shopId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintQR = () => {
    const shopId = getShopId();
    if (!shopId) {
      alert('معرف المحل غير موجود');
      return;
    }
    
    const printWindow = window.open('', '_blank');
    const qrHtml = qrRef.current?.innerHTML || '';
    const link = `${window.location.origin}/join/${shopId}`;
    
    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>رمز QR - ${user?.shopName || 'دورك'}</title>
          <style>
            body { font-family: 'IBM Plex Sans Arabic', sans-serif; text-align: center; padding: 40px; background: #0f172a; color: white; }
            .qr-container { display: inline-block; padding: 30px; background: white; border-radius: 20px; }
            h1 { margin-bottom: 10px; }
            p { color: #94a3b8; margin-bottom: 30px; }
            .url { margin-top: 20px; font-size: 14px; color: #10b981; word-break: break-all; }
          </style>
        </head>
        <body>
          <h1>${user?.shopName || 'نظام دورك'}</h1>
          <p>امسح الرمز للانضمام لقائمة الانتظار</p>
          <div class="qr-container">${qrHtml}</div>
          <div class="url">${link}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      
      const a = document.createElement('a');
      a.download = `QR-${user?.shopName || 'dourak'}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const Sidebar = () => (
    <>
      {/* خلفية شفافة تظهر بس بالجوال لما تكون القائمة مفتوحة */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      <div
        className={`w-64 bg-slate-800/50 border-l border-slate-700/50 h-screen flex flex-col backdrop-blur-xl
          fixed md:sticky top-0 z-50 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          right-0 md:right-auto`}
      >
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white">دورك</h1>
              <p className="text-xs text-slate-400">نظام إدارة الدور</p>
            </div>
          </div>
          {/* زر إغلاق يظهر بس بالجوال */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { key: 'home', icon: Home, label: 'الرئيسية' },
            { key: 'history', icon: History, label: 'سجل النداءات', badge: history.length },
            { key: 'qr', icon: QrCode, label: 'رمز QR' },
            { key: 'analytics', icon: BarChart3, label: 'التحليلات' }
          ].map(({ key, icon: Icon, label, badge }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-right ${
                activeTab === key
                  ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
              {badge > 0 && (
                <span className="mr-auto bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'صاحب المحل'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.shopName || 'المحل'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </>
  );

  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-sm text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
            <TrendingUp className="w-4 h-4" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );

  const Header = () => (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        {/* زر القائمة يظهر بس بالجوال */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 -mr-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl border border-slate-700"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {activeTab === 'home' && 'لوحة التحكم'}
            {activeTab === 'history' && 'سجل النداءات'}
            {activeTab === 'qr' && 'رمز QR'}
            {activeTab === 'analytics' && 'التحليلات'}
          </h1>
          <p className="text-slate-400 mt-1">
            {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-3 rounded-xl transition ${
            soundEnabled 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
          title={soundEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-4 py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 font-semibold"
        >
          <UserPlus className="w-5 h-5" />
          <span>إضافة زبون</span>
        </button>
      </div>
    </div>
  );

  const HomeContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={Clock}
          label="في الانتظار"
          value={stats.waiting}
          color="bg-amber-500"
          trend={stats.waiting > 0 ? `${stats.waiting} زبون` : null}
        />
        <StatCard
          icon={Check}
          label="تم خدمتهم اليوم"
          value={stats.completed}
          color="bg-emerald-500"
          trend="+12%"
        />
        <StatCard
          icon={Users}
          label="إجمالي اليوم"
          value={stats.totalToday}
          color="bg-blue-500"
        />
        <StatCard
          icon={SkipForward}
          label="لم يحضر"
          value={stats.skipped || 0}
          color="bg-red-500"
        />
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">الكاونتر النشط</h2>
            <p className="text-sm text-slate-400">اختر الكاونتر الذي تخدم منه</p>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => setActiveCounter(num)}
                className={`w-12 h-12 rounded-xl font-bold transition ${
                  activeCounter === num
                    ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center py-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={callNext}
            disabled={loading || queues.length === 0}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition ${
              queues.length === 0
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-xl shadow-emerald-500/20 animate-pulse-ring'
            }`}
          >
            <SkipForward className="w-6 h-6" />
            {loading ? 'جاري النداء...' : 'نداء التالي'}
          </motion.button>
        </div>

        {queues.length === 0 && (
          <p className="text-center text-slate-500 text-sm">لا يوجد زبائن في قائمة الانتظار</p>
        )}
      </div>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">قائمة الانتظار</h2>
          <select
            value={queueFilter}
            onChange={(e) => setQueueFilter(e.target.value)}
            className="bg-slate-700 text-white text-sm px-3 py-2 rounded-lg border border-slate-600 outline-none focus:border-emerald-500"
          >
            <option value="all">كل الطوابير</option>
            <option value="عام">عام</option>
            <option value="استشارة">استشارة</option>
            <option value="صيانة">صيانة</option>
            <option value="VIP">VIP</option>
          </select>
        </div>
        <div className="divide-y divide-slate-700/50">
          {queues.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p>قائمة الانتظار فارغة</p>
            </div>
          ) : (
            queues
              .filter(q => queueFilter === 'all' || q.serviceType === queueFilter)
              .map((queue, index) => (
                <div
                  key={queue.id || index}
                  className={`p-4 flex items-center justify-between transition-colors hover:bg-slate-700/20 ${
                    index === 0 ? 'bg-emerald-500/5 border-r-4 border-emerald-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-emerald-500 text-slate-900' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{queue.name || 'زبون'}</p>
                      <p className="text-sm text-slate-400">
                        {queue.ticketNumber || `T-${String(index + 1).padStart(3, '0')}`} • {queue.serviceType || 'عام'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {queue.priority === 'vip' && (
                      <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-full font-semibold border border-amber-500/20">
                        VIP
                      </span>
                    )}
                    <button
                      onClick={() => skipCustomer(queue.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      title="لم يحضر"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );

  const HistoryContent = () => {
    const filteredHistory = history.filter(item => {
      if (historyFilter === 'all') return true;
      return item.status === historyFilter;
    }).filter(item => {
      if (!searchQuery) return true;
      return item.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
             item.ticketNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <span className="text-white font-semibold">تصفية:</span>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-1">
            {[
              { key: 'all', label: 'الكل' },
              { key: 'completed', label: 'مكتمل' },
              { key: 'skipped', label: 'لم يحضر' }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setHistoryFilter(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  historyFilter === filter.key
                    ? 'bg-emerald-500 text-slate-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="بحث في السجل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-700 text-white text-sm pr-10 pl-4 py-2 rounded-lg border border-slate-600 outline-none focus:border-emerald-500 w-64 placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">سجل النداءات</h2>
            <span className="text-sm text-slate-400">{filteredHistory.length} نداء</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/30">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase">التذكرة</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase">الزبون</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase">الكاونتر</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase">وقت النداء</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase">وقت الانتظار</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-700/20 transition"
                  >
                    <td className="px-6 py-4 font-mono font-semibold text-emerald-400">{item.ticketNumber}</td>
                    <td className="px-6 py-4 font-semibold text-white">{item.customerName}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg text-sm font-semibold border border-blue-500/20">
                        كاونتر {item.counter}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{item.calledAt}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{item.waitTime} دقيقة</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${
                        item.status === 'completed' 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' 
                          : 'bg-red-500/20 text-red-400 border-red-500/20'
                      }`}>
                        {item.status === 'completed' ? 'تم' : 'لم يحضر'}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      <History className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                      <p>لا يوجد سجل</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const QRContent = () => {
    const shopId = getShopId();
    
    if (!shopId) {
      return (
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
            <p className="text-red-400">خطأ: معرف المحل غير موجود</p>
            <p className="text-slate-400 text-sm mt-2">يرجى تسجيل الخروج وإعادة تسجيل الدخول</p>
          </div>
        </div>
      );
    }
    
    const link = `${window.location.origin}/join/${shopId}`;
    
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <QrCode className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">رمز QR للزبائن</h2>
          <p className="text-slate-400 mb-8">امسح الرمز للانضمام لقائمة الانتظار</p>

          <div 
            ref={qrRef}
            className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-600 inline-block mb-6"
          >
            <QRCodeSVG
              value={link}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="flex items-center gap-3 max-w-md mx-auto mb-6">
            <div className="flex-1 bg-slate-700 rounded-xl px-4 py-3 text-left text-sm text-slate-300 truncate dir-ltr border border-slate-600">
              {link}
            </div>
            <button
              onClick={copyLink}
              className={`p-3 rounded-xl transition border ${
                copied 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-400 border-slate-600'
              }`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {copied && (
            <p className="text-emerald-400 text-sm mb-6">
              تم نسخ الرابط!
            </p>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handlePrintQR}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 rounded-xl transition border border-slate-600 font-semibold"
            >
              <Printer className="w-5 h-5" />
              <span>طباعة</span>
            </button>
            <button
              onClick={handleDownloadQR}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-5 py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 font-semibold"
            >
              <Download className="w-5 h-5" />
              <span>تحميل PNG</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AnalyticsContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-4">أوقات الذروة</h3>
          <div className="space-y-3">
            {[
              { time: '9:00 - 11:00', count: 45, percent: 90 },
              { time: '11:00 - 13:00', count: 38, percent: 76 },
              { time: '13:00 - 15:00', count: 25, percent: 50 },
              { time: '15:00 - 17:00', count: 30, percent: 60 },
            ].map((slot, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-slate-400 w-24">{slot.time}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${slot.percent}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-white w-8">{slot.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-4">متوسط وقت الانتظار</h3>
          <div className="flex items-end justify-center h-40 gap-4">
            {[12, 8, 15, 10, 6, 9, 11].map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-400"
                  style={{ height: `${val * 4}px` }}
                />
                <span className="text-xs text-slate-400">
                  {['سبت', 'أحد', 'اثن', 'ثلاث', 'أرب', 'خم', 'جمعة'][i]}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-2xl font-bold text-emerald-400 mt-4">10 دقائق</p>
          <p className="text-center text-sm text-slate-400">متوسط هذا الأسبوع</p>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // شاشة "انتهت التجربة المجانية" — تحجب الوصول للوحة التحكم كاملة
  // ==========================================
  if (subscription?.isExpired) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full bg-slate-800/50 border border-slate-700 rounded-3xl p-8 text-center">
          <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">انتهت فترة التجربة المجانية</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            نتمنى إنك استفدت من نظام دورك 🙏 للاستمرار باستخدام النظام، يرجى إتمام عملية الاشتراك عبر إحدى الوسيلتين:
          </p>

          <div className="bg-slate-900/60 rounded-2xl p-5 mb-4 text-right border border-slate-700">
            <p className="text-slate-400 text-xs mb-1">التحويل البنكي (آيبان)</p>
            <p className="text-white font-mono text-lg tracking-wide select-all">[ضع رقم الآيبان هنا]</p>
            <p className="text-slate-500 text-xs mt-1">[اسم صاحب الحساب]</p>
          </div>

          <a
            href="https://wa.me/966547096058"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 rounded-2xl transition shadow-lg shadow-emerald-500/20"
          >
            <span>تواصل معنا عبر واتساب</span>
          </a>

          <p className="text-slate-500 text-xs mt-4">
            بعد إتمام التحويل، أرسل لنا صورة الإيصال عبر واتساب وبنفعّل اشتراكك خلال دقائق.
          </p>

          <button
            onClick={handleLogout}
            className="mt-6 text-slate-500 hover:text-slate-300 text-sm underline"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex" dir="rtl">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-8 overflow-auto w-full">
        <Header />

        {/* تنبيه اقتراب انتهاء التجربة المجانية (يظهر بس آخر يومين) */}
        {subscription && !subscription.isExpired && subscription.status !== 'active' && subscription.daysLeft <= 2 && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3 flex-wrap">
            <Bell className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-amber-300 text-sm flex-1 min-w-[200px]">
              تبقى <span className="font-bold">{subscription.daysLeft}</span> {subscription.daysLeft === 1 ? 'يوم' : 'أيام'} على انتهاء تجربتك المجانية
              {subscription.trialEndsAt && (
                <> (تنتهي بتاريخ {new Date(subscription.trialEndsAt).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' })})</>
              )}
            </p>
            <a
              href="https://wa.me/966547096058"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold px-4 py-2 rounded-xl transition"
            >
              تواصل للاشتراك
            </a>
          </div>
        )}
        
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'home' && <HomeContent />}
          {activeTab === 'history' && <HistoryContent />}
          {activeTab === 'qr' && <QRContent />}
          {activeTab === 'analytics' && <AnalyticsContent />}
        </motion.div>
      </main>

      <AddCustomerModal 
        show={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        user={user}
        onSuccess={() => {
          setShowAddModal(false);
          const shopId = getShopId();
          if (!shopId) return;
          
          const fetchQueues = async () => {
            try {
              const res = await axios.get(`${API_URL}/api/queue/${shopId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              });
              setQueues(res.data.queues || []);
              setStats(prev => ({ ...prev, waiting: res.data.total || 0 }));
            } catch (error) { console.error('Error:', error); }
          };
          fetchQueues();
        }}
      />
    </div>
  );
};

export default Dashboard;