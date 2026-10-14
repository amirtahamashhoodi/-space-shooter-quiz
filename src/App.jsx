import React, { useState, useEffect, useRef } from 'react';

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
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [bombs, setBombs] = useState(2);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  const canvasRef = useRef(null);
  const keys = useRef({});
  const images = useRef({ ship: null, meteor: null, bg: null });

  const stateRef = useRef({
    player: { x: 370, y: 500, width: 60, height: 60, speed: 12 },
    lasers: [],
    meteors: [],
    stars: [],
    particles: [],
    lastShot: 0,
    currentQIndex: 0,
    score: 0,
    lives: 3,
    level: 1,
    combo: 0,
    bombs: 2,
    shake: 0,
    transitioning: false,
    feedbackText: null
  });

  // لود ایمن تصاویر (پشتیبانی از هر دو پسوند png و webp)
  useEffect(() => {
    const shipImg = new Image();
    shipImg.src = '/images/ship.png';
    shipImg.onerror = () => { shipImg.src = '/images/ship.webp'; };

    const meteorImg = new Image();
    meteorImg.src = '/images/meteor.png';
    meteorImg.onerror = () => { meteorImg.src = '/images/meteor.webp'; };

    const bgImg = new Image();
    bgImg.src = '/images/space-bg.png';
    bgImg.onerror = () => { bgImg.src = '/images/space-bg.webp'; };

    images.current = { ship: shipImg, meteor: meteorImg, bg: bgImg };
  }, []);

  const spawnMeteors = (qIdx, lvl) => {
    const q = QUESTIONS[qIdx % QUESTIONS.length];
    const baseSpeed = 1.8 + (lvl - 1) * 0.5;
    return q.options.map((opt, i) => ({
      index: i,
      x: 95 + i * 175,
      y: -70 - (i % 2) * 40,
      radius: 46,
      speed: baseSpeed + Math.random() * 0.4,
      text: `${i + 1}. ${opt}`,
      isCorrect: i === q.correct,
      isDestroyed: false
    }));
  };

  const triggerNukeBomb = () => {
    const s = stateRef.current;
    if (s.bombs <= 0 || s.transitioning) return;
    s.bombs -= 1;
    setBombs(s.bombs);
    s.shake = 20;

    s.meteors.forEach(m => {
      if (!m.isCorrect) m.isDestroyed = true;
    });

    for (let i = 0; i < 40; i++) {
      s.particles.push({
        x: 400,
        y: 300,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.5) * 16,
        color: '#facc15',
        alpha: 1
      });
    }
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setCombo(0);
    setBombs(2);
    setCurrentQIndex(0);

    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 600,
      speed: 1.5 + Math.random() * 2.5,
      size: Math.random() * 2 + 1
    }));

    stateRef.current = {
      player: { x: 370, y: 500, width: 60, height: 60, speed: 12 },
      lasers: [],
      meteors: spawnMeteors(0, 1),
      stars,
      particles: [],
      lastShot: 0,
      currentQIndex: 0,
      score: 0,
      lives: 3,
      level: 1,
      combo: 0,
      bombs: 2,
      shake: 0,
      transitioning: false,
      feedbackText: null
    };

    setGameState('playing');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'KeyB' || e.code === 'KeyE') {
        triggerNukeBomb();
      }
    };
    const handleKeyUp = (e) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      const s = stateRef.current;
      const p = s.player;
      const imgs = images.current;

      // حرکت سفینه
      if (keys.current['ArrowLeft'] || keys.current['KeyA']) p.x = Math.max(10, p.x - p.speed);
      if (keys.current['ArrowRight'] || keys.current['KeyD']) p.x = Math.min(800 - p.width - 10, p.x + p.speed);
      if (keys.current['ArrowUp'] || keys.current['KeyW']) p.y = Math.max(60, p.y - p.speed);
      if (keys.current['ArrowDown'] || keys.current['KeyS']) p.y = Math.min(530, p.y + p.speed);

      // شلیک
      const now = Date.now();
      if (keys.current['Space'] && now - s.lastShot > 160 && !s.transitioning) {
        s.lasers.push({ x: p.x + p.width / 2, y: p.y, speed: 20 });
        s.lastShot = now;
      }

      s.lasers.forEach(l => (l.y -= l.speed));
      s.lasers = s.lasers.filter(l => l.y > -20);

      s.stars.forEach(st => {
        st.y += st.speed;
        if (st.y > 600) {
          st.y = 0;
          st.x = Math.random() * 800;
        }
      });

      if (s.shake > 0) s.shake *= 0.84;
      if (s.shake < 0.2) s.shake = 0;

      s.particles.forEach(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.03;
      });
      s.particles = s.particles.filter(pt => pt.alpha > 0);

      const triggerCorrect = (target) => {
        target.isDestroyed = true;
        s.transitioning = true;
        s.combo += 1;
        setCombo(s.combo);

        const gained = 30 + s.combo * 10;
        s.score += gained;
        setScore(s.score);
        s.shake = 16;
        s.feedbackText = s.combo > 1 ? `عالی! کمبو X${s.combo} 🔥 (+${gained})` : `آفرین! پاسخ درست 🎯 (+${gained})`;

        for (let k = 0; k < 35; k++) {
          s.particles.push({
            x: target.x,
            y: target.y,
            vx: (Math.random() - 0.5) * 14,
            vy: (Math.random() - 0.5) * 14,
            color: '#22c55e',
            alpha: 1
          });
        }

        setTimeout(() => {
          let nextQ = s.currentQIndex + 1;
          if (nextQ >= QUESTIONS.length) {
            nextQ = 0;
            s.level += 1;
            setLevel(s.level);
          }

          s.currentQIndex = nextQ;
          setCurrentQIndex(s.currentQIndex);
          s.meteors = spawnMeteors(nextQ, s.level);
          s.lasers = [];
          s.feedbackText = null;
          s.transitioning = false;
        }, 850);
      };

      if (!s.transitioning) {
        s.meteors.forEach(m => {
          if (m.isDestroyed) return;
          m.y += m.speed;

          // برخورد سفینه با شهاب‌سنگ
          const shipDist = Math.hypot(p.x + p.width / 2 - m.x, p.y + p.height / 2 - m.y);
          if (shipDist < m.radius + 20) {
            if (m.isCorrect) {
              triggerCorrect(m);
              return;
            } else {
              m.isDestroyed = true;
              s.shake = 18;
              s.combo = 0;
              setCombo(0);
              s.lives -= 1;
              setLives(s.lives);
              if (s.lives <= 0) {
                setGameState('gameover');
                return;
              }
            }
          }

          // برخورد لیزر با شهاب‌سنگ
          for (let i = s.lasers.length - 1; i >= 0; i--) {
            const l = s.lasers[i];
            const dist = Math.hypot(l.x - m.x, l.y - m.y);
            if (dist < m.radius + 8) {
              s.lasers.splice(i, 1);
              if (m.isCorrect) {
                triggerCorrect(m);
                return;
              } else {
                m.isDestroyed = true;
                s.shake = 8;
                s.combo = 0;
                setCombo(0);
                for (let k = 0; k < 18; k++) {
                  s.particles.push({
                    x: m.x,
                    y: m.y,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8,
                    color: '#f97316',
                    alpha: 1
                  });
                }
              }
              break;
            }
          }
        });

        if (s.meteors.every(m => m.y > 640 || m.isDestroyed)) {
          s.combo = 0;
          setCombo(0);
          s.currentQIndex = (s.currentQIndex + 1) % QUESTIONS.length;
          setCurrentQIndex(s.currentQIndex);
          s.meteors = spawnMeteors(s.currentQIndex, s.level);
          s.lasers = [];
        }
      }

      // ================= رندر بازی =================
      ctx.save();
      if (s.shake > 0) {
        ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake);
      }

      // ۱. پس‌زمینه کهکشانی (با فال‌بک رنگی اگر عکس لود نشود)
      if (imgs.bg && imgs.bg.complete && imgs.bg.naturalWidth > 0) {
        ctx.drawImage(imgs.bg, 0, 0, 800, 600);
      } else {
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, 800, 600);
      }

      // ۲. ستاره‌های متحرک
      ctx.fillStyle = '#ffffff';
      s.stars.forEach(st => ctx.fillRect(st.x, st.y, st.size, st.size + 1));

      // ۳. لیزرها
      ctx.fillStyle = '#38bdf8';
      s.lasers.forEach(l => ctx.fillRect(l.x - 3, l.y, 6, 22));

      // ۴. ذرات انفجار
      s.particles.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillRect(pt.x, pt.y, 4, 4);
      });
      ctx.globalAlpha = 1;

      // ۵. رسم شهاب‌سنگ‌ها + گزینه‌ها
      s.meteors.forEach(m => {
        if (m.isDestroyed) return;
        ctx.save();

        if (imgs.meteor && imgs.meteor.complete && imgs.meteor.naturalWidth > 0) {
          ctx.drawImage(imgs.meteor, m.x - m.radius, m.y - m.radius, m.radius * 2, m.radius * 2);
        } else {
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#334155';
          ctx.fill();
        }

        // کادر متن گزینه
        ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
        ctx.fillRect(m.x - 65, m.y - 14, 130, 28);
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(m.x - 65, m.y - 14, 130, 28);

        // متن گزینه
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Tahoma, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(m.text, m.x, m.y);

        ctx.restore();
      });

      // ۶. رسم سفینه جنگنده
      ctx.save();
      if (imgs.ship && imgs.ship.complete && imgs.ship.naturalWidth > 0) {
        ctx.drawImage(imgs.ship, p.x, p.y, p.width, p.height);
      } else {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(p.x, p.y, p.width, p.height);
      }
      ctx.restore();

      // پیام درستی
      if (s.feedbackText) {
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 24px Tahoma, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(s.feedbackText, 400, 270);
      }

      ctx.restore();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div style={{ background: '#020617', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Tahoma, sans-serif' }}>
      {gameState === 'menu' && (
        <div style={{ textAlign: 'center', background: '#0b1329', padding: '40px 50px', borderRadius: '18px', border: '1px solid #1e293b' }}>
          <h1 style={{ fontSize: '36px', color: '#38bdf8', fontWeight: '900', marginBottom: '14px' }}>
            🚀 SPACE SHOOTER QUIZ
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '14px' }}>
            حرکت با کلیدهای جهتی یا [W, A, S, D] | <b>شلیک با [Space]</b>
          </p>
          <p style={{ color: '#facc15', fontSize: '14px', marginBottom: '24px' }}>
            💣 بمب پاکسازی صفحه با کلید [B]
          </p>
          <button
            onClick={startGame}
            style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '14px 36px', fontSize: '18px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            شروع ماموریت 🎮
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0b1329', padding: '12px 20px', borderRadius: '14px 14px 0 0', border: '1px solid #1e293b', borderBottom: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#facc15', fontSize: '18px', fontWeight: 'bold' }}>⭐ {score}</span>
              <span style={{ background: '#3b82f6', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>مرحله {level}</span>
              {combo > 1 && <span style={{ background: '#ea580c', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>X{combo} کمبو 🔥</span>}
              <span style={{ background: '#7c3aed', padding: '3px 8px', borderRadius: '6px', fontSize: '12px' }}>💣 بمب: {bombs}</span>
            </div>

            <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#38bdf8' }}>
              سوال {currentQIndex + 1}: {QUESTIONS[currentQIndex].q}
            </span>

            <span style={{ fontSize: '18px' }}>{'❤️'.repeat(lives)}</span>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ border: '1px solid #1e293b', borderRadius: '0 0 14px 14px', boxShadow: '0 0 40px rgba(56, 189, 248, 0.2)' }}
          />
        </div>
      )}

      {gameState === 'gameover' && (
        <div style={{ textAlign: 'center', background: '#0b1329', padding: '40px', borderRadius: '16px', border: '1px solid #ef4444' }}>
          <h2 style={{ fontSize: '32px', color: '#f87171', marginBottom: '10px' }}>سفینه منهدم شد! 💥</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '10px', fontSize: '18px' }}>مرحله: <strong style={{ color: '#38bdf8' }}>{level}</strong></p>
          <p style={{ color: '#cbd5e1', marginBottom: '24px', fontSize: '18px' }}>امتیاز نهایی: <strong style={{ color: '#facc15', fontSize: '24px' }}>{score}</strong></p>
          <button
            onClick={startGame}
            style={{ background: '#22c55e', color: '#000', border: 'none', padding: '14px 30px', fontSize: '17px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            تلاش مجدد 🔄
          </button>
        </div>
      )}
    </div>
  );
}
