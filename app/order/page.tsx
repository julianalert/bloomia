"use client";

import { useEffect, useState } from "react";

const ORDER_CSS = `
:root { --ink:#1C1418; --ink-soft:#3A2F36; --parchment:#FAF6F0; --parchment-2:#F2EBE1; --border:#E0D5C8; --rose:#B05A72; --rose-light:#E8A4B5; --rose-pale:#F9EEF2; --sage:#6B9E85; --sage-pale:#EAF3EE; --amber:#C07840; --amber-pale:#FBF0E4; --text-main:#2C2228; --text-body:#4A3E44; --text-muted:#8A7A82; --white:#FFFFFF; }
body { background: var(--parchment-2); color: var(--text-main); font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.65; min-height: 100vh; }
.topbar { background: var(--ink); padding: 16px 40px; display: flex; align-items: center; justify-content: space-between; }
.logo { font-family: 'Playfair Display', serif; font-size: 17px; color: var(--parchment); letter-spacing: 0.03em; }
.logo span { display: block; font-family: 'Inter', sans-serif; font-size: 10px; color: rgba(255,255,255,0.38); letter-spacing: 0.14em; text-transform: uppercase; margin-top: 1px; font-weight: 400; }
.topbar-step { display: flex; align-items: center; gap: 8px; font-size: 12px; color: rgba(255,255,255,0.35); letter-spacing: 0.05em; }
.topbar-step .done { color: var(--sage); font-weight: 600; }
.topbar-step .sep { opacity: 0.3; }
.page-wrap { max-width: 980px; margin: 0 auto; padding: 52px 32px 80px; }
.two-col { display: grid; grid-template-columns: 1fr 380px; gap: 32px; align-items: start; }
.col-right { position: sticky; top: 24px; }
.order-panel { background: var(--white); border: 1.5px solid var(--border); border-radius: 16px; overflow: hidden; }
.order-panel-header { background: var(--ink); padding: 24px 26px 20px; position: relative; overflow: hidden; }
.order-panel-header::before { content: ''; position: absolute; top: -40px; right: -40px; width: 160px; height: 160px; border-radius: 50%; background: radial-gradient(circle, rgba(176,90,114,0.2) 0%, transparent 70%); pointer-events: none; }
.order-panel-eyebrow { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--rose-light); font-weight: 600; margin-bottom: 10px; position: relative; z-index: 1; }
.order-price-row { display: flex; align-items: flex-start; gap: 3px; margin-bottom: 2px; position: relative; z-index: 1; }
.order-currency { font-size: 18px; color: rgba(255,255,255,0.45); font-weight: 300; margin-top: 8px; }
.order-amount { font-family: 'Playfair Display', serif; font-size: 56px; color: var(--parchment); font-weight: 400; line-height: 1; }
.order-was { font-size: 12px; color: rgba(255,255,255,0.3); text-decoration: line-through; margin-left: 6px; align-self: center; font-style: italic; }
.order-price-note { font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 12px; position: relative; z-index: 1; }
.order-launch-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(192,120,64,0.18); border: 1px solid rgba(192,120,64,0.3); border-radius: 50px; padding: 5px 12px; font-size: 11px; color: #F0B07A; font-weight: 500; position: relative; z-index: 1; }
.order-launch-dot { width: 6px; height: 6px; border-radius: 50%; background: #F0B07A; animation: pulse 2s infinite; }
.order-panel-body { padding: 20px 26px 24px; }
.order-includes { list-style: none; margin-bottom: 20px; display: flex; flex-direction: column; gap: 9px; }
.order-includes li { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: var(--text-body); line-height: 1.45; }
.order-includes li::before { content: '✓'; color: var(--sage); font-weight: 700; font-size: 12px; flex-shrink: 0; margin-top: 1px; }
.order-divider { height: 1px; background: var(--border); margin: 18px 0; }
.btn-order { width: 100%; background: var(--rose); color: white; font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; padding: 16px; border-radius: 50px; border: none; cursor: pointer; letter-spacing: 0.02em; box-shadow: 0 6px 28px rgba(176,90,114,0.3); transition: background 0.15s, transform 0.12s, box-shadow 0.15s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px; }
.btn-order:hover { background: #C06680; transform: translateY(-1px); box-shadow: 0 10px 36px rgba(176,90,114,0.4); }
.btn-order svg { width: 15px; height: 15px; }
.card-logos { display: flex; align-items: center; justify-content: center; gap: 7px; margin-bottom: 16px; }
.card-logo { background: var(--parchment-2); border: 1px solid var(--border); border-radius: 5px; padding: 4px 9px; font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
.card-logo.visa { color: #1A1F71; }
.card-logo.mc { color: #EB001B; }
.card-logo.amex { color: #007BC1; }
.trust-signals { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.trust-sig { display: flex; align-items: center; gap: 9px; font-size: 12px; color: var(--text-muted); }
.trust-sig-icon { font-size: 13px; flex-shrink: 0; }
.order-guarantee { background: var(--sage-pale); border: 1px solid rgba(107,158,133,0.25); border-radius: 10px; padding: 14px 16px; display: flex; gap: 12px; align-items: flex-start; }
.og-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
.og-title { font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 3px; }
.og-desc { font-size: 11.5px; color: var(--text-body); line-height: 1.55; }
@media (max-width: 780px) { .two-col { grid-template-columns: 1fr; } .col-right { position: static; order: -1; } }
.completion-badge { display: flex; align-items: center; gap: 10px; background: var(--sage-pale); border: 1px solid rgba(107,158,133,0.3); border-radius: 50px; padding: 10px 18px; margin-bottom: 32px; width: fit-content; }
.badge-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--sage); flex-shrink: 0; box-shadow: 0 0 0 3px rgba(107,158,133,0.2); animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { box-shadow: 0 0 0 3px rgba(107,158,133,0.2); } 50% { box-shadow: 0 0 0 6px rgba(107,158,133,0.08); } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.badge-text { font-size: 12px; font-weight: 600; color: var(--sage); letter-spacing: 0.06em; text-transform: uppercase; }
.page-heading { margin-bottom: 36px; }
.page-heading h1 { font-family: 'Playfair Display', serif; font-size: clamp(26px, 5vw, 36px); font-weight: 400; color: var(--ink); line-height: 1.2; margin-bottom: 10px; }
.page-heading h1 em { font-style: italic; color: var(--rose); }
.page-heading p { font-size: 15px; color: var(--text-muted); line-height: 1.7; }
.summary-card { background: var(--ink); border-radius: 16px; overflow: hidden; margin-bottom: 24px; position: relative; }
.summary-card::before { content: ''; position: absolute; top: -60px; right: -60px; width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(circle, rgba(176,90,114,0.18) 0%, transparent 70%); pointer-events: none; }
.summary-header { padding: 28px 32px 22px; border-bottom: 1px solid rgba(255,255,255,0.07); position: relative; z-index: 1; }
.summary-doc-meta { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.summary-doc-logo { font-family: 'Playfair Display', serif; font-size: 13px; color: rgba(255,255,255,0.4); }
.summary-doc-ref { font-family: monospace; font-size: 10px; color: rgba(255,255,255,0.2); letter-spacing: 0.08em; }
.summary-name-line { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--parchment); margin-bottom: 4px; }
.summary-name-line em { font-style: italic; color: var(--rose-light); }
.summary-sub { font-size: 12px; color: rgba(255,255,255,0.38); font-style: italic; }
.summary-fp { padding: 20px 32px 0; position: relative; z-index: 1; }
.fp-label-text { font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.28); margin-bottom: 10px; }
.fp-bars-row { display: flex; gap: 5px; align-items: flex-end; height: 48px; }
.fp-b { flex: 1; border-radius: 3px 3px 0 0; background: var(--rose); opacity: 0.8; transition: height 0.6s ease; }
.summary-focus { padding: 20px 32px 28px; position: relative; z-index: 1; }
.focus-label { font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.28); margin-bottom: 12px; }
.focus-tags { display: flex; flex-wrap: wrap; gap: 7px; }
.focus-tag { font-size: 12px; padding: 6px 14px; border-radius: 50px; background: rgba(176,90,114,0.14); border: 1px solid rgba(176,90,114,0.28); color: var(--rose-light); font-weight: 500; }
.focus-tag.sage-tag { background: rgba(107,158,133,0.12); border-color: rgba(107,158,133,0.25); color: #9DCFB8; }
.inside-card { background: var(--white); border: 1.5px solid var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 24px; }
.inside-card-header { padding: 20px 24px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.inside-card-header h3 { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 500; color: var(--ink); }
.inside-count { font-size: 11px; color: var(--text-muted); background: var(--parchment-2); padding: 4px 10px; border-radius: 20px; font-weight: 500; letter-spacing: 0.04em; }
.inside-rows { padding: 6px 0; }
.inside-row { display: flex; align-items: center; gap: 14px; padding: 12px 24px; border-bottom: 1px solid var(--border); transition: background 0.12s; }
.inside-row:last-child { border-bottom: none; }
.inside-row:hover { background: var(--parchment); }
.inside-row-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.icon-rose { background: var(--rose-pale); }
.icon-sage { background: var(--sage-pale); }
.icon-amber { background: var(--amber-pale); }
.inside-row-title { font-size: 13px; font-weight: 600; color: var(--text-main); margin-bottom: 1px; }
.inside-row-desc { font-size: 12px; color: var(--text-muted); line-height: 1.45; }
.inside-row-badge { margin-left: auto; font-size: 10px; padding: 3px 10px; border-radius: 20px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; flex-shrink: 0; }
.badge-rose { background: var(--rose-pale); color: var(--rose); }
.badge-sage { background: var(--sage-pale); color: var(--sage); }
.badge-amber { background: var(--amber-pale); color: var(--amber); }
.delivery-card { background: var(--white); border: 1.5px solid var(--border); border-radius: 14px; padding: 24px 26px; margin-bottom: 24px; }
.delivery-card h3 { font-size: 13px; font-weight: 600; color: var(--text-main); margin-bottom: 18px; letter-spacing: 0.02em; }
.delivery-steps { display: flex; flex-direction: column; gap: 0; }
.delivery-step { display: grid; grid-template-columns: 28px 1fr; gap: 14px; padding-bottom: 18px; position: relative; }
.delivery-step:not(:last-child)::before { content: ''; position: absolute; left: 13px; top: 28px; bottom: 0; width: 1px; background: var(--border); }
.delivery-step:last-child { padding-bottom: 0; }
.ds-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
.ds-dot.now { background: var(--sage); color: white; }
.ds-dot.next { background: var(--rose-pale); border: 1.5px solid var(--rose-light); color: var(--rose); font-size: 10px; }
.ds-dot.future { background: var(--parchment-2); border: 1.5px solid var(--border); color: var(--text-muted); font-size: 10px; }
.ds-time { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 2px; }
.ds-time.highlight { color: var(--sage); }
.ds-title { font-size: 13px; font-weight: 600; color: var(--text-main); margin-bottom: 2px; }
.ds-desc { font-size: 12px; color: var(--text-muted); line-height: 1.5; }
.mini-testi { background: var(--rose-pale); border: 1.5px solid rgba(176,90,114,0.15); border-radius: 14px; padding: 22px 26px; margin-bottom: 0; }
.mini-testi-stars { display: flex; gap: 2px; margin-bottom: 10px; }
.mini-testi-stars span { color: var(--amber); font-size: 13px; }
.mini-testi blockquote { font-family: 'Playfair Display', serif; font-size: 15px; font-style: italic; color: var(--text-body); line-height: 1.65; margin-bottom: 12px; }
.mini-testi cite { font-size: 12px; font-style: normal; color: var(--text-muted); }
.mini-testi cite strong { color: var(--text-main); }
.page-footer { margin-top: 40px; text-align: center; font-size: 11.5px; color: var(--text-muted); line-height: 1.65; padding: 0 12px; }
.page-footer a { color: var(--text-muted); text-decoration: underline; }
.reveal { opacity: 0; transform: translateY(14px); transition: opacity 0.4s ease, transform 0.4s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
.order-err { color: var(--rose); font-size: 12px; text-align: center; margin-bottom: 10px; }
@media (max-width: 500px) {
  .topbar { padding: 14px 20px; }
  .summary-header { padding: 22px 22px 18px; }
  .summary-fp, .summary-focus { padding-left: 22px; padding-right: 22px; }
  .inside-row { padding: 12px 18px; }
  .inside-row-badge { display: none; }
}
`;

