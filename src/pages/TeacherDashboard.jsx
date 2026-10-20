// src/pages/TeacherDashboard.jsx
import React, { useState } from 'react';
import { t } from '../utils/i18n';
import QuizBuilder from '../component/teacher/QuizBuilder';
import StudentSharePanel from '../component/teacher/StudentSharePanel'; // ایمپورت پنل جدید
import ProjectorLobby from '../component/teacher/ProjectorLobby';
import SpaceBlasterGame from '../component/game/SpaceBlasterGame';

export default function TeacherDashboard({ onLogout, onBackToHome }) {
// تب‌های موجود: 'menu' | 'builder' | 'share' | 'lobby' | 'game'
  const [currentTab, setCurrentTab] = useState('menu');
  const [activePackage, setActivePackage] = useState(null);

  // تابع کمکی برای بازگشت به منوی اصلی
  const goToMenu = () => {
    setCurrentTab('menu');
    setActivePackage(null);
  };

  return (
    <div className="dashboard-container min-h-screen bg-[#050b18] text-white">
      <header className="dashboard-header border-b border-cyan-500/20 bg-[#0d1527]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container header-flex flex justify-between items-center py-4 px-6 mx-auto">
          <div className="brand flex items-center gap-2">
            <span className="brand-dot w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight text-cyan-100">
              {t('teacher_dashboard.badge')}
            </h2>
          </div>
          <div className="actions flex gap-3">
            {currentTab !== 'menu' && (
              <button 
                onClick={goToMenu} 
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition text-sm border border-gray-700"
              >
                بازگشت به منو
              </button>
            )}
            <button 
              onClick={onBackToHome} 
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition text-sm border border-gray-700"
            >
              {t('teacher_dashboard.view_home')}
            </button>
            <button 
              onClick={onLogout} 
              className="px-4 py-2 bg-rose-900/40 hover:bg-rose-800 text-rose-200 rounded-xl transition text-sm border border-rose-500/30"
            >
              {t('teacher_dashboard.logout')}
            </button>
          </div>
        </div>
      </header>

      <main className="container dashboard-main mx-auto p-6 max-w-6xl">
        {currentTab === 'menu' && (
          <>
            <div className="dashboard-welcome mb-10 text-center md:text-right">
              <h2 className="text-3xl font-extrabold text-white mb-2">{t('teacher_dashboard.welcome')}</h2>
              <p className="text-gray-400">{t('teacher_dashboard.subtitle')}</p>
            </div>

            <div className="dashboard-cards-grid grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* کارت لابی (شروع مسابقه) */}
              <div className="dash-card bg-[#0d1527] border border-cyan-500/20 p-6 rounded-2xl hover:border-cyan-400/50 transition-all group">
                <div className="icon text-4xl mb-4 group-hover:scale-110 transition-transform">🎮</div>
                <h3 className="text-xl font-bold mb-2 text-cyan-100">{t('teacher_dashboard.lobby_card.title')}</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">{t('teacher_dashboard.lobby_card.desc')}</p>
                <button 
                  onClick={() => setCurrentTab('lobby')}
                  className="w-full py-3 bg-cyan-600/20 hover:bg-cyan-500 text-cyan-300 hover:text-black font-bold rounded-xl transition border border-cyan-500/40"
                >
                  {t('teacher_dashboard.lobby_card.btn')}
                </button>
              </div>

              {/* کارت ساخت آزمون جدید */}
              <div className="dash-card bg-[#0d1527] border border-cyan-500/20 p-6 rounded-2xl hover:border-cyan-400/50 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-bl-lg">جدید</div>
                <div className="icon text-4xl mb-4 group-hover:scale-110 transition-transform">📝</div>
                <h3 className="text-xl font-bold mb-2 text-cyan-100">{t('teacher_dashboard.quiz_card.title')}</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">{t('teacher_dashboard.quiz_card.desc')}</p>
                <button 
                  onClick={() => setCurrentTab('builder')} 
                  className="w-full py-3 bg-emerald-600/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-bold rounded-xl transition border border-emerald-500/40"
                >
                  {t('teacher_dashboard.quiz_card.btn')}
                </button>
              </div>

              {/* کارت مدیریت آفلاین */}
              <div className="dash-card bg-[#0d1527] border border-cyan-500/20 p-6 rounded-2xl hover:border-cyan-400/50 transition-all group">
                <div className="icon text-4xl mb-4 group-hover:scale-110 transition-transform">💾</div>
                <h3 className="text-xl font-bold mb-2 text-cyan-100">{t('teacher_dashboard.offline_card.title')}</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">{t('teacher_dashboard.offline_card.desc')}</p>
                <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl transition border border-gray-700">
                  {t('teacher_dashboard.offline_card.btn')}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ۱. صفحه ساخت آزمون */}
        {currentTab === 'builder' && (
          <QuizBuilder 
            onBack={goToMenu} 
            onOpenStudentShare={(pkg) => {
              setActivePackage(pkg);
              setCurrentTab('share');
            }}
          />
        )}

        {/* ۲. صفحه اشتراک‌گذاری پیش‌مطالعه با دانش‌آموزان */}
        {currentTab === 'share' && (
          <StudentSharePanel 
            activePackage={activePackage}
            onBack={() => setCurrentTab('builder')}
            onGoToProjector={() => setCurrentTab('lobby')}
          />
        )}

                   {/* ۳. صفحه لابی پروژکتور کلاس */}
        {currentTab === 'lobby' && (
          <ProjectorLobby 
            activePackage={activePackage}
            onBack={() => {
              if (activePackage) {
                setCurrentTab('share');
              } else {
                goToMenu();
              }
            }}
            onStartGame={(pkg) => {
              // هدایت به موتور بازی فیزر
              setCurrentTab('game');
            }}
          />
        )}

        {/* ۴. اجرای زنده بازی شلیک فضایی (Space Blaster) روی پروژکتور */}
        {currentTab === 'game' && (
          <SpaceBlasterGame 
            activePackage={activePackage}
            onBackToLobby={() => setCurrentTab('lobby')}
            onGameOver={(result) => {
              console.log('بازی تمام شد:', result);
            }}
          />
        )}


      </main>
    </div>
  );
}
