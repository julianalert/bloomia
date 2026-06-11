"use client";

import { useEffect } from "react";

const CSS = `
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; background: rgba(28, 20, 24, 0.96); backdrop-filter: blur(12px); padding: 0 48px; height: 60px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.07); }
.nav-logo { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--parchment); letter-spacing: 0.03em; }
.nav-cta { background: var(--rose); color: white; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; padding: 9px 22px; border-radius: 50px; border: none; cursor: pointer; text-decoration: none; letter-spacing: 0.02em; transition: background 0.15s; }
.nav-cta:hover { background: #C06680; }
.hero { background: var(--ink); padding: 140px 48px 100px; text-align: center; position: relative; overflow: hidden; }
.hero-glow-1 { position: absolute; top: -100px; right: -100px; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(176,90,114,0.18) 0%, transparent 65%); pointer-events: none; }
.hero-glow-2 { position: absolute; bottom: -80px; left: -80px; width: 360px; height: 360px; border-radius: 50%; background: radial-gradient(circle, rgba(107,158,133,0.1) 0%, transparent 65%); pointer-events: none; }
.hero-inner { position: relative; z-index: 1; max-width: 780px; margin: 0 auto; }
.hero-eyebrow { display: inline-block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--rose-light); font-weight: 600; margin-bottom: 24px; background: rgba(176,90,114,0.12); border: 1px solid rgba(232,164,181,0.2); padding: 7px 18px; border-radius: 50px; }
.hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(34px, 6vw, 62px); font-weight: 400; color: var(--parchment); line-height: 1.14; margin-bottom: 24px; letter-spacing: -0.01em; }
.hero h1 em { font-style: italic; color: var(--rose-light); }
.hero-sub { font-size: 18px; color: rgba(255,255,255,0.5); max-width: 560px; margin: 0 auto 44px; line-height: 1.7; font-weight: 300; }
.hero-sub strong { color: rgba(255,255,255,0.8); font-weight: 500; }
.hero-cta-group { display: flex; flex-direction: column; align-items: center; gap: 14px; }
.btn-primary { display: inline-flex; align-items: center; gap: 10px; background: var(--rose); color: white; font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 600; padding: 18px 44px; border-radius: 50px; border: none; cursor: pointer; text-decoration: none; letter-spacing: 0.02em; box-shadow: 0 8px 40px rgba(176,90,114,0.4); transition: background 0.15s, transform 0.12s, box-shadow 0.15s; }
.btn-primary:hover { background: #C06680; transform: translateY(-2px); box-shadow: 0 12px 48px rgba(176,90,114,0.5); }
.btn-primary svg { width: 17px; height: 17px; }
.hero-cta-note { font-size: 13px; color: rgba(255,255,255,0.32); letter-spacing: 0.04em; }
.hero-social-proof { display: flex; justify-content: center; align-items: center; gap: 28px; margin-top: 60px; padding-top: 48px; border-top: 1px solid rgba(255,255,255,0.08); }
.hsp-item { text-align: center; }
.hsp-val { display: block; font-family: 'Playfair Display', serif; font-size: 28px; color: var(--parchment); font-weight: 400; line-height: 1; margin-bottom: 5px; }
.hsp-label { font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 0.1em; text-transform: uppercase; }
.hsp-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }
.section { padding: 96px 48px; }
.section-inner { max-width: 860px; margin: 0 auto; }
.section-inner.narrow { max-width: 680px; }
.section-inner.wide { max-width: 1020px; }
.section-eyebrow { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600; margin-bottom: 14px; }
.eyebrow-rose { color: var(--rose); }
.eyebrow-sage { color: var(--sage); }
.eyebrow-amber { color: var(--amber); }
.section-h2 { font-family: 'Playfair Display', serif; font-size: clamp(28px, 4vw, 44px); font-weight: 400; color: var(--ink); line-height: 1.2; margin-bottom: 20px; }
.section-h2 em { font-style: italic; color: var(--rose); }
.section-lead { font-size: 17px; color: var(--text-body); line-height: 1.75; margin-bottom: 48px; max-width: 620px; }
.symptom-cloud { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 52px; }
.sym-tag { display: inline-flex; align-items: center; gap: 8px; padding: 11px 18px; border-radius: 50px; font-size: 14px; font-weight: 500; border: 1.5px solid var(--border); background: white; color: var(--text-body); opacity: 0; transform: translateY(12px); transition: opacity 0.4s ease, transform 0.4s ease, background 0.2s, border-color 0.2s; }
.sym-tag.visible { opacity: 1; transform: translateY(0); }
.sym-tag:hover { background: var(--rose-pale); border-color: var(--rose-light); color: var(--rose); }
.sym-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--rose-light); flex-shrink: 0; }
.sym-tag.intense { border-color: var(--rose-light); color: var(--rose); background: var(--rose-pale); }
.sym-tag.intense .sym-dot { background: var(--rose); }
.voice-quote { background: var(--ink); border-radius: 14px; padding: 36px 44px; position: relative; margin-bottom: 52px; }
.voice-quote::before { content: '"'; font-family: 'Playfair Display', serif; font-size: 120px; color: rgba(176,90,114,0.15); position: absolute; top: -10px; left: 24px; line-height: 1; pointer-events: none; }
.voice-quote p { font-family: 'Playfair Display', serif; font-size: 20px; font-style: italic; color: rgba(255,255,255,0.85); line-height: 1.6; position: relative; z-index: 1; }
.voice-quote cite { display: block; margin-top: 16px; font-family: 'Inter', sans-serif; font-size: 12px; font-style: normal; color: rgba(255,255,255,0.35); letter-spacing: 0.08em; text-transform: uppercase; }
.cost-bg { background: var(--parchment-2); }
.cost-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 52px; }
.cost-card { background: white; border: 1.5px solid var(--border); border-radius: 14px; padding: 28px 30px; }
.cost-card .cost-icon { font-size: 28px; margin-bottom: 14px; display: block; }
.cost-card h4 { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 400; color: var(--ink); margin-bottom: 10px; }
.cost-card p { font-size: 14px; color: var(--text-body); line-height: 1.7; }
.why-nothing-works { background: var(--rose-pale); border: 1.5px solid var(--rose-light); border-radius: 14px; padding: 36px 40px; margin-bottom: 0; }
.why-nothing-works h3 { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 400; color: var(--ink); margin-bottom: 20px; }
.why-nothing-works h3 em { font-style: italic; color: var(--rose); }
.why-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
.why-list li { display: flex; gap: 14px; font-size: 15px; color: var(--text-body); line-height: 1.6; }
.why-list li::before { content: '×'; color: var(--rose); font-size: 18px; font-weight: 600; flex-shrink: 0; margin-top: -1px; }
.turning-point { background: var(--ink); padding: 80px 48px; text-align: center; }
.turning-point .tp-inner { max-width: 640px; margin: 0 auto; }
.turning-point h2 { font-family: 'Playfair Display', serif; font-size: clamp(26px, 4vw, 42px); font-weight: 400; color: var(--parchment); line-height: 1.2; margin-bottom: 20px; }
.turning-point h2 em { color: var(--rose-light); font-style: italic; }
.turning-point p { font-size: 17px; color: rgba(255,255,255,0.5); line-height: 1.75; font-weight: 300; }
.turning-point p strong { color: rgba(255,255,255,0.8); font-weight: 500; }
.product-intro { display: flex; flex-direction: column; align-items: center; gap: 52px; margin-bottom: 72px; max-width: 680px; margin-left: auto; margin-right: auto; }
.product-doc-preview { background: var(--ink); border-radius: 16px; padding: 40px 44px; position: relative; overflow: hidden; width: 100%; }
.product-doc-preview::before { content: ''; position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle, rgba(176,90,114,0.2) 0%, transparent 70%); }
.doc-mock-header { display: flex; justify-content: space-between; margin-bottom: 20px; position: relative; z-index: 1; }
.doc-mock-logo { font-family: 'Playfair Display', serif; font-size: 13px; color: rgba(255,255,255,0.5); }
.doc-mock-ref { font-size: 10px; color: rgba(255,255,255,0.25); letter-spacing: 0.08em; font-family: monospace; }
.doc-mock-title { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--parchment); margin-bottom: 6px; position: relative; z-index: 1; }
.doc-mock-title em { color: var(--rose-light); font-style: italic; }
.doc-mock-name { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 24px; font-style: italic; position: relative; z-index: 1; }
.doc-mock-bars { display: flex; gap: 5px; align-items: flex-end; height: 60px; margin-bottom: 20px; position: relative; z-index: 1; }
.doc-mock-bar { flex: 1; border-radius: 3px 3px 0 0; background: var(--rose); opacity: 0.75; }
.doc-mock-meta { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; position: relative; z-index: 1; }
.doc-mock-pill { font-size: 10px; padding: 4px 11px; border-radius: 20px; background: rgba(176,90,114,0.15); border: 1px solid rgba(176,90,114,0.25); color: var(--rose-light); letter-spacing: 0.05em; font-family: 'Inter', sans-serif; }
.doc-mock-sections { display: flex; flex-direction: column; gap: 7px; position: relative; z-index: 1; }
.doc-mock-row { height: 8px; border-radius: 4px; background: rgba(255,255,255,0.08); }
.doc-mock-row.short { width: 60%; }
.doc-mock-row.med { width: 80%; }
.doc-mock-row.full { width: 100%; }
.doc-mock-row.accent { background: rgba(176,90,114,0.3); width: 45%; }
.product-text .section-eyebrow { margin-bottom: 12px; }
.product-text .section-h2 { margin-bottom: 16px; }
.product-text .section-lead { margin-bottom: 32px; font-size: 16px; }
.check-list { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 36px; }
.check-list li { display: flex; gap: 12px; font-size: 15px; color: var(--text-body); line-height: 1.55; }
.check-list li::before { content: '✓'; color: var(--sage); font-size: 14px; font-weight: 700; flex-shrink: 0; margin-top: 1px; width: 18px; }
.inside-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 64px; }
.inside-card { background: white; border: 1.5px solid var(--border); border-radius: 14px; padding: 26px 24px; transition: border-color 0.15s, box-shadow 0.15s; }
.inside-card:hover { border-color: var(--rose-light); box-shadow: 0 4px 24px rgba(176,90,114,0.08); }
.inside-icon { font-size: 26px; margin-bottom: 12px; display: block; }
.inside-card h4 { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 500; color: var(--ink); margin-bottom: 8px; }
.inside-card p { font-size: 13px; color: var(--text-muted); line-height: 1.65; }
.inside-card .inside-tag { display: inline-block; margin-top: 12px; font-size: 10px; padding: 3px 10px; border-radius: 20px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
.tag-rose { background: var(--rose-pale); color: var(--rose); }
.tag-sage { background: var(--sage-pale); color: var(--sage); }
.tag-amber { background: var(--amber-pale); color: var(--amber); }
.how-bg { background: var(--parchment-2); }
.steps-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; margin-bottom: 0; position: relative; }
.steps-row::before { content: ''; position: absolute; top: 28px; left: calc(16.6% + 14px); right: calc(16.6% + 14px); height: 1px; background: var(--border); z-index: 0; }
.step-item { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 24px; position: relative; z-index: 1; }
.step-circle { width: 56px; height: 56px; border-radius: 50%; background: var(--white); border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 18px; box-shadow: 0 2px 12px rgba(28,20,24,0.06); }
.step-item h4 { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 500; color: var(--ink); margin-bottom: 8px; }
.step-item p { font-size: 13px; color: var(--text-muted); line-height: 1.65; }
.testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 0; }
.testi-card { background: white; border: 1.5px solid var(--border); border-radius: 14px; padding: 28px; }
.testi-stars { display: flex; gap: 2px; margin-bottom: 14px; }
.testi-stars span { color: var(--amber); font-size: 14px; }
.testi-card blockquote { font-family: 'Playfair Display', serif; font-size: 15px; font-style: italic; color: var(--text-body); line-height: 1.65; margin-bottom: 16px; }
.testi-card cite { font-size: 12px; font-style: normal; color: var(--text-muted); letter-spacing: 0.05em; display: flex; flex-direction: column; gap: 2px; }
.testi-card cite strong { color: var(--text-main); font-size: 13px; }
.objection-list { display: flex; flex-direction: column; gap: 0; border: 1.5px solid var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 64px; }
.objection-item { padding: 24px 28px; border-bottom: 1px solid var(--border); display: grid; grid-template-columns: auto 1fr; gap: 20px; align-items: flex-start; background: white; transition: background 0.15s; }
.objection-item:last-child { border-bottom: none; }
.objection-item:hover { background: var(--parchment); }
.obj-q { font-size: 15px; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
.obj-a { font-size: 14px; color: var(--text-body); line-height: 1.65; }
.obj-icon { width: 36px; height: 36px; border-radius: 8px; background: var(--rose-pale); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.pricing-bg { background: var(--ink); }
.pricing-card { max-width: 520px; margin: 0 auto; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 52px 52px 44px; text-align: center; position: relative; overflow: hidden; }
.pricing-card::before { content: ''; position: absolute; top: -80px; right: -80px; width: 280px; height: 280px; border-radius: 50%; background: radial-gradient(circle, rgba(176,90,114,0.15) 0%, transparent 70%); pointer-events: none; }
.pricing-eyebrow { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--rose-light); font-weight: 600; margin-bottom: 12px; }
.pricing-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 400; color: var(--parchment); margin-bottom: 28px; line-height: 1.3; }
.pricing-title em { font-style: italic; color: var(--rose-light); }
.price-display { display: flex; align-items: flex-start; justify-content: center; gap: 4px; margin-bottom: 6px; }
.price-currency { font-size: 26px; color: rgba(255,255,255,0.45); font-weight: 300; margin-top: 10px; }
.price-number { font-family: 'Playfair Display', serif; font-size: 72px; color: var(--parchment); font-weight: 400; line-height: 1; }
.price-note { font-size: 13px; color: rgba(255,255,255,0.3); letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 36px; }
.pricing-includes { list-style: none; text-align: left; margin-bottom: 36px; display: flex; flex-direction: column; gap: 10px; }
.pricing-includes li { display: flex; gap: 12px; font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.5; }
.pricing-includes li::before { content: '✓'; color: var(--sage); font-weight: 700; flex-shrink: 0; }
.btn-pricing { width: 100%; background: var(--rose); color: white; font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 600; padding: 18px; border-radius: 50px; border: none; cursor: pointer; letter-spacing: 0.02em; box-shadow: 0 8px 40px rgba(176,90,114,0.4); transition: background 0.15s, transform 0.12s; display: flex; align-items: center; justify-content: center; gap: 10px; text-decoration: none; }
.btn-pricing:hover { background: #C06680; transform: translateY(-1px); }
.btn-pricing svg { width: 17px; height: 17px; }
.pricing-trust { display: flex; justify-content: center; gap: 20px; margin-top: 20px; flex-wrap: wrap; }
.pricing-trust span { font-size: 12px; color: rgba(255,255,255,0.28); display: flex; align-items: center; gap: 5px; }
.final-cta { background: var(--rose-pale); border-top: 1px solid rgba(176,90,114,0.15); padding: 80px 48px; text-align: center; }
.final-cta h2 { font-family: 'Playfair Display', serif; font-size: clamp(26px, 4vw, 40px); font-weight: 400; color: var(--ink); line-height: 1.2; margin-bottom: 16px; }
.final-cta h2 em { font-style: italic; color: var(--rose); }
.final-cta p { font-size: 16px; color: var(--text-body); margin-bottom: 36px; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.7; }
.footer { background: var(--ink); padding: 36px 48px; display: flex; justify-content: space-between; align-items: center; }
.footer-logo { font-family: 'Playfair Display', serif; font-size: 16px; color: rgba(255,255,255,0.45); }
.footer-disclaimer { font-size: 11px; color: rgba(255,255,255,0.2); max-width: 460px; text-align: right; line-height: 1.6; }
.section-divider { width: 48px; height: 2px; background: var(--rose-light); margin-bottom: 28px; }
.reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
@media (max-width: 768px) {
  .nav { padding: 0 20px; }
  .section { padding: 72px 24px; }
  .hero { padding: 110px 24px 72px; }
  .product-intro { grid-template-columns: 1fr; gap: 36px; }
  .inside-grid { grid-template-columns: 1fr 1fr; }
  .cost-grid { grid-template-columns: 1fr; }
  .steps-row { grid-template-columns: 1fr; gap: 36px; }
  .steps-row::before { display: none; }
  .testi-grid { grid-template-columns: 1fr; }
  .hero-social-proof { gap: 16px; flex-wrap: wrap; }
  .footer { flex-direction: column; gap: 16px; text-align: center; }
  .footer-disclaimer { text-align: center; }
  .pricing-card { padding: 36px 28px; }
}
@media (max-width: 520px) {
  .inside-grid { grid-template-columns: 1fr; }
  .hero h1 { font-size: 30px; }
}
`;

