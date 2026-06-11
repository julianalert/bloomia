"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { IntakeData } from "@/types/intake";

const FORM_CSS = `
:root { --ink:#1C1418; --ink-soft:#3A2F36; --parchment:#FAF6F0; --parchment-2:#F2EBE1; --border:#E0D5C8; --border-hover:#C8BCB0; --rose:#B05A72; --rose-light:#E8A4B5; --rose-pale:#F9EEF2; --sage:#6B9E85; --sage-pale:#EAF3EE; --amber:#C07840; --amber-pale:#FBF0E4; --text-main:#2C2228; --text-body:#4A3E44; --text-muted:#8A7A82; --white:#FFFFFF; }
body { background: var(--parchment-2); color: var(--text-main); font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.6; min-height: 100vh; }
.topbar { background: var(--ink); padding: 16px 40px; display: flex; align-items: center; justify-content: space-between; }
.logo { font-family: 'Playfair Display', serif; font-size: 17px; color: var(--parchment); letter-spacing: 0.03em; }
.logo span { display: block; font-family: 'Inter', sans-serif; font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 0.14em; text-transform: uppercase; margin-top: 1px; font-weight: 400; }
.topbar-badge { font-size: 11px; color: var(--rose-light); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; }
.progress-strip { background: var(--white); border-bottom: 1px solid var(--border); padding: 0 40px; position: sticky; top: 0; z-index: 100; box-shadow: 0 1px 12px rgba(28,20,24,0.06); }
.step-nav { max-width: 640px; margin: 0 auto; display: flex; align-items: stretch; }
.step-tab { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 14px 6px 12px; cursor: pointer; border-bottom: 2px solid transparent; transition: border-color 0.2s; position: relative; }
.step-tab.active { border-bottom-color: var(--rose); }
.step-tab.done { border-bottom-color: var(--sage); cursor: pointer; }
.step-dot { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid var(--border); background: var(--parchment); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; color: var(--text-muted); margin-bottom: 5px; transition: all 0.2s; flex-shrink: 0; }
.step-tab.active .step-dot { background: var(--rose); border-color: var(--rose); color: white; }
.step-tab.done .step-dot { background: var(--sage); border-color: var(--sage); color: white; }
.step-tab.done .step-dot::after { content: '✓'; font-size: 10px; }
.step-tab.done .step-num { display: none; }
.step-label { font-size: 10px; color: var(--text-muted); letter-spacing: 0.05em; text-align: center; white-space: nowrap; font-weight: 500; }
.step-tab.active .step-label { color: var(--rose); font-weight: 600; }
.step-tab.done .step-label { color: var(--sage); }
.main { max-width: 640px; margin: 0 auto; padding: 48px 24px 80px; }
.step-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 44px 48px; animation: fadeUp 0.3s ease; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.step-eyebrow { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--rose); font-weight: 600; margin-bottom: 8px; }
.step-card h2 { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 400; color: var(--ink); margin-bottom: 6px; line-height: 1.25; }
.step-card h2 em { font-style: italic; color: var(--rose); }
.step-subtitle { font-size: 13.5px; color: var(--text-muted); margin-bottom: 36px; line-height: 1.6; padding-bottom: 28px; border-bottom: 1px solid var(--border); }
.field { margin-bottom: 28px; }
.field label { display: block; font-size: 13px; font-weight: 600; color: var(--text-main); margin-bottom: 4px; letter-spacing: 0.01em; }
.field-hint { font-size: 12px; color: var(--text-muted); margin-bottom: 10px; line-height: 1.5; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 500px) { .field-row { grid-template-columns: 1fr; } }
input[type="text"], input[type="email"], input[type="number"], select, textarea { width: 100%; background: var(--parchment); border: 1.5px solid var(--border); color: var(--text-main); font-family: 'Inter', sans-serif; font-size: 14px; padding: 12px 16px; border-radius: 9px; outline: none; transition: border-color 0.2s, background 0.2s; -webkit-appearance: none; }
input:focus, select:focus, textarea:focus { border-color: var(--rose); background: var(--white); }
input::placeholder, textarea::placeholder { color: var(--text-muted); opacity: 0.55; }
select option { background: white; color: var(--text-main); }
textarea { resize: vertical; min-height: 88px; line-height: 1.6; }
.check-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(175px, 1fr)); gap: 8px; }
.check-item { display: flex; align-items: flex-start; gap: 10px; background: var(--parchment); border: 1.5px solid var(--border); border-radius: 9px; padding: 11px 13px; cursor: pointer; transition: border-color 0.15s, background 0.15s; user-select: none; }
.check-item:hover { border-color: var(--rose-light); background: var(--rose-pale); }
.check-item input { display: none; }
.check-item:has(input:checked) { border-color: var(--rose); background: var(--rose-pale); }
.check-box { width: 17px; height: 17px; border: 1.5px solid var(--border-hover); border-radius: 4px; flex-shrink: 0; margin-top: 1px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; background: white; }
.check-item:has(input:checked) .check-box { background: var(--rose); border-color: var(--rose); }
.check-item:has(input:checked) .check-box::after { content: ''; width: 8px; height: 5px; border-left: 2px solid white; border-bottom: 2px solid white; transform: rotate(-45deg) translateY(-1px); display: block; }
.check-text { font-size: 13px; color: var(--text-body); line-height: 1.4; }
.check-item:has(input:checked) .check-text { color: var(--rose); font-weight: 500; }
.radio-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.radio-pill { cursor: pointer; }
.radio-pill input { display: none; }
.pill-label { display: block; padding: 9px 18px; border: 1.5px solid var(--border); border-radius: 50px; font-size: 13px; color: var(--text-body); background: var(--parchment); transition: all 0.15s; white-space: nowrap; font-weight: 400; }
.radio-pill:hover .pill-label { border-color: var(--rose-light); background: var(--rose-pale); }
.radio-pill input:checked + .pill-label { background: var(--rose-pale); border-color: var(--rose); color: var(--rose); font-weight: 600; }
.severity-rows { display: flex; flex-direction: column; gap: 10px; }
.severity-row { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 16px; padding: 13px 16px; background: var(--parchment); border: 1.5px solid var(--border); border-radius: 9px; }
.sev-name { font-size: 13px; color: var(--text-main); font-weight: 500; }
.sev-dots { display: flex; gap: 6px; }
.sev-dot { width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid var(--border); background: white; cursor: pointer; font-size: 10px; font-weight: 600; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; justify-content: center; transition: all 0.15s; font-family: 'Inter', sans-serif; line-height: 1.1; }
.sev-dot:hover { border-color: var(--rose-light); }
.sev-dot.sel-1 { background: var(--sage-pale); border-color: var(--sage); color: var(--sage); }
.sev-dot.sel-2 { background: var(--amber-pale); border-color: var(--amber); color: var(--amber); }
.sev-dot.sel-3 { background: var(--rose-pale); border-color: var(--rose); color: var(--rose); }
.sev-dot .dot-label { font-size: 8px; font-weight: 400; opacity: 0.7; }
.sev-legend { display: flex; justify-content: flex-end; gap: 14px; font-size: 10px; color: var(--text-muted); margin-top: 6px; padding-right: 4px; }
.sev-legend span { display: flex; align-items: center; gap: 4px; }
.sev-legend-dot { width: 8px; height: 8px; border-radius: 50%; }
.callout { border-radius: 10px; padding: 16px 20px; margin-bottom: 24px; font-size: 13px; color: var(--text-body); line-height: 1.6; }
.callout.sage { background: var(--sage-pale); border-left: 3px solid var(--sage); }
.callout.rose { background: var(--rose-pale); border-left: 3px solid var(--rose); }
.callout strong { color: var(--text-main); }
.step-nav-btns { display: flex; justify-content: space-between; align-items: center; margin-top: 36px; padding-top: 28px; border-top: 1px solid var(--border); }
.btn-back { background: none; border: 1.5px solid var(--border); color: var(--text-muted); font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; padding: 11px 22px; border-radius: 50px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 7px; }
.btn-back:hover { border-color: var(--border-hover); color: var(--text-main); }
.btn-back.hidden { visibility: hidden; }
.btn-next { background: var(--rose); border: none; color: white; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; padding: 13px 30px; border-radius: 50px; cursor: pointer; transition: background 0.15s, transform 0.12s, box-shadow 0.15s; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 20px rgba(176,90,114,0.28); letter-spacing: 0.01em; }
.btn-next:hover { background: #C06680; transform: translateY(-1px); box-shadow: 0 6px 28px rgba(176,90,114,0.36); }
.btn-next:disabled { opacity: 0.6; cursor: default; transform: none; }
.btn-next svg, .btn-back svg { width: 15px; height: 15px; flex-shrink: 0; }
.step-counter { font-size: 12px; color: var(--text-muted); letter-spacing: 0.05em; }
.submit-block { text-align: center; padding-top: 4px; }
.price-row { display: flex; align-items: baseline; justify-content: center; gap: 4px; margin-bottom: 4px; }
.price-currency { font-size: 22px; color: var(--text-muted); font-weight: 300; }
.price-amount { font-family: 'Playfair Display', serif; font-size: 52px; color: var(--ink); font-weight: 400; line-height: 1; }
.price-label { font-size: 12px; color: var(--text-muted); letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 28px; }
.btn-submit { background: var(--ink); border: none; color: var(--parchment); font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; padding: 16px 44px; border-radius: 50px; cursor: pointer; transition: background 0.15s, transform 0.12s; display: inline-flex; align-items: center; gap: 10px; letter-spacing: 0.02em; box-shadow: 0 6px 32px rgba(28,20,24,0.18); }
.btn-submit:hover { background: var(--ink-soft); transform: translateY(-1px); }
.btn-submit:disabled { opacity: 0.7; cursor: default; transform: none; }
.btn-submit svg { width: 16px; height: 16px; }
.reassurance { margin-top: 18px; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
.reassurance span { font-size: 11.5px; color: var(--text-muted); display: flex; align-items: center; gap: 5px; }
.reassurance svg { width: 12px; height: 12px; color: var(--sage); }
.fp-preview { background: var(--ink); border-radius: 12px; padding: 20px 24px; margin-bottom: 32px; }
.fp-title { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 14px; }
.fp-bars { display: flex; align-items: flex-end; gap: 5px; height: 48px; }
.fp-bar { flex: 1; border-radius: 3px 3px 0 0; background: var(--rose); opacity: 0.2; min-height: 4px; transition: height 0.4s ease, opacity 0.3s; }
.fp-bar.lit { opacity: 0.9; }
.goal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
.goal-item { display: flex; align-items: flex-start; gap: 10px; background: var(--parchment); border: 1.5px solid var(--border); border-radius: 10px; padding: 13px 14px; cursor: pointer; transition: all 0.15s; user-select: none; }
.goal-item:hover { border-color: var(--rose-light); background: var(--rose-pale); }
.goal-item input { display: none; }
.goal-item:has(input:checked) { border-color: var(--rose); background: var(--rose-pale); }
.goal-emoji { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
.goal-title { font-size: 13px; font-weight: 500; color: var(--text-main); }
.goal-desc { font-size: 11px; color: var(--text-muted); margin-top: 1px; line-height: 1.4; }
.goal-item:has(input:checked) .goal-title { color: var(--rose); }
.field-divider { height: 1px; background: var(--border); margin: 28px 0; }
.hero { background: var(--ink); padding: 56px 40px 52px; text-align: center; position: relative; overflow: hidden; }
.hero::before { content: ''; position: absolute; top: -60px; right: -60px; width: 260px; height: 260px; border-radius: 50%; background: radial-gradient(circle, rgba(176,90,114,0.2) 0%, transparent 70%); pointer-events: none; }
.hero::after { content: ''; position: absolute; bottom: -40px; left: -40px; width: 180px; height: 180px; border-radius: 50%; background: radial-gradient(circle, rgba(107,158,133,0.12) 0%, transparent 70%); pointer-events: none; }
.hero-inner { position: relative; z-index: 1; max-width: 560px; margin: 0 auto; }
.hero-eyebrow { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--rose-light); font-weight: 600; margin-bottom: 16px; }
.hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(26px, 5vw, 40px); font-weight: 400; color: var(--parchment); line-height: 1.18; margin-bottom: 16px; }
.hero h1 em { font-style: italic; color: var(--rose-light); }
.hero-desc { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.7; max-width: 420px; margin: 0 auto 28px; }
.hero-stats { display: flex; justify-content: center; gap: 0; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; }
.hero-stat { flex: 1; text-align: center; padding: 0 20px; border-right: 1px solid rgba(255,255,255,0.1); }
.hero-stat:last-child { border-right: none; }
.hero-stat-val { display: block; font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 400; color: var(--parchment); line-height: 1; margin-bottom: 5px; }
.hero-stat-label { font-size: 11px; color: rgba(255,255,255,0.38); letter-spacing: 0.08em; text-transform: uppercase; }
.form-error { background: var(--rose-pale); border: 1px solid var(--rose-light); color: var(--rose); border-radius: 9px; padding: 12px 16px; font-size: 13px; margin-bottom: 20px; }
@media (max-width: 580px) {
  .step-card { padding: 32px 24px; }
  .goal-grid { grid-template-columns: 1fr; }
  .check-grid { grid-template-columns: 1fr 1fr; }
  .topbar { padding: 14px 20px; }
  .progress-strip { padding: 0 12px; }
  .hero { padding: 40px 24px 36px; }
  .hero-stat { padding: 0 12px; }
  .hero-stat-val { font-size: 20px; }
}
`;

