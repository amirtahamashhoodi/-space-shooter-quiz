import Phaser from 'phaser';

// موتور صوتی سایبرنتیک (بدون نیاز به فایل خارجی، ساخته شده در مرورگر)
class CyberAudioEngine {
  constructor() {
    this.ctx = null;
    this.noiseBuffer = null;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.isBgmPlaying = false;
    this.masterGain = null;
    this.sfxGain = null;
    this.bgmGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.95, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(1.1, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
        this.bgmGain.connect(this.masterGain);

        this.buildNoiseBuffer();
      }
    }

    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  buildNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2.0;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  }

  startBGM() {
    if (this.isBgmPlaying || !this.ctx) return;
    this.isBgmPlaying = true;
    this.bgmStep = 0;

    const stepInterval = (60 / 128 / 4) * 1000;
    this.bgmTimer = setInterval(() => {
      this.tickBGM();
    }, stepInterval);
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.isBgmPlaying = false;
  }

  tickBGM() {
    if (!this.ctx || !this.isBgmPlaying) return;
    const t = this.ctx.currentTime;
    const step = this.bgmStep % 16;

    if (step % 4 === 0) {
      this.synthKick(t);
    }
    if (step % 2 === 0) {
      this.synthHiHat(t, step % 4 === 2 ? 0.12 : 0.05);
    }

    const bassScale = [55, 65.41, 73.42, 82.41, 98.00, 73.42, 65.41, 55];
    const currentNote = bassScale[step % bassScale.length];
    this.synthBass(t, currentNote);

    this.bgmStep++;
  }

  synthKick(t) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(28, t + 0.1);
    gain.gain.setValueAtTime(0.85, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
    osc.connect(gain);
    gain.connect(this.bgmGain);
    osc.start(t);
    osc.stop(t + 0.14);
  }

  synthHiHat(t, volume) {
    if (!this.noiseBuffer) return;
    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7500, t);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);
    source.start(t);
    source.stop(t + 0.06);
  }

  synthBass(t, freq) {
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(550, t);
    filter.frequency.exponentialRampToValueAtTime(140, t + 0.12);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  playLaser() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const snap = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snap.type = 'triangle';
    snap.frequency.setValueAtTime(2000, t);
    snap.frequency.exponentialRampToValueAtTime(180, t + 0.04);
    snapGain.gain.setValueAtTime(0.35, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    snap.connect(snapGain);
    snapGain.connect(this.sfxGain);
    snap.start(t);
    snap.stop(t + 0.05);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.15);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  playExplosion(intensity = 1.0) {
    if (!this.ctx || !this.noiseBuffer) return;
    const t = this.ctx.currentTime;
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400 * intensity, t);
    filter.frequency.exponentialRampToValueAtTime(22, t + 0.6 * intensity);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.65 * intensity, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6 * intensity);
    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noiseSource.start(t);
    noiseSource.stop(t + 0.65 * intensity);

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.5);
    oscGain.gain.setValueAtTime(0.6 * intensity, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.52);
  }

  playCorrect(combo = 1) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const pitchShift = Math.min(1.7, 1 + (combo - 1) * 0.08);
    const baseFreqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    baseFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = t + idx * 0.04;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * pitchShift, noteTime);
      gain.gain.setValueAtTime(0.28, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(noteTime);
      osc.stop(noteTime + 0.36);
    });
  }

  playWrong() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [150, 100, 65].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(freq * 0.55, t + 0.38);
      gain.gain.setValueAtTime(0.38, t);
      gain.gain.linearRampToValueAtTime(0.001, t + 0.38);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t + idx * 0.025);
      osc.stop(t + 0.4);
    });
  }

  playBomb() {
    this.playExplosion(2.4);
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1600, t);
    osc.frequency.exponentialRampToValueAtTime(15, t + 0.9);
    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.92);
  }

  playShieldUp() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(1600, t + 0.45);
    gain.gain.setValueAtTime(0.32, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.46);
  }
}

