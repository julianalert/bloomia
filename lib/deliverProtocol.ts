import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Update this to a domain you have verified in Resend.
const FROM_ADDRESS = "Bloomia <hello@bloomia.com>";

function emailHtml(name: string, protocolUrl: string): string {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0; padding:0; background:#F2EBE1;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2EBE1; padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#FAF6F0; border:1px solid #E0D5C8; border-radius:16px; overflow:hidden;">
        <tr><td style="background:#1C1418; padding:28px 32px;">
          <div style="font-family:Georgia,'Times New Roman',serif; font-size:20px; color:#FAF6F0; letter-spacing:0.03em;">Bloomia</div>
        </td></tr>
        <tr><td style="padding:36px 32px;">
          <p style="margin:0 0 16px; font-family:-apple-system,Segoe UI,sans-serif; font-size:16px; color:#2C2228;">${greeting}</p>
          <h1 style="margin:0 0 16px; font-family:Georgia,serif; font-size:26px; font-weight:400; line-height:1.25; color:#1C1418;">Your personalized Menopause Protocol is ready.</h1>
          <p style="margin:0 0 28px; font-family:-apple-system,Segoe UI,sans-serif; font-size:15px; line-height:1.7; color:#4A3E44;">
            We've built your 20+ page protocol from your assessment — what's happening in your body, your nutrition and sleep plans, a movement strategy, a prioritized supplement stack, and a doctor's brief. It's all waiting for you online, ready to read, print, or take to your next appointment.
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
            <tr><td style="border-radius:50px; background:#B05A72;">
              <a href="${protocolUrl}" style="display:inline-block; padding:16px 40px; font-family:-apple-system,Segoe UI,sans-serif; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:50px;">View your Protocol →</a>
            </td></tr>
          </table>
          <p style="margin:0 0 8px; font-family:-apple-system,Segoe UI,sans-serif; font-size:13px; line-height:1.6; color:#8A7A82;">
            Or paste this link into your browser:
          </p>
          <p style="margin:0 0 24px; font-family:-apple-system,Segoe UI,sans-serif; font-size:13px; line-height:1.6; word-break:break-all;">
            <a href="${protocolUrl}" style="color:#B05A72;">${protocolUrl}</a>
          </p>
          <p style="margin:0; font-family:-apple-system,Segoe UI,sans-serif; font-size:12px; line-height:1.6; color:#8A7A82;">
            Keep this link private — anyone with it can view your protocol. Bloomia provides evidence-informed lifestyle and wellness guidance and is not a substitute for medical advice.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function deliverProtocol(
  protocolUrl: string,
  email: string,
  name: string
): Promise<void> {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: `${name}, your Bloomia Protocol is ready`,
    html: emailHtml(name, protocolUrl),
  });
}
