// src/component/student/StudentPortal.jsx
import React, { useState } from 'react';
import StudentJoinCard from './StudentJoinCard';
import SpaceBlasterGame from '../game/SpaceBlasterGame';

export default function StudentPortal({ onBackToHome }) {
  // وضعیت جاری: 'join' (فرم ورود) | 'playing' (در حال بازی) | 'finished' (پایان مسابقه)
  const [stage, setStage] = useState('join');
  const [playerInfo, setPlayerInfo] = useState({ name: '', code: '' });
  const [finalResult, setFinalResult] = useState(null);

  // دریافت پکیج سوالات ذخیره‌شده معلم از لوکال استوریج (اگر وجود داشت، وگرنه پیش‌فرض)
  const getActivePackage = (pinCode) => {
    try {
      const saved = localStorage.getItem(`cyberquiz_package_${pinCode}`) || localStorage.getItem('cyberquiz_active_package');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('پکیج محلی یافت نشد، استفاده از سوالات پیش‌فرض');
    }
    return null; // در این صورت SpaceBlaster خودش سوالات پیش‌فرض علوم هشتم را لود می‌کند
  };

  // ۱. وقتی دانش‌آموز دکمه ورود به بازی را می‌زند
  const handleStartGame = ({ code, name }) => {
    setPlayerInfo({ code, name });
    setStage('playing');
  };

  // ۲. پایان بازی
  const handleGameOver = (result) => {
    setFinalResult(result);
    // ذخیره موقت امتیاز دانش‌آموز در لوکال برای رتبه‌بندی
    try {
      const scoreRecord = {
        name: playerInfo.name,
        score: result.score,
        correct: result.correctAnswers,
        total: result.totalQuestions,
        timestamp: Date.now()
      };
      const existing = JSON.parse(localStorage.getItem(`cyberquiz_scores_${playerInfo.code}`) || '[]');
      existing.push(scoreRecord);
      localStorage.setItem(`cyberquiz_scores_${playerInfo.code}`, JSON.stringify(existing));
    } catch (e) {
      console.error('خطا در ذخیره امتیاز محلی', e);
    }
  };

  // بازگشت به فرم ورود
  const handleReset = () => {
    setStage('join');
    setFinalResult(null);
  };

  return (
    <div className="min-h-screen bg-[#050b18] text-white flex flex-col justify-between">
      {/* هدر ساده کارتابل دانش‌آموز */}
      <header className="border-b border-cyan-500/20 bg-[#0d1527]/80 backdrop-blur-md py-3 px-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
          <h1 className="text-base font-bold text-cyan-200">سایبرکوییز دانش‌آموز</h1>
        </div>
        {stage === 'join' && onBackToHome && (
          <button
            onClick={onBackToHome}
            className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700"
          >
            صفحه اصلی
          </button>
        )}
      </header>

      {/* بدنه اصلی کارتابل */}
      <main className="flex-1 flex items-center justify-center p-4">
        {stage === 'join' && (
          <div className="w-full max-w-md">
            <StudentJoinCard onStartGame={handleStartGame} />
          </div>
        )}

        {stage === 'playing' && (
          <div className="w-full h-full flex flex-col">
            {/* نمایش نام پایلوت (دانش‌آموز) بالای بازی */}
            <div className="bg-slate-900/90 text-center py-1 text-xs text-cyan-400 border-b border-cyan-900 flex justify-between px-4">
              <span>خلبان: <strong>{playerInfo.name}</strong></span>
              <span>کد ماموریت: <strong>{playerInfo.code}</strong></span>
            </div>

            <SpaceBlasterGame
              activePackage={getActivePackage(playerInfo.code)}
              onGameOver={handleGameOver}
              onBackToLobby={handleReset}
            />
          </div>
        )}
      </main>
    </div>
  );
}
