// src/component/game/SpaceBlasterGame.jsx
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import SpaceBlasterScene from '../../SpaceBlasterScene';
import { t } from '../../utils/i18n';

export default function SpaceBlasterGame({ activePackage, onGameOver, onBackToLobby }) {
  const gameContainerRef = useRef(null);
  const gameInstanceRef = useRef(null);

  // استیت‌های هاد (HUD) و نمایش لحظه‌ای بازی روی پروژکتور
  const [hudData, setHudData] = useState({
    score: 0,
    lives: 3,
    maxLives: 3,
    combo: 0,
    bombs: 1,
    hasShield: false,
    correctAnswers: 0,
    totalQuestions: activePackage?.questions?.length || 5
  });

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [gameOverResult, setGameOverResult] = useState(null);

  useEffect(() => {
    // سوالات دریافتی از بسته معلم یا سوالات پیش‌فرض علوم هشتم
    const questions = activePackage?.questions?.length > 0 
      ? activePackage.questions 
      : [
          { question: "کدام یک از عناصر زیر فلز است؟", options: ["گوگرد", "مس", "اکسیژن", "نیتروژن"], correct: 1 },
          { question: "بار الکتریکی پروتون در اتم چیست؟", options: ["مثبت (+)", "منفی (-)", "خنثی", "متغیر"], correct: 0 },
          { question: "فرمول شیمیایی آب چیست؟", options: ["CO2", "H2O", "NaCl", "O2"], correct: 1 },
          { question: "کدام لایه زمین حالت خمیری دارد؟", options: ["پوسته", "گوشته بالایی (استه‌نوسفر)", "هسته خارجی", "هسته داخلی"], correct: 1 },
          { question: "واحد اندازه‌گیری نیروی گرانش یا وزن چیست؟", options: ["کیلوگرم", "نیوتن", "ژول", "وات"], correct: 1 }
        ];

    // تنظیمات بازی فیزر
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameContainerRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [new SpaceBlasterScene(questions)]
    };

    // ایجاد نمونه بازی
    const game = new Phaser.Game(config);
    gameInstanceRef.current = game;

    // لیسنر برای به‌روزرسانی امتیازات و هاد
    const handleScoreEvent = (e) => {
      setHudData(prev => ({ ...prev, ...e.detail }));
    };

    // لیسنر برای سوال فعلی روی صفحه
    const handleQuestionEvent = (e) => {
      setCurrentQuestion(e.detail);
    };

    // لیسنر پایان بازی
    const handleGameOverEvent = (e) => {
      setGameOverResult(e.detail);
      if (onGameOver) onGameOver(e.detail);
    };

    window.addEventListener('cyberquiz:score', handleScoreEvent);
    window.addEventListener('cyberquiz:question', handleQuestionEvent);
    window.addEventListener('cyberquiz:gameover', handleGameOverEvent);

    // پاکسازی هنگام بستن کامپوننت
    return () => {
      window.removeEventListener('cyberquiz:score', handleScoreEvent);
      window.removeEventListener('cyberquiz:question', handleQuestionEvent);
      window.removeEventListener('cyberquiz:gameover', handleGameOverEvent);

      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, [activePackage]);

  return (
    <div className="relative w-full h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      
      {/* هاد بالای صفحه (مخصوص پروژکتور کلاس) */}
      <div className="absolute top-4 left-6 right-6 z-20 flex justify-between items-center bg-slate-900/80 border border-slate-700/60 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl text-white">
        
        {/* اطلاعات آزمون و سوال جاری */}
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
          <div>
            <h2 className="text-sm font-bold text-cyan-300">
              {activePackage?.title || 'آزمون جامع علوم هشتم - نوبت اول'}
            </h2>
            <p className="text-xs text-slate-400">
              {currentQuestion ? `سوال ${currentQuestion.index + 1} از ${currentQuestion.total}` : 'در حال بارگذاری سوالات...'}
            </p>
          </div>
        </div>

        {/* قلب‌ها / جان‌ها و سپر */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 ml-1">جان:</span>
            {Array.from({ length: hudData.maxLives }).map((_, idx) => (
              <span key={idx} className={`text-lg ${idx < hudData.lives ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'text-slate-700'}`}>
                ❤️
              </span>
            ))}
          </div>

          {hudData.hasShield && (
            <div className="bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-pulse">
              🛡️ سپر فعال
            </div>
          )}

          <div className="bg-slate-950/60 px-4 py-1.5 rounded-xl border border-slate-800 text-amber-400 font-bold text-sm">
            🔥 کمبو: ×{hudData.combo}
          </div>

          <div className="bg-slate-950/60 px-4 py-1.5 rounded-xl border border-slate-800 text-pink-400 font-bold text-sm">
            💣 بمب: {hudData.bombs}
          </div>

          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 px-5 py-1.5 rounded-xl text-cyan-300 font-black text-base shadow-inner">
            امتیاز: {hudData.score} XP
          </div>
        </div>

        {/* دکمه خروج اضطراری به لابی */}
        <button 
          onClick={onBackToLobby}
          className="text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 px-3 py-2 rounded-xl transition"
        >
          ✕ بازگشت به لابی
        </button>
      </div>

      {/* سوال فعلی بزرگ در بالای صفحه برای دیدن دانش‌آموزان از روی نیمکت */}
      {currentQuestion && currentQuestion.question && (
        <div className="absolute top-20 z-10 max-w-4xl text-center px-6 py-2 bg-slate-950/90 border border-cyan-500/40 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.2)]">
          <h1 className="text-lg md:text-xl font-black text-white tracking-wide">
            {currentQuestion.question.question}
          </h1>
        </div>
      )}

      {/* بوم بازی فیزر (کانتینر اصلی) */}
      <div 
        ref={gameContainerRef} 
        className="shadow-[0_0_50px_rgba(0,0,0,0.9)] rounded-2xl overflow-hidden border border-slate-800"
      />

      {/* صفحه پایان مرحله / مسابقه */}
      {gameOverResult && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(6,182,212,0.3)]">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-2xl font-black text-white mb-2">نبرد فضایی به پایان رسید!</h2>
            <p className="text-slate-400 text-sm mb-6">عملکرد کلاس و رتبه‌بندی نهایی ثبت شد.</p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6 space-y-3 text-right">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">مجموع امتیاز کسب شده:</span>
                <span className="text-cyan-400 font-bold">{gameOverResult.score} XP</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">پاسخ‌های صحیح:</span>
                <span className="text-emerald-400 font-bold">
                  {gameOverResult.correctAnswers} از {gameOverResult.totalQuestions}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">درصد تسلط بر مبحث:</span>
                <span className="text-amber-400 font-bold">
                  {gameOverResult.academic?.percentage || 0}%
                </span>
              </div>
            </div>

            <button
              onClick={onBackToLobby}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition"
            >
              بازگشت به لابی پروژکتور
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
