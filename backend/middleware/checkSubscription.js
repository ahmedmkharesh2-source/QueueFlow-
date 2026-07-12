// ============================================
// ملف: checkSubscription.js
// الغرض: منع صاحب المحل من استخدام ميزات الإدارة (نداء/تخطي/إكمال)
// بعد انتهاء فترة التجربة المجانية إذا ما كان مشترك بباقة مدفوعة
// ملاحظة: هذا الـ middleware يُستخدم بعد middleware "auth" دائماً
// (يحتاج req.user موجود مسبقاً)
// ============================================

const checkSubscription = (req, res, next) => {
  const sub = req.user.subscription;

  // مشترك بباقة مدفوعة فعّالة → يعدي بدون أي قيد
  if (sub?.status === 'active') {
    return next();
  }

  const trialEndsAt = sub?.trialEndsAt ? new Date(sub.trialEndsAt) : null;
  const now = new Date();

  // لسا داخل فترة التجربة المجانية → يعدي عادي
  if (trialEndsAt && now < trialEndsAt) {
    return next();
  }

  // انتهت التجربة ومافيه اشتراك فعّال → نرفض الطلب برمز 402 (Payment Required)
  return res.status(402).json({
    success: false,
    expired: true,
    trialEndsAt: trialEndsAt,
    message: 'انتهت فترة التجربة المجانية. يرجى الاشتراك لمواصلة استخدام النظام.'
  });
};

export default checkSubscription;
