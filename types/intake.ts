export interface IntakeData {
  // Step 1 — Symptoms
  symptoms?: string[];
  worst_symptom?: string;
  stage?: "peri_early" | "peri_late" | "menopause" | "post" | "unsure";

  // Step 2 — Severity & health context
  // keys match SYMPTOMS[].v from the assessment form
  severity?: Record<string, number>;
  duration?: "lt6mo" | "6_12" | "1_3yr" | "3plus";
  hrt?: "none" | "prescribed" | "bioidentical" | "considering" | "stopped";
  conditions?: string[];
  current_supplements?: string;

  // Step 3 — Sleep
  sleep_hours?: string;
  wake_freq?: string;
  sleep_disruptors?: string[];
  sleep_environment?: string[];
  stress?: "low" | "mod" | "high" | "very_high";

  // Step 4 — Nutrition & lifestyle
  diet?: "omni" | "pesc" | "veg" | "vegan" | "lowcarb" | "med";
  diet_quality?: string;
  diet_restrictions?: string;
  nutrition_challenges?: string[];
  activity?: "sed" | "light" | "mod" | "active" | "very";
  exercise?: string[];

  // Step 5 — Goals
  goals?: string[];
  motivation?: "full" | "mod" | "small" | "clarity";
  free_text?: string;

  // Step 6 — Profile (name/email promoted to order top-level columns too)
  name?: string;
  age?: number;
  email?: string;
  country?: string;
}

// Full intake — all fields required — used at generation time
export interface CompleteIntakeData
  extends Required<
    Omit<
      IntakeData,
      | "worst_symptom"
      | "current_supplements"
      | "diet_restrictions"
      | "sleep_environment"
      | "free_text"
      | "country"
    >
  > {
  worst_symptom?: string;
  current_supplements?: string;
  diet_restrictions?: string;
  sleep_environment?: string[];
  free_text?: string;
  country?: string;
}
