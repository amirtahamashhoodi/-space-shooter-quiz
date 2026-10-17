import React from 'react';

const Steps = [
  {
    step: '۰۱',
    title: 'سؤال‌ها آماده می‌شوند',
    desc: 'معلم می‌تواند از بانک سؤال استفاده کند یا سؤال‌های خودش را وارد کند.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    )
  },
  {
    step: '۰۲',
    title: 'مأموریت شروع می‌شود',
    desc: 'معلم کد بازی را به دانش‌آموزان می‌دهد و مسابقه آغاز می‌شود.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    )
  },
  {
    step: '۰۳',
    title: 'نتیجه دیده می‌شود',
    desc: 'امتیاز، نمره و عملکرد دانش‌آموزان در پایان قابل مشاهده است.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
      </svg>
    )
  }
];

export default function HowItWorks() {
  return (
    <section className="how-section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">فرآیند ساده و سریع</span>
          <h2>سایبرکوییز چطور کار می‌کند؟</h2>
          <p>از آماده‌سازی سؤال تا دیدن نتیجه، همه‌چیز برای یک کلاس روان و جذاب طراحی شده است.</p>
        </div>

        <div className="how-grid">
          {Steps.map((item, idx) => (
            <div key={idx} className="how-card">
              <div className="how-card-top">
                <span className="how-step-badge">{item.step}</span>
                <div className="how-icon-wrap">{item.icon}</div>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
