import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'يجب تسجيل الدخول' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ⬇️⬇️⬇️  التعديل هنا  ⬇️⬇️⬇️
    // decoded.id ممكن يكون String أو ObjectId
    const userId = decoded.id;
    
    // جرب findById أولاً، إذا فشل جرب findOne
    let user = await User.findById(userId);
    
    if (!user) {
      // إذا ما لقى، جرب كـ String
      user = await User.findOne({ _id: userId });
    }
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'المستخدم غير موجود' });
    }
    
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ success: false, message: 'الجلسة غير صالحة' });
  }
};

export default auth;