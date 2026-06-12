import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Bloomia <hello@bloomia.com>";

// ─── Symptom labels (mirrors SYMPTOMS array in assessment page) ───────────────
const SYMPTOM_LABELS: Record<string, string> = {
  hot_flashes: "hot flashes",
  night_sweats: "night sweats",
  sleep: "waking at 3am",
  weight: "belly weight that won't shift",
  brain_fog: "brain fog at work",
  mood: "irritability",
  anxiety: "anxiety",
  low_mood: "low mood",
  joint_pain: "aching joints",
  fatigue: "exhaustion",
  libido: "lost interest in intimacy",
  vaginal: "vaginal dryness",
  skin_hair: "skin and hair changes",
  palpitations: "palpitations",
  headaches: "forgetting words mid-sentence",
  bladder: "not feeling like yourself",
};

// ─── Personalized "because you reported…" blocks for email 2 ─────────────────
const BECAUSE_BLOCKS: Record<string, string> = {
  hot_flashes: `Because you reported <strong>hot flashes</strong> as one of your symptoms, your Protocol opens with the exact hormonal mechanism driving them at your stage — and gives you a 4-step evening protocol designed to reduce their frequency within 2 weeks.`,
  night_sweats: `Because you reported <strong>night sweats</strong>, your Protocol includes a targeted sleep temperature protocol — specific actions for the 90 minutes before bed that directly reduce the cortisol-estrogen cascade responsible for overnight waking.`,
  sleep: `Because you mentioned <strong>waking at 3am</strong>, you get a dedicated Sleep Rescue Plan built for that exact pattern — not generic sleep hygiene, but a step-by-step protocol for the specific type of fragmentation that happens in perimenopause.`,
  weight: `Because <strong>belly weight that won't shift</strong> is on your list, your Protocol explains exactly why calorie restriction and extra cardio make it worse right now — and gives you the resistance-training and eating-window strategy that actually works for your stage.`,
  brain_fog: `Because you flagged <strong>brain fog at work</strong>, your Protocol includes a cognitive support stack — specific nutrients and daily habits with the strongest research backing for estrogen-related cognitive changes.`,
  anxiety: `Because you mentioned <strong>anxiety out of nowhere</strong>, your Protocol addresses the physiological cause — declining estrogen destabilising serotonin and GABA — with both supplement and lifestyle interventions that address the root, not the symptom.`,
  fatigue: `Because <strong>exhaustion by noon</strong> is a pattern for you, your Protocol includes an energy protocol built around your hormonal rhythm — including the single dietary change that most consistently restores afternoon energy within 10–14 days.`,
};

function topSymptoms(
  symptoms: string[],
  severity: Record<string, number>,
  max = 3
): string[] {
  return [...symptoms]
    .sort((a, b) => (severity[b] ?? 1) - (severity[a] ?? 1))
    .slice(0, max);
}

// ─── Shared email chrome ──────────────────────────────────────────────────────
function wrap(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#F2EBE1;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2EBE1;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FAF6F0;border:1px solid #E0D5C8;border-radius:16px;overflow:hidden;">
        <tr><td style="background:#1C1418;padding:24px 32px;">
          <span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#FAF6F0;letter-spacing:0.04em;"><em style="color:#E8A4B5;">B</em>loomia</span>
        </td></tr>
        <tr><td style="padding:36px 32px 32px;">
          ${body}
          <p style="margin:28px 0 0;font-family:-apple-system,Segoe UI,sans-serif;font-size:12px;line-height:1.6;color:#8A7A82;">
            Bloomia provides evidence-informed lifestyle and wellness guidance. It is not a substitute for medical advice.<br/>
            You're receiving this because you started a Protocol assessment. <a href="{{unsubscribe}}" style="color:#8A7A82;">Unsubscribe</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(url: string, label = "Get my Protocol →"): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
    <tr><td style="border-radius:50px;background:#B05A72;">
      <a href="${url}" style="display:inline-block;padding:16px 40px;font-family:-apple-system,Segoe UI,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:50px;">${label}</a>
    </td></tr>
  </table>`;
}

function p(text: string, style = ""): string {
  return `<p style="margin:0 0 16px;font-family:-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.7;color:#4A3E44;${style}">${text}</p>`;
}

function h1(text: string): string {
  return `<h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;font-weight:400;line-height:1.25;color:#1C1418;">${text}</h1>`;
}

