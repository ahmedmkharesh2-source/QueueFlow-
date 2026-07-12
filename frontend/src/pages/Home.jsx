// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Bell, Monitor, Smartphone, TrendingUp, Shield, Clock } from 'lucide-react';
// import { motion } from 'framer-motion';

// const Home = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
//       {/* Navbar */}
//       <nav className="border-b border-slate-700/50 backdrop-blur-lg bg-slate-900/50 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
//               <Bell className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-xl font-bold">نظام دورك</span>
//           </div>
//           <div className="flex gap-4">
//             <Link to="/login" className="px-6 py-2 rounded-xl border border-slate-600 hover:bg-slate-800 transition">تسجيل الدخول</Link>
//             <Link to="/register" className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition font-semibold">سجل محلك</Link>
//           </div>
//         </div>
//       </nav>

//       {/* Hero */}
//       <section className="max-w-7xl mx-auto px-6 py-20 text-center">
//         <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
//           <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
//             نظام <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">إدارة الدور</span><br />
//             الذكي للمحلات السعودية
//           </h1>
//           <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
//             أنهِ انتظار زبائنك. نظام دورك يدير قوائم الانتظار بذكاء مع إشعارات فورية وشاشات عرض احترافية
//           </p>
//           <div className="flex gap-4 justify-center">
//             <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition">
//               ابدأ مجاناً - 14 يوم تجربة
//             </Link>
//             <Link to="/display/demo" className="px-8 py-4 border border-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-800 transition">
//               جرب الشاشة التجريبية
//             </Link>
//           </div>
//         </motion.div>
//       </section>

//       {/* Features */}
//       <section className="max-w-7xl mx-auto px-6 py-20">
//         <div className="grid md:grid-cols-3 gap-8">
//           {[
//             { icon: Monitor, title: 'شاشات عرض ذكية', desc: 'شاشات كبيرة تعرض الدور الحالي مع إشعارات صوتية ومرئية' },
//             { icon: Smartphone, title: 'QR Code سريع', desc: 'زبونك يمسح الكود ويحصل على رقم الدور فوراً' },
//             { icon: TrendingUp, title: 'إحصائيات متقدمة', desc: 'تعرف على أوقات الذروة ومتوسط وقت الانتظار' },
//             { icon: Shield, title: 'أولويات ذكية', desc: 'VIP، كبار السن، ذوي الاحتياجات - نظام أولويات مرن' },
//             { icon: Clock, title: 'توقيت ذكي', desc: 'توقع وقت الانتظار بدقة عالية للزبائن' },
//             { icon: Bell, title: 'إشعارات فورية', desc: 'صوتية + مرئية + SMS + WhatsApp' }
//           ].map((feature, i) => (
//             <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
//               className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 hover:border-emerald-500/50 transition group">
//               <feature.icon className="w-12 h-12 text-emerald-400 mb-4 group-hover:scale-110 transition" />
//               <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
//               <p className="text-slate-400">{feature.desc}</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* Pricing */}
//       <section className="max-w-7xl mx-auto px-6 py-20">
//         <h2 className="text-4xl font-bold text-center mb-12">باقات الاشتراك</h2>
//         <div className="grid md:grid-cols-3 gap-8">
//           {[
//             { name: 'أساسي', price: '99', period: 'شهري', features: ['2 شاشة', '200 دور/يوم', 'إحصائيات أساسية', 'دعم فني'] },
//             { name: 'احترافي', price: '199', period: 'شهري', popular: true, features: ['5 شاشات', 'غير محدود', 'SMS + WhatsApp', 'إحصائيات متقدمة', 'API'] },
//             { name: 'مؤسسي', price: '499', period: 'شهري', features: ['غير محدود', 'تصميم خاص', 'دعم 24/7', 'تدريب فريق'] }
//           ].map((plan, i) => (
//             <div key={i} className={`relative bg-slate-800/50 backdrop-blur border rounded-2xl p-8 ${plan.popular ? 'border-emerald-500 scale-105' : 'border-slate-700'}`}>
//               {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-1 rounded-full text-sm font-bold">الأكثر طلباً</div>}
//               <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
//               <div className="flex items-baseline gap-2 mb-6">
//                 <span className="text-4xl font-black text-emerald-400">{plan.price}</span>
//                 <span className="text-slate-400">ريال/{plan.period}</span>
//               </div>
//               <ul className="space-y-3 mb-8">
//                 {plan.features.map((f, j) => (
//                   <li key={j} className="flex items-center gap-2 text-slate-300">
//                     <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center"><div className="w-2 h-2 bg-emerald-400 rounded-full" /></div>
//                     {f}
//                   </li>
//                 ))}
//               </ul>
//               <Link to="/register" className={`block text-center py-3 rounded-xl font-bold transition ${plan.popular ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg' : 'border border-slate-600 hover:bg-slate-700'}`}>
//                 اشترك الآن
//               </Link>
//             </div>
//           ))}
//         </div>
//         <p className="text-center text-slate-400 mt-8">خصم 20% للاشتراك السنوي • 14 يوم تجربة مجانية</p>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-slate-800 py-12 text-center text-slate-500">
//         <p>نظام دورك - حلول ذكية لإدارة الانتظار © 2026</p>
//       </footer>
//     </div>
//   );
// };

