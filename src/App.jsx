import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import SpaceBlasterScene from './SpaceBlasterScene';
import { QUESTIONS } from './data/quizData';
import LandingPage from './pages/LandingPage';
import GameScreen from './pages/GameScreen';
import GameOverScreen from './pages/GameOverScreen';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherAuthModal from './component/TeacherAuthModal';
import './App.css';

export default function App() {
  // صفحات مجاز: 'home' | 'playing' | 'gameover' | 'teacher-dashboard'
  const [screen, setScreen] = useState('home');
  const [player, setPlayer] = useState({ name: '', code: '' });

  // وضعیت باز بودن پاپ‌آپ لاگین معلم و لاگین بودن
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

  // هندلر کلیک ورود معلم: اگر لاگین بود مستقیم می‌ره تو پنل، اگر نبود مودال با کلید تازه باز می‌شه
  const handleTeacherClick = () => {
    if (isTeacherLoggedIn) {
      setScreen('teacher-dashboard');
    } else {
      setModalKey((prev) => prev + 1);
      setIsTeacherModalOpen(true);
    }
  };

  const startGame = (playerInfo = { name: 'بازیکن دمو', code: '842109' }) => {
    setPlayer(playerInfo);
    setScore(0);
    setLives(3);
    setCombo(0);
    setCurrentQuestion(QUESTIONS[0]);
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
    game.registry.set('questions', QUESTIONS);

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
      setScore(detail.score || 0);
      setScreen('gameover');
    };

    window.addEventListener('cyberquiz:score', handleScore);
    window.addEventListener('cyberquiz:question', handleQuestion);
    window.addEventListener('cyberquiz:gameover', handleGameOver);

    return () => {
      window.removeEventListener('cyberquiz:score', handleScore);
      window.removeEventListener('cyberquiz:question', handleQuestion);
      window.removeEventListener('cyberquiz:gameover', handleGameOver);

      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [screen]);

  // ۱. صفحه بازی فعال
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

  // ۲. صفحه گیم‌اور
  if (screen === 'gameover') {
    return (
      <GameOverScreen
        score={score}
        onRestart={restartGame}
        onBackHome={goHome}
      />
    );
  }

  // ۳. صفحه پنل معلم
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

  // ۴. صفحه اصلی (Landing) + مودال لاگین معلم
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
