import { IntakeData } from "@/types/intake";

const symptomLabels: Record<string, string> = {
  hot_flashes: "hot flashes",
  night_sweats: "night sweats",
  sleep: "sleep disruption",
  weight: "weight gain / belly fat",
  brain_fog: "brain fog",
  mood: "mood swings",
  anxiety: "anxiety",
  low_mood: "low mood",
  joint_pain: "joint / muscle pain",
  fatigue: "fatigue / low energy",
  libido: "low libido",
  vaginal: "vaginal dryness",
  skin_hair: "skin / hair changes",
  palpitations: "palpitations",
  headaches: "headaches",
  bladder: "bladder changes",
};

const stageLabels: Record<string, string> = {
  peri_early: "early perimenopause",
  peri_late: "late perimenopause",
  menopause: "menopause",
  post: "postmenopause",
  unsure: "perimenopause (stage uncertain)",
};

const hrtContext: Record<string, string> = {
  none: "She is not currently using any hormonal therapy.",
  prescribed: "She is on prescribed HRT but still experiencing significant symptoms.",
  bioidentical: "She uses bioidentical hormones.",
  considering: "She is considering HRT but has not yet started.",
  stopped: "She recently stopped HRT.",
};

export function buildProtocolPrompt(data: IntakeData): string {
  const symptoms = data.symptoms ?? [];
  const severity = data.severity ?? { hf: 0, sl: 0, mo: 0, wt: 0, fa: 0, bf: 0 };
  const conditions = data.conditions ?? [];

  const topSymptoms = symptoms.map((s) => symptomLabels[s] ?? s).join(", ");

  const severityNarrative = [
    severity.hf === 3 ? "severe hot flashes / night sweats" : severity.hf === 2 ? "moderate hot flashes" : null,
    severity.sl === 3 ? "severely disrupted sleep" : severity.sl === 2 ? "moderately disrupted sleep" : null,
    severity.mo === 3 ? "severe anxiety / mood instability" : severity.mo === 2 ? "moderate mood issues" : null,
    severity.wt >= 2 ? "significant weight / body composition concerns" : null,
    severity.fa >= 2 ? "notable fatigue" : null,
    severity.bf >= 2 ? "brain fog affecting daily function" : null,
  ]
    .filter(Boolean)
    .join("; ");

  const hasBreastCancerHistory = conditions.includes("breast_cancer");
  const safetyWarning = hasBreastCancerHistory
    ? "\n\nCRITICAL SAFETY: This woman has a history of breast cancer. Do NOT recommend HRT, phytoestrogens, black cohosh, red clover, or any estrogenic supplements. Focus exclusively on non-hormonal, evidence-based approaches."
    : "";

  return `
You are a specialist menopause health writer creating a deeply personalized Menopause Management Protocol document for a real woman.

The tone is warm, expert, and direct — like a brilliant friend who happens to be a menopause specialist. Every recommendation must reference her specific situation. Use her name (${data.name}) throughout. Never write generic advice.

## About ${data.name}

- Name: ${data.name}, Age: ${data.age}
- Stage: ${stageLabels[data.stage ?? "unsure"] ?? data.stage}
- Symptoms reported (${symptoms.length}): ${topSymptoms}
- Severity: ${severityNarrative || "mild across most symptoms"}
- Duration: ${(data.duration ?? "")
    .replace("lt6mo", "less than 6 months")
    .replace("6_12", "6–12 months")
    .replace("1_3yr", "1–3 years")
    .replace("3plus", "3+ years")}
- HRT status: ${hrtContext[data.hrt ?? "none"]}
- Health conditions: ${conditions.length ? conditions.join(", ") : "none reported"}
- Current supplements/meds: ${data.current_supplements || "none mentioned"}
- Diet style: ${data.diet}, quality self-rated ${data.diet_quality}/5
- Dietary restrictions: ${data.diet_restrictions || "none"}
- Nutrition challenges: ${(data.nutrition_challenges ?? []).join(", ") || "none specified"}
- Exercise: ${(data.exercise ?? []).join(", ") || "none currently"}, activity level: ${data.activity}
- Sleep: averaging ${data.sleep_hours} hours, waking ${data.wake_freq} per night
- Sleep disruptors: ${(data.sleep_disruptors ?? []).join(", ") || "unclear"}
- Stress level: ${data.stress}
- Primary goals: ${(data.goals ?? []).join(", ").replace(/_/g, " ")}
- Motivation level: ${data.motivation}
- In her own words: "${data.free_text || "not provided"}"
${safetyWarning}

## Your task

Generate a complete, structured Menopause Management Protocol for ${data.name}.

Return ONLY a valid JSON object with no markdown, no backticks, no preamble, no explanation. Just the raw JSON.

The JSON must follow this exact structure:

{
  "cover": {
    "stage": "string — e.g. 'Late Perimenopause'",
    "duration": "string — e.g. '2 years'",
    "focus_areas": number,
    "plan_weeks": number,
    "fingerprint_scores": [array of 8 integers 1–10, in this order: hot_flashes, night_sweats, sleep, weight, mood_anxiety, brain_fog, fatigue, libido]
  },
  "whats_happening": {
    "headline": "string — personalised to her stage and symptoms",
    "summary": "string — 3–4 sentences explaining exactly what is happening hormonally for HER, referencing her specific symptom cluster",
    "key_callout": "string — one powerful insight specific to her situation",
    "mechanisms": [
      { "number": "01", "title": "string", "body": "string — 2–3 sentences", "tag": "string" }
    ]
  },
  "nutrition": {
    "headline": "string",
    "profile_callout": "string — references her specific diet style, quality rating, and top challenges",
    "key_insight": "string — the single highest-impact dietary change for HER symptoms, with concrete example and expected timeline",
    "foods": [
      { "name": "string", "why": "string — one sentence tied to her symptoms", "examples": ["5 foods"] }
    ],
    "reduce_note": "string — what to reduce and why, personalised to her diet style"
  },
  "sleep": {
    "headline": "string",
    "pattern_callout": "string — names her specific disruption pattern and its hormonal cause",
    "steps": [
      { "week_range": "string", "title": "string", "body": "string — 3–4 sentences, specific and actionable" }
    ]
  },
  "movement": {
    "headline": "string",
    "reframe_callout": "string — personalised to her current activity level and what needs to change",
    "recommendations": [
      { "priority": "string", "title": "string", "body": "string — 2–3 sentences", "tag": "string" }
    ]
  },
  "supplements": {
    "headline": "string",
    "safety_note": "string — reference her specific conditions if any",
    "stack": [
      { "name": "string", "dose": "string", "benefit": "string — tied to her symptoms", "timing": "string", "priority": "high | medium | supportive" }
    ]
  },
  "daily_rhythm": {
    "headline": "string",
    "intro": "string — one sentence about why timing matters for her hormonal pattern",
    "schedule": [
      { "time": "string", "title": "string", "desc": "string — specific and actionable" }
    ]
  },
  "doctors_brief": {
    "intro": "string — empowering, references her experience if she mentioned dismissal",
    "symptoms_to_discuss": ["specific symptom descriptions with severity and duration"],
    "hrt_questions": ["questions about HRT — omit if breast cancer history"],
    "non_hormonal_options": ["specific non-hormonal treatments to ask about"],
    "tests_to_request": ["specific blood tests and scans"],
    "closing_note": "string — one sentence of encouragement"
  }
}
`.trim();
}