// export default Home;

// جديد-------------------------
// ============================================
// ملف: Home.jsx
// الغرض: صفحة الهبوط الرئيسية (Landing Page)
// التصميم: داكن + أخضر (الأصلي الأجمل!)
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bell, ArrowLeft, QrCode, Ticket, Smartphone,
  Scissors, UtensilsCrossed, Droplets, Wrench, Sparkles,
  CheckCircle, Clock, Users, Volume2, Monitor
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans overflow-x-hidden">

      {/* ====================================== */}
      {/* Navbar — شريط التنقل */}
      {/* ====================================== */}
      <nav className="border-b border-slate-800/50 backdrop-blur-lg bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">نظام دورك</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-2 rounded-xl border border-slate-600 hover:bg-slate-800 transition text-sm">
              تسجيل الدخول
            </Link>
            <Link to="/register" className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition font-semibold text-sm">
              سجل محلك
            </Link>
          </div>
        </div>
      </nav>

      {/* ====================================== */}
      {/* Hero Section — القسم الرئيسي */}
      {/* ====================================== */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          {/* العنوان الرئيسي الجديد */}
          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
            ودع <span className="text-slate-500">الطوابير</span>
          </h1>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            رحب بدورك
          </h1>

          {/* الوصف */}
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            نظام ذكي لإدارة دور الانتظار في المحلات التجارية
            <br />
            ومتاحة موقعهم في الطابور لحظة بلحظة
          </p>

          {/* الأزرار الجديدة */}
          <div className="flex gap-4 justify-center mb-16">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition flex items-center gap-2"
            >
              جرب كصاحب محل
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link 
              to="/join/demo" 
              className="px-8 py-4 border-2 border-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-800 hover:border-emerald-500 transition flex items-center gap-2"
            >
              جرب كزبون
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>

          {/* المميزات الصغيرة */}
          <div className="flex justify-center gap-8 text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              بدون تطبيقات
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              إشعارات فورية
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              تجربة مجانية
            </span>
          </div>
        </motion.div>
      </section>

      {/* ====================================== */}
      {/* 3 خطوات بسيطة — تجربة بلا احتكاك */}
      {/* ====================================== */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">ثلاث خطوات بسيطة</h2>
          <p className="text-slate-400">تجربة بلا احتكاك</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* الخطوة 1: مسح QR */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700 text-center hover:border-emerald-500/50 transition"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
              <QrCode className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">يمسح الزبون الرمز</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              كاميرا الهاتف تكفي. بدون تطبيقات، بدون إنشاء حساب — مجرد مسح QR بسيط
            </p>
          </motion.div>

          {/* الخطوة 2: يأخذ رقمه */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700 text-center hover:border-emerald-500/50 transition"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
              <Ticket className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">يأخذ رقمه ويتابع دوره</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              يكتب اسمه ويحصل على رقم تذكرته وموقعه في الطابور لحظة بلحظة
            </p>
          </motion.div>

          {/* الخطوة 3: ينبهه الهاتف */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700 text-center hover:border-emerald-500/50 transition"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
              <Smartphone className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">ينبهه الهاتف حين يقترب دوره</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              إشعارات فورية عند اقتراب الدور وعند المناداة — بدخل الحمل
            </p>
          </motion.div>
        </div>
      </section>

      {/* ====================================== */}
      {/* كل ما تحتاجه لإدارة الطوابير */}
      {/* ====================================== */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">كل ما تحتاجه لإدارة الطوابير</h2>
          <p className="text-slate-400">في مكان واحد</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* بطاقة 1: QR */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700 hover:border-emerald-500/50 transition"
          >
            <QrCode className="w-12 h-12 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">رمز QR لكل محل</h3>
            <p className="text-slate-400 text-sm">
              مشاركة واضحة في المحل. الزبون يمسح الرمز ويحصل على دوره بكل سهولة
            </p>
          </motion.div>

          {/* بطاقة 2: شاشة */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700 hover:border-emerald-500/50 transition"
          >
            <Monitor className="w-12 h-12 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">شاشة عرض للزبائن</h3>
            <p className="text-slate-400 text-sm">
              تعرض أرقام الدور الحالي والأرقام القادمة بوضوح تام
            </p>
          </motion.div>

          {/* بطاقة 3: إشعارات */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700 hover:border-emerald-500/50 transition"
          >
            <Volume2 className="w-12 h-12 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">تنبيهات ذكية للزبائن</h3>
            <p className="text-slate-400 text-sm">
              إشعارات فورية عند اقتراب الدور وعند المناداة — لا داعي للانتظار في المكان
            </p>
          </motion.div>
        </div>
      </section>

      {/* ====================================== */}
      {/* مناسب لكل محل خدمي */}
      {/* ====================================== */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">مناسب لكل محل خدمي</h2>
          <p className="text-slate-400">أي نوع محل، أي حجم</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {/* مقص — حلاق */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 text-center hover:border-emerald-500/50 transition"
          >
            <Scissors className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-bold">صالونات</h3>
            <p className="text-slate-400 text-xs mt-1">حلاقة وتجميل</p>
          </motion.div>

          {/* مطعم */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 text-center hover:border-emerald-500/50 transition"
          >
            <UtensilsCrossed className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-bold">مطاعم</h3>
            <p className="text-slate-400 text-xs mt-1">ومقاهي</p>
          </motion.div>

          {/* مغسلة */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 text-center hover:border-emerald-500/50 transition"
          >
            <Droplets className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-bold">مغاسل</h3>
            <p className="text-slate-400 text-xs mt-1">سيارات وملابس</p>
          </motion.div>

          {/* ورشة */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 text-center hover:border-emerald-500/50 transition"
          >
            <Wrench className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-bold">ورش صيانة</h3>
            <p className="text-slate-400 text-xs mt-1">سيارات وأجهزة</p>
          </motion.div>

          {/* تجميل */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 text-center hover:border-emerald-500/50 transition"
          >
            <Sparkles className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-bold">صالونات تجميل</h3>
            <p className="text-slate-400 text-xs mt-1">نسائي ورجالي</p>
          </motion.div>
        </div>
      </section>

           {/* ====================================== */}
      {/* الأسعار — Freemium */}
      {/* ====================================== */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">أسعار واضحة. إبدأ مجاناً ووسّع متى شئت</h2>
          <p className="text-slate-400">14 يوم تجربة مجانية — لا تحتاج بطاقة</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* باقة التجربة المجانية */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700 hover:border-emerald-500/30 transition"
          >
            <h3 className="text-xl font-bold mb-2 text-white">التجربة</h3>
            <p className="text-slate-400 text-sm mb-6">14 يوم مجاناً</p>
            <div className="text-4xl font-black text-white mb-6">
              0 <span className="text-lg font-normal text-slate-400">ر.س</span>
            </div>
            <ul className="space-y-3 mb-8 text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                100 دور/شهر
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                شاشة واحدة
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                إشعارات صوتية
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                QR Code للمحل
              </li>
            </ul>
            <Link 
              to="/register" 
              className="block text-center border-2 border-slate-600 text-slate-300 py-3 rounded-xl font-bold hover:border-emerald-500 hover:text-emerald-400 transition"
            >
              ابدأ التجربة
            </Link>
          </motion.div>

          {/* باقة احترافية — الأكثر طلباً */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-b from-emerald-600/20 to-teal-700/20 backdrop-blur rounded-2xl p-8 border-2 border-emerald-500/50 relative transform scale-105"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1 rounded-full text-sm font-bold text-white">
              الأكثر طلباً 🔥
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">الاحترافية</h3>
            <p className="text-emerald-300 text-sm mb-6">للمحلات الناشئة</p>
            <div className="text-4xl font-black text-white mb-2">
              99 <span className="text-lg font-normal text-emerald-300">ر.س/شهر</span>
            </div>
            <p className="text-slate-400 text-sm mb-6">أو 950 ريال/سنة (توفر 20%)</p>
            <ul className="space-y-3 mb-8 text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                دور غير محدود
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                3 شاشات عرض
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                إشعارات SMS
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                تقارير يومية/شهرية
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                دعم فني
              </li>
            </ul>
            <Link 
              to="/register" 
              className="block text-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition"
            >
              اشترك الآن
            </Link>
          </motion.div>

          {/* باقة مؤسسات */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700 hover:border-emerald-500/30 transition"
          >
            <h3 className="text-xl font-bold mb-2 text-white">المؤسسات</h3>
            <p className="text-slate-400 text-sm mb-6">للسلاسل والفروع</p>
            <div className="text-4xl font-black text-white mb-2">
              299 <span className="text-lg font-normal text-slate-400">ر.س/شهر</span>
            </div>
            <p className="text-slate-400 text-sm mb-6">أو 2,870 ريال/سنة (توفر 20%)</p>
            <ul className="space-y-3 mb-8 text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                كل مميزات الاحترافية
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                شاشات غير محدودة
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                API للربط مع أنظمة أخرى
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                دعم فني 24/7
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                تخصيص كامل
              </li>
            </ul>
            <button className="w-full border-2 border-slate-600 text-slate-300 py-3 rounded-xl font-bold hover:border-emerald-500 hover:text-emerald-400 transition">
              تواصل معنا
            </button>
          </motion.div>
        </div>

        {/* ملاحظة أسفل الباقات */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          💡 جميع الباقات تشمل 14 يوم تجربة مجانية — إلغِ في أي وقت
        </div>
      </section>

      {/* ====================================== */}
      {/* CTA — حوّل محلك */}
      {/* ====================================== */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-12 text-center border border-emerald-500/30 shadow-2xl shadow-emerald-500/20"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            حوّل محلك إلى تجربة بلا طوابير
          </h2>
          <p className="text-emerald-100 mb-8 text-lg">
            اليوم
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-white text-emerald-700 rounded-2xl font-bold text-lg hover:bg-gray-100 transition flex items-center gap-2"
            >
              ابدأ الآن
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link 
              to="/join/demo" 
              className="px-8 py-4 bg-emerald-800/50 text-white border border-emerald-400/30 rounded-2xl font-bold text-lg hover:bg-emerald-800/70 transition flex items-center gap-2"
            >
              شاهد تجربة الزبون
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 text-center text-slate-500">
        <p>نظام دورك — حلول ذكية لإدارة الانتظار © 2026</p>
      </footer>
    </div>
  );
};

export default Home;