import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      number: '۰۱',
      icon: '📚',
      title: 'سؤال‌ها آماده می‌شوند',
      text: 'معلم می‌تواند از بانک سؤال استفاده کند یا سؤال‌های خودش را وارد کند.'
    },
    {
      number: '۰۲',
      icon: '🚀',
      title: 'مأموریت شروع می‌شود',
      text: 'معلم کد بازی را به دانش‌آموزان می‌دهد و مسابقه آغاز می‌شود.'
    },
    {
      number: '۰۳',
      icon: '🏆',
      title: 'نتیجه دیده می‌شود',
      text: 'امتیاز، نمره و عملکرد دانش‌آموزان در پایان قابل مشاهده است.'
    }
  ];

  return (
    <section className="how-section" id="how-it-works">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">فرآیند ساده و سریع</span>
          <h2>سایبرکوییز چطور کار می‌کند؟</h2>
          <p>
            از آماده‌سازی سؤال تا دیدن نتیجه، همه‌چیز برای یک کلاس روان و جذاب
            طراحی شده است.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <article className="step-card">
                <div className="step-top">
                  <span className="step-number">{step.number}</span>
                  <span className="step-icon">{step.icon}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>

              {index < steps.length - 1 && (
                <div className="step-arrow" aria-hidden="true">
                  ←
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
