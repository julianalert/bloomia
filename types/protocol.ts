export interface ProtocolData {
  cover: {
    stage: string;
    duration: string;
    focus_areas: number;
    plan_weeks: number;
    fingerprint_scores: number[]; // 8 values 1–10
  };
  whats_happening: {
    headline: string;
    summary: string;
    key_callout: string;
    mechanisms: Array<{
      number: string;
      title: string;
      body: string;
      tag: string;
    }>;
  };
  nutrition: {
    headline: string;
    profile_callout: string;
    key_insight: string;
    foods: Array<{
      name: string;
      why: string;
      examples: string[];
    }>;
    reduce_note: string;
  };
  sleep: {
    headline: string;
    pattern_callout: string;
    steps: Array<{
      week_range: string;
      title: string;
      body: string;
    }>;
  };
  movement: {
    headline: string;
    reframe_callout: string;
    recommendations: Array<{
      priority: string;
      title: string;
      body: string;
      tag: string;
    }>;
  };
  supplements: {
    headline: string;
    safety_note: string;
    stack: Array<{
      name: string;
      dose: string;
      benefit: string;
      timing: string;
      priority: "high" | "medium" | "supportive";
    }>;
  };
  daily_rhythm: {
    headline: string;
    intro: string;
    schedule: Array<{
      time: string;
      title: string;
      desc: string;
    }>;
  };
  doctors_brief: {
    intro: string;
    symptoms_to_discuss: string[];
    hrt_questions: string[];
    non_hormonal_options: string[];
    tests_to_request: string[];
    closing_note: string;
  };
}
