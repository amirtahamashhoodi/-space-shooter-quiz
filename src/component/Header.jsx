import React, { useState } from 'react';
import Logo from './Logo';

export default function Header({ onTeacherClick, onJoinClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          <a href="#features" onClick={closeMenu}>
            امکانات
          </a>
          <a href="#game-modes" onClick={closeMenu}>
            مدل‌های بازی
          </a>
          <a href="#how-it-works" onClick={closeMenu}>
            راهنمای استفاده
          </a>
          <button
            type="button"
            className="mobile-teacher-link"
            onClick={() => {
              closeMenu();
              onTeacherClick();
            }}
          >
            ورود معلم
          </button>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="header-join-button"
            onClick={onJoinClick}
          >
            ورود به بازی
          </button>

          <button
            type="button"
            className="header-teacher-button"
            onClick={onTeacherClick}
          >
            ورود معلم
          </button>

          <button
            type="button"
            className="menu-toggle"
            aria-label="باز کردن منو"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
