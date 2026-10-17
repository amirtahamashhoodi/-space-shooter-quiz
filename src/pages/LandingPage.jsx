import React from 'react';
import Header from '../component/Header';
import HeroVisual from '../component/HeroVisual';
import StudentJoinCard from '../component/StudentJoinCard';
import FeatureStrip from '../component/FeatureStrip';
import HowItWorks from '../component/HowItWorks';
import GameModes from '../component/GameModes';
import TeacherCTA from '../component/TeacherCTA';
import Footer from '../component/Footer';
import { t } from '../utils/i18n';

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
                {t('landing.badge')}
              </div>

              <h1>
                {t('landing.hero_title_p1')}{' '}
                <span>{t('landing.hero_title_highlight')}</span>{' '}
                {t('landing.hero_title_p2')}
              </h1>

              <p className="hero-description">
                {t('landing.hero_desc')}
              </p>

              <div className="hero-trust-row">
                <span>
                  <b>✓</b> {t('landing.trust_no_reg')}
                </span>
                <span>
                  <b>✓</b> {t('landing.trust_fit_class')}
                </span>
              </div>

              <StudentJoinCard onStartGame={onStartGame} />
            </div>

            <div className="hero-side">
              <HeroVisual />

              <div className="hero-side-caption">
                <span className="caption-icon">✦</span>
                {t('landing.side_caption')}
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
