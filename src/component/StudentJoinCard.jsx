import React, { useState } from 'react';
import { t } from '../utils/i18n';

export default function StudentJoinCard({ onStartGame }) {
  const [gameCode, setGameCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedCode = gameCode.replace(/\D/g, '');

    if (normalizedCode.length !== 6) {
      setError(t('student_join.error_code_len'));
      return;
    }

    if (studentName.trim().length < 2) {
      setError(t('student_join.error_name_empty'));
      return;
    }

    setError('');

    onStartGame({
      code: normalizedCode,
      name: studentName.trim()
    });
  };

  const handleCodeChange = (event) => {
    const onlyNumbers = event.target.value
      .replace(/\D/g, '')
      .slice(0, 6);

    setGameCode(onlyNumbers);

    if (error) {
      setError('');
    }
  };

  const handleNameChange = (event) => {
    setStudentName(event.target.value);

    if (error) {
      setError('');
    }
  };

  return (
    <div className="join-card" id="join-card">
      <div className="join-card-header">
        <div className="join-icon">🎮</div>
        <div>
          <span className="eyebrow">{t('student_join.eyebrow')}</span>
          <h2>{t('student_join.title')}</h2>
        </div>
      </div>

      <p className="join-description">
        {t('student_join.desc')}
      </p>

      <form onSubmit={handleSubmit} className="join-form">
        <label className="field-label" htmlFor="game-code">
          {t('student_join.code_label')}
        </label>

        <div className="input-wrapper code-input-wrapper">
          <span className="input-icon">#</span>
          <input
            id="game-code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder={t('student_join.code_placeholder')}
            value={gameCode}
            onChange={handleCodeChange}
            dir="ltr"
            autoComplete="off"
          />
          <span className="code-counter">{gameCode.length}/۶</span>
        </div>

        <label className="field-label" htmlFor="student-name">
          {t('student_join.name_label')}
        </label>

        <div className="input-wrapper">
          <span className="input-icon">◈</span>
          <input
            id="student-name"
            type="text"
            placeholder={t('student_join.name_placeholder')}
            value={studentName}
            onChange={handleNameChange}
            autoComplete="nickname"
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="primary-button join-submit">
          <span>{t('student_join.submit_btn')}</span>
          <b>←</b>
        </button>
      </form>

      <div className="join-card-footer">
        <span className="online-indicator" />
        {t('student_join.footer_note')}
      </div>
    </div>
  );
}