// ─── Email 1 — 1 hour ─────────────────────────────────────────────────────────
function email1Html(name: string, url: string, symptoms: string[]): string {
  const symptomList = symptoms
    .map((v) => SYMPTOM_LABELS[v] ?? v)
    .slice(0, 5)
    .map((l) => `<li style="margin:0 0 8px;font-family:-apple-system,Segoe UI,sans-serif;font-size:14px;color:#4A3E44;line-height:1.5;">→ ${l}</li>`)
    .join("");

  return wrap(`
    ${p(`Hi ${name},`, "font-weight:600;")}
    ${h1("Your Protocol is still waiting for you.")}
    ${p("You spent time answering some of the most personal questions about your health — your symptoms, your sleep, your goals. That took courage.")}
    ${p("Your personalized Menopause Management Protocol is ready to be generated. It's sitting there, waiting for one last step.")}
    ${p("Here's what's on the other side:", "margin-bottom:12px;")}
    <ul style="margin:0 0 20px;padding:0 0 0 4px;list-style:none;">
      <li style="margin:0 0 8px;font-family:-apple-system,Segoe UI,sans-serif;font-size:14px;color:#4A3E44;line-height:1.5;">→ A 20+ page plan built entirely around your answers</li>
      ${symptomList}
      <li style="margin:0 0 8px;font-family:-apple-system,Segoe UI,sans-serif;font-size:14px;color:#4A3E44;line-height:1.5;">→ A doctor's brief you can print and take to your next appointment</li>
    </ul>
    ${ctaButton(url, "Complete my Protocol — $27")}
    ${p(`${name}, you already did the hard part.`)}
    ${p("— The Bloomia Team", "color:#8A7A82;font-size:13px;")}
    <p style="margin:16px 0 0;font-family:-apple-system,Segoe UI,sans-serif;font-size:13px;line-height:1.6;color:#8A7A82;font-style:italic;">
      P.S. Your answers are saved. You don't need to fill anything in again. Just click above.
    </p>
  `);
}

// ─── Email 2 — 24 hours ───────────────────────────────────────────────────────
function email2Html(
  name: string,
  url: string,
  symptoms: string[],
  severity: Record<string, number>
): string {
  const top = topSymptoms(symptoms, severity, 3);
  const becauseBlocks = top
    .filter((v) => BECAUSE_BLOCKS[v])
    .map((v) => p(BECAUSE_BLOCKS[v]))
    .join("");

  return wrap(`
    ${p(`Hi ${name},`, "font-weight:600;")}
    ${p(`<em style="font-family:Georgia,serif;font-size:17px;color:#1C1418;">"I wasn't sure it would actually be personalised."</em>`, "margin-bottom:20px;")}
    ${p("That's the most common thing we hear from women who almost didn't go through with it.")}
    ${p("So let's be specific about what your Protocol actually contains — based on what you told us.")}
    ${becauseBlocks || p("Your Protocol is built directly from your answers — not a generic menopause guide.")}
    ${p("This isn't a one-size-fits-all document. It was built from your answers.")}
    ${ctaButton(url, "Get my Protocol — $27")}
    ${p("And if it doesn't feel genuinely written for you? Full refund within 30 days. No questions asked.", "font-size:13px;color:#8A7A82;")}
    ${p("— The Bloomia Team", "color:#8A7A82;font-size:13px;")}
  `);
}