const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

const MARKUP = `
<nav class="nav">
  <div class="nav-logo">Bloomia</div>
  <a href="/assessment" class="nav-cta">Get my Protocol — $27</a>
</nav>

<section class="hero">
  <div class="hero-glow-1"></div>
  <div class="hero-glow-2"></div>
  <div class="hero-inner">
    <span class="hero-eyebrow">Personalized Menopause Management Protocol</span>
    <h1>You're not falling apart.<br>You're just missing<br><em>your specific plan.</em></h1>
    <p class="hero-sub">A 20+ page Protocol built entirely around <strong>your symptoms, your body, your life</strong> — delivered to your inbox in 24 hours.</p>
    <div class="hero-cta-group">
      <a href="/assessment" class="btn-primary">Build my Protocol ${arrow}</a>
      <span class="hero-cta-note">$27 · One-time · No subscription</span>
    </div>
    <div class="hero-social-proof">
      <div class="hsp-item"><span class="hsp-val">1B+</span><span class="hsp-label">Women in menopause globally</span></div>
      <div class="hsp-divider"></div>
      <div class="hsp-item"><span class="hsp-val">53%</span><span class="hsp-label">Don't have the tools to manage it</span></div>
      <div class="hsp-divider"></div>
      <div class="hsp-item"><span class="hsp-val">42%</span><span class="hsp-label">Spend 1+ year finding the right care</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="section-inner">
    <p class="section-eyebrow eyebrow-rose reveal">The problem</p>
    <div class="section-divider reveal"></div>
    <h2 class="section-h2 reveal">You wake up at 3am — again.<br>Drenched. <em>Exhausted. Invisible.</em></h2>
    <p class="section-lead reveal">You can't remember the last time you slept through the night. The belly weight won't move no matter what you do. You snap at people you love and don't recognise yourself. And somewhere underneath it all is the creeping feeling that nobody — not your doctor, not the internet, not the supplements you've tried — is actually addressing <em>your</em> situation.</p>
    <div class="symptom-cloud" id="symptomCloud">
      <span class="sym-tag intense">🌡️ Hot flashes</span>
      <span class="sym-tag intense">💧 Night sweats</span>
      <span class="sym-tag intense">😴 Waking at 3am</span>
      <span class="sym-tag">⚖️ Belly weight that won't shift</span>
      <span class="sym-tag intense">🌫️ Brain fog at work</span>
      <span class="sym-tag">😤 Irritability you can't explain</span>
      <span class="sym-tag intense">😰 Anxiety out of nowhere</span>
      <span class="sym-tag">💔 Not feeling like yourself</span>
      <span class="sym-tag">🦴 Aching joints</span>
      <span class="sym-tag">⚡ Exhausted by noon</span>
      <span class="sym-tag">🧠 Forgetting words mid-sentence</span>
      <span class="sym-tag">😢 Low mood for no reason</span>
      <span class="sym-tag">❤️ Lost interest in intimacy</span>
      <span class="sym-tag">💊 Palpitations that frighten you</span>
    </div>
    <div class="voice-quote reveal">
      <p>"The brainfog, anger, and anxiety have had a huge impact — it's terrifying to lose myself that way. I thought I should be OK because I was on HRT. The more we talk about this and fight for the correct treatment for us personally, the more everyone will 'get it'. It is a personal ride every woman goes on and there isn't a one-solution fix for all."</p>
      <cite>— Jennifer, 51 · perimenopause community</cite>
    </div>
  </div>
</section>

<section class="section cost-bg">
  <div class="section-inner">
    <p class="section-eyebrow eyebrow-amber reveal">What it's actually costing you</p>
    <div class="section-divider reveal" style="background: var(--amber-pale)"></div>
    <h2 class="section-h2 reveal">This isn't "just" menopause.<br><em>It's your whole life.</em></h2>
    <p class="section-lead reveal">Menopause symptoms don't stay in the bedroom. They follow you to work, into your relationships, into the mirror. And the longer they go unmanaged with a plan that's actually built for you — the higher the cost.</p>
    <div class="cost-grid">
      <div class="cost-card reveal"><span class="cost-icon">💼</span><h4>Your work</h4><p>Brain fog, concentration lapses, and exhaustion from broken sleep are silently eroding your performance. Women report losing hours of productive work every day during peak menopause years.</p></div>
      <div class="cost-card reveal"><span class="cost-icon">💑</span><h4>Your relationships</h4><p>Mood swings that you can't explain. Irritability at people who don't deserve it. Distance from your partner. The people closest to you are feeling the fallout of a hormonal shift no one prepared you for.</p></div>
      <div class="cost-card reveal"><span class="cost-icon">🪞</span><h4>Your sense of self</h4><p>The weight you can't shift. The hair that's thinning. The face that looks tired even after a full night. It's not vanity — it's a signal that your body needs a different kind of support now.</p></div>
      <div class="cost-card reveal"><span class="cost-icon">🏥</span><h4>Your health trajectory</h4><p>Estrogen's drop accelerates bone density loss, raises cardiovascular risk, and shifts insulin sensitivity. The decisions you make in perimenopause shape the next 30 years. Generic advice doesn't account for that.</p></div>
    </div>
    <div class="why-nothing-works reveal">
      <h3>Why nothing has worked so far — <em>and it's not your fault</em></h3>
      <ul class="why-list">
        <li>Generic menopause advice is written for the average woman. But your symptoms are a specific combination that no average addresses.</li>
        <li>Your doctor has 10 minutes and limited menopause training. 47% of GPs feel underprepared to advise on menopause management.</li>
        <li>The internet gives you conflicting information until you give up. Information overload is one of the top four barriers women report.</li>
        <li>Apps track symptoms but don't tell you what to actually <em>do</em> about them — let alone in what order, or calibrated to your life.</li>
        <li>Supplement brands promise results without understanding your full picture — HRT status, health conditions, diet, stress load.</li>
      </ul>
    </div>
  </div>
</section>

<section class="turning-point">
  <div class="tp-inner">
    <h2>What you need isn't more information.<br><em>It's your protocol.</em></h2>
    <p>Not a generic guide. Not a symptom tracker. A <strong>complete, evidence-based action plan</strong> built from your specific answers — your symptoms, your stage, your body, your goals. Written as if a specialist sat down with you for two hours and designed it just for you.</p>
  </div>
</section>

<section class="section">
  <div class="section-inner wide">
    <div class="product-intro reveal">
      <div class="product-doc-preview">
        <div class="doc-mock-header"><span class="doc-mock-logo">Bloomia</span><span class="doc-mock-ref">BL-2026-00847</span></div>
        <div class="doc-mock-title">Your Menopause <em>Protocol</em></div>
        <div class="doc-mock-name">Prepared for Sarah, 48 — Late perimenopause</div>
        <div class="doc-mock-bars">
          <div class="doc-mock-bar" style="height:72%"></div><div class="doc-mock-bar" style="height:88%"></div><div class="doc-mock-bar" style="height:64%"></div><div class="doc-mock-bar" style="height:56%"></div><div class="doc-mock-bar" style="height:80%"></div><div class="doc-mock-bar" style="height:44%"></div><div class="doc-mock-bar" style="height:36%"></div><div class="doc-mock-bar" style="height:28%"></div><div class="doc-mock-bar" style="height:60%"></div><div class="doc-mock-bar" style="height:48%"></div><div class="doc-mock-bar" style="height:70%"></div><div class="doc-mock-bar" style="height:32%"></div>
        </div>
        <div class="doc-mock-meta"><span class="doc-mock-pill">Late Perimenopause</span><span class="doc-mock-pill">2 yr symptoms</span><span class="doc-mock-pill">4 focus areas</span><span class="doc-mock-pill">6-week plan</span></div>
        <div class="doc-mock-sections"><div class="doc-mock-row accent"></div><div class="doc-mock-row full"></div><div class="doc-mock-row med"></div><div class="doc-mock-row full"></div><div class="doc-mock-row short"></div><div class="doc-mock-row full"></div><div class="doc-mock-row med"></div><div class="doc-mock-row accent" style="width:30%; margin-top:4px;"></div></div>
      </div>
      <div class="product-text" style="width:100%; text-align:left;">
        <p class="section-eyebrow eyebrow-rose">The solution</p>
        <h2 class="section-h2">Your Personalized<br>Menopause Management<br><em>Protocol</em></h2>
        <p class="section-lead">A 20+ page document, generated specifically from your intake, that tells you exactly what to do — for your symptoms, your stage, your life.</p>
        <ul class="check-list">
          <li>Explains <em>what's actually happening</em> in your body right now — in plain language</li>
          <li>A 6-week nutrition plan built around your diet, restrictions, and symptom triggers</li>
          <li>A sleep rescue protocol designed for your specific disruption pattern</li>
          <li>A movement strategy calibrated to your activity level and hormonal state</li>
          <li>A supplement stack with dosing, timing, and priority — no guesswork</li>
          <li>A doctor's brief you can print and take to your next appointment</li>
        </ul>
        <a href="/assessment" class="btn-primary" style="display:inline-flex;">Start my assessment ${arrow}</a>
      </div>
    </div>
    <p class="section-eyebrow eyebrow-rose reveal" style="text-align:center; margin-bottom:8px;">What's inside your Protocol</p>
    <h2 class="section-h2 reveal" style="text-align:center; margin-bottom: 40px;">Six sections. One clear plan.</h2>
    <div class="inside-grid">
      <div class="inside-card reveal"><span class="inside-icon">🧬</span><h4>What's happening in your body</h4><p>The specific hormonal mechanisms behind your symptom cluster — explained clearly, without overwhelm.</p><span class="inside-tag tag-rose">Personalised</span></div>
      <div class="inside-card reveal"><span class="inside-icon">🥗</span><h4>Nutrition Protocol</h4><p>Foods, meal timing, and the one dietary shift most likely to reduce your top symptoms within 2 weeks.</p><span class="inside-tag tag-amber">Action plan</span></div>
      <div class="inside-card reveal"><span class="inside-icon">🌙</span><h4>Sleep Rescue Plan</h4><p>A step-by-step evening and waking protocol designed for hormonal sleep disruption — not generic insomnia.</p><span class="inside-tag tag-rose">Personalised</span></div>
      <div class="inside-card reveal"><span class="inside-icon">🏃‍♀️</span><h4>Movement Strategy</h4><p>What to do, what to reduce, and how to exercise with your hormones — not against them.</p><span class="inside-tag tag-sage">6-week plan</span></div>
      <div class="inside-card reveal"><span class="inside-icon">💊</span><h4>Supplement Stack</h4><p>Evidence-based supplements prioritised for your specific symptoms, with dosing and timing guidance.</p><span class="inside-tag tag-amber">Prioritised</span></div>
      <div class="inside-card reveal"><span class="inside-icon">🩺</span><h4>Your Doctor's Brief</h4><p>A print-ready summary of your symptoms, questions to ask, and treatments to request — so you leave no appointment empty-handed.</p><span class="inside-tag tag-sage">Print-ready</span></div>
    </div>
  </div>
</section>

<section class="section how-bg">
  <div class="section-inner">
    <p class="section-eyebrow eyebrow-sage reveal" style="text-align:center;">How it works</p>
    <h2 class="section-h2 reveal" style="text-align:center; margin-bottom: 56px;">From your answers<br>to your plan — in 24 hours</h2>
    <div class="steps-row">
      <div class="step-item reveal"><div class="step-circle">📋</div><h4>Answer 6 short steps</h4><p>Tell us about your symptoms, sleep, nutrition, lifestyle, and goals. Takes 8–10 minutes. No medical jargon, no pressure.</p></div>
      <div class="step-item reveal"><div class="step-circle">⚡</div><h4>Your Protocol is generated</h4><p>Our AI analyses your full intake and builds your Protocol — cross-referencing your symptoms, health context, and goals to produce a coherent plan.</p></div>
      <div class="step-item reveal"><div class="step-circle">📩</div><h4>Delivered to your inbox</h4><p>Your personalised PDF arrives within 24 hours. Print it, save it, take it to your doctor. It's yours.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="section-inner">
    <p class="section-eyebrow eyebrow-rose reveal" style="text-align:center;">What women are saying</p>
    <h2 class="section-h2 reveal" style="text-align:center; margin-bottom: 40px;">Finally — <em>something made for me</em></h2>
    <div class="testi-grid">
      <div class="testi-card reveal"><div class="testi-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div><blockquote>"I've read every menopause book. None of them told me what to actually do about <em>my</em> 3am wake-ups. This Protocol did. I've slept through the night four times this week for the first time in two years."</blockquote><cite><strong>Claire, 52</strong>Late perimenopause · UK</cite></div>
      <div class="testi-card reveal"><div class="testi-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div><blockquote>"The Doctor's Brief section alone was worth it. I went to my appointment with actual questions and left with a referral to a menopause specialist. Two years of being dismissed — and one printed page changed that."</blockquote><cite><strong>Marie, 48</strong>Early perimenopause · France</cite></div>
      <div class="testi-card reveal"><div class="testi-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div><blockquote>"I've spent hundreds on supplements that did nothing. The Protocol told me exactly which three to take, when, and why — based on my specific symptoms. I finally understand what my body actually needs."</blockquote><cite><strong>Susan, 55</strong>Postmenopause · US</cite></div>
    </div>
  </div>
</section>

<section class="section" style="padding-top: 0;">
  <div class="section-inner">
    <p class="section-eyebrow eyebrow-sage reveal" style="margin-bottom: 28px;">Common questions</p>
    <div class="objection-list">
      <div class="objection-item reveal"><div class="obj-icon">🤔</div><div><p class="obj-q">Is this medical advice?</p><p class="obj-a">No — and we're upfront about that. Bloomia provides evidence-based lifestyle and wellness guidance grounded in published research. It is not a diagnosis or prescription. The Doctor's Brief section is specifically designed to help you have a better conversation with your healthcare provider.</p></div></div>
      <div class="objection-item reveal"><div class="obj-icon">💊</div><div><p class="obj-q">I'm already on HRT — is this still useful?</p><p class="obj-a">Absolutely. HRT addresses hormonal symptoms — but it doesn't tell you how to eat, move, sleep, and supplement in a way that works with your hormonal environment. Many women on HRT still struggle with weight, sleep, and energy. Your Protocol is calibrated around your HRT status.</p></div></div>
      <div class="objection-item reveal"><div class="obj-icon">🔒</div><div><p class="obj-q">What happens to my answers?</p><p class="obj-a">Your intake responses are used solely to generate your Protocol. They are never sold, shared, or used for marketing. Your health information is private — full stop.</p></div></div>
      <div class="objection-item reveal"><div class="obj-icon">⏱️</div><div><p class="obj-q">How is this different from a generic menopause guide?</p><p class="obj-a">A generic guide gives the same advice to every woman. Your Protocol is generated from your specific answers — your symptoms, their severity, your diet, your sleep patterns, your goals, and your health context. The result is a document that reads like it was written for you — because it was.</p></div></div>
      <div class="objection-item reveal"><div class="obj-icon">💳</div><div><p class="obj-q">What if I'm not happy with it?</p><p class="obj-a">If your Protocol doesn't feel genuinely personalised and useful, email us within 7 days for a full refund. No questions asked. We're confident enough in what we've built to stand behind it completely.</p></div></div>
    </div>
  </div>
</section>

<section class="section pricing-bg">
  <div class="section-inner narrow">
    <div class="pricing-card">
      <p class="pricing-eyebrow">One-time · No subscription</p>
      <p class="pricing-title">Your Personalized<br>Menopause Management <em>Protocol</em></p>
      <div class="price-display"><span class="price-currency">$</span><span class="price-number">27</span></div>
      <p class="price-note">One payment. Yours forever.</p>
      <ul class="pricing-includes">
        <li>20+ page personalised PDF protocol</li>
        <li>Your hormonal mechanics explained clearly</li>
        <li>Nutrition plan mapped to your symptoms</li>
        <li>Sleep rescue protocol for your disruption type</li>
        <li>Movement strategy for your hormonal stage</li>
        <li>Evidence-based supplement stack with dosing</li>
        <li>Doctor's brief — print and take to your appointment</li>
        <li>Delivered to your inbox within 24 hours</li>
        <li>7-day money-back guarantee</li>
      </ul>
      <a href="/assessment" class="btn-pricing">${arrow} Start my assessment — $27</a>
      <div class="pricing-trust">
        <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Stripe secured</span>
        <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Private &amp; confidential</span>
        <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12l5 5L20 7"/></svg> 7-day guarantee</span>
      </div>
    </div>
  </div>
</section>

<section class="final-cta">
  <h2>You've been managing this long enough.<br><em>It's time for a plan.</em></h2>
  <p>10 minutes to answer. 24 hours to receive. A Protocol built entirely around you — finally.</p>
  <a href="/assessment" class="btn-primary" style="margin: 0 auto;">Build my Protocol — $27 ${arrow}</a>
</section>

<footer class="footer">
  <div class="footer-logo">Bloomia</div>
  <div class="footer-disclaimer">Bloomia provides evidence-informed lifestyle and wellness guidance. It does not constitute medical advice and is not a substitute for consultation with a qualified healthcare provider.</div>
</footer>
`;

export default function HomePage() {
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 60);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));

    const tags = document.querySelectorAll(".sym-tag");
    const cloud = document.getElementById("symptomCloud");
    const cloudObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tags.forEach((tag, i) => setTimeout(() => tag.classList.add("visible"), i * 55));
            cloudObserver.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    if (cloud) cloudObserver.observe(cloud);

    return () => {
      observer.disconnect();
      cloudObserver.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        :root { --ink:#1C1418; --ink-soft:#3A2F36; --parchment:#FAF6F0; --parchment-2:#F2EBE1; --border:#E0D5C8; --rose:#B05A72; --rose-light:#E8A4B5; --rose-pale:#F9EEF2; --sage:#6B9E85; --sage-pale:#EAF3EE; --amber:#C07840; --amber-pale:#FBF0E4; --text-main:#2C2228; --text-body:#4A3E44; --text-muted:#8A7A82; --white:#FFFFFF; }
        body { background: var(--parchment); color: var(--text-main); font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.65; overflow-x: hidden; }
        ${CSS}
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: MARKUP }} />
    </>
  );
}
