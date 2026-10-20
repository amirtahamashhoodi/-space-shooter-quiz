// src/App.jsx
import React, { useEffect, useRef, useState } from 'react';
import SpaceBlasterScene from './SpaceBlasterScene';
import { QUESTIONS } from './data/quizData';
import LandingPage from './pages/LandingPage';
import GameScreen from './pages/GameScreen';
import GameOverScreen from './pages/GameOverScreen';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherAuthModal from './component/TeacherAuthModal';
import { t } from './utils/i18n';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [player, setPlayer] = useState({ name: '', code: '' });
  const [activeQuestions, setActiveQuestions] = useState(QUESTIONS);

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(QUESTIONS[0]);
  const [qIndex, setQIndex] = useState(0);

  const containerRef = useRef(null);
  const gameRef = useRef(null);

  const handleTeacherClick = () => {
    if (isTeacherLoggedIn) {
      setScreen('teacher-dashboard');
    } else {
      setModalKey((prev) => prev + 1);
      setIsTeacherModalOpen(true);
    }
  };

  // تابع آغاز بازی دانش‌آموز با اعتبارسنجی پین و پکیج سوالات
  const startGame = (playerInfo) => {
    const defaultPlayer = {
      name: t('common.default_player_name') || 'خلبان آزمایشی',
      code: '842109'
    };
    const finalPlayer = playerInfo || defaultPlayer;
    setPlayer(finalPlayer);

    // جستجوی پکیج سوالات ثبت‌شده با این PIN توسط معلم
    let questionsToUse = QUESTIONS;
    try {
      const savedPackage = localStorage.getItem(`cyberquiz_package_${finalPlayer.code}`) ||
                           localStorage.getItem('cyberquiz_active_package');
      if (savedPackage) {
        const parsed = JSON.parse(savedPackage);
        if (parsed?.questions && parsed.questions.length > 0) {
          questionsToUse = parsed.questions;
        }
      }
    } catch (e) {
      console.warn('استفاده از سوالات پیش‌فرض به دلیل عدم دسترسی به حافظه محلی');
    }

    setActiveQuestions(questionsToUse);
    setScore(0);
    setLives(3);
    setCombo(0);
    setCurrentQuestion(questionsToUse[0]);
    setQIndex(0);
    setScreen('playing');
  };

  const restartGame = () => {
    startGame(player);
  };

  const goHome = () => {
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
    setScreen('home');
  };

  useEffect(() => {
    if (screen !== 'playing' || !containerRef.current) {
      return undefined;
    }

    let isMounted = true;

    // لود Lazy فیزر
    import('phaser').then((phaserModule) => {
      if (!isMounted || !containerRef.current) return;
      const Phaser = phaserModule.default || phaserModule;

      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }

      const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: containerRef.current,
        backgroundColor: '#020617',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0 },
            debug: false
          }
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: 800,
          height: 600
        },
        render: {
          antialias: true,
          pixelArt: false,
          roundPixels: true
        },
        scene: SpaceBlasterScene
      };

      const game = new Phaser.Game(config);
      gameRef.current = game;
      // انتقال سوالات فعال و مشخصات دانش‌آموز به داخل صحنه بازی
      game.registry.set('questions', activeQuestions);
      game.registry.set('player', player);
    });

    const handleScore = (event) => {
      const detail = event.detail || {};
      setScore(detail.score || 0);
      setLives(typeof detail.lives === 'number' ? detail.lives : 3);
      setCombo(detail.combo || 0);
    };

    const handleQuestion = (event) => {
      const detail = event.detail || {};
      if (detail.question) setCurrentQuestion(detail.question);
      if (typeof detail.index === 'number') setQIndex(detail.index);
    };

    const handleGameOver = (event) => {
      const detail = event.detail || {};
      const finalScore = detail.score || score;
      setScore(finalScore);

      // ثبت نمره دانش‌آموز در لیست امتیازات PIN برای مشاهده روی پروژکتور
      try {
        const key = `cyberquiz_scores_${player.code}`;
        const prevScores = JSON.parse(localStorage.getItem(key) || '[]');
        const newRecord = {
          name: player.name || 'بدون نام',
          score: finalScore,
          date: new Date().toLocaleTimeString('fa-IR')
        };
        localStorage.setItem(key, JSON.stringify([...prevScores, newRecord]));
      } catch (err) {
        console.error('خطا در ذخیره امتیاز', err);
      }

      setScreen('gameover');
    };

    window.addEventListener('cyberquiz:score', handleScore);
    window.addEventListener('cyberquiz:question', handleQuestion);
    window.addEventListener('cyberquiz:gameover', handleGameOver);

    return () => {
      isMounted = false;
      window.removeEventListener('cyberquiz:score', handleScore);
      window.removeEventListener('cyberquiz:question', handleQuestion);
      window.removeEventListener('cyberquiz:gameover', handleGameOver);

      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [screen, activeQuestions]);

  // ۱. صفحه بازی فعال (روی موبایل دانش‌آموز)
  if (screen === 'playing') {
    return (
      <GameScreen
        score={score}
        lives={lives}
        combo={combo}
        currentQuestion={currentQuestion}
        qIndex={qIndex}
        containerRef={containerRef}
        onBackHome={goHome}
        onRestart={restartGame}
      />
    );
  }

  // ۲. صفحه کارنامه پایان بازی
  if (screen === 'gameover') {
    return (
      <GameOverScreen
        score={score}
        onRestart={restartGame}
        onBackHome={goHome}
      />
    );
  }

  // ۳. پنل معلم
  if (screen === 'teacher-dashboard') {
    return (
      <TeacherDashboard
        onLogout={() => {
          setIsTeacherLoggedIn(false);
          setScreen('home');
        }}
        onBackToHome={goHome}
      />
    );
  }

  // ۴. صفحه فرود و ورود دانش‌آموز با PIN
  return (
    <>
      <LandingPage
        onStartGame={startGame}
        onTeacherClick={handleTeacherClick}
      />

      {isTeacherModalOpen && (
        <TeacherAuthModal
          key={modalKey}
          onClose={() => setIsTeacherModalOpen(false)}
          onSuccess={() => {
            setIsTeacherLoggedIn(true);
            setIsTeacherModalOpen(false);
            setScreen('teacher-dashboard');
          }}
        />
      )}
    </>
  );
}