// ─── Email 3 — 72 hours ───────────────────────────────────────────────────────
function email3Html(name: string, url: string): string {
  return wrap(`
    ${p(`Hi ${name},`, "font-weight:600;")}
    ${p("This is the last email we'll send.")}
    ${p("Your answers are saved for 7 days. After that, they're deleted and you'd need to start again.")}
    ${p("I know $27 isn't nothing. So let me put it differently.")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#F9EEF2;border-left:3px solid #B05A72;border-radius:0 8px 8px 0;padding:16px 20px;">
      <tr><td>
        <p style="margin:0 0 8px;font-family:-apple-system,Segoe UI,sans-serif;font-size:13px;line-height:1.6;color:#4A3E44;">A single session with a menopause specialist costs <strong style="color:#2C2228;">$200–$400</strong>.</p>
        <p style="margin:0;font-family:-apple-system,Segoe UI,sans-serif;font-size:13px;line-height:1.6;color:#4A3E44;">Your Protocol covers that — and more — for <strong style="color:#B05A72;">$27</strong>. Yours forever. No subscription, no renewals.</p>
      </td></tr>
    </table>
    ${p("What other women said after theirs arrived:")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;background:#FAF6F0;border:1px solid #E0D5C8;border-radius:10px;padding:16px 20px;">
      <tr><td>
        <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:14px;font-style:italic;line-height:1.65;color:#4A3E44;">"The first time anything felt written for me — not for some average version of a menopausal woman."</p>
        <p style="margin:0;font-family:-apple-system,Segoe UI,sans-serif;font-size:12px;color:#8A7A82;">— Claire, 52 · Late perimenopause · UK</p>
      </td></tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:#FAF6F0;border:1px solid #E0D5C8;border-radius:10px;padding:16px 20px;">
      <tr><td>
        <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:14px;font-style:italic;line-height:1.65;color:#4A3E44;">"I took the Doctor's Brief to my appointment. Two years of being dismissed — and one printed page changed that."</p>
        <p style="margin:0;font-family:-apple-system,Segoe UI,sans-serif;font-size:12px;color:#8A7A82;">— Marie, 48 · UK</p>
      </td></tr>
    </table>
    ${p("You've been managing this long enough.")}
    ${ctaButton(url, "Get my Protocol — $27 →")}
    ${p("After 7 days, this link stops working.", "font-size:13px;color:#8A7A82;")}
    ${p("— The Bloomia Team", "color:#8A7A82;font-size:13px;")}
    <p style="margin:16px 0 0;font-family:-apple-system,Segoe UI,sans-serif;font-size:13px;line-height:1.6;color:#8A7A82;font-style:italic;">
      P.S. 30-day money-back guarantee. If it doesn't help, email us. Full refund, no friction.
    </p>
  `);
}

// ─── Email schedule ───────────────────────────────────────────────────────────
const SEQUENCE = [
  { num: 1, delayHours: 1 },
  { num: 2, delayHours: 24 },
  { num: 3, delayHours: 72 },
] as const;

// ─── Route handler ────────────────────────────────────────────────────────────
// Vercel Cron sends a GET with the Authorization header set to Bearer CRON_SECRET.
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

  // Orders that completed Step 6 (have email), never paid, updated at least 1h ago
  const { data: candidates, error } = await supabase
    .from("orders")
    .select("id, name, email, updated_at, abandoned_email_sent, intake_data")
    .eq("status", "incomplete")
    .eq("current_step", 6)
    .not("email", "is", null)
    .lt("updated_at", oneHourAgo);

  if (error) {
    console.error("abandoned-cart: query error", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (!candidates?.length) {
    return NextResponse.json({ sent: 0 });
  }

  let sent = 0;

  for (const order of candidates) {
    const hoursSince =
      (now.getTime() - new Date(order.updated_at).getTime()) / 3_600_000;
    const alreadySent: number[] = order.abandoned_email_sent ?? [];
    const checkoutUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/order?id=${order.id}`;
    const symptoms: string[] = order.intake_data?.symptoms ?? [];
    const severity: Record<string, number> = order.intake_data?.severity ?? {};
    const name = order.name ?? "there";

    for (const { num, delayHours } of SEQUENCE) {
      if (alreadySent.includes(num)) continue;
      if (hoursSince < delayHours) continue;

      let subject: string;
      let html: string;

      if (num === 1) {
        subject = `${name}, your Protocol is still waiting for you`;
        html = email1Html(name, checkoutUrl, symptoms);
      } else if (num === 2) {
        subject = `"I wasn't sure it would actually be personalised"`;
        html = email2Html(name, checkoutUrl, symptoms, severity);
      } else {
        subject = `Last chance — your Protocol expires soon`;
        html = email3Html(name, checkoutUrl);
      }

      try {
        await resend.emails.send({ from: FROM, to: order.email, subject, html });
        await supabase
          .from("orders")
          .update({ abandoned_email_sent: [...alreadySent, num] })
          .eq("id", order.id);
        sent++;
      } catch (err) {
        console.error(`abandoned-cart: failed to send email ${num} to ${order.email}`, err);
      }

      break; // one email per order per cron run
    }
  }

  return NextResponse.json({ sent });
}