export default class SpaceBlasterScene extends Phaser.Scene {
  constructor(questions = []) {
    super({ key: 'SpaceBlasterScene' });
    this.initialQuestions = questions;
    this.audio = new CyberAudioEngine();
    this.lastLaserY = new WeakMap();
  }

  preload() {
    // بارگذاری فایل‌ها از مسیر عمومی با قابلیت اطمینان بالا
    this.load.image('space_bg', '/images/space_bg.png');
    this.load.image('player_ship', '/images/player_ship.png');
    this.load.image('meteor_ring', '/images/meteor_ring.png');
    this.load.image('bg_cruiser', '/images/bg_cruiser.png');
  }

  create() {
    this.audio.init();

    this.input.keyboard.on('keydown', () => {
      this.audio.init();
      this.audio.startBGM();
    }, this);

    const fallbackQuestions = [
      {
        question: "کدام یک از عناصر زیر فلز است؟",
        options: ["گوگرد", "مس", "اکسیژن", "نیتروژن"],
        correct: 1
      },
      {
        question: "بار الکتریکی پروتون در اتم چیست؟",
        options: ["مثبت (+)", "منفی (-)", "خنثی", "متغیر"],
        correct: 0
      }
    ];

    const regQuestions = this.registry.get('questions');
    this.questions =
      this.initialQuestions?.length > 0
        ? this.initialQuestions
        : (regQuestions?.length > 0 ? regQuestions : fallbackQuestions);

    this.currentQIndex = 0;
    this.score = 0;
    this.correctAnswers = 0;
    this.lives = 3;
    this.maxLives = 3;
    this.combo = 0;
    this.bombs = 1;
    this.hasShield = false;
    this.nextShieldScore = 150;
    this.lastFired = 0;
    this.isTransitioning = false;
    this.waveId = 0;
    this.gameEnded = false;

    // ۱. ایجاد تکسچرهای داخلی نئونی (پشتیبان ۱۰۰٪ پایدار)
    this.createProceduralTextures();

    // ۲. پس‌زمینه ایمن کیهانی (اگر عکس بارگذاری نشد، تاریک و نئونی بماند نه شطرنجی سبز)
    this.createCosmicBackground();

    // ۳. ستاره‌های متحرک پرسرعت (Starfield Warp Effect)
    this.stars = [];
    for (let i = 0; i < 85; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 600),
        Phaser.Math.FloatBetween(1, 2.5),
        Phaser.Math.RND.pick([0x38bdf8, 0xec4899, 0xffffff, 0xa855f7]),
        Phaser.Math.FloatBetween(0.3, 0.9)
      );

