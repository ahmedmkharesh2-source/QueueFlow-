// ============================================
// ملف: ErrorBoundary.jsx
// الغرض: التقاط أي خطأ برمجي غير متوقع بأي مكان بالتطبيق
// وعرض رسالة واضحة للمستخدم بدل شاشة فاضية تماماً
// ============================================
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // نطبعه بالكونسول عشان يسهل تشخيصه لاحقاً من أدوات المطور
    console.error('حدث خطأ غير متوقع:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div dir="rtl" style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          padding: '24px',
          textAlign: 'center',
          fontFamily: "'IBM Plex Sans Arabic', sans-serif"
        }}>
          <div style={{ maxWidth: '380px' }}>
            <h2 style={{ color: 'white', fontSize: '22px', marginBottom: '12px' }}>
              حدث خطأ غير متوقع
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
              نعتذر، صار خلل بسيط بالصفحة. جرب تحديث الصفحة مرة ثانية.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#10b981',
                color: '#0f172a',
                fontWeight: 'bold',
                padding: '14px 28px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
