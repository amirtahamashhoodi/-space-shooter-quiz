import React, { useState } from 'react';
import Logo from './Logo';
import { t } from '../utils/i18n';

export default function Header({ onTeacherClick, onJoinClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          <a href="#features" onClick={closeMenu}>
            {t('header.features')}
          </a>
          <a href="#modes" onClick={closeMenu}>
            {t('header.modes')}
          </a>
          <a href="#how-it-works" onClick={closeMenu}>
            {t('header.how_it_works')}
          </a>
          <button
            type="button"
            className="mobile-teacher-link"
            onClick={() => {
              closeMenu();
              onTeacherClick();
            }}
          >
            {t('header.mobile_teacher_btn')}
          </button>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="header-join-button"
            onClick={onJoinClick}
          >
            {t('header.join_btn')}
          </button>

          <button
            type="button"
            className="header-teacher-button"
            onClick={onTeacherClick}
          >
            {t('header.teacher_btn')}
          </button>

          <button
            type="button"
            className="menu-toggle"
            aria-label={t('header.menu_toggle_aria')}
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