const ArrowR = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const ArrowL = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const STEP_LABELS = ["Symptoms", "Severity", "Sleep", "Lifestyle", "Goals", "Your Info"];

const SYMPTOMS: { v: string; l: string; h: number }[] = [
  { v: "hot_flashes", l: "Hot flashes", h: 72 },
  { v: "night_sweats", l: "Night sweats", h: 88 },
  { v: "sleep", l: "Sleep disruption", h: 60 },
  { v: "weight", l: "Weight gain (belly)", h: 64 },
  { v: "brain_fog", l: "Brain fog", h: 52 },
  { v: "mood", l: "Mood swings", h: 56 },
  { v: "anxiety", l: "Anxiety", h: 48 },
  { v: "low_mood", l: "Low mood", h: 40 },
  { v: "joint_pain", l: "Joint / muscle pain", h: 44 },
  { v: "fatigue", l: "Fatigue / low energy", h: 68 },
  { v: "libido", l: "Low libido", h: 36 },
  { v: "vaginal", l: "Vaginal dryness", h: 32 },
  { v: "skin_hair", l: "Skin / hair changes", h: 28 },
  { v: "palpitations", l: "Palpitations", h: 44 },
  { v: "headaches", l: "Headaches", h: 40 },
  { v: "bladder", l: "Bladder changes", h: 36 },
];

