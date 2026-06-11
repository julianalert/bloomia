"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SUCCESS_CSS = `
:root { --ink:#1C1418; --parchment:#FAF6F0; --parchment-2:#F2EBE1; --border:#E0D5C8; --rose:#B05A72; --rose-light:#E8A4B5; --sage:#6B9E85; --sage-pale:#EAF3EE; --text-main:#2C2228; --text-body:#4A3E44; --text-muted:#8A7A82; --white:#FFFFFF; }
body { background: var(--parchment-2); color: var(--text-main); font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.65; min-height: 100vh; }
.topbar { background: var(--ink); padding: 16px 40px; display: flex; align-items: center; }
.logo { font-family: 'Playfair Display', serif; font-size: 17px; color: var(--parchment); letter-spacing: 0.03em; }
.wrap { max-width: 600px; margin: 0 auto; padding: 72px 24px; text-align: center; }
.tick { width: 72px; height: 72px; border-radius: 50%; background: var(--sage-pale); border: 1.5px solid rgba(107,158,133,0.4); display: flex; align-items: center; justify-content: center; margin: 0 auto 28px; }
.tick svg { width: 32px; height: 32px; color: var(--sage); }
.wrap h1 { font-family: 'Playfair Display', serif; font-size: clamp(28px, 5vw, 38px); font-weight: 400; color: var(--ink); line-height: 1.2; margin-bottom: 16px; }
.wrap h1 em { font-style: italic; color: var(--rose); }
.wrap p { font-size: 16px; color: var(--text-body); line-height: 1.75; margin-bottom: 16px; }
.wrap p.muted { font-size: 14px; color: var(--text-muted); }
.card { background: var(--white); border: 1.5px solid var(--border); border-radius: 16px; padding: 28px 32px; margin: 32px 0; text-align: left; }
.card h3 { font-size: 13px; font-weight: 600; letter-spacing: 0.02em; margin-bottom: 16px; }
.card ol { list-style: none; counter-reset: s; display: flex; flex-direction: column; gap: 14px; }
.card li { display: flex; gap: 14px; counter-increment: s; font-size: 14px; color: var(--text-body); line-height: 1.5; }
.card li::before { content: counter(s); flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%; background: var(--rose); color: white; font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; }
.home-link { display: inline-block; margin-top: 8px; color: var(--rose); font-weight: 600; text-decoration: none; font-size: 14px; }
.home-link:hover { text-decoration: underline; }
`;

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get("session_id"));
    // Assessment is complete and paid — clear the working order reference.
    sessionStorage.removeItem("orderId");
  }, []);

  return (
    <>
      <style>{SUCCESS_CSS}</style>
      <header className="topbar">
        <div className="logo">Bloomia</div>
      </header>
      <div className="wrap">
        <div className="tick">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1>
          Payment confirmed.<br />Your Protocol is <em>being generated.</em>
        </h1>
        <p>
          Thank you — your order is in. Our system is now building your personalised Menopause Management Protocol from
          your assessment.
        </p>

        <div className="card">
          <h3>WHAT HAPPENS NOW</h3>
          <ol>
            <li>Your answers are processed and your 20+ page document is generated.</li>
            <li>It&apos;s rendered into your personalised Protocol and sent to your email.</li>
            <li>It arrives in your inbox within 24 hours — usually much sooner.</li>
          </ol>
        </div>

        <p className="muted">
          Keep an eye on your inbox (and your spam folder, just in case). If you don&apos;t receive your Protocol within
          24 hours, reach out to support and we&apos;ll sort it out right away.
        </p>

        {sessionId && <p className="muted">Order reference: {sessionId}</p>}

        <Link href="/" className="home-link">
          ← Back to home
        </Link>
      </div>
    </>
  );
}
