import Anthropic from "@anthropic-ai/sdk";
import { IntakeData } from "@/types/intake";
import { ProtocolData } from "@/types/protocol";
import { buildProtocolPrompt } from "./buildProtocolPrompt";

const client = new Anthropic();

export async function generateProtocol(intakeData: IntakeData): Promise<ProtocolData> {
  const prompt = buildProtocolPrompt(intakeData);

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    system:
      "You are a specialist menopause health writer. You always respond with valid JSON only. No markdown fences, no backticks, no preamble, no explanation. Raw JSON only.",
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.content[0].type === "text" ? response.content[0].text : "";

  try {
    return JSON.parse(raw) as ProtocolData;
  } catch {
    // Strip any accidental markdown fences before retrying parse
    const cleaned = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    return JSON.parse(cleaned) as ProtocolData;
  }
}