const STAGES = [
  { v: "peri_early", l: "Early perimenopause" },
  { v: "peri_late", l: "Late perimenopause" },
  { v: "menopause", l: "Menopause" },
  { v: "post", l: "Postmenopause" },
  { v: "unsure", l: "Not sure" },
];

const SEVERITY_ROWS: { k: keyof NonNullable<IntakeData["severity"]>; l: string }[] = [
  { k: "hf", l: "Hot flashes / Night sweats" },
  { k: "sl", l: "Sleep disruption" },
  { k: "mo", l: "Mood / Anxiety" },
  { k: "wt", l: "Weight gain / Belly fat" },
  { k: "fa", l: "Energy / Fatigue" },
  { k: "bf", l: "Brain fog / Focus" },
];

const DURATIONS = [
  { v: "lt6mo", l: "Less than 6 months" },
  { v: "6_12", l: "6–12 months" },
  { v: "1_3yr", l: "1–3 years" },
  { v: "3plus", l: "3+ years" },
];

const HRT_OPTS = [
  { v: "none", l: "No HRT" },
  { v: "prescribed", l: "Yes — prescribed HRT" },
  { v: "bioidentical", l: "Bioidentical hormones" },
  { v: "considering", l: "Considering it" },
  { v: "stopped", l: "Stopped recently" },
];

