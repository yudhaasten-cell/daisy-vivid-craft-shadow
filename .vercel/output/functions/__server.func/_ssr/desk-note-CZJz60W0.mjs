import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { i as string, r as object } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desk-note-CZJz60W0.js
var Input = object({ prompt: string().min(80).max(4e4) });
var writeDeskNote_createServerFn_handler = createServerRpc({
	id: "287dc15e29d6798168edbf699c25bc7e27c765933b054279272bcae99aa90240",
	name: "writeDeskNote",
	filename: "src/lib/macro/desk-note.ts"
}, (opts) => writeDeskNote.__executeServer(opts));
var writeDeskNote = createServerFn({ method: "POST" }).validator((input) => Input.parse(input)).handler(writeDeskNote_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Catatan AI tidak tersedia di lingkungan ini."
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .28,
			max_tokens: 1800,
			messages: [{
				role: "system",
				content: "Kamu desk economist Indonesia. Ikuti operating system yang diberi user. Bahasa Indonesia, nada riset bank, tanpa klaim kepastian."
			}, {
				role: "user",
				content: data.prompt
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Gagal memanggil model (${res.status}).`
	};
	const text = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
	if (!text) return {
		ok: false,
		error: "Model mengembalikan catatan kosong."
	};
	return {
		ok: true,
		text
	};
});
//#endregion
export { writeDeskNote_createServerFn_handler };
