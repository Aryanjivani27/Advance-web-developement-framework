import { useState } from 'react';
import { authApi } from '../api';

// ─── AuthPage ──────────────────────────────────────────────────────────────────
// Renders a login/register form.
// Props:
//   onAuthSuccess(user, token) – called after successful login or registration
// ──────────────────────────────────────────────────────────────────────────────
export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode]       = useState('login'); // 'login' | 'register'
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const isRegister = mode === 'register';

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(''); // clear error on every keystroke
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ── Client-side validation ────────────────────────────────────────────────
    if (isRegister && !form.name.trim()) {
      return setError('Name is required');
    }
    if (!form.email.trim()) return setError('Email is required');
    if (!form.password)     return setError('Password is required');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      const payload = isRegister
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };

      const res = isRegister
        ? await authApi.register(payload)
        : await authApi.login(payload);

      // Persist token & user in localStorage
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));

      onAuthSuccess(res.user, res.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setForm({ name: '', email: '', password: '' });
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="logo-icon">✓</div>
          <span className="logo-text">TaskFlow</span>
        </div>

        <h2 className="auth-title">{isRegister ? 'Create an account' : 'Welcome back'}</h2>
        <p className="auth-subtitle">
          {isRegister
            ? 'Sign up to start managing your tasks'
            : 'Log in to access your tasks'}
        </p>

        {error && (
          <div className="auth-error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {isRegister && (
            <div className="form-group">
              <label htmlFor="auth-name" className="form-label">Full Name</label>
              <input
                id="auth-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Jane Doe"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email" className="form-label">Email Address</label>
            <input
              id="auth-email"
              name="email"
              type="email"
              className="form-input"
              placeholder="jane@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password" className="form-label">Password</label>
            <input
              id="auth-password"
              name="password"
              type="password"
              className="form-input"
              placeholder={isRegister ? 'At least 6 characters' : '••••••••'}
              value={form.password}
              onChange={handleChange}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              disabled={loading}
            />
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading
              ? <><span className="spinner" /> {isRegister ? 'Creating account…' : 'Logging in…'}</>
              : isRegister ? 'Create Account' : 'Log In'
            }
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            id="auth-switch-btn"
            type="button"
            className="auth-switch-link"
            onClick={switchMode}
          >
            {isRegister ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
