# دليل نشر مشروع دورك أونلاين

المشروع فيه جزئين لازم تنشرهم كل واحد لحاله:
- **الباك اند** (Node/Express + MongoDB) → على Render أو Railway
- **الفرونت اند** (React/Vite) → على Vercel

---

## 1️⃣ نشر الباك اند (Render مثلاً)

1. ادخل [render.com](https://render.com) وسوّي حساب.
2. New → Web Service → اربط مستودع GitHub تبعك.
3. **Root Directory**: `backend` ⚠️ (مهم جداً، لأن مشروعك فيه مجلدين)
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. أضف متغيرات البيئة (Environment Variables) من ملف `backend/.env`:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRE`
   - `NODE_ENV=production`
   - `FRONTEND_URL` → رابط الفرونت اند بعد نشره على Vercel (تحطه بعد الخطوة 2)
7. بعد النشر، هتاخذ رابط زي: `https://dorck-backend.onrender.com`

## 2️⃣ نشر الفرونت اند (Vercel)

هذا يحل مشكلة الـ **404: NOT_FOUND** اللي واجهتها بالضبط 👇

1. ادخل [vercel.com](https://vercel.com) → Add New Project → اربط نفس المستودع.
2. **Root Directory**: اضغط "Edit" وحدد `frontend` ⚠️ (أهم خطوة، من غيرها Vercel ما يلقى المشروع أصلاً ويطلع 404)
3. Framework Preset: Vite (يكتشفه تلقائياً)
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. أضف متغير بيئة (Environment Variables):
   - `VITE_API_URL` = رابط الباك اند من الخطوة السابقة (مثال: `https://dorck-backend.onrender.com`) **بدون** `/api` في الآخر
7. اضغط Deploy.

ملف `frontend/vercel.json` (موجود بالمشروع) يحل مشكلة ثانية شائعة: لو فتحت رابط مباشر زي `/dashboard` أو `/join/xxx` بعد النشر، يطلع 404 لأن Vercel ما يعرف يوجهه لتطبيق React. الملف هذا يخلي كل الروابط ترجع لـ `index.html` وReact Router يتولى الباقي.

## 3️⃣ آخر خطوة: اربط الطرفين ببعض

بعد ما يشتغلوا الاثنين:
1. روح لإعدادات مشروع الباك اند بـ Render وحدّث `FRONTEND_URL` برابط Vercel الصحيح.
2. تأكد إن رابط `VITE_API_URL` بمشروع Vercel مطابق تماماً لرابط الباك اند (بدون `/api` بالآخر).
3. أعد النشر (Redeploy) للطرفين بعد أي تعديل بمتغيرات البيئة.

## 4️⃣ MongoDB Atlas
تأكد إن إعدادات الشبكة (Network Access) بـ MongoDB Atlas تسمح بالاتصال من أي مكان:
- Network Access → Add IP Address → `0.0.0.0/0` (Allow access from anywhere)

هذا ضروري لأن Render/Railway تستخدم IPs متغيرة، فما تقدر تحدد IP معين.
