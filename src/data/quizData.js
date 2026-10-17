// src/data/quizData.js
export const QUESTIONS = [
  {
    q: 'کدام یک از عناصر زیر فلز است؟',
    options: ['گوگرد', 'مس', 'اکسیژن', 'نیتروژن'],
    correct: 1
  },
  {
    q: 'بار الکتریکی پروتون در اتم چیست؟',
    options: ['مثبت (+)', 'منفی (-)', 'خنثی', 'متغیر'],
    correct: 0
  },
  {
    q: 'کدام ذره در هسته اتم قرار ندارد؟',
    options: ['پروتون', 'نوترون', 'الکترون', 'هیچ‌کدام'],
    correct: 2
  },
  {
    q: 'یکای اندازه‌گیری نیرو در فیزیک چیست؟',
    options: ['ژول', 'وات', 'نیوتون', 'پاسکال'],
    correct: 2
  },
  {
    q: 'سرعت نور تقریباً چند کیلومتر بر ثانیه است؟',
    options: ['۳۰۰ هزار', '۱۵۰ هزار', '۳۰ هزار', '۱ میلیون'],
    correct: 0
  }
];

export const GAME_MODES = [
  {
    icon: '🚀',
    title: 'نبرد فضایی',
    subtitle: 'Space Blaster',
    description: 'پاسخ درست را هدف بگیر و با شلیک لیزر امتیاز بگیر.',
    color: 'cyan'
  },
  {
    icon: '🔐',
    title: 'خزانه سایبری',
    subtitle: 'Cyber Vault',
    description: 'با حل سؤال‌ها رمزها را باز کن و امتیاز بیشتری جمع کن.',
    color: 'purple'
  },
  {
    icon: '🧪',
    title: 'دفاع آزمایشگاهی',
    subtitle: 'Lab Defense',
    description: 'با پاسخ‌های درست از پایگاه خودت محافظت کن.',
    color: 'green'
  },
  {
    icon: '💣',
    title: 'بمب زمان‌دار',
    subtitle: 'Co-op Time Bomb',
    description: 'با همکاری هم‌تیمی‌ها قبل از پایان زمان تصمیم بگیرید.',
    color: 'pink'
  }
];
