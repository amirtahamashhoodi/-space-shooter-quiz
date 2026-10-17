import React, { useState, useEffect, useRef } from 'react';
import Phaser from 'phaser';
import SpaceBlasterScene from './SpaceBlasterScene';

const QUESTIONS = [
  {
    q: "کدام یک از عناصر زیر فلز است؟",
    options: ["گوگرد", "مس", "اکسیژن", "نیتروژن"],
    correct: 1 // مس
  },
  {
    q: "بار الکتریکی پروتون در اتم چیست؟",
    options: ["مثبت (+)", "منفی (-)", "خنثی", "متغیر"],
    correct: 0 // مثبت
  },
  {
    q: "کدام ذره در هسته اتم قرار ندارد؟",
    options: ["پروتون", "نوترون", "الکترون", "هیچ‌کدام"],
    correct: 2 // الکترون
  },
  {
    q: "یکای اندازه‌گیری نیرو در فیزیک چیست؟",
    options: ["ژول", "وات", "نیوتون", "پاسکال"],
    correct: 2 // نیوتون
  },
  {
    q: "سرعت نور تقریباً چند کیلومتر بر ثانیه است؟",
    options: ["۳۰۰ هزار", "۱۵۰ هزار", "۳۰ هزار", "۱ میلیون"],
    correct: 0 // ۳۰۰ هزار
  }
];

export default function App() {
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(QUESTIONS[0]);
  const [qIndex, setQIndex] = useState(0);

  const containerRef = useRef(null);
  const gameRef = useRef(null);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setCombo(0);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing' || !containerRef.current) return;

    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: SpaceBlasterScene
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    game.registry.set('questions', QUESTIONS);

    const handleScore = (e) => {
      setScore(e.detail.score);
      setLives(e.detail.lives);
      setCombo(e.detail.combo);
    };

    const handleQuestion = (e) => {
      setCurrentQuestion(e.detail.question);
      setQIndex(e.detail.index);
    };

    const handleOver = (e) => {
      setScore(e.detail.score);
      setGameState('gameover');
    };

    window.addEventListener('cyberquiz:score', handleScore);
    window.addEventListener('cyberquiz:question', handleQuestion);
    window.addEventListener('cyberquiz:gameover', handleOver);

    return () => {
      window.removeEventListener('cyberquiz:score', handleScore);
      window.removeEventListener('cyberquiz:question', handleQuestion);
      window.removeEventListener('cyberquiz:gameover', handleOver);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [gameState]);

  return (
    <div style={{ background: '#020617', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Tahoma, sans-serif' }}>
      
      {gameState === 'menu' && (
        <div style={{ textAlign: 'center', background: '#0b1329', padding: '40px 50px', borderRadius: '18px', border: '1px solid #1e293b', boxShadow: '0 0 35px rgba(56,189,248,0.2)' }}>
          <h1 style={{ fontSize: '38px', color: '#38bdf8', fontWeight: '900', marginBottom: '14px' }}>
            ⚡ سایبر کوییز (CyberQuiz) ⚡
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '8px' }}>
            حرکت سفینه: کلیدهای [W, A, S, D] یا جهت‌نماها
          </p>
          <p style={{ color: '#38bdf8', fontSize: '16px', fontWeight: 'bold', marginBottom: '24px' }}>
            شلیک لیزر به پاسخ درست: کلید [Space]
          </p>
          <button
            onClick={startGame}
            style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '14px 40px', fontSize: '18px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 20px rgba(14,165,233,0.4)' }}
          >
            ورود به بازی 🎮
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0b1329', padding: '12px 20px', borderRadius: '14px 14px 0 0', border: '1px solid #1e293b', borderBottom: 'none' }} dir="rtl">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#facc15', fontSize: '18px', fontWeight: 'bold' }}>⭐ {score}</span>
              {combo > 1 && <span style={{ background: '#ea580c', padding: '3px 9px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>X{combo} کمبو 🔥</span>}
            </div>

            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#38bdf8' }}>
              {currentQuestion ? `سوال ${qIndex + 1}: ${currentQuestion.q}` : 'در حال آماده‌سازی...'}
            </span>

            <span style={{ fontSize: '18px' }}>{'❤️'.repeat(Math.max(0, lives))}</span>
          </div>

          <div
            ref={containerRef}
            style={{ width: '800px', height: '600px', border: '1px solid #1e293b', borderRadius: '0 0 14px 14px', overflow: 'hidden', boxShadow: '0 0 45px rgba(56, 189, 248, 0.25)' }}
          />
        </div>
      )}

      {gameState === 'gameover' && (
        <div style={{ textAlign: 'center', background: '#0b1329', padding: '40px', borderRadius: '16px', border: '1px solid #ef4444', boxShadow: '0 0 35px rgba(239,68,68,0.3)' }}>
          <h2 style={{ fontSize: '32px', color: '#f87171', marginBottom: '14px' }}>سفینه منهدم شد! 💥</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '24px', fontSize: '18px' }}>
            امتیاز نهایی: <strong style={{ color: '#facc15', fontSize: '26px' }}>{score}</strong>
          </p>
          <button
            onClick={startGame}
            style={{ background: '#22c55e', color: '#000', border: 'none', padding: '14px 34px', fontSize: '18px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            تلاش مجدد 🔄
          </button>
        </div>
      )}
    </div>
  );
}