const CONDITIONS = [
  { v: "thyroid", l: "Thyroid condition" },
  { v: "breast_cancer", l: "History of breast cancer" },
  { v: "cardio", l: "Cardiovascular disease" },
  { v: "diabetes", l: "Diabetes / insulin resistance" },
  { v: "osteo", l: "Osteoporosis" },
  { v: "none", l: "None of the above" },
];

const SLEEP_HOURS = ["Less than 4 hours", "4–5 hours", "5–6 hours", "6–7 hours", "7–8 hours", "8+ hours"];
const WAKE_FREQ = ["Never / rarely", "1–2 times", "3–4 times", "More than 4"];

const SLEEP_DISRUPTORS = [
  { v: "night_sweats", l: "Night sweats / overheating" },
  { v: "racing_mind", l: "Racing mind / anxiety" },
  { v: "bathroom", l: "Bathroom trips" },
  { v: "cant_return", l: "Can't fall back asleep" },
  { v: "joint_discomfort", l: "Joint / muscle discomfort" },
  { v: "no_reason", l: "No obvious reason" },
];

const SLEEP_ENV = [
  { v: "warm_room", l: "Room often too warm" },
  { v: "phone_near", l: "Phone near the bed" },
  { v: "partner", l: "Partner disrupts my sleep" },
  { v: "screens", l: "Screens in bed" },
  { v: "inconsistent_wake", l: "Inconsistent wake time" },
  { v: "sleep_aids", l: "Take sleep aids / melatonin" },
];

const STRESS = [
  { v: "low", l: "Low — fairly calm" },
  { v: "mod", l: "Moderate — manageable" },
  { v: "high", l: "High — often overwhelmed" },
  { v: "very_high", l: "Very high — constantly" },
];

const DIETS = [
  { v: "omni", l: "Omnivore" },
  { v: "pesc", l: "Pescatarian" },
  { v: "veg", l: "Vegetarian" },
  { v: "vegan", l: "Vegan" },
  { v: "lowcarb", l: "Low-carb / keto" },
  { v: "med", l: "Mediterranean" },
];

const DIET_QUALITY = [
  { v: "1", l: "1 — Poor" },
  { v: "2", l: "2 — Below average" },
  { v: "3", l: "3 — Average" },
  { v: "4", l: "4 — Good" },
  { v: "5", l: "5 — Very healthy" },
];

const NUTRITION_CHALLENGES = [
  { v: "sugar_cravings", l: "Sugar / carb cravings" },
  { v: "emotional_eating", l: "Emotional eating" },
  { v: "low_protein", l: "Not enough protein" },
  { v: "bloating", l: "Bloating / digestion" },
  { v: "belly_fat", l: "Belly fat won't shift" },
  { v: "no_time", l: "No time to cook" },
  { v: "alcohol", l: "Alcohol most evenings" },
  { v: "skipping_meals", l: "Skipping meals" },
];

const ACTIVITY = [
  { v: "sed", l: "Mostly sitting" },
  { v: "light", l: "Light (occasional walks)" },
  { v: "mod", l: "Moderate (2–3× / week)" },
  { v: "active", l: "Active (4–5× / week)" },
  { v: "very", l: "Very active (daily)" },
];