      this.stars.push({
        obj: star,
        speed: Phaser.Math.FloatBetween(1.8, 5.5)
      });
    }

    // ۴. سفینه‌های گشت‌زن در عمق فضا (در صورت لود شدن تصویر)
    this.bgCruisers = [];
    if (this.textures.exists('bg_cruiser')) {
      for (let i = 0; i < 2; i++) {
        const cruiser = this.add.image(
          Phaser.Math.Between(-150, 900),
          Phaser.Math.Between(80, 260),
          'bg_cruiser'
        );
        cruiser.setAlpha(0.35);
        cruiser.setScale(0.16);

        this.bgCruisers.push({
          sprite: cruiser,
          speedX: Phaser.Math.FloatBetween(0.8, 1.8),
          baseY: cruiser.y
        });
      }
    }

    // ۵. ایجاد سفینه بازیکن در موقعیت مناسب و خوش‌دست
    const shipTexture = this.textures.exists('player_ship') ? 'player_ship' : 'ship_fallback';
    this.player = this.physics.add.image(400, 480, shipTexture);
    this.player.setScale(this.textures.exists('player_ship') ? 0.12 : 1);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(this.player.width * 0.6, this.player.height * 0.7);
    this.playerSpeed = 440;

    // هاله سپر دور سفینه
    this.shieldGfx = this.add.circle(this.player.x, this.player.y, 44, 0x06b6d4, 0.25);
    this.shieldGfx.setStrokeStyle(3, 0x38bdf8, 0.95);
    this.shieldGfx.setVisible(false);

    this.lasers = this.physics.add.group();
    this.meteors = [];

    // کلیدهای کنترل
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      bomb: Phaser.Input.Keyboard.KeyCodes.B
    });

    this.spawnQuestionWave();
    this.notifyHUD();
  }

  createProceduralTextures() {
    const gfx = this.make.graphics({ x: 0, y: 0, add: false });

    // لیزر نئونی فیروزه‌ای
    if (!this.textures.exists('laser')) {
      gfx.clear();
      gfx.fillStyle(0x38bdf8, 1);
      gfx.fillRect(0, 0, 6, 24);
      gfx.fillStyle(0xffffff, 1);
      gfx.fillRect(2, 2, 2, 20);
      gfx.generateTexture('laser', 6, 24);
    }

    // دایره نئونی برای جایگزینی پایدار حلقه‌ها (در صورت نیاز)
    if (!this.textures.exists('ring_fallback')) {
      gfx.clear();
      gfx.fillStyle(0x0f172a, 0.9);
      gfx.fillCircle(45, 45, 42);
      gfx.lineStyle(3, 0x38bdf8, 1);
      gfx.strokeCircle(45, 45, 42);
      gfx.lineStyle(2, 0x06b6d4, 0.6);
      gfx.strokeCircle(45, 45, 36);
      gfx.generateTexture('ring_fallback', 90, 90);
    }

    // ذرات انفجار رنگی
    if (!this.textures.exists('particle_green')) {
      gfx.clear();
      gfx.fillStyle(0x22c55e, 1);
      gfx.fillCircle(3, 3, 3);
      gfx.generateTexture('particle_green', 6, 6);
    }

    if (!this.textures.exists('particle_red')) {
      gfx.clear();
      gfx.fillStyle(0xef4444, 1);
      gfx.fillCircle(3, 3, 3);
      gfx.generateTexture('particle_red', 6, 6);
    }

    if (!this.textures.exists('particle_blue')) {
      gfx.clear();
      gfx.fillStyle(0x38bdf8, 1);
      gfx.fillCircle(4, 4, 4);
      gfx.generateTexture('particle_blue', 8, 8);
    }

    // سفینه پشتیبان
    if (!this.textures.exists('ship_fallback')) {
      gfx.clear();
      gfx.fillStyle(0x38bdf8, 1);
      gfx.beginPath();
      gfx.moveTo(20, 0);
      gfx.lineTo(40, 40);
      gfx.lineTo(20, 30);
      gfx.lineTo(0, 40);
      gfx.closePath();
      gfx.fillPath();
      gfx.generateTexture('ship_fallback', 40, 40);
    }

    gfx.destroy();
  }

  createCosmicBackground() {
    // اگر فایل space_bg واقعاً و سالم در حافظه بود استفاده شود
    if (this.textures.exists('space_bg') && this.textures.get('space_bg').key !== '__MISSING') {
      try {
        this.bgTile = this.add.tileSprite(400, 300, 800, 600, 'space_bg');
        this.bgTile.setDisplaySize(800, 600);
        return;
      } catch (e) {
        // در صورت خطا رد می‌شود تا fallback اجرا شود
      }
    }

    // گرادیان پس‌زمینه فوق مدرن دارک و سایبرپانک
    const bgGfx = this.add.graphics();
    bgGfx.fillGradientStyle(0x020617, 0x020617, 0x0b1329, 0x111827, 1);
    bgGfx.fillRect(0, 0, 800, 600);
  }

  getXpMultiplier() {
    if (this.lives === 3) return 2;
    if (this.lives === 2) return 1.5;
    if (this.lives === 1) return 1;
    return 0.5;
  }

  getAcademicResult() {
    const total = this.questions?.length || 0;
    const correct = this.correctAnswers;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  }

  spawnQuestionWave() {
    if (!this.questions?.length || this.currentQIndex >= this.questions.length) {
      this.endGame();
      return;
    }

    const currentWave = ++this.waveId;
    this.isTransitioning = false;

    const question = this.questions[this.currentQIndex];
    if (!question || !Array.isArray(question.options)) {
      this.currentQIndex++;
      this.spawnQuestionWave();
      return;
    }

    window.dispatchEvent(
      new CustomEvent('cyberquiz:question', {
        detail: {
          question,
          index: this.currentQIndex,
          total: this.questions.length
        }
      })
    );

    this.meteors.forEach(meteor => {
      if (meteor?.active) meteor.destroy();
    });
    this.meteors = [];

    // تنظیم فواصل استاندارد برای ۴ ستون با حاشیه مناسب
    const positions = [115, 305, 495, 685];
    const baseSpeed = 55 + this.currentQIndex * 4;
    const faNumbers = ['۱', '۲', '۳', '۴'];

    const ringTexture = this.textures.exists('meteor_ring') ? 'meteor_ring' : 'ring_fallback';
    const isCustomImage = ringTexture === 'meteor_ring';

    question.options.forEach((optionText, index) => {
      const x = positions[index] ?? 115;
      const y = -60 - (index % 2) * 35;
      const container = this.add.container(x, y);

      const sprite = this.add.image(0, 0, ringTexture);
      // مقیاس متناسب تا حلقه‌ها به هم نچسبند
      sprite.setScale(isCustomImage ? 0.12 : 0.95);

      this.tweens.add({
        targets: sprite,
        angle: 360,
        duration: 9000,
        repeat: -1,
        ease: 'Linear'
      });

      const label = this.add.text(
        0,
        0,
        `${faNumbers[index] ?? index + 1}. ${optionText}`,
        {
          fontFamily: 'Vazirmatn, Tahoma, sans-serif',
          fontSize: '13px',
          color: '#ffffff',
          fontStyle: 'bold',
          align: 'center',
          stroke: '#000000',
          strokeThickness: 3,
          wordWrap: { width: 75, useAdvancedWrap: true }
        }
      ).setOrigin(0.5);

      container.add([sprite, label]);

      this.physics.world.enable(container);
      container.body.setSize(75, 75);
      container.body.setVelocityY(baseSpeed);

      container.setData('isCorrect', index === question.correct);
      container.setData('waveId', currentWave);
      container.setData('answerResolved', false);
      container.setData('collisionResolved', false);

      this.meteors.push(container);
    });
  }

  checkCombatCollisions() {
    if (this.isTransitioning) return;

    for (const laser of this.lasers.getChildren()) {
      if (!laser?.active || laser.getData('hitResolved')) continue;

      const previousY = this.lastLaserY.get(laser) ?? laser.y;
      const halfWidth = Math.max(4, laser.displayWidth / 2);
      const halfHeight = Math.max(14, laser.displayHeight / 2);

      const laserRect = new Phaser.Geom.Rectangle(
        laser.x - halfWidth,
        Math.min(previousY, laser.y) - halfHeight,
        halfWidth * 2,
        Math.abs(previousY - laser.y) + halfHeight * 2
      );

      this.lastLaserY.set(laser, laser.y);

      for (const meteor of this.meteors) {
        if (
          !meteor?.active ||
          meteor.getData('waveId') !== this.waveId ||
          meteor.getData('answerResolved') ||
          meteor.getData('collisionResolved')
        ) {
          continue;
        }

        const meteorRect = new Phaser.Geom.Rectangle(
          meteor.x - 38,
          meteor.y - 38,
          76,
          76
        );

        if (Phaser.Geom.Rectangle.Overlaps(laserRect, meteorRect)) {
          laser.setData('hitResolved', true);
          this.lastLaserY.delete(laser);
          laser.destroy();
          this.handleHit(meteor);
          break;
        }
      }
    }

    if (!this.player?.active) return;

    const playerRect = new Phaser.Geom.Rectangle(
      this.player.x - 24,
      this.player.y - 24,
      48,
      48
    );

    for (const meteor of [...this.meteors]) {
      if (
        !meteor?.active ||
        meteor.getData('waveId') !== this.waveId ||
        meteor.getData('answerResolved') ||
        meteor.getData('collisionResolved')
      ) {
        continue;
      }

      const meteorRect = new Phaser.Geom.Rectangle(
        meteor.x - 38,
        meteor.y - 38,
        76,
        76
      );

      if (Phaser.Geom.Rectangle.Overlaps(playerRect, meteorRect)) {
        this.handlePlayerCollision(meteor);
      }
    }
  }

  handleHit(container) {
    if (
      this.isTransitioning ||
      !container?.active ||
      container.getData('answerResolved') ||
      container.getData('collisionResolved')
    ) {
      return;
    }

    container.setData('answerResolved', true);
    const isCorrect = container.getData('isCorrect');

    if (isCorrect) {
      const answeredWave = this.waveId;
      this.isTransitioning = true;

      this.correctAnswers++;
      this.combo++;
      this.audio.playCorrect(this.combo);
      this.audio.playExplosion(1.15);

      const baseXp = 50 + this.combo * 15;
      const multiplier = this.getXpMultiplier();
      const gainedXp = Math.round(baseXp * multiplier);
      this.score += gainedXp;

      if (this.combo % 3 === 0) {
        this.bombs++;
        this.showFloatingText(400, 360, '💣 شارژ بمب EMP دریافت شد!', '#facc15');

        if (this.lives < this.maxLives) {
          this.lives++;
          this.audio.playShieldUp();
          this.showFloatingText(400, 320, '💚 یک جان بازیابی شد!', '#22c55e');
        } else {
          this.showFloatingText(400, 320, '⚡ کمبوی ۳تایی! جان‌ها کامل‌اند', '#38bdf8');
        }
      }

      if (this.score >= this.nextShieldScore && !this.hasShield) {
        this.hasShield = true;
        this.nextShieldScore += 180;
        this.shieldGfx.setVisible(true);
        this.audio.playShieldUp();
        this.showFloatingText(400, 285, '🛡️ سپر دفاعی فعال شد!', '#38bdf8');
      }

      this.notifyHUD();
      this.cameras.main.shake(300, 0.02);
      this.createExplosion(container.x, container.y, 'particle_green', 50);

      this.meteors.forEach(meteor => {
        if (meteor?.active && meteor !== container) {
          this.tweens.add({
            targets: meteor,
            alpha: 0,
            scale: 0.2,
            duration: 250,
            onComplete: () => {
              if (meteor?.active) meteor.destroy();
            }
          });
        }
      });

      this.removeMeteor(container);
      this.meteors = [];

      this.showFloatingText(
        400,
        240,
        this.combo > 1
          ? `پاسخ صحیح! کمبو ×${this.combo} | XP +${gainedXp}`
          : `پاسخ صحیح! XP +${gainedXp}`,
        '#22c55e'
      );

      this.time.delayedCall(800, () => {
        if (!this.scene.isActive() || this.waveId !== answeredWave) return;
        this.currentQIndex++;
        this.spawnQuestionWave();
      });

      return;
    }

    if (this.hasShield) {
      this.hasShield = false;
      this.shieldGfx.setVisible(false);
      this.audio.playWrong();
      this.audio.playExplosion(0.9);
      this.cameras.main.shake(250, 0.015);
      this.createExplosion(this.player.x, this.player.y, 'particle_blue', 40);

      this.showFloatingText(
        this.player.x,
        this.player.y - 40,
        'سپر ضربه را دفع کرد!',
        '#38bdf8'
      );

      this.removeMeteor(container);
      this.notifyHUD();
      return;
    }

    this.audio.playWrong();
    this.audio.playExplosion(1.0);
    this.cameras.main.shake(260, 0.016);
    this.createExplosion(container.x, container.y, 'particle_red', 40);

    this.combo = 0;
    this.lives = Math.max(0, this.lives - 1);
    this.notifyHUD();
    this.removeMeteor(container);

    if (this.lives === 0) {
      this.showFloatingText(
        400,
        200,
        'جان‌ها تمام شد؛ آزمون ادامه دارد',
        '#ef4444'
      );
    } else {
      this.showFloatingText(
        this.player.x,
        this.player.y - 40,
        `پاسخ نادرست؛ یک جان کم شد`,
        '#ef4444'
      );
    }
  }

  handlePlayerCollision(meteor) {
    if (
      !meteor?.active ||
      meteor.getData('collisionResolved') ||
      meteor.getData('answerResolved')
    ) {
      return;
    }

    meteor.setData('collisionResolved', true);

    this.audio.playExplosion(0.9);
    this.cameras.main.shake(220, 0.014);
    this.createExplosion(meteor.x, meteor.y, 'particle_red', 25);
    this.removeMeteor(meteor);

    if (this.hasShield) {
      this.hasShield = false;
      this.shieldGfx.setVisible(false);
      this.audio.playShieldUp();
      this.showFloatingText(
        this.player.x,
        this.player.y - 40,
        'سپر برخورد را خنثی کرد!',
        '#38bdf8'
      );
    } else {
      this.audio.playWrong();
      this.lives = Math.max(0, this.lives - 1);
      this.combo = 0;

      this.showFloatingText(
        this.player.x,
        this.player.y - 40,
        this.lives === 0
          ? 'جان‌ها تمام شد؛ آزمون ادامه دارد'
          : 'برخورد با مانع؛ یک جان کم شد',
        '#ef4444'
      );
    }

    this.notifyHUD();
  }

  endGame() {
    if (this.gameEnded) return;
    this.gameEnded = true;

    this.audio.stopBGM();

    const endBonus = this.lives * 100;
    this.score += endBonus;

    const academic = this.getAcademicResult();
    const game = {
      xp: this.score,
      heartsRemaining: this.lives,
      endBonus,
      maxCombo: this.combo,
      bombsRemaining: this.bombs
    };

    this.scene.pause();

    window.dispatchEvent(
      new CustomEvent('cyberquiz:gameover', {
        detail: {
          academic,
          game,
          score: this.score,
          correctAnswers: academic.correct,
          totalQuestions: academic.total
        }
      })
    );
  }

  triggerCyberBomb() {
    if (this.bombs <= 0 || this.isTransitioning) return;

    this.bombs--;
    this.audio.playBomb();
    this.cameras.main.shake(550, 0.035);
    this.cameras.main.flash(400, 56, 189, 248);

    this.showFloatingText(400, 300, 'بمب EMP شلیک شد!', '#ec4899');

    const wrongMeteors = this.meteors.filter(
      meteor => meteor?.active && !meteor.getData('isCorrect')
    );

    wrongMeteors.forEach(meteor => {
      this.createExplosion(meteor.x, meteor.y, 'particle_red', 30);
      this.removeMeteor(meteor);
    });

    this.notifyHUD();
  }

  showFloatingText(x, y, text, color) {
    const label = this.add.text(x, y, text, {
      fontFamily: 'Vazirmatn, Tahoma',
      fontSize: '20px',
      color,
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 700 }
    }).setOrigin(0.5);

    this.tweens.add({
      targets: label,
      y: y - 50,
      alpha: 0,
      duration: 1100,
      onComplete: () => label.destroy()
    });
  }

  removeMeteor(container) {
    const index = this.meteors.indexOf(container);
    if (index !== -1) {
      this.meteors.splice(index, 1);
    }

    if (container?.active) {
      container.destroy();
    }
  }

  notifyHUD() {
    window.dispatchEvent(
      new CustomEvent('cyberquiz:score', {
        detail: {
          score: this.score,
          xp: this.score,
          lives: this.lives,
          maxLives: this.maxLives,
          xpMultiplier: this.getXpMultiplier(),
          combo: this.combo,
          correctAnswers: this.correctAnswers,
          totalQuestions: this.questions?.length || 0,
          bombs: this.bombs,
          hasShield: this.hasShield
        }
      })
    );
  }

  createExplosion(x, y, textureKey, count) {
    for (let i = 0; i < count; i++) {
      const particle = this.physics.add.image(x, y, textureKey);
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const speed = Phaser.Math.Between(100, 300);

      particle.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

      this.tweens.add({
        targets: particle,
        alpha: 0,
        scale: 0.1,
        duration: Phaser.Math.Between(300, 650),
        onComplete: () => particle.destroy()
      });
    }
  }

  update(time) {
    if (this.bgTile) {
      this.bgTile.tilePositionY -= 0.6;
    }

    this.stars?.forEach(star => {
      star.obj.y += star.speed;
      if (star.obj.y > 600) {
        star.obj.y = 0;
        star.obj.x = Phaser.Math.Between(0, 800);
      }
    });

    this.bgCruisers?.forEach(cruiser => {
      cruiser.sprite.x += cruiser.speedX;
      cruiser.sprite.y = cruiser.baseY + Math.sin(cruiser.sprite.x * 0.015) * 6;

      if (cruiser.sprite.x > 950) {
        cruiser.sprite.x = -150;
        cruiser.baseY = Phaser.Math.Between(70, 300);
      }
    });

    if (this.shieldGfx && this.player) {
      this.shieldGfx.setPosition(this.player.x, this.player.y);
    }

    if (this.isTransitioning || !this.player?.active) return;

    let targetVx = 0;
    let targetVy = 0;

    if (this.cursors.left.isDown || this.keys.a.isDown) {
      targetVx = -this.playerSpeed;
    } else if (this.cursors.right.isDown || this.keys.d.isDown) {
      targetVx = this.playerSpeed;
    }

    if (this.cursors.up.isDown || this.keys.w.isDown) {
      targetVy = -this.playerSpeed;
    } else if (this.cursors.down.isDown || this.keys.s.isDown) {
      targetVy = this.playerSpeed;
    }

    const currentVel = this.player.body.velocity;
    const lerpFactor = 0.18;

    this.player.setVelocity(
      Phaser.Math.Linear(currentVel.x, targetVx, lerpFactor),
      Phaser.Math.Linear(currentVel.y, targetVy, lerpFactor)
    );

    if (this.keys.space.isDown && time > this.lastFired) {
      const laser = this.lasers.create(this.player.x, this.player.y - 25, 'laser');
      laser.setVelocityY(-680);
      this.lastLaserY.set(laser, laser.y);

      this.audio.startBGM();
      this.audio.playLaser();
      this.lastFired = time + 160;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.bomb)) {
      this.triggerCyberBomb();
    }

    this.lasers.getChildren().forEach(laser => {
      if (laser?.active && laser.y < -30) {
        this.lastLaserY.delete(laser);
        laser.destroy();
      }
    });

    for (let i = this.meteors.length - 1; i >= 0; i--) {
      const meteor = this.meteors[i];
      if (meteor?.active && meteor.y > 660) {
        meteor.destroy();
        this.meteors.splice(i, 1);
      }
    }

    this.checkCombatCollisions();

    if (this.meteors.length === 0 && !this.isTransitioning) {
      this.isTransitioning = true;
      const expiredWave = this.waveId;

      this.time.delayedCall(450, () => {
        if (!this.scene.isActive() || this.waveId !== expiredWave) return;

        this.combo = 0;
        this.notifyHUD();
        this.currentQIndex++;
        this.spawnQuestionWave();
      });
    }
  }
}
