import fs from "fs";
import path from "path";
import { IntakeData } from "@/types/intake";
import { ProtocolData } from "@/types/protocol";

/**
 * Inject the generated protocol content into the HTML template via targeted
 * replacements. Returns a complete, standalone HTML document.
 */
export function fillProtocolTemplate(
  template: string,
  intake: IntakeData,
  protocol: ProtocolData
): string {
  let html = template;

  // ── Cover ──
  html = html.replace(/\bSophie\b/g, intake.name ?? "");
  html = html.replace(/\b49\b/g, String(intake.age ?? ""));
  html = html.replace("Late Peri", protocol.cover.stage);
  html = html.replace("2 yr", protocol.cover.duration);

  // ── Symptom fingerprint bars ──
  // Rebuild the entire .fingerprint block (bar + label per symptom). The block
  // is matched up to the </div> that immediately precedes .cover-meta, which
  // avoids the nested-<div> pitfall of a naive non-greedy match.
  const FP_LABELS = [
    "Hot flashes",
    "Night sweats",
    "Sleep",
    "Weight",
    "Anxiety",
    "Brain fog",
    "Fatigue",
    "Libido",
  ];
  const FP_COLORS = [
    "rgba(176,90,114,0.95)",
    "rgba(176,90,114,0.95)",
    "rgba(176,90,114,0.9)",
    "rgba(192,120,64,0.8)",
    "rgba(107,158,133,0.75)",
    "rgba(107,158,133,0.65)",
    "rgba(123,79,126,0.6)",
    "rgba(123,79,126,0.5)",
  ];
  const scores = protocol.cover.fingerprint_scores ?? [];
  const wrapsHtml = FP_LABELS.map((label, i) => {
    const score = Math.max(0, Math.min(10, scores[i] ?? 0));
    const heightPx = Math.max(score, 1) * 9; // 9–90px
    return `        <div class="fp-bar-wrap">
          <div class="fp-bar" style="height:${heightPx}px; background: ${FP_COLORS[i]};"></div>
          <div class="fp-label">${label}</div>
        </div>`;
  }).join("\n");
  html = html.replace(
    /<div class="fingerprint">[\s\S]*?<\/div>\s*(<div class="cover-meta">)/,
    `<div class="fingerprint">\n${wrapsHtml}\n      </div>\n\n      $1`
  );

  // ── What's happening — summary ──
  html = html.replace(
    /(<p class="body-text">)([\s\S]*?)(<\/p>)/,
    `$1${protocol.whats_happening.summary}$3`
  );

  // ── Nutrition profile callout ──
  html = html.replace(
    /(<p class="callout-label">Your Nutrition Profile<\/p>\s*<p>)([\s\S]*?)(<\/p>)/,
    `$1${protocol.nutrition.profile_callout}$3`
  );

  // ── Nutrition key insight ──
  html = html.replace(
    /(<p class="callout-label">The one swap[\s\S]*?<\/p>\s*<p>)([\s\S]*?)(<\/p>)/,
    `$1${protocol.nutrition.key_insight}$3`
  );

  // ── Sleep pattern callout ──
  html = html.replace(
    /(<p class="callout-label">Your sleep pattern<\/p>\s*<p>)([\s\S]*?)(<\/p>)/,
    `$1${protocol.sleep.pattern_callout}$3`
  );

  // ── Movement reframe callout ──
  html = html.replace(
    /(<p class="callout-label">Why your usual approach[\s\S]*?<\/p>\s*<p>)([\s\S]*?)(<\/p>)/,
    `$1${protocol.movement.reframe_callout}$3`
  );

  // ── Doctor's brief intro ──
  html = html.replace(
    /Take this to your next appointment[^<]*/,
    protocol.doctors_brief.intro
  );

  return html;
}

/** Read the protocol HTML template from disk. */
export function loadProtocolTemplate(): string {
  const templatePath = path.join(process.cwd(), "templates", "protocol.html");
  return fs.readFileSync(templatePath, "utf-8");
}

/**
 * Render the full hosted protocol page for a given order, live from the
 * stored protocol data. Used by the /protocol/[token] route.
 */
export function renderProtocolPage(intake: IntakeData, protocol: ProtocolData): string {
  return fillProtocolTemplate(loadProtocolTemplate(), intake, protocol);
}