const EXERCISE = [
  { v: "walking", l: "Walking" },
  { v: "running", l: "Running / jogging" },
  { v: "weights", l: "Weights / resistance" },
  { v: "yoga", l: "Yoga / Pilates" },
  { v: "swimming", l: "Swimming / cycling" },
  { v: "hiit", l: "Group classes / HIIT" },
  { v: "none", l: "Not exercising currently" },
];

const GOALS = [
  { v: "fewer_hot_flashes", e: "🌡️", t: "Fewer hot flashes", d: "Reduce frequency and intensity" },
  { v: "sleep", e: "🌙", t: "Sleep through the night", d: "Consistent, restorative sleep" },
  { v: "lose_weight", e: "⚖️", t: "Lose belly weight", d: "Shift stubborn fat for good" },
  { v: "calmer", e: "🧘‍♀️", t: "Feel calmer", d: "Less anxiety, more equanimity" },
  { v: "energy", e: "⚡", t: "Regain energy", d: "Energy and mental clarity" },
  { v: "mood", e: "😊", t: "Stabilise my mood", d: "Feel more like myself" },
  { v: "bones", e: "🦴", t: "Protect my bones", d: "Bone density long-term" },
  { v: "intimacy", e: "❤️", t: "Improve intimacy", d: "Libido and sexual wellbeing" },
  { v: "understand", e: "🧬", t: "Understand my body", d: "What's happening and why" },
  { v: "doctor", e: "🩺", t: "Talk to my doctor", d: "Know what to ask for" },
];

const MOTIVATION = [
  { v: "full", l: "All in — ready to commit" },
  { v: "mod", l: "Willing but busy" },
  { v: "small", l: "Small steps only please" },
  { v: "clarity", l: "I need clarity first" },
];

const COUNTRIES = [
  "United Kingdom", "United States", "Canada", "Australia", "France",
  "Germany", "Spain", "Portugal", "Netherlands", "Other",
];

const FP_HEIGHTS = SYMPTOMS.map((s) => s.h);