export default function OrderPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(sessionStorage.getItem("intakeName") || "");
    setEmail(sessionStorage.getItem("intakeEmail") || "");

    document.querySelectorAll(".reveal").forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), 100 + i * 80);
    });
  }, []);

  async function handleCheckout() {
    setError(null);
    let orderId: string | null = sessionStorage.getItem("orderId");
    if (!orderId) {
      const params = new URLSearchParams(window.location.search);
      orderId = params.get("id");
    }
    if (!orderId) {
      setError("We couldn't find your assessment. Please start again.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error || "checkout failed");
      window.location.href = json.url;
    } catch {
      setError("Something went wrong starting checkout. Please try again.");
      setLoading(false);
    }
  }

  const heading = name ? `One last step, ${name}.` : "One last step.";
  const deliveryEmail = email || "your inbox";
  const summaryName = name || "Your";

  return (
    <>
      <style>{ORDER_CSS}</style>

      <header className="topbar">
        <div className="logo">
          Bloomia
          <span>Personalized Menopause Intelligence</span>
        </div>
        <div className="topbar-step">
          <span className="done">✓ Assessment complete</span>
          <span className="sep">·</span>
          <span>Step 2 of 2</span>
        </div>
      </header>

      <div className="page-wrap">
        <div className="completion-badge reveal">
          <div className="badge-dot" />
          <span className="badge-text">Your Protocol is ready to generate</span>
        </div>
        <div className="page-heading reveal">
          <h1>
            {heading}
            <br />
            Then it's <em>all yours.</em>
          </h1>
          <p>
            You've answered everything we need. Your personalised Protocol is queued and will be generated the moment
            your order is confirmed.
          </p>
        </div>

        <div className="two-col">
          <div className="col-left">
            <div className="summary-card reveal">
              <div className="summary-header">
                <div className="summary-doc-meta">
                  <span className="summary-doc-logo">Bloomia</span>
                  <span className="summary-doc-ref">BL-2026-00847</span>
                </div>
                <div className="summary-name-line">
                  {summaryName}&apos;s Menopause <em>Protocol</em>
                </div>
                <div className="summary-sub">Generated from your personal assessment</div>
              </div>
              <div className="summary-fp">
                <div className="fp-label-text">Your symptom fingerprint</div>
                <div className="fp-bars-row">
                  {[80, 100, 88, 60, 52, 70, 44, 36, 64, 28, 48, 32].map((h, i) => (
                    <div className="fp-b" key={i} style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div className="summary-focus">
                <div className="focus-label">Your Protocol will focus on</div>
                <div className="focus-tags">
                  <span className="focus-tag">🌡️ Hot flashes &amp; night sweats</span>
                  <span className="focus-tag">🌙 Sleep disruption</span>
                  <span className="focus-tag">⚖️ Belly weight</span>
                  <span className="focus-tag sage-tag">🧘‍♀️ Anxiety</span>
                  <span className="focus-tag sage-tag">⚡ Fatigue</span>
                </div>
              </div>
            </div>

            <div className="inside-card reveal">
              <div className="inside-card-header">
                <h3>What&apos;s inside your Protocol</h3>
                <span className="inside-count">20+ pages</span>
              </div>
              <div className="inside-rows">
                <div className="inside-row">
                  <div className="inside-row-icon icon-rose">🧬</div>
                  <div><div className="inside-row-title">What&apos;s happening in your body</div><div className="inside-row-desc">Your hormonal mechanisms — explained clearly for your stage</div></div>
                  <span className="inside-row-badge badge-rose">Personalised</span>
                </div>
                <div className="inside-row">
                  <div className="inside-row-icon icon-amber">🥗</div>
                  <div><div className="inside-row-title">Nutrition Protocol</div><div className="inside-row-desc">Calibrated to your diet &amp; symptom triggers</div></div>
                  <span className="inside-row-badge badge-amber">6-week plan</span>
                </div>
                <div className="inside-row">
                  <div className="inside-row-icon icon-rose">🌙</div>
                  <div><div className="inside-row-title">Sleep Rescue Plan</div><div className="inside-row-desc">Built for your specific wake pattern — not generic insomnia</div></div>
                  <span className="inside-row-badge badge-rose">Priority focus</span>
                </div>
                <div className="inside-row">
                  <div className="inside-row-icon icon-sage">🏃‍♀️</div>
                  <div><div className="inside-row-title">Movement Strategy</div><div className="inside-row-desc">Why your current routine may be working against you — and what to do instead</div></div>
                  <span className="inside-row-badge badge-sage">Adapted</span>
                </div>
                <div className="inside-row">
                  <div className="inside-row-icon icon-amber">💊</div>
                  <div><div className="inside-row-title">Supplement Stack</div><div className="inside-row-desc">Evidence-based, prioritised for your symptoms with dosing &amp; timing</div></div>
                  <span className="inside-row-badge badge-amber">Prioritised</span>
                </div>
                <div className="inside-row">
                  <div className="inside-row-icon icon-rose">🩺</div>
                  <div><div className="inside-row-title">Your Doctor&apos;s Brief</div><div className="inside-row-desc">Print it. Take it to your appointment. Know exactly what to ask for.</div></div>
                  <span className="inside-row-badge badge-rose">Print-ready</span>
                </div>
              </div>
            </div>

            <div className="delivery-card reveal">
              <h3>What happens next</h3>
              <div className="delivery-steps">
                <div className="delivery-step">
                  <div className="ds-dot now">✓</div>
                  <div><div className="ds-time highlight">Right now</div><div className="ds-title">Assessment complete</div><div className="ds-desc">Your answers are saved and ready for generation.</div></div>
                </div>
                <div className="delivery-step">
                  <div className="ds-dot next">2</div>
                  <div><div className="ds-time">After payment</div><div className="ds-title">Protocol generation begins</div><div className="ds-desc">Your answers are processed and your personalised document is built. Usually takes a few minutes.</div></div>
                </div>
                <div className="delivery-step">
                  <div className="ds-dot future">3</div>
                  <div><div className="ds-time">Within 24 hours</div><div className="ds-title">Delivered to your inbox</div><div className="ds-desc">Your Protocol arrives as a PDF at {deliveryEmail}. Print it, save it, read it at your own pace.</div></div>
                </div>
              </div>
            </div>

            <div className="mini-testi reveal">
              <div className="mini-testi-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
              <blockquote>&quot;I almost didn&apos;t go through with it. I&apos;m so glad I did — it was the first time anything felt written for me, not for some average version of a menopausal woman.&quot;</blockquote>
              <cite><strong>Claire, 52</strong> · Late perimenopause · UK</cite>
            </div>
          </div>

          <div className="col-right">
            <div className="order-panel reveal">
              <div className="order-panel-header">
                <div className="order-panel-eyebrow">Your Menopause Management Protocol</div>
                <div className="order-price-row">
                  <span className="order-currency">$</span>
                  <span className="order-amount">27</span>
                  <span className="order-was">$97</span>
                </div>
                <div className="order-price-note">One-time payment · No subscription</div>
                <div className="order-launch-badge"><span className="order-launch-dot" />Launch price — ends soon</div>
              </div>
              <div className="order-panel-body">
                <ul className="order-includes">
                  <li>20+ page personalised Protocol PDF</li>
                  <li>Nutrition plan for your symptom triggers</li>
                  <li>Sleep rescue protocol for your pattern</li>
                  <li>Movement strategy for your stage</li>
                  <li>Prioritised supplement stack with dosing</li>
                  <li>Doctor&apos;s brief — print &amp; take to your GP</li>
                  <li>Delivered to your inbox within 24 hours</li>
                </ul>
                <div className="order-divider" />
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 18, textAlign: "center" }}>
                  A session with a menopause specialist costs <strong style={{ color: "var(--text-body)" }}>$200–$400</strong>. A
                  functional nutritionist, another <strong style={{ color: "var(--text-body)" }}>$150–$300</strong>. Your Protocol
                  covers both — for $27.
                </p>
                {error && <p className="order-err">{error}</p>}
                <button className="btn-order" onClick={handleCheckout} disabled={loading} style={loading ? { background: "#8A7A82" } : undefined}>
                  {loading ? (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 0.8s linear infinite" }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Redirecting to Stripe…
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" />
                        <path d="M1 10h22" />
                      </svg>
                      Complete my order — $27
                    </>
                  )}
                </button>
                <div className="card-logos">
                  <span className="card-logo visa">Visa</span>
                  <span className="card-logo mc">MC</span>
                  <span className="card-logo amex">Amex</span>
                </div>
                <div className="trust-signals">
                  <div className="trust-sig"><span className="trust-sig-icon">🔒</span>Secured by Stripe · SSL encrypted</div>
                  <div className="trust-sig"><span className="trust-sig-icon">📧</span>Sent instantly to your inbox</div>
                  <div className="trust-sig"><span className="trust-sig-icon">🚫</span>No subscription — ever</div>
                  <div className="trust-sig"><span className="trust-sig-icon">🛡️</span>Your data is private &amp; never shared</div>
                </div>
                <div className="order-divider" />
                <div className="order-guarantee">
                  <span className="og-icon">↩️</span>
                  <div>
                    <div className="og-title">30-day money-back guarantee</div>
                    <div className="og-desc">If the Protocol doesn&apos;t help, email us within 30 days for a full refund. No questions asked.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="page-footer reveal">
          Bloomia provides evidence-informed lifestyle and wellness guidance. It is not a substitute for medical advice.{" "}
          <a href="#">Privacy policy</a> · <a href="#">Terms</a>
        </div>
      </div>
    </>
  );
}
