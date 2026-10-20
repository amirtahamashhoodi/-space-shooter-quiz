// src/component/teacher/ProjectorLobby.jsx
import React, { useState, useEffect } from 'react';
import { t } from '../../utils/i18n';

export default function ProjectorLobby({ activePackage, onBack, onStartGame }) {
  // پین مخصوص مسابقه زنده کلاس (مستقل از پین پیش‌مطالعه یا مشتق از بسته فعلی)
  const gamePin = activePackage?.sharePin || '582914';
  const quizTitle = activePackage?.title || 'آزمون جامع علوم هشتم - نوبت اول';
  const totalQuestions = activePackage?.questions?.length || 5;
  const gameTemplate = activePackage?.template || 'space-blaster';

  // لیست دانش‌آموزان متصل به لابی
  const [players, setPlayers] = useState([
    { id: 1, name: 'علی رضایی', avatar: '🚀', ready: true },
    { id: 2, name: 'مهدی حسینی', avatar: '⚡', ready: true },
    { id: 3, name: 'پارسا کاظمی', avatar: '🛸', ready: true },
    { id: 4, name: 'آرین صادقی', avatar: '👾', ready: true }
  ]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // شبیه‌سازی ورود دانش‌آموز جدید برای تست راحت معلم
  const handleSimulateJoin = () => {
    const mockNames = ['سروش کریمی', 'امیرعلی مرادی', 'کیان نوری', 'بردیا شریفی', 'سینا باقری'];
    const avatars = ['🤖', '🔥', '🛡️', '🛰️', '⭐'];
    const unusedNames = mockNames.filter(n => !players.some(p => p.name === n));
    
    if (unusedNames.length > 0) {
      const newName = unusedNames[Math.floor(Math.random() * unusedNames.length)];
      const newAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      setPlayers(prev => [...prev, {
        id: Date.now(),
        name: newName,
        avatar: newAvatar,
        ready: true
      }]);
    }
  };

  const handleRemovePlayer = (id) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gamePin);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="projector-lobby-wrapper min-h-screen bg-[#040814] text-white p-4 md:p-8 flex flex-col justify-between">
      {/* هدر بالای صفحه پروژکتور */}
      <header className="flex flex-wrap justify-between items-center bg-[#0a1226]/90 border border-cyan-500/30 rounded-2xl p-4 md:p-6 backdrop-blur-md gap-4 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700 text-gray-300 rounded-xl transition border border-gray-600 text-sm font-medium"
          >
            ← بازگشت به اشتراک
          </button>
          <div>
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold block">
              لابی زنده پروژکتور کلاس
            </span>
            <h1 className="text-xl md:text-2xl font-black text-white">{quizTitle}</h1>
          </div>
        </div>

        {/* وضعیت اتصال شبکه مدرسه */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-emerald-400 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            هات‌اسپات محلی / آنلاین آماده
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-lg transition"
            title="صدای مسابقه"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      {/* بخش مرکزی: پین ورود درشت برای پروژکتور + اطلاعات اتصال */}
      <div className="my-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* ستون راست: کارت پین ورود فوق‌العاده بزرگ */}
        <div className="lg:col-span-1 bg-[#0b142b]/95 border-2 border-cyan-500/40 rounded-3xl p-6 flex flex-col justify-center items-center text-center shadow-[0_0_40px_rgba(6,182,212,0.2)]">
          <span className="text-cyan-300 text-sm font-bold mb-2">
            دانش‌آموزان عزیز، وارد سایت شوید و پین را وارد کنید:
          </span>
          <div className="bg-[#030712] border border-cyan-400/50 rounded-2xl px-8 py-5 my-4 w-full cursor-pointer hover:border-cyan-300 transition" onClick={handleCopyCode}>
            <span className="text-xs text-gray-400 block mb-1">کد اتصال به نبرد کلاسی (PIN)</span>
            <div className="text-5xl md:text-6xl font-black tracking-[0.25em] text-cyan-300 font-mono select-all">
              {gamePin}
            </div>
          </div>
          <button
            onClick={handleCopyCode}
            className="text-xs text-cyan-400/80 hover:text-cyan-300 underline mb-4 transition"
          >
            {isCopied ? 'کد پین کپی شد!' : 'کپی کردن کد'}
          </button>

          <div className="w-full bg-[#111c38] rounded-xl p-3 border border-gray-700 text-xs text-gray-300 space-y-1 text-right">
            <div>🔹 قالب موتور: <span className="font-bold text-yellow-400">شلیک فضایی (Space Blaster)</span></div>
            <div>🔹 کل سوالات مرحله: <span className="font-bold text-white">{totalQuestions} سوال</span></div>
            <div>🔹 سیستم نمره‌دهی: <span className="font-bold text-emerald-400">امتیاز ضربتی + کمبو</span></div>
          </div>
        </div>

        {/* ستون چپ و میانی: لیست بازیکنان ملحق شده به نبرد */}
        <div className="lg:col-span-2 bg-[#091024]/90 border border-cyan-500/20 rounded-3xl p-6 flex flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-lg md:text-xl font-bold text-white">
                  دانش‌آموزان حاضر در کابین سفینه
                </h2>
                <span className="px-3 py-1 bg-cyan-900/60 border border-cyan-400/50 rounded-full text-cyan-300 text-xs font-bold font-mono">
                  {players.length} بازیکن
                </span>
              </div>

              {/* دکمه شبیه‌ساز دانش‌آموز جدید برای تست */}
              <button
                onClick={handleSimulateJoin}
                className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-medium transition"
              >
                + شبیه‌سازی ورود دانش‌آموز
              </button>
            </div>

            {/* گرید آواتار بازیکنان */}
            {players.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <span className="text-4xl block mb-2 animate-bounce">⏳</span>
                در انتظار پیوستن دانش‌آموزان به لابی با پین فوق...
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto p-1">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="group relative bg-[#0f1b38] border border-cyan-500/20 hover:border-cyan-400/60 p-3 rounded-2xl flex items-center gap-3 transition-all transform hover:-translate-y-0.5"
                  >
                    <span className="text-2xl">{p.avatar}</span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{p.name}</p>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        آماده پرتاب
                      </span>
                    </div>
                    {/* دکمه حذف بازیکن */}
                    <button
                      onClick={() => handleRemovePlayer(p.id)}
                      className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 text-xs p-1 transition"
                      title="اخراج از بازی"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-[11px] text-gray-500 text-center mt-4">
            نکته: معلم می‌تواند در صورت مشاهده نام نامناسب روی علامت ✕ بالای نام دانش‌آموز کلیک کرده و او را از بازی خارج کند.
          </p>
        </div>
      </div>

      {/* فوتر: دکمه استارت حماسی بازی روی پروژکتور */}
      <footer className="bg-[#0b142b]/95 border border-cyan-500/30 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-xs text-gray-400 flex items-center gap-2">
          <span>🚀 وضعیت: همه سامانه‌ها در حالت آماده‌باش برای موج اول دشمنان فضایی.</span>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => onStartGame?.(activePackage)}
            disabled={players.length === 0}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
              players.length > 0
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
            }`}
          >
            <span>شروع مسابقه زنده روی پروژکتور کلاس</span>
            <span>🎮</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
