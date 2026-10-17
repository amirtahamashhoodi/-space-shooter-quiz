import React from 'react';

export default function FeatureStrip() {
  const features = [
    {
      icon: '⚡',
      title: 'سریع و ساده',
      text: 'دانش‌آموز با یک کد وارد می‌شود.'
    },
    {
      icon: '📱',
      title: 'همه‌جا قابل اجرا',
      text: 'مناسب موبایل، تبلت و لپ‌تاپ.'
    },
    {
      icon: '📊',
      title: 'نتیجه قابل‌اندازه‌گیری',
      text: 'امتیاز و عملکرد دانش‌آموز ثبت می‌شود.'
    },
    {
      icon: '🛡️',
      title: 'مناسب کلاس',
      text: 'برای تمرین، آزمون و رقابت کلاسی.'
    }
  ];

  return (
    <section className="feature-strip" id="features">
      <div className="container feature-grid">
        {features.map((feature) => (
          <div className="feature-item" key={feature.title}>
            <div className="feature-icon">{feature.icon}</div>
            <div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
