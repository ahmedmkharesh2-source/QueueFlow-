import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Phone, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../config.js';

const Login = () => {
  const [form, setForm] = useState({ phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError('');
    
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      
      // ⬇️⬇️⬇️  حفظ مباشرة بدون تحقق  ⬇️⬇️⬇️
      const user = res.data.user;
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      navigate('/dashboard');
      
    } catch (e) {
      console.error('Login error:', e.response);
      setError(e.response?.data?.message || 'حدث خطأ');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">تسجيل الدخول</h1>
          <p className="text-slate-400 mt-2">أهلاً بعودتك صاحب المحل</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">رقم الجوال</label>
            <div className="relative">
              <Phone className="absolute right-3 top-3.5 w-5 h-5 text-slate-500" />
              <input 
                type="tel" 
                required 
                pattern="05[0-9]{8}" 
                value={form.phone} 
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3.5 pr-10 pl-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition" 
                placeholder="05XXXXXXXX" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3.5 w-5 h-5 text-slate-500" />
              <input 
                type={showPassword ? "text" : "password"}
                required 
                value={form.password} 
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3.5 pr-10 pl-12 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition" 
                placeholder="••••••••" 
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
            {loading ? 'جاري الدخول...' : <><span>دخول</span><ArrowLeft className="w-5 h-5" /></>}
          </motion.button>

          <p className="text-center text-slate-400 text-sm">
            ليس لديك حساب؟ <Link to="/register" className="text-emerald-400 hover:text-emerald-300">سجل الآن</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;