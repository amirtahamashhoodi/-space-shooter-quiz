// src/component/teacher/QuizBuilder.jsx
import React, { useState } from 'react';
import { t } from '../../utils/i18n';

export default function QuizBuilder({ onBack, onOpenStudentShare }) {
  const [quizTitle, setQuizTitle] = useState('آزمون جامع علوم هشتم - نوبت اول');
  const [selectedTemplate, setSelectedTemplate] = useState('space-blaster');
  const [questions, setQuestions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // شبیه‌ساز حرفه‌ای پارس فایل Word و PDF با خروجی کامل ۵ سوال علوم هشتم
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setStatusMessage('');

    setTimeout(() => {
      const extracted = [
        {
          id: 1,
          text: 'کدام اندامک سلولی وظیفه تولید انرژی (ATP) را بر عهده دارد؟',
          options: ['میتوکندری', 'ریبوزوم', 'دستگاه گلژی', 'واکوئل'],
          correct: 0,
          topic: 'زیست‌شناسی - سلول',
          difficulty: 'متوسط'
        },
        {
          id: 2,
          text: 'عنصر اصلی تشکیل‌دهنده ترکیبات آلی کدام است؟',
          options: ['آهن', 'کربن', 'سدیم', 'مس'],
          correct: 1,
          topic: 'شیمی - مواد',
          difficulty: 'آسان'
        },
        {
          id: 3,
          text: 'کدام یک از موارد زیر جزو ویژگی‌های نور در فیزیک است؟',
          options: ['حرکت در خلاء با سرعت ثابت', 'نیاز به محیط مادی برای انتشار', 'جرم حجمی بالا', 'توقف در میدان مغناطیسی'],
          correct: 0,
          topic: 'فیزیک - نور و انرژی',
          difficulty: 'سخت'
        },
        {
          id: 4,
          text: 'سنگ‌های آذرین درونی حاصل سرد شدن کدام ماده هستند؟',
          options: ['لاوا در سطح زمین', 'ماگما در اعماق زمین', 'رسوبات دریایی', 'دگرگونی سنگ‌های قدیمی'],
          correct: 1,
          topic: 'زمین‌شناسی - سنگ‌ها',
          difficulty: 'متوسط'
        },
        {
          id: 5,
          text: 'واحد اندازه‌گیری انرژی در سیستم بین‌المللی (SI) چیست؟',
          options: ['وات', 'نیوتون', 'ژول', 'پاسکال'],
          correct: 2,
          topic: 'فیزیک - کار و انرژی',
          difficulty: 'آسان'
        }
      ];

      setQuestions(extracted);
      setIsProcessing(false);
      setStatusMessage(
        `فایل «${file.name}» با موفقیت خوانده شد (${extracted.length} سوال یافت شد).`
      );
    }, 1000);
  };

  const handleSaveQuizPackage = () => {
    if (!quizTitle.trim()) {
      alert('لطفاً عنوان آزمون را وارد کنید.');
      return;
    }

    if (!questions.length) {
      alert('ابتدا فایل سوالات را بارگذاری کنید تا سوالات استخراج شوند.');
      return;
    }

    const quizPackage = {
      id: `quiz_${Date.now()}`,
      title: quizTitle.trim(),
      template: selectedTemplate,
      questions,
      questionCount: questions.length,
      createdAt: new Date().toISOString(),
      status: 'prestudy-ready',
      source: 'offline-builder',
      deliveryMode: 'student-prestudy'
    };

    try {
      const existingPackages = JSON.parse(
        localStorage.getItem('cyberquiz_offline_packages') || '[]'
      );

      if (!Array.isArray(existingPackages)) {
        throw new Error('فهرست بسته‌های ذخیره‌شده معتبر نیست.');
      }

      const updatedPackages = [quizPackage, ...existingPackages];

      localStorage.setItem(
        'cyberquiz_offline_packages',
        JSON.stringify(updatedPackages)
      );

      localStorage.setItem(
        'cyberquiz_active_package',
        JSON.stringify(quizPackage)
      );

      alert('بسته پیش‌مطالعه با موفقیت ذخیره شد.');

      if (typeof onOpenStudentShare === 'function') {
        onOpenStudentShare(quizPackage);
      }
    } catch (error) {
      console.error('خطا در ذخیره بسته آزمون:', error);
      alert('در ذخیره بسته پیش‌مطالعه خطایی رخ داد.');
    }
  };

  return (
    <div className="quiz-builder">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-cyan-300">
            {t('quiz_builder.header_title')}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {t('quiz_builder.header_subtitle')}
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition text-sm cursor-pointer"
        >
          {t('quiz_builder.back_btn')}
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              {t('quiz_builder.title_label')}
            </label>
            <input
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder={t('quiz_builder.title_placeholder')}
              className="w-full bg-[#0d1527] border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              {t('quiz_builder.template_label')}
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full bg-[#0d1527] border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="space-blaster">{t('quiz_builder.templates.space_blaster')}</option>
              <option value="cyber-vault">{t('quiz_builder.templates.cyber_vault')}</option>
              <option value="tower-defense">{t('quiz_builder.templates.tower_defense')}</option>
              <option value="time-bomb">{t('quiz_builder.templates.time_bomb')}</option>
            </select>
          </div>
        </div>

        <div className="border-2 border-dashed border-cyan-500/30 rounded-2xl p-8 text-center bg-[#0d1527]/60 hover:border-cyan-400 transition">
          <div className="text-4xl mb-3">📄 📑</div>
          <h3 className="text-lg font-bold text-white mb-1">
            {t('quiz_builder.upload_title')}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {t('quiz_builder.upload_desc')}
          </p>

          <input
            type="file"
            accept=".docx,.doc,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
            onChange={handleFileUpload}
            id="quiz-file-upload-input"
            className="hidden"
          />
          <label
            htmlFor="quiz-file-upload-input"
            className="inline-block px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl cursor-pointer transition shadow-[0_0_15px_rgba(34,211,238,0.3)] text-sm"
          >
            {t('quiz_builder.upload_btn')}
          </label>
        </div>

        {isProcessing && (
          <div className="text-center py-4 text-cyan-400 animate-pulse text-sm">
            {t('quiz_builder.processing')}
          </div>
        )}

        {statusMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-center text-sm">
            {statusMessage}
          </div>
        )}

        {questions.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-gray-800">
            <h4 className="text-white font-bold text-base flex justify-between items-center">
              <span>{t('quiz_builder.cards_title')}</span>
              <span className="text-xs text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                تعداد کل سوالات استخراج شده: {questions.length}
              </span>
            </h4>

            {questions.map((q, idx) => (
              <div key={q.id} className="bg-[#0d1527] border border-cyan-500/20 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-cyan-400 font-semibold text-xs">
                    {t('quiz_builder.question_prefix')} {idx + 1} ({q.topic})
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full border ${
                      q.difficulty === 'سخت'
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                        : q.difficulty === 'متوسط'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>

                <p className="text-white text-sm mb-3 font-medium">{q.text}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2.5 rounded-lg text-xs border ${
                        oIdx === q.correct
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                          : 'bg-gray-800/40 border-gray-700/60 text-gray-300'
                      }`}
                    >
                      {oIdx + 1}. {opt} {oIdx === q.correct && ' ✓'}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleSaveQuizPackage}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl transition shadow-[0_0_20px_rgba(16,185,129,0.3)] mt-4 cursor-pointer"
            >
              {t('quiz_builder.save_offline_btn')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
