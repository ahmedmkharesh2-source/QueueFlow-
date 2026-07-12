import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Phone, Store, MapPin, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react'; // ← أضف Eye, EyeOff
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../config.js';

const Register = () => {
  const [form, setForm] = useState({ name: '', phone: '', shopName: '', shopType: 'مطعم', city: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); // ← أضف
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const shopTypes = ['مطعم', 'مقهى', 'صالون حلاقة', 'صالون تجميل', 'عيادة', 'مستشفى', 'خدمات حكومية', 'أخرى'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError('');
    try {
      console.log('Registering:', form); // ← للتشخيص
      
      const res = await axios.post(`${API_URL}/api/auth/register`, form);
      
      console.log('Success:', res.data); // ← للتشخيص
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
      
    } catch (e) {
      console.error('Register error:', e.response); // ← للتشخيص
      setError(e.response?.data?.message || 'حدث خطأ في الخادم');
      
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">تسجيل محل جديد</h1>
          <p className="text-slate-400 mt-2">14 يوم تجربة مجانية - لا تحتاج بطاقة</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-5">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">الاسم</label>
              <div className="relative">
                <User className="absolute right-3 top-3.5 w-4 h-4 text-slate-500" />
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3.5 pr-9 pl-3 text-white text-sm focus:outline-none focus:border-emerald-500" placeholder="محمد" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">رقم الجوال</label>
              <div className="relative">
                <Phone className="absolute right-3 top-3.5 w-4 h-4 text-slate-500" />
                <input type="tel" required pattern="05[0-9]{8}" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3.5 pr-9 pl-3 text-white text-sm focus:outline-none focus:border-emerald-500" placeholder="05XXXXXXXX" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">اسم المحل</label>
            <div className="relative">
              <Store className="absolute right-3 top-3.5 w-4 h-4 text-slate-500" />
              <input type="text" required value={form.shopName} onChange={e => setForm({...form, shopName: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3.5 pr-9 pl-4 text-white focus:outline-none focus:border-emerald-500" placeholder="مثال: صالون الأناقة" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">نوع المحل</label>
              <select value={form.shopType} onChange={e => setForm({...form, shopType: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-emerald-500">
                {shopTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">المدينة</label>
              <div className="relative">
                <MapPin className="absolute right-3 top-3.5 w-4 h-4 text-slate-500" />
                <input type="text" required value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3.5 pr-9 pl-3 text-white text-sm focus:outline-none focus:border-emerald-500" placeholder="الرياض" />
              </div>
            </div>
          </div>

          {/* Password with Eye Icon */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3.5 w-4 h-4 text-slate-500" />
              <input 
                type={showPassword ? "text" : "password"}
                required 
                minLength="6" 
                value={form.password} 
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3.5 pr-9 pl-12 text-white focus:outline-none focus:border-emerald-500" 
                placeholder="6 أحرف على الأقل" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3.5 p-0.5 rounded-lg hover:bg-slate-700 transition text-slate-400 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'جاري التسجيل...' : <><span>تسجيل وبدء التجربة</span><ArrowLeft className="w-5 h-5" /></>}
          </motion.button>

          <p className="text-center text-slate-400 text-sm">
            لديك حساب؟ <Link to="/login" className="text-emerald-400 hover:text-emerald-300">تسجيل الدخول</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;