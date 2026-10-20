// src/component/teacher/StudentSharePanel.jsx
import React, { useState } from 'react';
import { t } from '../../utils/i18n';

export default function StudentSharePanel({ activePackage, onBack, onGoToProjector }) {
  const [copied, setCopied] = useState(false);
  const quiz = activePackage || JSON.parse(localStorage.getItem('cyberquiz_active_package') || '{}');

  // ساخت کد دسترسی ۶ رقمی برای بسته
  const accessPin = quiz.id ? quiz.id.replace('quiz_', '').slice(-6) : '842109';
  const shareLink = `${window.location.origin}/?pin=${accessPin}&mode=prestudy`;

  // نسخه دانش‌آموز بدون جواب درست (کلید correct پاک می‌شود)
  const studentPackage = {
    title: quiz.title,
    pin: accessPin,
    template: quiz.template,
    questionCount: quiz.questions?.length || 0,
    questions: (quiz.questions || []).map((q) => ({
      id: q.id,
      text: q.text,
      options: q.options,
      topic: q.topic,
      difficulty: q.difficulty
    }))
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadOfflineJSON = () => {
    const blob = new Blob([JSON.stringify(studentPackage, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberQuiz_PreStudy_${accessPin}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="student-share-panel space-y-6">
      {/* هدر پنل */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-mono">
            وضعیت: آماده پیش‌مطالعه دانش‌آموزان
          </span>
          <h2 className="text-2xl font-bold text-cyan-300 mt-2">
            ارسال و اشتراک‌گذاری بسته پیش‌مطالعه
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            آزمون: <span className="text-white font-medium">{quiz.title || 'بدون عنوان'}</span>
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition text-sm cursor-pointer"
        >
          بازگشت به ویرایشگر
        </button>
      </div>

      {/* کارت کد دسترسی و لینک */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0d1527] border border-cyan-500/30 rounded-2xl p-6 text-center flex flex-col justify-center items-center">
          <span className="text-gray-400 text-sm mb-2">کد ورود پیش‌مطالعه دانش‌آموزان (PIN)</span>
          <div className="text-4xl font-extrabold tracking-widest text-cyan-300 bg-black/40 px-6 py-3 rounded-xl border border-cyan-500/40">
            {accessPin}
          </div>
          <span className="text-xs text-gray-500 mt-3">
            دانش‌آموز می‌تواند این کد را در صفحه اصلی وارد کند
          </span>
        </div>

        <div className="bg-[#0d1527] border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-white font-bold text-sm mb-2">روش‌های ارسال به کلاس</h4>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              دانش‌آموزان قبل از جلسه امتحان می‌توانند سوالات را بدون دیدن جواب نهایی مرور کنند تا برای بازی رقابتی کلاسی آماده شوند.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 px-4 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-sm font-semibold rounded-xl transition cursor-pointer flex justify-center items-center gap-2"
            >
              <span>{copied ? '✓ لینک کپی شد' : '🔗 کپی لینک پیش‌مطالعه (برای شاد / بله / پیامک)'}</span>
            </button>

            <button
              onClick={handleDownloadOfflineJSON}
              className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-semibold rounded-xl transition cursor-pointer flex justify-center items-center gap-2"
            >
              <span>💾 دانلود فایل آفلاین بسته (JSON بدون پاسخ)</span>
            </button>
          </div>
        </div>
      </div>

      {/* پیش‌نمایش سوالات از دید دانش‌آموز */}
      <div className="bg-[#0d1527]/70 border border-gray-800 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-800 pb-3">
          <h4 className="text-white font-bold text-sm">
            پیش‌نمایش دید دانش‌آموز ({studentPackage.questionCount} سوال)
          </h4>
          <span className="text-xs text-amber-400/80 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
            پاسخ‌های صحیح از بسته دانش‌آموز مخفی شده‌اند
          </span>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {studentPackage.questions.map((q, idx) => (
            <div key={q.id} className="bg-black/30 border border-gray-800 p-3 rounded-xl text-xs">
              <p className="text-cyan-200 font-medium mb-2">
                {idx + 1}. {q.text}
              </p>
              <div className="grid grid-cols-2 gap-2 text-gray-400">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="bg-gray-900/60 p-1.5 rounded border border-gray-800">
                    {oIdx + 1}) {opt}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* دکمه انتقال به روز مسابقه */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onGoToProjector}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.3)] text-sm flex items-center gap-2"
        >
          <span>آماده‌اید برای روز مسابقه؟ رفتن به لابی پروژکتور کلاس</span>
          <span>←</span>
        </button>
      </div>
    </div>
  );
}
