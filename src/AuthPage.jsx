import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/auth";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --red: #dc2626;
    --red-light: #fee2e2;
    --red-mid: #fca5a5;
    --red-dim: rgba(220,38,38,0.08);
    --red-border: rgba(220,38,38,0.2);
    --bg: #f5f5f7;
    --surface: #ffffff;
    --surface2: #f9f9fb;
    --surface3: #f0f0f4;
    --border: rgba(0,0,0,0.08);
    --text: #0f0f12;
    --muted: #7c7c8a;
    --dim: #c4c4cc;
    --green: #16a34a;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.05);
    --shadow-lg: 0 20px 60px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.07);
    --font-display: 'Syne', sans-serif;
    --font-body: 'Outfit', sans-serif;
  }

  body {
    font-family: var(--font-body);
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }

  .auth-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: var(--font-body);
  }

  .auth-left {
    background: var(--red);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px 52px;
    position: relative;
    overflow: hidden;
  }

  .auth-left::before {
    content: '';
    position: absolute;
    width: 420px; height: 420px;
    border-radius: 50%;
    border: 80px solid rgba(255,255,255,0.07);
    top: -120px; right: -120px;
  }
  .auth-left::after {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    border-radius: 50%;
    border: 60px solid rgba(255,255,255,0.05);
    bottom: -80px; left: -80px;
  }

  .left-logo {
    display: flex; align-items: center; gap: 14px;
    position: relative; z-index: 2;
  }

  .logo-icon {
    width: 44px; height: 44px;
    background: rgba(255,255,255,0.2);
    border-radius: 13px;
    display: grid; place-items: center;
    font-size: 22px;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.25);
  }

  .logo-name {
    font-family: var(--font-display);
    font-size: 18px; font-weight: 800;
    color: #fff; letter-spacing: -0.01em;
  }
  .logo-name span { opacity: .75; }

  .left-hero { position: relative; z-index: 2; }

  .left-eyebrow {
    font-size: 12px; font-weight: 600;
    text-transform: uppercase; letter-spacing: .12em;
    color: rgba(255,255,255,0.6);
    margin-bottom: 18px;
    display: flex; align-items: center; gap: 8px;
  }
  .left-eyebrow::before {
    content: '';
    width: 28px; height: 2px;
    background: rgba(255,255,255,0.4);
    border-radius: 2px;
  }

  .left-headline {
    font-family: var(--font-display);
    font-size: 42px; font-weight: 800;
    color: #fff; line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
  }

  .left-desc {
    font-size: 15px; color: rgba(255,255,255,0.7);
    line-height: 1.7; max-width: 340px;
  }

  .left-stats {
    display: flex; gap: 32px;
    position: relative; z-index: 2;
  }

  .left-stat-num {
    font-family: var(--font-display);
    font-size: 28px; font-weight: 800;
    color: #fff; line-height: 1;
    margin-bottom: 4px;
  }
  .left-stat-label { font-size: 12px; color: rgba(255,255,255,0.6); font-weight: 500; }

  .auth-right {
    background: var(--surface);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 52px;
    position: relative;
  }

  .auth-card {
    width: 100%; max-width: 400px;
    display: flex; flex-direction: column; gap: 28px;
  }

  .auth-tabs {
    display: flex;
    background: var(--surface3);
    border-radius: 12px;
    padding: 4px;
    gap: 4px;
  }

  .auth-tab {
    flex: 1; padding: 11px;
    border-radius: 9px; border: none;
    font-family: var(--font-body);
    font-size: 14px; font-weight: 600;
    cursor: pointer;
    transition: all .22s;
    color: var(--muted);
    background: transparent;
  }
  .auth-tab.active {
    background: var(--surface);
    color: var(--text);
    box-shadow: var(--shadow-sm);
  }

  .auth-title {
    font-family: var(--font-display);
    font-size: 28px; font-weight: 800;
    color: var(--text); letter-spacing: -0.01em;
    margin-bottom: 6px;
  }
  .auth-title span { color: var(--red); }
  .auth-subtitle { font-size: 14px; color: var(--muted); line-height: 1.5; }

  .auth-form { display: flex; flex-direction: column; gap: 16px; }

  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label {
    font-size: 12px; font-weight: 600;
    color: var(--muted);
    text-transform: uppercase; letter-spacing: .08em;
  }

  .input-wrap { position: relative; }
  .input-icon {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%);
    font-size: 16px; color: var(--dim);
    pointer-events: none;
  }

  .auth-input {
    width: 100%;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: 11px;
    padding: 13px 16px 13px 42px;
    font-family: var(--font-body);
    font-size: 14px; color: var(--text);
    outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
    box-shadow: var(--shadow-sm);
  }
  .auth-input::placeholder { color: var(--dim); }
  .auth-input:focus {
    border-color: var(--red);
    background: var(--surface);
    box-shadow: 0 0 0 3px rgba(220,38,38,0.1), var(--shadow-sm);
  }

  .show-toggle {
    position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none;
    color: var(--muted); cursor: pointer;
    font-size: 16px; padding: 0;
    transition: color .18s;
  }
  .show-toggle:hover { color: var(--red); }

  .auth-options {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: -4px;
  }

  .remember {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; color: var(--muted); cursor: pointer;
    font-weight: 500;
  }
  .remember input[type=checkbox] {
    width: 15px; height: 15px;
    accent-color: var(--red);
    cursor: pointer;
    padding: 0; box-shadow: none;
  }

  .forgot-link {
    font-size: 13px; font-weight: 600;
    color: var(--red); text-decoration: none;
    background: none; border: none; cursor: pointer;
    font-family: var(--font-body);
    transition: opacity .18s;
  }
  .forgot-link:hover { opacity: .7; }

  .btn-submit {
    width: 100%; padding: 14px;
    background: var(--red); border: none;
    border-radius: 11px;
    font-family: var(--font-body);
    font-size: 15px; font-weight: 600; color: #fff;
    cursor: pointer;
    transition: background .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 4px 16px rgba(220,38,38,0.3);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-submit:hover:not(:disabled) { background: #b91c1c; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(220,38,38,0.38); }
  .btn-submit:active:not(:disabled) { transform: none; }
  .btn-submit:disabled { opacity: .65; cursor: not-allowed; }

  .auth-msg {
    padding: 12px 16px; border-radius: 10px;
    font-size: 13px; font-weight: 500;
    display: flex; align-items: center; gap: 10px;
    animation: msgIn .25s ease;
  }
  @keyframes msgIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }

  .auth-msg.error   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .auth-msg.success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

  .auth-footer {
    text-align: center;
    font-size: 13px; color: var(--muted);
  }
  .auth-footer strong { color: var(--text); font-weight: 600; }

  .spinner {
    width: 18px; height: 18px;
    border: 2.5px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }
  @keyframes spin { to{transform:rotate(360deg)} }

  .auth-right::before {
    content: '🩸';
    position: absolute;
    font-size: 200px;
    opacity: .03;
    bottom: -30px; right: -20px;
    pointer-events: none;
    line-height: 1;
  }

  @media (max-width: 768px) {
    .auth-page { grid-template-columns: 1fr; }
    .auth-left { display: none; }
    .auth-right { padding: 40px 24px; }
  }
`;

export default function AuthPage({ onLogin }) {
  const [tab, setTab]           = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState(null);
  const [form, setForm]         = useState({ username:"", password:"", email:"" });

  const handle   = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const clearMsg = () => setMsg(null);

  const handleLogin = async () => {
    if (!form.username || !form.password) { setMsg({ type:"error", text:"Please fill in all fields." }); return; }
    setLoading(true); clearMsg();
    try {
      const res = await axios.post(`${API}/login`, { username: form.username, password: form.password });
      setMsg({ type:"success", text:"Welcome back! Redirecting…" });
      setTimeout(() => onLogin && onLogin(res.data), 1000);
    } catch {
      setMsg({ type:"error", text:"Invalid username or password." });
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!form.username || !form.password || !form.email) { setMsg({ type:"error", text:"Please fill in all fields." }); return; }
    setLoading(true); clearMsg();
    try {
      await axios.post(`${API}/register`, { username: form.username, password: form.password, email: form.email });
      setMsg({ type:"success", text:"Account created! Please log in." });
      setTimeout(() => { setTab("login"); setMsg(null); }, 1500);
    } catch {
      setMsg({ type:"error", text:"Registration failed. Username may already exist." });
    } finally { setLoading(false); }
  };

  const switchTab = t => { setTab(t); setMsg(null); setForm({ username:"", password:"", email:"" }); };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-page">

        <div className="auth-left">
          <div className="left-logo">
            <div className="logo-icon">🩸</div>
            <div className="logo-name">Blood<span>Bank</span> MS</div>
          </div>
          <div className="left-hero">
            <div className="left-eyebrow">Blood Bank System</div>
            <div className="left-headline">Every drop<br />saves a life.</div>
            <div className="left-desc">
              A centralized platform to manage blood donors, track donations,
              and connect people in need — fast and reliably.
            </div>
          </div>
          <div className="left-stats">
            <div className="left-stat">
              <div className="left-stat-num">500+</div>
              <div className="left-stat-label">Donors Registered</div>
            </div>
            <div className="left-stat">
              <div className="left-stat-num">8</div>
              <div className="left-stat-label">Blood Groups</div>
            </div>
            <div className="left-stat">
              <div className="left-stat-num">24/7</div>
              <div className="left-stat-label">Available</div>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">

            <div className="auth-tabs">
              <button className={`auth-tab${tab==="login"?" active":""}`}    onClick={() => switchTab("login")}>Login</button>
              <button className={`auth-tab${tab==="register"?" active":""}`} onClick={() => switchTab("register")}>Register</button>
            </div>

            <div className="auth-header">
              {tab === "login" ? (
                <>
                  <div className="auth-title">Welcome <span>back</span></div>
                  <div className="auth-subtitle">Sign in to manage your blood donors and requests.</div>
                </>
              ) : (
                <>
                  <div className="auth-title">Create <span>account</span></div>
                  <div className="auth-subtitle">Join the Blood Bank system and start saving lives.</div>
                </>
              )}
            </div>

            {msg && (
              <div className={`auth-msg ${msg.type}`}>
                <span>{msg.type === "error" ? "⚠️" : "✅"}</span>
                {msg.text}
              </div>
            )}

            <div className="auth-form">

              {tab === "register" && (
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrap">
                    <span className="input-icon">✉️</span>
                    <input className="auth-input" name="email" type="email"
                      placeholder="you@example.com" value={form.email} onChange={handle} />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Username</label>
                <div className="input-wrap">
                  <span className="input-icon">👤</span>
                  <input className="auth-input" name="username" type="text"
                    placeholder="Enter your username" value={form.username} onChange={handle}
                    onKeyDown={e => e.key === "Enter" && (tab==="login" ? handleLogin() : handleRegister())} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input className="auth-input" name="password"
                    type={showPass ? "text" : "password"}
                    placeholder={tab==="register" ? "Create a strong password" : "Enter your password"}
                    value={form.password} onChange={handle}
                    onKeyDown={e => e.key === "Enter" && (tab==="login" ? handleLogin() : handleRegister())}
                    style={{ paddingRight: "44px" }} />
                  <button className="show-toggle" type="button" onClick={() => setShowPass(s => !s)}>
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {tab === "login" && (
                <div className="auth-options">
                  <label className="remember">
                    <input type="checkbox" />
                    Remember me
                  </label>
                  <button className="forgot-link" type="button">Forgot password?</button>
                </div>
              )}

              <button className="btn-submit" onClick={tab==="login" ? handleLogin : handleRegister} disabled={loading}>
                {loading ? <div className="spinner" /> : (tab==="login" ? "Sign In →" : "Create Account →")}
              </button>

            </div>

            <div className="auth-footer">
              {tab === "login"
                ? <>Don't have an account? <strong style={{color:"var(--red)",cursor:"pointer"}} onClick={() => switchTab("register")}>Register here</strong></>
                : <>Already have an account? <strong style={{color:"var(--red)",cursor:"pointer"}} onClick={() => switchTab("login")}>Sign in</strong></>
              }
            </div>

          </div>
        </div>

      </div>
    </>
  );
}