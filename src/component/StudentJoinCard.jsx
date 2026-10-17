import React, { useState } from 'react';

export default function StudentJoinCard({ onStartGame }) {
  const [gameCode, setGameCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedCode = gameCode.replace(/\D/g, '');

    if (normalizedCode.length !== 6) {
      setError('کد بازی باید ۶ رقمی باشد.');
      return;
    }

    if (studentName.trim().length < 2) {
      setError('لطفاً نام یا نام مستعار خود را وارد کن.');
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
          <span className="eyebrow">ورود سریع دانش‌آموز</span>
          <h2>آماده‌ای وارد مأموریت شوی؟</h2>
        </div>
      </div>

      <p className="join-description">
        کد بازی را از معلمت بگیر و بدون ساخت حساب کاربری وارد مسابقه شو.
      </p>

      <form onSubmit={handleSubmit} className="join-form">
        <label className="field-label" htmlFor="game-code">
          کد بازی
        </label>

        <div className="input-wrapper code-input-wrapper">
          <span className="input-icon">#</span>
          <input
            id="game-code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="مثلاً ۸۴۲۱۰۹"
            value={gameCode}
            onChange={handleCodeChange}
            dir="ltr"
            autoComplete="off"
          />
          <span className="code-counter">{gameCode.length}/۶</span>
        </div>

        <label className="field-label" htmlFor="student-name">
          نام یا نام مستعار
        </label>

        <div className="input-wrapper">
          <span className="input-icon">◈</span>
          <input
            id="student-name"
            type="text"
            placeholder="مثلاً آرین"
            value={studentName}
            onChange={handleNameChange}
            autoComplete="nickname"
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="primary-button join-submit">
          <span>شروع مأموریت</span>
          <b>←</b>
        </button>
      </form>

      <div className="join-card-footer">
        <span className="online-indicator" />
        ورود سریع، بدون نیاز به ثبت‌نام
      </div>
    </div>
  );
}
