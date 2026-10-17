import React from 'react';
import Header from '../component/Header';
import HeroVisual from '../component/HeroVisual';
import StudentJoinCard from '../component/StudentJoinCard';
import FeatureStrip from '../component/FeatureStrip';
import HowItWorks from '../component/HowItWorks';
import GameModes from '../component/GameModes';
import TeacherCTA from '../component/TeacherCTA';
import Footer from '../component/Footer';

export default function LandingPage({ onStartGame, onTeacherClick }) {
  const scrollToJoin = () => {
    document.getElementById('join-card')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  return (
    <div className="landing-page" id="top" dir="rtl">
      <Header
        onTeacherClick={onTeacherClick}
        onJoinClick={scrollToJoin}
      />

      <main>
        <section className="hero-section">
          <div className="hero-grid container">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="badge-dot" />
                پلتفرم بازی‌محور یادگیری و آزمون کلاسی
              </div>

              <h1>
                کلاس را به
                <span> میدان نبرد یادگیری </span>
                تبدیل کن
              </h1>

              <p className="hero-description">
                سایبرکوییز آزمون‌های کلاسی را به تجربه‌ای رقابتی، جذاب و
                قابل‌اندازه‌گیری تبدیل می‌کند؛ برای یادگیری بهتر و مشارکت بیشتر
                دانش‌آموزان.
              </p>

              <div className="hero-trust-row">
                <span>
                  <b>✓</b> بدون ثبت‌نام دانش‌آموز
                </span>
                <span>
                  <b>✓</b> مناسب کلاس و تمرین
                </span>
              </div>

              <StudentJoinCard onStartGame={onStartGame} />
            </div>

            <div className="hero-side">
              <HeroVisual />

              <div className="hero-side-caption">
                <span className="caption-icon">✦</span>
                هر پاسخ درست، یک قدم نزدیک‌تر به پیروزی
              </div>
            </div>
          </div>

          <div className="hero-bottom-fade" />
        </section>

        <FeatureStrip />
        <HowItWorks />
        <GameModes />
        <TeacherCTA onTeacherClick={onTeacherClick} />
      </main>

      <Footer onTeacherClick={onTeacherClick} />
    </div>
  );
}
