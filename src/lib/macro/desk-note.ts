import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  prompt: z.string().min(80).max(40000),
});

export const writeDeskNote = createServerFn({ method: "POST" })
  .validator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "Catatan AI tidak tersedia di lingkungan ini." };
    }

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.28,
        max_tokens: 1800,
        messages: [
          {
            role: "system",
            content:
              "Kamu desk economist Indonesia. Ikuti operating system yang diberi user. Bahasa Indonesia, nada riset bank, tanpa klaim kepastian.",
          },
          { role: "user", content: data.prompt },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: `Gagal memanggil model (${res.status}).` };
    }

    const body = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "Model mengembalikan catatan kosong." };
    return { ok: true as const, text };
  });
