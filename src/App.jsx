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
  const [bombs, setBombs] = useState(1);
  const [shieldActive, setShieldActive] = useState(false);
  const [dualLaserActive, setDualLaserActive] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  const canvasRef = useRef(null);
  const keys = useRef({});

  const stateRef = useRef({
    player: { x: 376, y: 520, width: 48, height: 44, speed: 15 },
    lasers: [],
    meteors: [],
    obstacles: [], // سنگ‌های مزاحم فضایی
    powerups: [],
    stars: [],
    particles: [],
    lastShot: 0,
    currentQIndex: 0,
    score: 0,
    lives: 3,
    level: 1,
    combo: 0,
    bombs: 1,
    shield: false,
    dualLaserTimer: 0,
    shake: 0,
    transitioning: false,
    feedbackText: null,
    levelBanner: null
  });

  // تولید گزینه‌ها متناسب با لول
  const spawnMeteors = (qIdx, lvl) => {
    const q = QUESTIONS[qIdx % QUESTIONS.length];
    const baseSpeed = 2.4 + (lvl - 1) * 0.9; // با هر مرحله سرعت بیشتر می‌شود
    return q.options.map((opt, i) => ({
      index: i,
      x: 90 + i * 175,
      y: -70 - (i % 2) * 35,
      radius: 46,
      speed: baseSpeed + Math.random() * 0.4,
      text: `${i + 1}. ${opt}`,
      isCorrect: (i === q.correct),
      isDestroyed: false
    }));
  };

  const spawnPowerup = (x, y) => {
    const types = ['shield', 'dual', 'heart', 'bomb'];
    const type = types[Math.floor(Math.random() * types.length)];
    stateRef.current.powerups.push({
      x,
      y,
      type,
      radius: 17,
      speed: 3,
      angle: 0
    });
  };

  const triggerNukeBomb = () => {
    const s = stateRef.current;
    if (s.bombs <= 0 || s.transitioning) return;
    s.bombs -= 1;
    setBombs(s.bombs);
    s.shake = 22;

    // پاکسازی سنگ‌های غلط و موانع با بمب
    s.meteors.forEach(m => {
      if (!m.isCorrect) m.isDestroyed = true;
    });
    s.obstacles = [];

    // ذرات سفید و طلایی بمب
    for (let i = 0; i < 60; i++) {
      s.particles.push({
        x: 400,
        y: 300,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18,
        color: '#ffffff',
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
    setShieldActive(false);
    setDualLaserActive(false);

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 600,
      speed: 2 + Math.random() * 5,
      size: Math.random() * 2.5
    }));

    stateRef.current = {
      player: { x: 376, y: 520, width: 48, height: 44, speed: 15 },
      lasers: [],
      meteors: spawnMeteors(0, 1),
      obstacles: [],
      powerups: [],
      stars,
      particles: [],
      lastShot: 0,
      currentQIndex: 0,
      score: 0,
      lives: 3,
      level: 1,
      combo: 0,
      bombs: 2,
      shield: false,
      dualLaserTimer: 0,
      shake: 0,
      transitioning: false,
      feedbackText: null,
      levelBanner: 'مرحله ۱ - سرعت پایه 🚀'
    };

    setTimeout(() => {
      stateRef.current.levelBanner = null;
    }, 1800);

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

      // حرکت پرسرعت سفینه (چپ، راست، بالا، پایین)
      if (keys.current['ArrowLeft'] || keys.current['KeyA']) p.x = Math.max(10, p.x - p.speed);
      if (keys.current['ArrowRight'] || keys.current['KeyD']) p.x = Math.min(800 - p.width - 10, p.x + p.speed);
      if (keys.current['ArrowUp'] || keys.current['KeyW']) p.y = Math.max(70, p.y - p.speed);
      if (keys.current['ArrowDown'] || keys.current['KeyS']) p.y = Math.min(545, p.y + p.speed);

      // تایمر تیربار دوگانه
      if (s.dualLaserTimer > 0) {
        s.dualLaserTimer -= 1;
        if (s.dualLaserTimer === 0) setDualLaserActive(false);
      }

      // شلیک تیر بسیار سریع
      const now = Date.now();
      const fireRate = s.dualLaserTimer > 0 ? 100 : 160;
      if (keys.current['Space'] && now - s.lastShot > fireRate && !s.transitioning) {
        if (s.dualLaserTimer > 0) {
          s.lasers.push({ x: p.x + 8, y: p.y, speed: 20, color: '#f43f5e' });
          s.lasers.push({ x: p.x + p.width - 8, y: p.y, speed: 20, color: '#f43f5e' });
        } else {
          s.lasers.push({ x: p.x + p.width / 2, y: p.y, speed: 19, color: '#38bdf8' });
        }
        s.lastShot = now;
      }

      // حرکت سریع تیرها
      s.lasers.forEach(l => (l.y -= l.speed));
      s.lasers = s.lasers.filter(l => l.y > -20);

      // باران موانع فضایی تصادفی (هیجان اضافه)
      if (Math.random() < 0.02 + s.level * 0.008 && s.obstacles.length < 3) {
        s.obstacles.push({
          x: Math.random() * 740 + 30,
          y: -40,
          radius: 18,
          speed: 3.5 + s.level * 0.8
        });
      }
      s.obstacles.forEach(ob => (ob.y += ob.speed));
      s.obstacles = s.obstacles.filter(ob => ob.y < 650);

      // آپدیت ستاره‌ها
      s.stars.forEach(st => {
        st.y += st.speed;
        if (st.y > 600) {
          st.y = 0;
          st.x = Math.random() * 800;
        }
      });

      // کاهش لرزش صفحه
      if (s.shake > 0) s.shake *= 0.86;
      if (s.shake < 0.2) s.shake = 0;

      // ذرات انفجار
      s.particles.forEach(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.025;
      });
      s.particles = s.particles.filter(pt => pt.alpha > 0);

      // آپدیت آیتم‌ها
      s.powerups.forEach(pu => {
        pu.y += pu.speed;
        pu.angle += 0.05;
        const dist = Math.hypot(p.x + p.width / 2 - pu.x, p.y + p.height / 2 - pu.y);
        if (dist < pu.radius + 24) {
          pu.collected = true;
          if (pu.type === 'shield') {
            s.shield = true;
            setShieldActive(true);
          } else if (pu.type === 'dual') {
            s.dualLaserTimer = 450;
            setDualLaserActive(true);
          } else if (pu.type === 'heart') {
            if (s.lives < 5) {
              s.lives += 1;
              setLives(s.lives);
            }
          } else if (pu.type === 'bomb') {
            s.bombs += 1;
            setBombs(s.bombs);
          }
        }
      });
      s.powerups = s.powerups.filter(pu => !pu.collected && pu.y < 640);

      // بررسی پاسخ درست
      const triggerCorrect = (target) => {
        target.isDestroyed = true;
        s.transitioning = true;
        s.combo += 1;
        setCombo(s.combo);

        const gained = 30 + s.combo * 10;
        s.score += gained;
        setScore(s.score);
        s.shake = 16;
        s.feedbackText = s.combo > 1 ? `فوق‌العاده! کمبو X${s.combo} 🔥 (+${gained})` : `آفرین! پاسخ درست (+${gained}) 🎯`;

        // رها شدن جایزه
        if (Math.random() > 0.35) {
          spawnPowerup(target.x, target.y);
        }

        // ذرات انفجار سبز نئونی
        for (let k = 0; k < 40; k++) {
          s.particles.push({
            x: target.x,
            y: target.y,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.5) * 12,
            color: '#22c55e',
            alpha: 1
          });
        }

        setTimeout(() => {
          let nextQ = s.currentQIndex + 1;
          // اگر همه سوالات تمام شد -> رفتن به مرحله بعدی با سرعت بالاتر!
          if (nextQ >= QUESTIONS.length) {
            nextQ = 0;
            s.level += 1;
            setLevel(s.level);
            s.levelBanner = `⚡ صعود به مرحله ${s.level}! سرعت بالاتر رفت! ⚡`;
            setTimeout(() => {
              stateRef.current.levelBanner = null;
            }, 1800);
          }

          s.currentQIndex = nextQ;
          setCurrentQIndex(s.currentQIndex);
          s.meteors = spawnMeteors(nextQ, s.level);
          s.lasers = [];
          s.obstacles = [];
          s.feedbackText = null;
          s.transitioning = false;
        }, 850);
      };

      if (!s.transitioning) {
        // برخورد موانع سنگی مزاحم با سفینه
        for (let ob of s.obstacles) {
          const distOb = Math.hypot(p.x + p.width / 2 - ob.x, p.y + p.height / 2 - ob.y);
          if (distOb < ob.radius + 18) {
            ob.y = 700;
            s.shake = 15;
            if (s.shield) {
              s.shield = false;
              setShieldActive(false);
            } else {
              s.lives -= 1;
              s.combo = 0;
              setCombo(0);
              setLives(s.lives);
              if (s.lives <= 0) {
                setGameState('gameover');
                return;
              }
            }
          }
        }

        s.meteors.forEach(m => {
          if (m.isDestroyed) return;
          m.y += m.speed;

          // برخورد مستقیم خود سفینه
          const shipDist = Math.hypot(p.x + p.width / 2 - m.x, p.y + p.height / 2 - m.y);
          if (shipDist < m.radius + 18) {
            if (m.isCorrect) {
              triggerCorrect(m);
              return;
            } else {
              m.isDestroyed = true;
              s.shake = 18;
              s.combo = 0;
              setCombo(0);

              if (s.shield) {
                s.shield = false;
                setShieldActive(false);
              } else {
                s.lives -= 1;
                setLives(s.lives);
                if (s.lives <= 0) {
                  setGameState('gameover');
                  return;
                }
              }
            }
          }

          // برخورد تیر به شهاب سنگ
          for (let i = s.lasers.length - 1; i >= 0; i--) {
            const l = s.lasers[i];
            const dist = Math.hypot(l.x - m.x, l.y - m.y);
            if (dist < m.radius + 10) {
              s.lasers.splice(i, 1);
              if (m.isCorrect) {
                triggerCorrect(m);
                return;
              } else {
                m.isDestroyed = true;
                s.shake = 6;
                s.combo = 0;
                setCombo(0);
                for (let k = 0; k < 18; k++) {
                  s.particles.push({
                    x: m.x,
                    y: m.y,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8,
                    color: '#ea580c',
                    alpha: 1
                  });
                }
              }
              break;
            }
          }
        });

        // اگر سنگ‌ها گذشتند
        if (s.meteors.every(m => m.y > 640 || m.isDestroyed)) {
          s.combo = 0;
          setCombo(0);
          s.currentQIndex = (s.currentQIndex + 1) % QUESTIONS.length;
          setCurrentQIndex(s.currentQIndex);
          s.meteors = spawnMeteors(s.currentQIndex, s.level);
          s.lasers = [];
        }
      }

      // ================== رندرینگ گرافیکی فوق‌سریع و سبک ==================
      ctx.save();
      if (s.shake > 0) {
        ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake);
      }

      // پس‌زمینه کهکشان
      ctx.fillStyle = '#050816';
      ctx.fillRect(0, 0, 800, 600);

      // ستاره‌های تند و پرسرعت
      ctx.fillStyle = '#94a3b8';
      s.stars.forEach(st => {
        ctx.fillRect(st.x, st.y, st.size, st.size + 2); // کشیدگی ستاره‌ها برای القای سرعت نور
      });

      // موانع سنگی مزاحم
      ctx.fillStyle = '#78716c';
      s.obstacles.forEach(ob => {
        ctx.beginPath();
        ctx.arc(ob.x, ob.y, ob.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // پاورآپ‌ها
      s.powerups.forEach(pu => {
        ctx.save();
        ctx.translate(pu.x, pu.y);
        ctx.beginPath();
        ctx.arc(0, 0, pu.radius, 0, Math.PI * 2);
        ctx.fillStyle = pu.type === 'shield' ? '#0284c7' : pu.type === 'dual' ? '#e11d48' : pu.type === 'bomb' ? '#eab308' : '#16a34a';
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const icon = pu.type === 'shield' ? '🛡️' : pu.type === 'dual' ? '⚡' : pu.type === 'bomb' ? '💣' : '💖';
        ctx.fillText(icon, 0, 1);
        ctx.restore();
      });

      // تیرها
      s.lasers.forEach(l => {
        ctx.fillStyle = l.color;
        ctx.fillRect(l.x - 3, l.y, 6, 18);
      });

      // ذرات
      s.particles.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillRect(pt.x, pt.y, 4, 4);
      });
      ctx.globalAlpha = 1;

      // شهاب‌سنگ‌های کوانتومی
      s.meteors.forEach(m => {
        if (m.isDestroyed) return;
        ctx.save();
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#38bdf8';
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 13px Vazirmatn, Tahoma, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(m.text, m.x, m.y);
        ctx.restore();
      });

      // سفینه جنگنده فضایی
      ctx.save();
      ctx.translate(p.x, p.y);

      // آتش پیشران دوقلو
      ctx.fillStyle = '#f97316';
      const fLen = 12 + Math.random() * 8;
      ctx.fillRect(8, p.height - 3, 6, fLen);
      ctx.fillRect(p.width - 14, p.height - 3, 6, fLen);

      // بدنه
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(p.width / 2, 0);
      ctx.lineTo(p.width, p.height - 6);
      ctx.lineTo(p.width / 2, p.height - 12);
      ctx.lineTo(0, p.height - 6);
      ctx.closePath();
      ctx.fill();

      // باله‌ها
      ctx.fillStyle = '#4f46e5';
      ctx.fillRect(-6, p.height - 15, 6, 12);
      ctx.fillRect(p.width, p.height - 15, 6, 12);

      // هاله سپر
      if (s.shield) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(p.width / 2, p.height / 2, 34, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // پیام فیدبک
      if (s.feedbackText) {
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 24px Vazirmatn, Tahoma, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(s.feedbackText, 400, 270);
      }

      // بنر مرحله بعد
      if (s.levelBanner) {
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 28px Vazirmatn, Tahoma, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(s.levelBanner, 400, 220);
      }

      ctx.restore();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div style={{ background: '#020617', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif' }}>
      {gameState === 'menu' && (
        <div style={{ textAlign: 'center', background: '#0b1329', padding: '40px 50px', borderRadius: '18px', border: '1px solid #1e293b', boxShadow: '0 0 50px rgba(14, 165, 233, 0.35)' }}>
          <h1 style={{ fontSize: '38px', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '900', marginBottom: '14px' }}>
            ⚡ SPACE SHOOTER: HYPER DRIVE
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '16px' }}>
            هدایت در ۴ جهت با ⬅️ ➡️ ⬆️ ⬇️ یا [W, A, S, D] | <b>شلیک با [Space]</b>
          </p>
          <div style={{ background: '#0f172a', padding: '12px', borderRadius: '10px', marginBottom: '24px', display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '14px', color: '#cbd5e1' }}>
            <span>💣 بمب اتم با کلید [B]</span>
            <span>⚡ تیر دوقلو</span>
            <span>🛡️ سپر انرژی</span>
            <span>🔥 کمبوی امتیازی</span>
          </div>
          <button
            onClick={startGame}
            style={{ background: 'linear-gradient(to right, #0ea5e9, #6366f1)', color: '#fff', border: 'none', padding: '16px 40px', fontSize: '18px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            شروع ماموریت پرسرعت 🚀
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* نوار اطلاعات بازی */}
          <div style={{ width: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0b1329', padding: '12px 20px', borderRadius: '14px 14px 0 0', border: '1px solid #1e293b', borderBottom: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#facc15', fontSize: '18px', fontWeight: 'bold' }}>⭐ {score}</span>
              <span style={{ background: '#3b82f6', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>مرحله {level}</span>
              {combo > 1 && <span style={{ background: '#ea580c', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>X{combo} کمبو 🔥</span>}
              <span style={{ background: '#7c3aed', padding: '3px 8px', borderRadius: '6px', fontSize: '12px' }}>💣 بمب: {bombs} (کلید B)</span>
            </div>

            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#38bdf8' }}>
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
          <p style={{ color: '#cbd5e1', marginBottom: '10px', fontSize: '18px' }}>تا مرحله: <strong style={{ color: '#38bdf8' }}>{level}</strong> پیش رفتی!</p>
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
