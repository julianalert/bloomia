import { IntakeData } from "@/types/intake";
import { ProtocolData } from "@/types/protocol";

// Sample data used only by the dev preview route (/preview/protocol) so the
// hosted protocol page can be viewed without going through Stripe + Claude.

export const sampleIntake: IntakeData = {
  name: "Amara",
  age: 47,
  stage: "peri_late",
  symptoms: ["night_sweats", "sleep", "weight", "anxiety", "brain_fog", "fatigue"],
  severity: { hf: 3, sl: 3, mo: 2, wt: 2, fa: 2, bf: 2 },
  duration: "1_3yr",
  hrt: "none",
  conditions: [],
  diet: "med",
  diet_quality: "3",
  activity: "light",
  sleep_hours: "5–6 hours",
  wake_freq: "3–4 times",
  stress: "high",
  goals: ["sleep", "lose_weight", "calmer"],
  motivation: "mod",
};

export const sampleProtocol: ProtocolData = {
  cover: {
    stage: "Late Perimenopause",
    duration: "2 years",
    focus_areas: 4,
    plan_weeks: 6,
    fingerprint_scores: [7, 9, 8, 6, 5, 6, 7, 3],
  },
  whats_happening: {
    headline: "Your symptoms, decoded",
    summary:
      "Amara, you're in late perimenopause, and the cluster you're describing — night sweats, 3am wake-ups, stubborn belly weight, and a new layer of anxiety — is a classic cortisol–estrogen cascade. As estrogen and progesterone decline, your nervous system loses two of its key stabilisers, which is why your sleep fractures first and everything else amplifies from there. This is physiological, not a personal failing — and crucially, it's interruptible.",
    key_callout:
      "Your 3am waking is progesterone-driven fragmentation, not insomnia — which means the fix is different from generic sleep advice.",
    mechanisms: [
      { number: "01", title: "The Cortisol–Estrogen Loop", body: "Falling estrogen makes your brain's thermostat hypersensitive, triggering night sweats and a stress response.", tag: "Primary driver" },
      { number: "02", title: "Progesterone Depletion", body: "Progesterone calms the brain via GABA receptors. Its decline explains your anxiety and broken sleep at once.", tag: "Sleep + anxiety" },
      { number: "03", title: "Insulin Resistance Shift", body: "Lower estrogen changes how your cells handle carbs, driving energy crashes and abdominal fat storage.", tag: "Weight related" },
      { number: "04", title: "Serotonin Fluctuation", body: "Estrogen supports serotonin, so mood instability here is physiological — and highly addressable.", tag: "Mood + fog" },
    ],
  },
  nutrition: {
    headline: "Eating for your hormones",
    profile_callout:
      "You eat a Mediterranean-style diet and rate its quality 3/5, with high stress and afternoon energy dips. This protocol builds on what you already do rather than replacing it.",
    key_insight:
      "Your single highest-impact change is protein distribution: aim for 25–30g protein at each meal instead of loading it at dinner. This stabilises blood sugar, blunts the 4pm cortisol spike, and tends to reduce night-sweat frequency within 4–6 weeks.",
    foods: [
      { name: "Phytoestrogens", why: "Can soften hot flash frequency.", examples: ["Edamame", "Tofu", "Flaxseeds", "Tempeh", "Lentils"] },
      { name: "Magnesium-rich foods", why: "Calms the nervous system for deeper sleep.", examples: ["Dark chocolate", "Almonds", "Spinach", "Avocado", "Black beans"] },
    ],
    reduce_note:
      "Reduce (don't eliminate) alcohol and after-1pm caffeine — both are common night-sweat triggers. Halving them is sustainable and nearly as effective as cutting them out.",
  },
  sleep: {
    headline: "Sleep rescue protocol",
    pattern_callout:
      "You fall asleep fine but wake 3–4 times between 2am and 5am, mostly from night sweats — progesterone-driven fragmentation, not delayed-onset insomnia. The approach is correspondingly different.",
    steps: [
      { week_range: "Weeks 1–2", title: "Cool your sleep architecture", body: "Drop the bedroom to 16–18°C, switch to moisture-wicking bedding, and keep a fan on your side." },
      { week_range: "Weeks 2–4", title: "When you wake at 3am", body: "No phone. Cold cloth on wrists, then cognitive shuffling to interrupt rumination. Most women resettle in 15–20 minutes." },
    ],
  },
  movement: {
    headline: "Movement strategy",
    reframe_callout:
      "If more cardio hasn't shifted the weight, that's expected. High-intensity steady-state cardio raises cortisol, which in perimenopause increases visceral fat. Your plan shifts the balance toward resistance training first, with Zone 2 walking second.",
    recommendations: [
      { priority: "PRIORITY 01", title: "Resistance training × 3/week", body: "The most powerful lever for body composition, bone density, and insulin sensitivity.", tag: "30–45 min" },
      { priority: "PRIORITY 02", title: "Zone 2 walking × 4–5/week", body: "Lowers cortisol and improves insulin sensitivity without triggering a stress response.", tag: "Morning" },
    ],
  },
  supplements: {
    headline: "Your supplement stack",
    safety_note: "Non-hormonal supplements with research backing for your reported symptoms. Confirm with your doctor before starting.",
    stack: [
      { name: "Magnesium Glycinate", dose: "300–400mg", benefit: "Sleep depth, anxiety, night sweats", timing: "1–2h before bed", priority: "high" },
      { name: "Vitamin D3 + K2", dose: "2,000–4,000 IU", benefit: "Bone density, mood, sleep regulation", timing: "With breakfast", priority: "high" },
    ],
  },
  daily_rhythm: {
    headline: "Your symptom-optimised day",
    intro: "Timing matters because your cortisol and blood sugar swings are what amplify your symptoms.",
    schedule: [
      { time: "06:30", title: "Wake + light", desc: "Same time daily, natural light within 30 minutes." },
      { time: "16:00", title: "Protein + fat snack", desc: "Heads off the cortisol-peak craving window." },
    ],
  },
  doctors_brief: {
    intro:
      "You don't have to accept being dismissed. Bring this to your next appointment — your symptoms are summarised, your options laid out, your questions ready.",
    symptoms_to_discuss: ["Severe night sweats waking 3–4× nightly", "Two years of fragmented sleep", "Unresponsive abdominal weight gain"],
    hrt_questions: ["Am I a candidate for transdermal HRT?", "Could low-dose progesterone help my sleep?"],
    non_hormonal_options: ["Fezolinetant (Veozah)", "Low-dose SSRI if anxiety escalates"],
    tests_to_request: ["FSH + LH", "Full thyroid panel", "Fasting insulin + HbA1c", "Vitamin D"],
    closing_note: "You deserve a plan built around you — and now you have one.",
  },
};