export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<IntakeData>({});

  function update<K extends keyof IntakeData>(key: K, value: IntakeData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function toggle(key: "symptoms" | "conditions" | "sleep_disruptors" | "sleep_environment" | "nutrition_challenges" | "exercise" | "goals", value: string, limit?: number) {
    setData((d) => {
      const arr = (d[key] as string[] | undefined) ?? [];
      if (arr.includes(value)) return { ...d, [key]: arr.filter((v) => v !== value) };
      if (limit && arr.length >= limit) return d;
      return { ...d, [key]: [...arr, value] };
    });
  }

  function setSeverity(k: keyof NonNullable<IntakeData["severity"]>, val: number) {
    setData((d) => ({ ...d, severity: { hf: 0, sl: 0, mo: 0, wt: 0, fa: 0, bf: 0, ...(d.severity ?? {}), [k]: val } }));
  }

  function stepPayload(n: number): Partial<IntakeData> {
    switch (n) {
      case 1: return { symptoms: data.symptoms ?? [], worst_symptom: data.worst_symptom, stage: data.stage };
      case 2: return { severity: data.severity, duration: data.duration, hrt: data.hrt, conditions: data.conditions ?? [] };
      case 3: return { sleep_hours: data.sleep_hours, wake_freq: data.wake_freq, sleep_disruptors: data.sleep_disruptors ?? [], sleep_environment: data.sleep_environment ?? [], stress: data.stress };
      case 4: return { diet: data.diet, diet_quality: data.diet_quality, diet_restrictions: data.diet_restrictions, nutrition_challenges: data.nutrition_challenges ?? [], activity: data.activity, exercise: data.exercise ?? [] };
      case 5: return { goals: data.goals ?? [], motivation: data.motivation, free_text: data.free_text };
      case 6: return { name: data.name, age: data.age, email: data.email, country: data.country };
      default: return {};
    }
  }

  async function saveStep(stepData: Partial<IntakeData>, stepNum: number) {
    const orderId = typeof window !== "undefined" ? sessionStorage.getItem("orderId") : null;
    if (!orderId) {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepData }),
      });
      if (!res.ok) throw new Error("create-order failed");
      const { orderId: newId } = await res.json();
      sessionStorage.setItem("orderId", newId);
    } else {
      const res = await fetch("/api/update-intake", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, stepData, currentStep: stepNum }),
      });
      if (!res.ok) throw new Error("update-intake failed");
    }
  }

  async function handleNext() {
    setError(null);
    setSaving(true);
    try {
      await saveStep(stepPayload(step), step);
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Something went wrong saving your answers. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit() {
    setError(null);
    if (!data.name?.trim() || !data.email?.trim()) {
      setError("Please enter your first name and email so we can deliver your Protocol.");
      return;
    }
    setSaving(true);
    try {
      await saveStep(stepPayload(6), 6);
      sessionStorage.setItem("intakeName", data.name.trim());
      sessionStorage.setItem("intakeEmail", data.email.trim());
      router.push("/order");
    } catch {
      setError("Something went wrong saving your answers. Please try again.");
      setSaving(false);
    }
  }

  function goToStep(n: number) {
    if (n < step) {
      setStep(n);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const litSymptoms = useMemo(() => new Set(data.symptoms ?? []), [data.symptoms]);

  return (
    <>
      <style>{FORM_CSS}</style>

      <header className="topbar">
        <div className="logo">
          Bloomia
          <span>Personalized Menopause Intelligence</span>
        </div>
        <div className="topbar-badge">Free Assessment</div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Your Personalized Menopause Management Protocol</p>
          <h1>
            Your body has changed.<br />
            <em>Your plan should too.</em>
          </h1>
          <p className="hero-desc">
            Answer these questions honestly. The more detail you provide, the more precisely your Protocol will be
            calibrated to your specific symptoms, stage, and lifestyle.
          </p>
          <div className="hero-stats">
            <div className="hero-stat"><span className="hero-stat-val">8–10</span><span className="hero-stat-label">min to complete</span></div>
            <div className="hero-stat"><span className="hero-stat-val">20+</span><span className="hero-stat-label">page protocol</span></div>
            <div className="hero-stat"><span className="hero-stat-val">24h</span><span className="hero-stat-label">delivery</span></div>
          </div>
        </div>
      </section>

      <div className="progress-strip">
        <div className="step-nav">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const cls = n === step ? "active" : n < step ? "done" : "";
            return (
              <div key={label} className={`step-tab ${cls}`} onClick={() => goToStep(n)}>
                <div className="step-dot">{n >= step && <span className="step-num">{n}</span>}</div>
                <div className="step-label">{label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <main className="main">
        <div className="step-card">
          {error && <div className="form-error">{error}</div>}

          {/* STEP 1 — SYMPTOMS */}
          {step === 1 && (
            <>
              <p className="step-eyebrow">Step 1 of 6</p>
              <h2>What are you <em>experiencing?</em></h2>
              <p className="step-subtitle">
                Select every symptom you're currently dealing with. The more you select, the more precisely your
                Protocol is calibrated.
              </p>

              {(data.symptoms?.length ?? 0) > 0 && (
                <div className="fp-preview">
                  <p className="fp-title">Your symptom fingerprint is taking shape…</p>
                  <div className="fp-bars">
                    {SYMPTOMS.map((s) => {
                      const lit = litSymptoms.has(s.v);
                      return (
                        <div
                          key={s.v}
                          className={`fp-bar ${lit ? "lit" : ""}`}
                          style={{ height: lit ? `${s.h}px` : "4px" }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="field">
                <div className="check-grid">
                  {SYMPTOMS.map((s) => (
                    <label className="check-item" key={s.v}>
                      <input type="checkbox" checked={litSymptoms.has(s.v)} onChange={() => toggle("symptoms", s.v)} />
                      <span className="check-box" />
                      <span className="check-text">{s.l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Which symptom is most disrupting your daily life?</label>
                <p className="field-hint">In your own words — this becomes a focus area for your Protocol.</p>
                <textarea
                  value={data.worst_symptom ?? ""}
                  onChange={(e) => update("worst_symptom", e.target.value)}
                  placeholder="e.g. Night sweats waking me up 3× a night, or constant fatigue affecting my work…"
                />
              </div>

              <div className="field">
                <label>Where are you in your menopause journey?</label>
                <div className="radio-pills">
                  {STAGES.map((o) => (
                    <label className="radio-pill" key={o.v}>
                      <input type="radio" name="stage" checked={data.stage === o.v} onChange={() => update("stage", o.v as IntakeData["stage"])} />
                      <span className="pill-label">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 2 — SEVERITY */}
          {step === 2 && (
            <>
              <p className="step-eyebrow">Step 2 of 6</p>
              <h2>How <em>severe</em> are they?</h2>
              <p className="step-subtitle">
                Rate the intensity of each symptom on a typical day. This shapes which interventions your Protocol
                prioritises.
              </p>

              <div className="sev-legend">
                <span><span className="sev-legend-dot" style={{ background: "var(--sage)" }} />Mild</span>
                <span><span className="sev-legend-dot" style={{ background: "var(--amber)" }} />Moderate</span>
                <span><span className="sev-legend-dot" style={{ background: "var(--rose)" }} />Severe</span>
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <div className="severity-rows">
                  {SEVERITY_ROWS.map((row) => {
                    const current = data.severity?.[row.k] ?? 0;
                    return (
                      <div className="severity-row" key={row.k}>
                        <span className="sev-name">{row.l}</span>
                        <div className="sev-dots">
                          {[1, 2, 3].map((val) => (
                            <button
                              type="button"
                              key={val}
                              className={`sev-dot ${current >= val && current > 0 ? `sel-${current}` : ""}`}
                              onClick={() => setSeverity(row.k, val)}
                            >
                              <span>{val}</span>
                              <span className="dot-label">{val === 1 ? "Mild" : val === 2 ? "Mod" : "Severe"}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="field">
                <label>How long have you been experiencing symptoms?</label>
                <div className="radio-pills">
                  {DURATIONS.map((o) => (
                    <label className="radio-pill" key={o.v}>
                      <input type="radio" name="duration" checked={data.duration === o.v} onChange={() => update("duration", o.v as IntakeData["duration"])} />
                      <span className="pill-label">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Are you currently using any hormonal therapy?</label>
                <div className="radio-pills">
                  {HRT_OPTS.map((o) => (
                    <label className="radio-pill" key={o.v}>
                      <input type="radio" name="hrt" checked={data.hrt === o.v} onChange={() => update("hrt", o.v as IntakeData["hrt"])} />
                      <span className="pill-label">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Do any of these apply to you?</label>
                <p className="field-hint">Shapes which recommendations are safe and relevant for you.</p>
                <div className="check-grid">
                  {CONDITIONS.map((o) => (
                    <label className="check-item" key={o.v}>
                      <input type="checkbox" checked={(data.conditions ?? []).includes(o.v)} onChange={() => toggle("conditions", o.v)} />
                      <span className="check-box" />
                      <span className="check-text">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 3 — SLEEP */}
          {step === 3 && (
            <>
              <p className="step-eyebrow">Step 3 of 6</p>
              <h2>Tell me about your <em>nights</em></h2>
              <p className="step-subtitle">
                Sleep disruption is the most common — and most underestimated — menopause symptom. These details shape
                a dedicated section in your Protocol.
              </p>

              <div className="field field-row">
                <div>
                  <label>Average hours of sleep</label>
                  <select value={data.sleep_hours ?? ""} onChange={(e) => update("sleep_hours", e.target.value)}>
                    <option value="">Select…</option>
                    {SLEEP_HOURS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label>Times waking per night</label>
                  <select value={data.wake_freq ?? ""} onChange={(e) => update("wake_freq", e.target.value)}>
                    <option value="">Select…</option>
                    {WAKE_FREQ.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div className="field">
                <label>What typically wakes you or makes it hard to sleep?</label>
                <div className="check-grid">
                  {SLEEP_DISRUPTORS.map((o) => (
                    <label className="check-item" key={o.v}>
                      <input type="checkbox" checked={(data.sleep_disruptors ?? []).includes(o.v)} onChange={() => toggle("sleep_disruptors", o.v)} />
                      <span className="check-box" />
                      <span className="check-text">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>How would you describe your stress level day-to-day?</label>
                <div className="radio-pills">
                  {STRESS.map((o) => (
                    <label className="radio-pill" key={o.v}>
                      <input type="radio" name="stress" checked={data.stress === o.v} onChange={() => update("stress", o.v as IntakeData["stress"])} />
                      <span className="pill-label">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>What's your current sleep environment like?</label>
                <div className="check-grid">
                  {SLEEP_ENV.map((o) => (
                    <label className="check-item" key={o.v}>
                      <input type="checkbox" checked={(data.sleep_environment ?? []).includes(o.v)} onChange={() => toggle("sleep_environment", o.v)} />
                      <span className="check-box" />
                      <span className="check-text">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 4 — LIFESTYLE */}
          {step === 4 && (
            <>
              <p className="step-eyebrow">Step 4 of 6</p>
              <h2>Nutrition & <em>Lifestyle</em></h2>
              <p className="step-subtitle">
                Your daily habits are the levers your Protocol will work with — not around. Be honest, this isn't a
                test.
              </p>

              <div className="field">
                <label>How would you describe your current diet?</label>
                <div className="radio-pills">
                  {DIETS.map((o) => (
                    <label className="radio-pill" key={o.v}>
                      <input type="radio" name="diet" checked={data.diet === o.v} onChange={() => update("diet", o.v as IntakeData["diet"])} />
                      <span className="pill-label">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>How would you rate your diet quality right now?</label>
                <div className="radio-pills">
                  {DIET_QUALITY.map((o) => (
                    <label className="radio-pill" key={o.v}>
                      <input type="radio" name="diet_q" checked={data.diet_quality === o.v} onChange={() => update("diet_quality", o.v)} />
                      <span className="pill-label">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Your biggest nutrition challenges right now</label>
                <div className="check-grid">
                  {NUTRITION_CHALLENGES.map((o) => (
                    <label className="check-item" key={o.v}>
                      <input type="checkbox" checked={(data.nutrition_challenges ?? []).includes(o.v)} onChange={() => toggle("nutrition_challenges", o.v)} />
                      <span className="check-box" />
                      <span className="check-text">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field-divider" />

              <div className="field">
                <label>How physically active are you right now?</label>
                <div className="radio-pills">
                  {ACTIVITY.map((o) => (
                    <label className="radio-pill" key={o.v}>
                      <input type="radio" name="activity" checked={data.activity === o.v} onChange={() => update("activity", o.v as IntakeData["activity"])} />
                      <span className="pill-label">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Types of exercise you currently do or enjoy</label>
                <div className="check-grid">
                  {EXERCISE.map((o) => (
                    <label className="check-item" key={o.v}>
                      <input type="checkbox" checked={(data.exercise ?? []).includes(o.v)} onChange={() => toggle("exercise", o.v)} />
                      <span className="check-box" />
                      <span className="check-text">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Any dietary restrictions or food intolerances?</label>
                <input
                  type="text"
                  value={data.diet_restrictions ?? ""}
                  onChange={(e) => update("diet_restrictions", e.target.value)}
                  placeholder="e.g. Gluten-free, dairy-free, nut allergy…"
                />
              </div>
            </>
          )}

          {/* STEP 5 — GOALS */}
          {step === 5 && (
            <>
              <p className="step-eyebrow">Step 5 of 6</p>
              <h2>What do you most <em>need</em>?</h2>
              <p className="step-subtitle">
                Choose up to 3 goals. These become the three pillars your Protocol is structured around.
              </p>

              <div className="field">
                <div className="goal-grid">
                  {GOALS.map((g) => (
                    <label className="goal-item" key={g.v}>
                      <input
                        type="checkbox"
                        checked={(data.goals ?? []).includes(g.v)}
                        onChange={() => toggle("goals", g.v, 3)}
                      />
                      <span className="goal-emoji">{g.e}</span>
                      <div className="goal-text-wrap">
                        <p className="goal-title">{g.t}</p>
                        <p className="goal-desc">{g.d}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>How much are you ready to change right now?</label>
                <div className="radio-pills">
                  {MOTIVATION.map((o) => (
                    <label className="radio-pill" key={o.v}>
                      <input type="radio" name="motivation" checked={data.motivation === o.v} onChange={() => update("motivation", o.v as IntakeData["motivation"])} />
                      <span className="pill-label">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Anything else you want your Protocol to address?</label>
                <textarea
                  value={data.free_text ?? ""}
                  onChange={(e) => update("free_text", e.target.value)}
                  placeholder="A specific situation, a doctor's appointment coming up, something no one seems to take seriously…"
                />
              </div>
            </>
          )}

          {/* STEP 6 — PROFILE */}
          {step === 6 && (
            <>
              <p className="step-eyebrow">Step 6 of 6 · Almost there</p>
              <h2>Where should we <em>send it?</em></h2>
              <p className="step-subtitle">
                Your Protocol is generated to your name and profile. It will be in your inbox within 24 hours — usually
                much faster.
              </p>

              <div className="callout sage">
                <strong>You've answered everything we need.</strong> This last step takes 60 seconds — it's just how we
                address your Protocol and where we deliver it.
              </div>

              <div className="field field-row">
                <div>
                  <label>First name</label>
                  <input type="text" value={data.name ?? ""} onChange={(e) => update("name", e.target.value)} placeholder="Sophie" />
                </div>
                <div>
                  <label>Age</label>
                  <input
                    type="number"
                    value={data.age ?? ""}
                    onChange={(e) => update("age", e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="49"
                    min={35}
                    max={70}
                  />
                </div>
              </div>

              <div className="field">
                <label>Email address</label>
                <input type="email" value={data.email ?? ""} onChange={(e) => update("email", e.target.value)} placeholder="Your Protocol arrives here" />
              </div>

              <div className="field">
                <label>Country</label>
                <select value={data.country ?? ""} onChange={(e) => update("country", e.target.value)}>
                  <option value="">Select your country…</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="field-divider" />

              <div className="submit-block">
                <div className="price-row">
                  <span className="price-currency">$</span>
                  <span className="price-amount">27</span>
                </div>
                <p className="price-label">One-time · No subscription · Delivered to your inbox</p>
                <button className="btn-submit" type="button" onClick={handleSubmit} disabled={saving}>
                  <ArrowR />
                  {saving ? "Saving…" : "Generate my Protocol"}
                </button>
                <div className="reassurance">
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    Stripe-secured payment
                  </span>
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    Fully private
                  </span>
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                    24h delivery
                  </span>
                </div>
              </div>
            </>
          )}

          {/* NAV BUTTONS */}
          {step < 6 ? (
            <div className="step-nav-btns">
              <button className={`btn-back ${step === 1 ? "hidden" : ""}`} type="button" onClick={() => goToStep(step - 1)}>
                <ArrowL /> Back
              </button>
              <span className="step-counter">{step} / 6</span>
              <button className="btn-next" type="button" onClick={handleNext} disabled={saving}>
                {saving ? "Saving…" : "Continue"}
                <ArrowR />
              </button>
            </div>
          ) : (
            <div className="step-nav-btns" style={{ marginTop: 24, paddingTop: 20 }}>
              <button className="btn-back" type="button" onClick={() => goToStep(5)}>
                <ArrowL /> Back
              </button>
              <span className="step-counter">6 / 6</span>
              <div />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
