// src/component/teacher/ArenaSpectator.jsx
import React, { useState, useEffect } from 'react';
import { t } from '../../utils/i18n';

export default function ArenaSpectator({ activePackage, onBackToLobby }) {
  const gamePin = activePackage?.sharePin || '582914';
  const quizTitle = activePackage?.title || 'آزمون جامع علوم هشتم - نوبت اول';

  const [leaderboard, setLeaderboard] = useState([]);
  const [matchTime, setMatchTime] = useState(0);

  // تایمر مسابقه کلاسی
  useEffect(() => {
    const timer = setInterval(() => {
      setMatchTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // خواندن لحظه‌ای نتایج دانش‌آموزان از حافظه مشترک یا رویدادها
  useEffect(() => {
    const loadScores = () => {
      try {
        const key = `cyberquiz_scores_${gamePin}`;
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        
        // اگر هنوز کسی ثبت نکرده بود، چند رکورد نمونه برای تست نمایشی نگه می‌داریم
        if (stored.length === 0) {
          setLeaderboard([
            { name: 'علی رضایی', score: 1450, date: 'هم‌اکنون' },
            { name: 'مهدی حسینی', score: 1120, date: 'هم‌اکنون' },
            { name: 'پارسا کاظمی', score: 980, date: 'هم‌اکنون' }
          ]);
        } else {
          // مرتب‌سازی بر اساس بالاترین امتیاز
          const sorted = [...stored].sort((a, b) => (b.score || 0) - (a.score || 0));
          setLeaderboard(sorted);
        }
      } catch (err) {
        console.error('خطا در خواندن لیدربرد:', err);
      }
    };

    loadScores();
    const interval = setInterval(loadScores, 2000); // هر ۲ ثانیه آپدیت لیدربرد
    return () => clearInterval(interval);
  }, [gamePin]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="arena-spectator min-h-screen bg-[#030712] text-white p-6 flex flex-col justify-between select-none">
      {/* هدر پروژکتور */}
      <header className="flex justify-between items-center bg-[#0d1527]/90 border border-cyan-500/40 rounded-2xl p-5 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 rounded-full bg-rose-500 animate-ping" />
          <div>
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold block">
              نبرد کلاسی زنده روی پروژکتور
            </span>
            <h1 className="text-2xl font-black text-white">{quizTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center bg-[#070d1e] px-4 py-2 rounded-xl border border-cyan-500/30">
            <span className="text-[10px] text-gray-400 block">زمان مسابقه</span>
            <span className="text-xl font-mono font-bold text-amber-400">{formatTime(matchTime)}</span>
          </div>

          <div className="text-center bg-[#070d1e] px-4 py-2 rounded-xl border border-cyan-500/30">
            <span className="text-[10px] text-gray-400 block">کد PIN کلاس</span>
            <span className="text-xl font-mono font-black text-cyan-300 tracking-wider">{gamePin}</span>
          </div>

          <button
            onClick={onBackToLobby}
            className="px-4 py-2 bg-rose-900/40 hover:bg-rose-800 text-rose-200 border border-rose-500/40 rounded-xl text-xs font-bold transition"
          >
            پایان مسابقه و بازگشت
          </button>
        </div>
      </header>

      {/* بخش مرکزی: لیدربرد سایبرپانکی رتبه‌بندی دانش‌آموزان */}
      <main className="my-8 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* سکوی ۳ خلبان برتر (Podium Top 3) */}
        <div className="lg:col-span-1 bg-[#0b142b]/90 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
          <h2 className="text-lg font-bold text-cyan-300 mb-6 flex items-center gap-2">
            <span>🏆</span> خلبانان پیشتاز کهکشان
          </h2>

          <div className="w-full space-y-4">
            {leaderboard.slice(0, 3).map((item, index) => {
              const medals = ['🥇', '🥈', '🥉'];
              const borders = ['border-amber-400/80 bg-amber-950/20 text-amber-300', 'border-slate-300/80 bg-slate-800/30 text-slate-200', 'border-amber-700/80 bg-amber-950/20 text-amber-500'];
              return (
                <div
                  key={index}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between shadow-lg ${borders[index] || ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{medals[index]}</span>
                    <div>
                      <h3 className="font-black text-base text-white">{item.name}</h3>
                      <span className="text-xs text-gray-400">رتبه {index + 1} کلاس</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black font-mono">{item.score}</span>
                    <span className="text-[10px] block opacity-75">امتیاز XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* جدول کل نمرات کلاس به صورت زنده */}
        <div className="lg:col-span-2 bg-[#091024]/90 border border-cyan-500/20 rounded-3xl p-6 shadow-2xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📊</span> جدول امتیازات زنده کل کلاس
            </h2>
            <span className="text-xs text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
              {leaderboard.length} دانش‌آموز ثبت‌شده
            </span>
          </div>

          <div className="overflow-y-auto max-h-[460px] space-y-2 pr-1">
            {leaderboard.map((student, idx) => (
              <div
                key={idx}
                className="bg-[#0f1b38] hover:bg-[#14234a] border border-cyan-500/20 px-5 py-3 rounded-xl flex justify-between items-center transition"
              >
                <div className="flex items-center gap-4">
                  <span className="w-7 h-7 rounded-lg bg-slate-800 text-cyan-300 font-mono text-sm flex items-center justify-center font-bold">
                    #{idx + 1}
                  </span>
                  <span className="font-bold text-sm text-white">{student.name}</span>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-xs text-gray-400">{student.date || 'هم‌اکنون'}</span>
                  <div className="bg-[#030712] px-4 py-1.5 rounded-lg border border-cyan-500/30">
                    <span className="font-mono font-black text-emerald-400 text-base">{student.score}</span>
                    <span className="text-[10px] text-gray-400 mr-1">XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* نوار وضعیت زیرین پروژکتور */}
      <footer className="text-center text-xs text-gray-500 py-2 border-t border-cyan-950">
        سیستم نبرد زنده سایبرکوییز — دانش‌آموزان با پایان موج سوالات، امتیازشان خودکار در جدول بالا قرار می‌گیرد.
      </footer>
    </div>
  );
}
