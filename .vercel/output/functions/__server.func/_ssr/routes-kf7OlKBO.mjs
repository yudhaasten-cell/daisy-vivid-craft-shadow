import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, n as useQuery, r as QueryClientProvider, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { i as string, r as object } from "../_libs/zod.mjs";
import { a as Copy, c as ArrowDownRight, i as Download, n as RefreshCw, o as Check, r as LoaderCircle, s as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as createSsrRpc, n as Route, r as fetchQuotes } from "./router-BXtc3LLs.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-kf7OlKBO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatIdNumber(value, options) {
	return new Intl.NumberFormat("id-ID", options).format(value);
}
function formatSignedPct(value, digits = 2) {
	const abs = Math.abs(value).toFixed(digits);
	if (value > 1e-7) return `+${abs}%`;
	if (value < -1e-7) return `−${abs}%`;
	return `${0 .toFixed(digits)}%`;
}
function formatUsdIdr(value) {
	return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(Math.round(value));
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide", {
	variants: { tone: {
		muted: "bg-bg-subtle text-muted",
		accent: "bg-accent/15 text-accent",
		up: "bg-up/15 text-up",
		down: "bg-down/15 text-down",
		warn: "bg-warn/15 text-warn"
	} },
	defaultVariants: { tone: "muted" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,color] duration-[var(--motion-quick)] ease-[var(--ease-smooth-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:size-4", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			outline: "border border-border-strong bg-transparent text-fg hover:bg-bg-subtle",
			ghost: "text-muted hover:bg-bg-subtle hover:text-fg",
			inverse: "bg-fg text-bg hover:opacity-90"
		},
		size: {
			default: "h-11 rounded-md px-4 text-sm",
			sm: "h-9 rounded-sm px-3 text-sm",
			lg: "h-12 rounded-md px-5 text-sm",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Sparkline({ data, rising, className }) {
	if (data.length < 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-10", className) });
	const values = data.map((d) => d.v);
	const min = Math.min(...values);
	const span = Math.max(...values) - min || 1;
	const path = data.map((point, index) => {
		const x = index / (data.length - 1) * 100;
		const y = 100 - (point.v - min) / span * 100;
		return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
	}).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 100 100",
		preserveAspectRatio: "none",
		className: cn("h-10 w-full overflow-visible", rising ? "text-down" : "text-up", className),
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: path,
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.4",
			vectorEffect: "non-scaling-stroke"
		})
	});
}
var Input = object({ prompt: string().min(80).max(4e4) });
var writeDeskNote = createServerFn({ method: "POST" }).validator((input) => Input.parse(input)).handler(createSsrRpc("287dc15e29d6798168edbf699c25bc7e27c765933b054279272bcae99aa90240"));
var DEFAULT_ASSUMPTIONS = {
	biRate: 5.75,
	fedRate: 3.75,
	sbn10y: 6.9,
	inflation: 3.1,
	cadGdp: -1.1,
	fiscalGdp: -2.8,
	reservesBn: 148,
	growth: 5
};
function q(payload, symbol) {
	return payload.quotes[symbol];
}
function n(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function computeRegime(payload, a) {
	const idr = q(payload, "IDR=X");
	const dxy = q(payload, "DX-Y.NYB");
	const brent = q(payload, "BZ=F");
	const wti = q(payload, "CL=F");
	const tnx = q(payload, "^TNX");
	const vix = q(payload, "^VIX");
	const copper = q(payload, "HG=F");
	const gold = q(payload, "GC=F");
	const irx = q(payload, "^IRX");
	const oil = n(brent?.price) ?? n(wti?.price);
	const ust = n(tnx?.price);
	const dxyPx = n(dxy?.price);
	const vixPx = n(vix?.price);
	const idrPx = n(idr?.price);
	const fedPx = n(irx?.price) ?? a.fedRate;
	const copperChg = n(copper?.change6mPct);
	const oilChg = n(brent?.change6mPct) ?? n(wti?.change6mPct);
	const carry = a.biRate - fedPx;
	const drivers = [];
	let score = 50;
	const push = (driver) => {
		score += driver.contribution;
		drivers.push(driver);
	};
	if (dxyPx != null) {
		const contribution = dxyPx >= 103 ? 11 : dxyPx >= 100.5 ? 6 : dxyPx >= 98 ? 1 : -7;
		push({
			id: "dxy",
			label: "DXY",
			valueLabel: dxyPx.toFixed(2),
			contribution,
			polarity: contribution > 1 ? "tekan" : contribution < -1 ? "dukung" : "netral",
			note: contribution > 1 ? "Dolar global kuat biasanya menyeret keranjang Asia, termasuk IDR." : contribution < -1 ? "Dolar lunak membuka ruang aliran ke EM." : "DXY di zona netral — bukan mesin utama hari ini."
		});
	}
	if (ust != null) {
		const contribution = ust >= 5 ? 13 : ust >= 4.5 ? 8 : ust >= 4.1 ? 3 : -6;
		push({
			id: "ust",
			label: "UST 10Y",
			valueLabel: `${ust.toFixed(2)}%`,
			contribution,
			polarity: contribution > 1 ? "tekan" : contribution < -1 ? "dukung" : "netral",
			note: contribution > 1 ? "Imbal hasil dolar tinggi = diskonto EM + saingan SBN. Ini saluran paling mahal untuk IDR." : "Yield dolar mereda, carry IDR lebih mudah dijual ke asing."
		});
	}
	if (oil != null) {
		const contribution = oil >= 110 ? 11 : oil >= 95 ? 7 : oil >= 80 ? 3 : oil <= 65 ? -5 : 0;
		push({
			id: "oil",
			label: "Brent/WTI",
			valueLabel: `$${oil.toFixed(1)}`,
			contribution,
			polarity: contribution > 1 ? "tekan" : contribution < -1 ? "dukung" : "netral",
			note: contribution > 1 ? "Indonesia net importir BBM. Minyak mahal menekan CAD, subsidi, dan inflasi bergejolak." : "Minyak jinak meringankan fiskal dan tagihan impor."
		});
	}
	if (vixPx != null) {
		const contribution = vixPx >= 28 ? 10 : vixPx >= 20 ? 5 : vixPx <= 14 ? -3 : 0;
		push({
			id: "vix",
			label: "VIX",
			valueLabel: vixPx.toFixed(1),
			contribution,
			polarity: contribution > 1 ? "tekan" : contribution < 0 ? "dukung" : "netral",
			note: vixPx >= 20 ? "Risk-off: dolar diminta, EM dijual tanpa pilih kasih." : "Ekuitas tenang. Jika IDR tetap tertekan, mesinnya yield/minyak — bukan panic."
		});
	}
	const carryContrib = carry < 1 ? 11 : carry < 1.6 ? 6 : carry > 2.6 ? -8 : carry > 2 ? -3 : 1;
	push({
		id: "carry",
		label: "Carry BI−Fed",
		valueLabel: `${carry.toFixed(2)} pp`,
		contribution: carryContrib,
		polarity: carryContrib > 1 ? "tekan" : carryContrib < -1 ? "dukung" : "netral",
		note: carryContrib > 1 ? "Diferensial tipis. Asing tidak dibayar cukup untuk menahan IDR tanpa bantuan SRBI." : "Carry masih ada. Berguna hanya jika premi risiko tidak menelannya."
	});
	if (copperChg != null) {
		const contribution = copperChg >= 10 ? -5 : copperChg <= -10 ? 4 : 0;
		if (contribution !== 0) push({
			id: "copper",
			label: "Tembaga 6 bln",
			valueLabel: `${copperChg >= 0 ? "+" : ""}${copperChg.toFixed(1)}%`,
			contribution,
			polarity: contribution < 0 ? "dukung" : "tekan",
			note: "Tembaga = proksi siklus Tiongkok/industri. Ikut menopang nikel dan selera komoditas ID."
		});
	}
	if (a.cadGdp <= -1.8) push({
		id: "cad",
		label: "CAD/PDB",
		valueLabel: `${a.cadGdp.toFixed(1)}%`,
		contribution: 6,
		polarity: "tekan",
		note: "Defisit transaksi berjalan yang melebar = kebutuhan dolar struktural."
	});
	else if (a.cadGdp >= 0) push({
		id: "cad",
		label: "CAD/PDB",
		valueLabel: `${a.cadGdp.toFixed(1)}%`,
		contribution: -4,
		polarity: "dukung",
		note: "Neraca berjalan longgar menopang kurs."
	});
	if (a.reservesBn < 140) push({
		id: "reserves",
		label: "Cadangan devisa",
		valueLabel: `$${a.reservesBn.toFixed(0)} mr`,
		contribution: 7,
		polarity: "tekan",
		note: "Buffer intervensi menipis. Pasar lebih berani menguji level."
	});
	else if (a.reservesBn > 155) push({
		id: "reserves",
		label: "Cadangan devisa",
		valueLabel: `$${a.reservesBn.toFixed(0)} mr`,
		contribution: -4,
		polarity: "dukung",
		note: "Buffer masih memberi BI amunisi."
	});
	if (idr?.high52 && idrPx != null && idr.low52) {
		const span = idr.high52 - idr.low52;
		if (span > 0) {
			const pos = (idrPx - idr.low52) / span;
			if (pos > .82) push({
				id: "range",
				label: "Posisi 52 minggu",
				valueLabel: `${Math.round(pos * 100)}% ke lemah`,
				contribution: 4,
				polarity: "tekan",
				note: "IDR sudah di zona lemah 52 minggu. Overshoot mudah; intervensi juga lebih sering."
			});
			else if (pos < .25) push({
				id: "range",
				label: "Posisi 52 minggu",
				valueLabel: `${Math.round(pos * 100)}% ke lemah`,
				contribution: -2,
				polarity: "dukung",
				note: "IDR masih jauh dari zona stres 52 minggu."
			});
		}
	}
	score = Math.max(8, Math.min(92, Math.round(score)));
	const label = score >= 72 ? "Tekanan IDR tinggi" : score >= 58 ? "Waspada — condong lemah" : score >= 45 ? "Seimbang, rapuh" : score >= 32 ? "IDR relatif ditopang" : "Angin belakang untuk IDR";
	const bits = [];
	if (ust != null && ust >= 4.7) bits.push("yield dolar tinggi");
	if (oil != null && oil >= 95) bits.push("energi mahal");
	if (vixPx != null && vixPx < 18) bits.push("ekuitas tenang");
	else if (vixPx != null && vixPx >= 22) bits.push("risk-off");
	if (dxyPx != null && dxyPx >= 100) bits.push("dolar kokoh");
	if (copperChg != null && copperChg > 8) bits.push("logam industri kuat");
	if (oilChg != null && oilChg > 8) bits.push("minyak sedang tren naik");
	const headline = bits.length > 0 ? `Rezim: ${bits.slice(0, 3).join(" + ")}.` : "Rezim: data campuran, belum ada mesin tunggal.";
	const goldNote = n(gold?.change6mPct) != null && (gold?.change6mPct ?? 0) < -8 ? " Emas yang mundur selaras dengan yield riil tinggi — bukan sinyal risk-on murni." : "";
	const body = `${headline} Carry BI−Fed sekitar ${carry.toFixed(2)} poin. Skor tekanan ${score}/100 adalah kompas rezim (bukan model bank): semakin tinggi, semakin banyak saluran yang berbaris melemahkan rupiah bersamaan.${goldNote} Pakai sebagai filter skenario, jangan sebagai target kurs.`;
	return {
		score,
		label,
		headline,
		body,
		drivers
	};
}
function computeBands(payload, regime) {
	const spot = n(q(payload, "IDR=X")?.price) ?? 17680;
	const tilt = (regime.score - 50) / 50;
	const band = (horizon, method, width, drift, confidence, caveat) => {
		const base = Math.round(spot * (1 + drift) / 50) * 50;
		const pad = Math.round(spot * width / 50) * 50;
		return {
			horizon,
			method,
			low: Math.round(base - pad),
			base,
			high: Math.round(base + pad),
			confidence,
			caveat
		};
	};
	return [
		band("3 bulan", "Nowcast: harga + carry + minyak + fungsi reaksi BI", .028 + Math.abs(tilt) * .01, tilt * .018, regime.score >= 70 || regime.score <= 30 ? "sedang" : "sedang", "Intervensi BI dan berita geopolitik bisa mematahkan band ini dalam hitungan sesi."),
		band("12 bulan", "Jalur Fed/BI + terms of trade + CAD", .055 + Math.abs(tilt) * .015, tilt * .035 + .012, "sedang", "Asumsi diam-diam: tidak ada krisis cadangan dan tidak ada pemangkasan Fed yang agresif."),
		band("24 bulan", "Siklus kebijakan + komoditas + fiskal", .09, tilt * .04 + .025, "terbatas", "Dua tahun adalah siklus, bukan garis. Cabangkan, jangan kunci.")
	];
}
function computeSectors(payload, a, regime) {
	const oil = n(q(payload, "BZ=F")?.price) ?? n(q(payload, "CL=F")?.price) ?? 80;
	const ust = n(q(payload, "^TNX")?.price) ?? 4.2;
	const vix = n(q(payload, "^VIX")?.price) ?? 18;
	const copperChg = n(q(payload, "HG=F")?.change6mPct) ?? 0;
	const idrWeak = (n(q(payload, "IDR=X")?.change6mPct) ?? 0) > 3 || regime.score >= 60;
	const ratesHigh = ust >= 4.6 || a.biRate >= 5.5;
	return [
		{
			id: "cpo",
			name: "CPO & perkebunan",
			score: (idrWeak ? 18 : 4) + (oil > 95 ? 6 : 0) - 8,
			why: "Pendapatan dolar, biaya sebagian besar rupiah. IDR lemah = angin belakang, selama harga CPO tidak jebol.",
			stance: "campuran"
		},
		{
			id: "coal",
			name: "Batu bara",
			score: (idrWeak ? 14 : 2) + (oil > 100 ? 10 : oil > 85 ? 4 : -4),
			why: "Sering bergerak bersama energi. Menopang devisa saat minyak mahal, tergantung kuota dan Tiongkok.",
			stance: "campuran"
		},
		{
			id: "nickel",
			name: "Nikel & smelter",
			score: copperChg * .6 + (idrWeak ? 8 : 0) - (oil > 100 ? 8 : 0),
			why: "Tiongkok + tembaga sebagai proksi. Energi mahal memakan margin smelter.",
			stance: "campuran"
		},
		{
			id: "bank",
			name: "Perbankan",
			score: (ratesHigh ? 6 : 2) - (ust >= 5 ? 14 : 0) - (vix > 22 ? 6 : 0),
			why: "NIM bisa naik, tetapi mark-to-market SBN dan kualitas kredit tertekan jika UST dan IDR bergejolak.",
			stance: "campuran"
		},
		{
			id: "property",
			name: "Properti",
			score: ratesHigh ? -18 : 4,
			why: "Suku bunga tinggi menahan KPR dan kredit pengembang. Ini saluran domestik paling jelas.",
			stance: "rugi"
		},
		{
			id: "airline",
			name: "Maskapai & aviasi",
			score: oil > 100 ? -22 : oil > 85 ? -10 : 2 - (idrWeak ? 8 : 0),
			why: "Avtur dolar + tiket sebagian rupiah. Minyak mahal dan IDR lemah adalah kombinasi buruk.",
			stance: "rugi"
		},
		{
			id: "retail",
			name: "Ritel barang impor",
			score: idrWeak ? -16 : -2,
			why: "Elektronik, fashion, otomotif CKD: harga modal naik sebelum daya beli bergerak.",
			stance: "rugi"
		},
		{
			id: "export-manuf",
			name: "Manufaktur ekspor",
			score: idrWeak ? 12 : 0 - (a.growth < 4.6 ? 6 : 0),
			why: "IDR lemah menolong daya saing harga, asalkan permintaan global tidak jatuh.",
			stance: "campuran"
		},
		{
			id: "consumer",
			name: "Konsumer staples",
			score: a.inflation > 3.5 ? -8 : 2 - (oil > 100 ? 4 : 0),
			why: "Bisa teruskan harga, tetapi volume rapuh jika beras/CPO/BBM menekan kantong.",
			stance: "campuran"
		},
		{
			id: "infra",
			name: "Infrastruktur",
			score: a.fiscalGdp < -3.2 ? 4 : 0 - (ratesHigh ? 8 : 0),
			why: "Fiskal longgar bisa mengisi proyek; suku bunga tinggi memakan BUMN karya dan semen.",
			stance: "campuran"
		}
	].map((row) => {
		const stance = row.score >= 8 ? "untung" : row.score <= -8 ? "rugi" : "campuran";
		return {
			...row,
			score: Math.round(row.score),
			stance
		};
	}).sort((x, y) => y.score - x.score);
}
function narrativeForCopy(payload, a, regime) {
	const px = (symbol) => n(q(payload, symbol)?.price);
	return {
		fetchedAt: payload.fetchedAt,
		usdIdr: px("IDR=X"),
		dxy: px("DX-Y.NYB"),
		brent: px("BZ=F"),
		wti: px("CL=F"),
		ust10: px("^TNX"),
		vix: px("^VIX"),
		gold: px("GC=F"),
		copper: px("HG=F"),
		irx: px("^IRX"),
		jkse: px("^JKSE"),
		jpy: px("JPY=X"),
		cny: px("CNY=X"),
		assumptions: a,
		regime
	};
}
var APP_NAME = "Neraca";
var APP_TAGLINE = "Desk intelijen makro Indonesia";
var HONESTY = {
	title: "Yang jujur dulu, sebelum pathway",
	points: [
		"Tidak ada pakar — di X, di bank, di IMF — yang bisa meramal titik USD/IDR 1–10 tahun ke depan dengan akurasi 100%. Yang selalu “tepat” di sosmed hampir selalu menang karena seleksi: ramalan yang kena diumumkan, yang meleset dilupakan, dan hampir semua ditulis dalam rentang.",
		"Yang mereka miliki bukan ramalan gaib. Mereka punya peta sebab-akibat, hirarki data, dan kebiasaan membaca rezim. Mereka tahu sektor mana yang diuntungkan JIKA minyak naik, JIKA Fed menahan, JIKA cadangan devisa menipis — bukan “tahu masa depan”.",
		"Horizon 0–3 bulan: nowcast + aliran + intervensi BI. Horizon 1–2 tahun: jalur kebijakan + siklus. Horizon 5–10 tahun: skenario struktural. Mencampur ketiga horizon seolah satu angka adalah cara paling cepat kelihatan pintar dan paling cepat salah.",
		"Pakar institusi (riset bank, IMF Article IV, World Bank IEQ) merevisi. Pakar sinyal sosmed jarang merevisi di depan umum. Kalau Anda ingin meniru yang “terpercaya”, tiru proses revisi, bukan gaya yakin."
	]
};
var LAYERS = [
	{
		id: "rezim",
		k: "01",
		title: "Tentukan rezim, bukan angka",
		lead: "Pertanyaan pertama desk bukan “IDR akan 18.000”. Pertanyaannya: kita sedang di mesin yang mana?",
		body: [
			"Empat saklar yang hampir semua ekonom IDR baca setiap pagi: (1) dolar global — DXY dan imbal hasil UST; (2) selera risiko — VIX, aliran ke emerging market; (3) komoditas Indonesia — minyak, CPO, batu bara, nikel, tembaga; (4) reaksi kebijakan — Fed, BI-Rate, SRBI, intervensi spot/DNDF/NDF.",
			"Rezim yang berbeda menghasilkan ramalan yang bertolak belakang dari data yang sama. Minyak $105 di rezim risk-off (VIX 30) menekan IDR lebih dalam daripada minyak $105 di rezim risk-on (VIX 15) karena yang kedua masih menarik aliran ke aset berisiko, termasuk SBN.",
			"Tulis satu kalimat rezim sebelum menulis angka. Contoh: “Yield dolar tinggi + energi mahal + ekuitas tenang.” Kalimat itu sudah 60% kerja desk."
		]
	},
	{
		id: "hirarki",
		k: "02",
		title: "Hirarki variabel IDR",
		lead: "Tidak semua data setara. Desk yang rapi membagi waktu paruh.",
		body: [
			"Tier 0 — jam hingga hari: DXY, UST 2Y/10Y, VIX, Brent/WTI, berita geopolitik, JISDOR vs pasar, indikasi intervensi BI, IHSG. Ini yang membuat “pakar” di X kelihatan cepat.",
			"Tier 1 — minggu hingga kuartal: jalur Fed (dot plot, CME FedWatch), BI-Rate dan SRBI, kepemilikan asing di SBN/SRBI, inflasi BPS, neraca perdagangan, cadangan devisa, defisit APBN berjalan.",
			"Tier 2 — 2–8 kuartal: current account, terms of trade, pertumbuhan, impuls kredit Tiongkok, harga CPO/batubara/nikel, posisi fiskal, utang luar negeri jangka pendek.",
			"Tier 3 — 5–10 tahun: demografi, bauran energi dan subsidi, hilirisasi nikel, produktivitas, kualitas institusi, peta geopolitik, iklim. Di sini yang ditulis adalah cabang skenario, bukan titik."
		]
	},
	{
		id: "carry",
		k: "03",
		title: "Mesin carry dan diferensial suku bunga",
		lead: "IDR adalah mata uang carry. Selisih BI vs Fed adalah gravitasi, bukan ramalan.",
		body: [
			"Intuisi uncovered interest parity: jika imbal hasil dolar naik lebih cepat daripada rupiah, modal portfolio cenderung keluar, IDR melemah, sampai BI menaikkan suku bunga, menaikkan SRBI, atau menjual dolar.",
			"Yang dibaca: BI-Rate, Fed funds (atau ^IRX sebagai proksi cepat), UST 10Y (harga diskonto semua aset), imbal hasil SBN 10Y, dan selisihnya. Selisih nominal 200 bps belum tentu cukup jika inflasi ID lebih tinggi atau jika premi risiko geopolitik membengkak.",
			"SRBI adalah tuas modern BI: menarik dolar tanpa selalu menaikkan BI-Rate ke ekonomi domestik. Kalau Anda hanya menonton BI-Rate, Anda buta setengah instrumen."
		]
	},
	{
		id: "neraca",
		k: "04",
		title: "Neraca luar negeri dan terms of trade",
		lead: "Nilai tukar jangka menengah adalah cerita surplus/defisit, bukan opini.",
		body: [
			"Indonesia sering “setengah eksportir komoditas, setengah importir energi”. Minyak naik: tagihan BBM dan subsidi membesar, current account menekan IDR. CPO, batu bara, nikel, tembaga naik: devisa masuk, IDR ditopang. Dua arah ini bisa hidup bersamaan — itulah mengapa desk memisahkan “minyak” dari “komoditas non-migas”.",
			"Cadangan devisa dan import cover adalah bensin intervensi. Kalau cadangan menipis sambil defisit transaksi berjalan melebar, pasar menguji BI. Kalau cadangan tebal dan asing masuk SRBI, IDR bisa tenang meski DXY naik.",
			"Neraca perdagangan BPS/Kemendag adalah nowcast kasar current account. Perhatikan volume vs harga: surplus karena harga batu bara ≠ surplus karena daya saing pabrik."
		]
	},
	{
		id: "fiskal",
		k: "05",
		title: "Fiskal, subsidi, dan premi risiko",
		lead: "Defisit APBN dan desain subsidi BBM adalah saluran IDR yang sering dilupakan trader.",
		body: [
			"Minyak mahal + kurs lemah = tekanan subsidi dan belanja. Jika pemerintah menahan harga, defisit yang menanggung. Jika harga diserahkan ke pasar, inflasi yang menanggung — lalu BI yang menahan. Tidak ada jalan gratis.",
			"Utang pemerintah/GDP Indonesia relatif rendah dibanding banyak negara, tapi yang diuji pasar adalah kebutuhan pembiayaan (lelang SBN) dan porsi asing. Saat UST 10Y 5%, SBN harus membayar premi. Itu menekan harga obligasi, menekan perbankan, dan bisa menekan IDR bersamaan.",
			"Kalender politik dan kualitas belanja (program padat anggaran) masuk premi risiko. Desk institusi menuliskannya sebagai “tail”, bukan sebagai ramalan harian."
		]
	},
	{
		id: "pemain",
		k: "06",
		title: "BI adalah pemain, bukan peramal",
		lead: "Ramalan IDR tanpa fungsi reaksi BI adalah fanfiksi.",
		body: [
			"Bank Indonesia menstabilkan, bukan memaksimalkan. Instrumen: BI-Rate, koridor DF/LF, SRBI, intervensi spot, DNDF, NDF offshore, twisto/forward, dan insentif makroprudensial untuk aliran masuk.",
			"Baca siaran pers RDG dan pidato Gubernur sebagai fungsi reaksi: apa yang mereka takutkan minggu ini — inflasi, pertumbuhan, atau kurs? Satu kalimat di press conference sering lebih mahal daripada 40 indikator.",
			"JISDOR vs kurs pasar: gap yang melebar = tekanan, kemungkinan intervensi, atau keduanya. Pakar yang “tahu besok” sering hanya sedang menonton gap itu plus cadangan devisa."
		]
	},
	{
		id: "horizon",
		k: "07",
		title: "Metode per horizon — jangan dicampur",
		lead: "Ini pemisah antara desk serius dan konten prediksi.",
		body: [
			"0–3 bulan: nowcast. Bobot pada harga, aliran, dan kebijakan. Output: arah tekanan + band sempit. Akurasi titik tetap rendah karena intervensi dan berita.",
			"12–24 bulan: jalur kebijakan. Fed terminal rate, inflasi AS, inflasi BPS, BI, terms of trade, CAD. Output: tiga skenario (dasar/keras/lunak) dengan probabilitas kasar yang jumlahnya 100%.",
			"5 tahun: siklus + politik + komoditas. Apakah Tiongkok masih menyerap nikel dan batu bara? Apakah transisi energi memotong batubara lebih cepat dari hilirisasi? Output: cabang, bukan angka sakti.",
			"10 tahun: produktivitas, demografi, iklim, peta industri. Hampir semua “prediksi 10 tahun” yang viral adalah narasi, bukan model. Yang boleh ditulis: apa yang harus benar agar IDR riil menguat, dan apa yang merusaknya."
		]
	},
	{
		id: "output",
		k: "08",
		title: "Format output yang dipakai desk institusi",
		lead: "Meniru pakar = meniru bentuk jawabannya, bukan meramal lebih berani.",
		body: [
			"Selalu: (1) rezim satu kalimat, (2) tiga pendorong utama, (3) band USD/IDR bukan titik, (4) pemicu yang mematahkan tes, (5) siapa diuntungkan/dirugikan, (6) apa yang dicek 7 hari ke depan, (7) tingkat keyakinan.",
			"Jangan tulis “IDR pasti 16.000 di 2027”. Tulis “Dasar 12 bulan 17.200–18.400 jika UST 10Y bertahan 4,5–5,2% dan Brent $85–110; rusak jika Fed memangkas cepat atau jika cadangan devisa jebol”.",
			"Revisi adalah fitur. Tanggal setiap panggilan. Kalau data berubah, panggilan berubah. Itu yang membedakan live database dari opini beku."
		]
	}
];
var DAILY_RITUAL = [
	{
		time: "05:30–06:30",
		title: "Tutup AS / buka Asia",
		queries: [
			"DXY index last close",
			"US 10 year yield",
			"WTI Brent crude",
			"VIX",
			"Fed speakers overnight"
		],
		where: "Yahoo Finance, CME FedWatch, Reuters, Federal Reserve calendar",
		why: "80% arah IDR sesi Asia sudah tertulis di malam AS: dolar, yield, minyak."
	},
	{
		time: "06:30–07:30",
		title: "Kompleks Asia dan Tiongkok",
		queries: [
			"USD/CNH USD/JPY USD/KRW USD/SGD",
			"China credit impulse PMI",
			"LME nickel copper",
			"CPO price BMD MPOB",
			"Newcastle coal price"
		],
		where: "Investing.com, TradingView, MPOB, LME via berita, Argus/IHS ringkasan di riset bank",
		why: "IDR bergerak dalam keranjang Asia. Jika KRW dan THB lemah bersamaan, itu dolar — bukan berita Jakarta."
	},
	{
		time: "07:30–09:00",
		title: "Papan lokal",
		queries: [
			"JISDOR hari ini",
			"kurs Jakarta interbank",
			"IHSG futures / buka",
			"imbal hasil SBN 10Y",
			"berita BI Kemenkeu"
		],
		where: "bi.go.id, idx.co.id, DJPPR, CNBC Indonesia, Kontan, Bisnis.com",
		why: "Bandingkan JISDOR vs pasar. Gap + cadangan devisa = peta intervensi."
	},
	{
		time: "09:00–12:00",
		title: "Aliran dan fiskal",
		queries: [
			"kepemilikan asing SBN SRBI",
			"lelang SUN hasil",
			"cadangan devisa terbaru",
			"neraca perdagangan BPS",
			"inflasi BPS inti vs volatile food"
		],
		where: "bi.go.id statistik, DJPPR, bps.go.id, kemenkeu.go.id",
		why: "Ini daging 1–12 bulan. Trader X jarang menonton lelang SUN; desk bank selalu."
	},
	{
		time: "12:00–16:00",
		title: "Sesi Eropa dan energi",
		queries: [
			"Brent ICE",
			"Middle East shipping Hormuz Red Sea",
			"EURUSD",
			"gas TTF jika relevan ke minyak"
		],
		where: "Reuters, Bloomberg, EIA, ICE via Yahoo CL=F BZ=F",
		why: "Shock minyak masuk ke IDR lewat BBM, subsidi, dan inflasi — bukan lewat ‘sentimen’ semata."
	},
	{
		time: "19:30–21:30",
		title: "Buka AS dan tulis catatan",
		queries: [
			"UST auction / 10Y",
			"FOMC priced in",
			"S&P VIX",
			"tulis rezim 1 kalimat + 3 pemicu"
		],
		where: "Fed, Treasury, CME, catatan desk sendiri",
		why: "Pakar yang kelihatan “selalu siap” hanya rajin menulis. Bukan lebih pintar dari data."
	}
];
var SOURCE_STACK = [
	{
		tier: "Primer — wajib",
		items: [
			{
				name: "Bank Indonesia",
				url: "https://www.bi.go.id",
				use: "BI-Rate, RDG, JISDOR, cadangan devisa, SRBI, survei"
			},
			{
				name: "BPS",
				url: "https://www.bps.go.id",
				use: "Inflasi, PDB, neraca perdagangan, ketenagakerjaan"
			},
			{
				name: "Kemenkeu / DJPPR",
				url: "https://www.kemenkeu.go.id",
				use: "APBN, lelang SBN, realisasi defisit"
			},
			{
				name: "Federal Reserve",
				url: "https://www.federalreserve.gov",
				use: "FFR, SEP/dot plot, pidato, Beige Book"
			},
			{
				name: "US Treasury",
				url: "https://home.treasury.gov",
				use: "Imbal hasil UST, lelang"
			},
			{
				name: "EIA",
				url: "https://www.eia.gov",
				use: "Stok minyak, produksi, outlook"
			}
		]
	},
	{
		tier: "Harga — setiap sesi",
		items: [
			{
				name: "Yahoo Finance USD/IDR",
				url: "https://finance.yahoo.com/quote/IDR=X",
				use: "USDIDR, DXY, WTI, Brent, emas, VIX, UST 10Y"
			},
			{
				name: "CME FedWatch",
				url: "https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html",
				use: "Probabilitas Fed, bukan opini Twitter"
			},
			{
				name: "Investing.com / TradingView",
				url: "https://www.investing.com/currencies/usd-idr",
				use: "Keranjang Asia, CPO, nikel"
			}
		]
	},
	{
		tier: "Riset yang ditiru nada dan metodenya",
		items: [
			{
				name: "IMF Article IV Indonesia",
				url: "https://www.imf.org",
				use: "CAD, REER, utang, skenario 2–5 tahun"
			},
			{
				name: "World Bank IEQ",
				url: "https://www.worldbank.org/en/country/indonesia",
				use: "Pertumbuhan, fiskal, kemiskinan energi"
			},
			{
				name: "BCA / Mandiri / Danamon / UOB / DBS / HSBC research",
				url: "https://www.bca.co.id",
				use: "Format tiga skenario + band IDR — ini yang ditiru"
			},
			{
				name: "LPEM UI, INDEF, CSIS",
				url: "https://www.lpem.org",
				use: "Fiskal, industri, politik ekonomi"
			}
		]
	}
];
var TRANSMISSION = [
	{
		shock: "UST 10Y naik tajam",
		channel: "Harga diskonto global + outflow portfolio dari SBN",
		idr: "Melemah, sering bersamaan dengan DXY naik",
		winners: "Kas dolar, eksportir yang sudah hedging",
		losers: "Perbankan (mark-to-market SBN), properti, emiten USD debt"
	},
	{
		shock: "Fed menahan / hawkish",
		channel: "Diferensial vs BI menyempit, dolar diminta",
		idr: "Tekanan; BI cenderung defensif (SRBI / rate)",
		winners: "Deposan berbunga tinggi, bank dengan LDR longgar",
		losers: "Kredit pemakai bunga, properti, UMKM rate-sensitive"
	},
	{
		shock: "Brent melonjak",
		channel: "Impor BBM + subsidi APBN + inflasi bergejolak",
		idr: "Menekan via CAD dan fiskal; kecuali harga batubara/CPO ikut jauh lebih kuat",
		winners: "Hulu energi, batu bara (sering ikut), sebagian nikel jika demand kuat",
		losers: "Maskapai, logistik, PLN/IPP berbahan bakar, konsumen, fiskal"
	},
	{
		shock: "CPO / batubara / nikel naik",
		channel: "Terms of trade + devisa ekspor",
		idr: "Menopang, terutama jika volume tidak jebol",
		winners: "Perkebunan, tambang, pelayaran curah, APBN bea keluar",
		losers: "Industri makanan (CPO), smelter jika biaya energi ikut naik"
	},
	{
		shock: "VIX lonjak / risk-off",
		channel: "Flight to USD, jual EM indiscriminate",
		idr: "Melemah cepat, sering overshoot, lalu BI intervensi",
		winners: "USD cash, emas (kadang), defensive",
		losers: "IHSG, asing di SBN, emiten beta tinggi"
	},
	{
		shock: "Tiongkok menstimulus kredit",
		channel: "Permintaan komoditas + selera risiko Asia",
		idr: "Menopang lewat nikel, batubara, CPO, tembaga",
		winners: "Tambang, CPO, terkait Tiongkok",
		losers: "Importir Tiongkok yang bersaing harga di pasar lokal"
	},
	{
		shock: "Cadangan devisa turun beruntun",
		channel: "Kapasitas intervensi diragukan",
		idr: "Premi risiko naik, uji level psikologis",
		winners: "Spekulan short IDR (berisiko vs BI)",
		losers: "Semua yang butuh dolar: importir, korporasi unhedged"
	},
	{
		shock: "IDR melemah 3%+ dalam sebulan",
		channel: "Pass-through ke inflasi barang impor 1–2 kuartal",
		idr: "Bisa self-reinforcing sampai BI bertindak",
		winners: "Eksportir murni (tekstil, CPO, tambang) yang biaya lokal",
		losers: "Ritel barang impor, otomotif CKD, farmasi, gadget, wisata outbound"
	}
];
var SEARCH_QUERIES = [
	"JISDOR",
	"cadangan devisa Bank Indonesia",
	"kepemilikan asing SBN",
	"hasil lelang SUN",
	"BI 7-day reverse repo SRBI",
	"BPS inflasi inti",
	"neraca perdagangan Indonesia",
	"current account Indonesia",
	"CME FedWatch tool",
	"US 10 year yield",
	"DXY dollar index",
	"Brent crude OPEC",
	"CPO price MPOB",
	"LME nickel",
	"Newcastle coal",
	"IMF Article IV Indonesia",
	"World Bank Indonesia Economic Quarterly",
	"real effective exchange rate Indonesia"
];
var WHAT_EXPERTS_ACTUALLY_DO = [
	{
		title: "Mereka tidak “tahu” — mereka mempersempit",
		text: "Setiap pagi kerja desk adalah membuang skenario yang tidak konsisten dengan harga semalam. Bukan menambah ramalan baru."
	},
	{
		title: "Mereka membaca fungsi reaksi, bukan kristal",
		text: "Fed dan BI punya mandat. Jika inflasi AS lengket, Fed tidak memangkas hanya karena saham turun. Jika IDR diuji dan cadangan masih ada, BI hampir selalu memilih stabilitas kurs dulu. Itu prediksi kelembagaan, bukan magis."
	},
	{
		title: "Mereka membeli data mahal, lalu mengulang yang gratis",
		text: "Terminal Bloomberg/Refinitiv, aliran primary dealer, survei konsensus. Di internet publik, 70% sinyal yang sama ada di Yahoo, BI, BPS, Fed, CME. Yang mahal adalah kecepatan dan posisi — bukan rumus rahasia."
	},
	{
		title: "Mereka menulis band dan pemicu",
		text: "Riset bank menulis “17.500–18.200, rusak jika UST 10Y > 5,2%”. Itu kelihatan kurang heroik di sosmed, dan justru itu yang bisa diaudit 12 bulan kemudian."
	},
	{
		title: "Mereka hidup dari kalender",
		text: "RDG BI, FOMC, rilis CPI AS, inflasi BPS, neraca perdagangan, lelang SUN, payrolls. “Pakar yang selalu akurat” sering hanya tidak pernah ketinggalan kalender."
	}
];
var TEN_YEAR_BRANCHES = [
	{
		id: "lunak",
		title: "Cabang lunak",
		ifTrue: "Produktivitas naik, hilirisasi nikel bernilai tambah, fiskal tertib, energi bertransisi tanpa meledakkan subsidi, Tiongkok tidak keras jatuh.",
		idr: "IDR riil stabil-menguat; nominal tetap melemah pelan mengikuti inflasi relatif, bukan krisis.",
		sectors: "Manufaktur, infrastruktur berkualitas, bank dengan kredit produktif."
	},
	{
		id: "dasar",
		title: "Cabang dasar",
		ifTrue: "Pertumbuhan 4,5–5,2%, komoditas berfluktuasi, twin deficit terkelola, BI tetap defensif pada kurs.",
		idr: "Melemah bertahap mengikuti diferensial inflasi + premi EM. Lonjakan sesekali, lalu intervensi.",
		sectors: "Campuran: komoditas tetap tulang devisa, domestik mengikuti suku bunga."
	},
	{
		id: "keras",
		title: "Cabang keras",
		ifTrue: "Minyak struktural mahal, UST tinggi lama, Tiongkok lemah, fiskal longgar, cadangan tergerus.",
		idr: "Overshoot berulang, premi risiko menempel, suku bunga domestik tinggi lebih lama.",
		sectors: "Eksportir komoditas vs penderitaan impor/energi/utang valas."
	}
];
var CLAUDE_RULES = `Kamu adalah desk economist Indonesia, bukan dukun angka.

Larangan keras:
- Jangan klaim akurasi 100% atau "pasti".
- Jangan tulis satu titik USD/IDR untuk 5–10 tahun.
- Jangan mencampur horizon (harian dicampur ramalan 10 tahun seolah satu model).
- Jangan mengada-ada angka cadangan devisa, CAD, atau kepemilikan asing jika tidak ada di SNAPSHOT. Tulis "tidak ada di snapshot — perlu dicek BI/BPS".
- Jangan meniru gaya signal seller.

Wajib:
- Mulai dengan SATU kalimat rezim.
- Isi band USD/IDR untuk 3 bulan, 12 bulan, 24 bulan (rendah / dasar / tinggi).
- Untuk 5 tahun dan 10 tahun: TIGA cabang (lunak / dasar / keras) plus syarat yang harus benar.
- Matriks sektor: untung / rugi / campuran, dengan saluran (bukan slogan).
- Tiga pemicu yang mematahkan tes dalam 14 hari.
- Tingkat keyakinan: rendah / sedang / terbatas — tidak pernah "tinggi" untuk horizon > 24 bulan.
- Bahasa: Indonesia, nada riset bank (BCA/Mandiri/IMF), bukan clickbait.

Ingat saluran IDR:
1. Dolar global (DXY, UST) → aliran portfolio.
2. Diferensial suku bunga BI vs Fed + SRBI.
3. Terms of trade: minyak menekan; CPO/batubara/nikel/tembaga menopang.
4. Fiskal & subsidi BBM.
5. Fungsi reaksi BI (intervensi, JISDOR).
6. Premi risiko (VIX, geopolitik, politik).`;
function fmt(value, digits = 2) {
	if (value == null || Number.isNaN(value)) return "n/a";
	return value.toLocaleString("id-ID", {
		maximumFractionDigits: digits,
		minimumFractionDigits: digits
	});
}
function buildOpsiDianPrompt(input) {
	const snap = narrativeForCopy(input.payload, input.assumptions, input.regime);
	const a = input.assumptions;
	const snapshot = `SNAPSHOT LIVE (${snap.fetchedAt})
USD/IDR: ${fmt(snap.usdIdr, 0)}
DXY: ${fmt(snap.dxy, 2)}
Brent: ${fmt(snap.brent, 1)} | WTI: ${fmt(snap.wti, 1)}
UST 10Y: ${fmt(snap.ust10, 3)}%
T-bill 13w (proksi Fed): ${fmt(snap.irx, 3)}%
VIX: ${fmt(snap.vix, 1)}
Emas: ${fmt(snap.gold, 1)} | Tembaga: ${fmt(snap.copper, 3)}
USD/JPY: ${fmt(snap.jpy, 2)} | USD/CNY: ${fmt(snap.cny, 4)}
IHSG: ${fmt(snap.jkse, 0)}
Skor tekanan IDR: ${input.regime.score}/100 — ${input.regime.label}
${input.regime.headline}

Asumsi desk (boleh dikoreksi user):
BI-Rate ${a.biRate}% | Fed ${a.fedRate}% | SBN 10Y ${a.sbn10y}%
Inflasi ${a.inflation}% | CAD/PDB ${a.cadGdp}% | Fiskal/PDB ${a.fiscalGdp}%
Cadangan devisa $${a.reservesBn} mr | PDB ${a.growth}%`;
	const drivers = input.regime.drivers.map((d) => `- ${d.label} ${d.valueLabel} (${d.polarity}, kontribusi ${d.contribution > 0 ? "+" : ""}${d.contribution}): ${d.note}`).join("\n");
	const bands = input.bands.map((b) => `- ${b.horizon}: ${b.low.toLocaleString("id-ID")} – ${b.base.toLocaleString("id-ID")} – ${b.high.toLocaleString("id-ID")} | ${b.method} | keyakinan ${b.confidence}. ${b.caveat}`).join("\n");
	const sectors = input.sectors.map((s) => `- ${s.name}: ${s.stance} (skor ${s.score}). ${s.why}`).join("\n");
	const jalur = LAYERS.map((l) => `### ${l.k} ${l.title}\n${l.lead}\n${l.body.join(" ")}`).join("\n\n");
	const ritual = DAILY_RITUAL.map((r) => `- ${r.time} ${r.title}: cari ${r.queries.join("; ")}. Sumber: ${r.where}. Alasan: ${r.why}`).join("\n");
	const transmisi = TRANSMISSION.map((t) => `- Shock ${t.shock} → ${t.channel} → IDR: ${t.idr}. Untung: ${t.winners}. Rugi: ${t.losers}.`).join("\n");
	const cabang = TEN_YEAR_BRANCHES.map((c) => `- ${c.title}: JIKA ${c.ifTrue} MAKA ${c.idr} Sektor: ${c.sectors}`).join("\n");
	return `# OPERATING SYSTEM DESK MAKRO IDR — NERACA
Simpan ini di OpsiDian. Setiap kali diminta prediksi, jalankan OS ini terhadap data terbaru.

${CLAUDE_RULES}

## ${snapshot}

## Pendorong skor (otomatis)
${drivers}

## Kompas band (bukan target bank)
${bands}

## Heat sektor dari rezim saat ini
${sectors}

## Pathway 8 lapis yang harus diikuti
${jalur}

## Ritual pencarian harian
${ritual}

## Query internet yang diulang
${SEARCH_QUERIES.map((q) => `- ${q}`).join("\n")}

## Peta transmisi shock → IDR → sektor
${transmisi}

## Cabang 5–10 tahun (struktural)
${cabang}

## Tugas sekarang
Tuliskan catatan desk lengkap mengikuti aturan di atas, memakai SNAPSHOT ini. Jika user menambahkan berita baru, revisi band dan sebutkan apa yang berubah.`;
}
function buildPathwayMarkdown(input) {
	return `# Pathway Neraca — live database prediksi IDR

Diperbarui: ${(/* @__PURE__ */ new Date()).toISOString()}

${buildOpsiDianPrompt(input)}
`;
}
var useDeskStore = create()(persist((set, get) => ({
	view: "papan",
	setView: (view) => set({ view }),
	assumptions: DEFAULT_ASSUMPTIONS,
	setAssumption: (key, value) => set({ assumptions: {
		...get().assumptions,
		[key]: value
	} }),
	resetAssumptions: () => set({ assumptions: DEFAULT_ASSUMPTIONS }),
	ritualDone: [],
	toggleRitual: (time) => {
		const cur = get().ritualDone;
		set({ ritualDone: cur.includes(time) ? cur.filter((item) => item !== time) : [...cur, time] });
	},
	lastNote: null,
	lastNoteAt: null,
	setLastNote: (note) => set({
		lastNote: note,
		lastNoteAt: (/* @__PURE__ */ new Date()).toISOString()
	})
}), {
	name: "neraca-desk-v1",
	partialize: (state) => ({
		assumptions: state.assumptions,
		ritualDone: state.ritualDone,
		lastNote: state.lastNote,
		lastNoteAt: state.lastNoteAt
	})
}));
var VIEWS = [
	{
		id: "papan",
		label: "Papan"
	},
	{
		id: "jalur",
		label: "Jalur"
	},
	{
		id: "ritual",
		label: "Ritual"
	},
	{
		id: "transmisi",
		label: "Transmisi"
	},
	{
		id: "skenario",
		label: "Skenario"
	},
	{
		id: "prompt",
		label: "OpsiDian"
	}
];
async function copyText(label, text) {
	await navigator.clipboard.writeText(text);
	toast(label);
}
function downloadMarkdown(filename, text) {
	const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}
function signedTone(value, invert = false) {
	if (value == null || Math.abs(value) < .02) return "text-muted";
	const up = value > 0;
	return (invert ? up : !up) ? "text-down" : "text-up";
}
function QuoteCard({ quote, invert }) {
	if (!quote || quote.price == null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg border border-border bg-bg-elevated p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: "Memuat"
		})
	});
	const digits = quote.unit === "IDR" || quote.unit === "idx" ? 0 : quote.unit === "%" ? 2 : 2;
	const rising = (quote.change1dPct ?? 0) > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-lg border border-border bg-bg-elevated p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-muted",
				children: quote.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 font-mono text-lg tabular-nums text-fg",
				children: [
					quote.unit === "USD" ? "$" : "",
					formatIdNumber(quote.price, { maximumFractionDigits: digits }),
					quote.unit === "%" ? "%" : ""
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("font-mono text-xs tabular-nums", signedTone(quote.change1dPct, invert)),
				children: quote.change1dPct == null ? "—" : formatSignedPct(quote.change1dPct)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
			data: quote.spark,
			rising: invert ? rising : !rising,
			className: "mt-3"
		})]
	});
}
function NumberField({ label, value, step, onChange }) {
	const decimals = step >= 1 ? 0 : step >= .1 ? 1 : 2;
	const shown = Number.isFinite(value) ? Number(value.toFixed(decimals)) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "number",
			step,
			value: shown,
			onChange: (event) => {
				const next = Number(event.target.value);
				onChange(Number.isFinite(next) ? Number(next.toFixed(decimals)) : 0);
			},
			className: "h-11 rounded-md border border-border bg-bg px-3 font-mono text-sm tabular-nums text-fg outline-none focus:border-accent"
		})]
	});
}
function DeskApp({ initialQuotes }) {
	const view = useDeskStore((s) => s.view);
	const setView = useDeskStore((s) => s.setView);
	const assumptions = useDeskStore((s) => s.assumptions);
	const setAssumption = useDeskStore((s) => s.setAssumption);
	const resetAssumptions = useDeskStore((s) => s.resetAssumptions);
	const ritualDone = useDeskStore((s) => s.ritualDone);
	const toggleRitual = useDeskStore((s) => s.toggleRitual);
	const lastNote = useDeskStore((s) => s.lastNote);
	const lastNoteAt = useDeskStore((s) => s.lastNoteAt);
	const setLastNote = useDeskStore((s) => s.setLastNote);
	const quotesQuery = useQuery({
		queryKey: ["macro-quotes"],
		queryFn: () => fetchQuotes(),
		initialData: initialQuotes ?? void 0,
		refetchInterval: 3e5,
		staleTime: 6e4,
		retry: 1
	});
	const payload = quotesQuery.data;
	const regime = (0, import_react.useMemo)(() => payload ? computeRegime(payload, assumptions) : null, [payload, assumptions]);
	const bands = (0, import_react.useMemo)(() => payload && regime ? computeBands(payload, regime) : [], [payload, regime]);
	const sectors = (0, import_react.useMemo)(() => payload && regime ? computeSectors(payload, assumptions, regime) : [], [
		payload,
		assumptions,
		regime
	]);
	const promptText = (0, import_react.useMemo)(() => {
		if (!payload || !regime) return "";
		return buildOpsiDianPrompt({
			payload,
			assumptions,
			regime,
			bands,
			sectors
		});
	}, [
		payload,
		assumptions,
		regime,
		bands,
		sectors
	]);
	const noteMutation = useMutation({
		mutationFn: () => writeDeskNote({ data: { prompt: promptText } }),
		onSuccess: (result) => {
			if (result.ok) {
				setLastNote(result.text);
				toast("Catatan desk siap");
				setView("skenario");
			} else toast(result.error);
		},
		onError: () => toast("Gagal menyusun catatan")
	});
	const idr = payload?.quotes["IDR=X"];
	const idrUp = (idr?.change1dPct ?? 0) > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-widest text-subtle uppercase",
							children: "Desk makro"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl leading-none text-fg sm:text-5xl",
							children: APP_NAME
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 max-w-xl text-sm text-muted",
							children: [APP_TAGLINE, ". Fokus IDR dan dolar, dengan minyak dan aliran global sebagai saluran."]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => quotesQuery.refetch(),
							disabled: quotesQuery.isFetching,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-4", quotesQuery.isFetching && "animate-spin") }), "Perbarui harga"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => {
								if (!promptText) return;
								copyText("Pathway tersalin — tempel di OpsiDian", promptText);
							},
							disabled: !promptText,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Salin OS"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex flex-wrap gap-1",
					"aria-label": "Bagian desk",
					children: VIEWS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setView(item.id),
						className: cn("h-11 shrink-0 rounded-full px-4 text-sm transition-colors duration-[var(--motion-quick)]", view === item.id ? "bg-fg text-bg" : "text-muted hover:bg-bg-subtle hover:text-fg"),
						children: item.label
					}, item.id))
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8",
			children: [
				view === "papan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Papan, {
					loading: quotesQuery.isPending && !payload,
					error: quotesQuery.isError,
					payloadOk: Boolean(payload),
					idr,
					idrUp,
					regime,
					assumptions,
					setAssumption,
					resetAssumptions,
					quotes: payload?.quotes,
					fetchedAt: payload?.fetchedAt,
					sourceNote: payload?.sourceNote,
					degraded: payload?.degraded
				}),
				view === "jalur" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Jalur, {}),
				view === "ritual" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ritual, {
					done: ritualDone,
					toggle: toggleRitual
				}),
				view === "transmisi" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transmisi, { sectors }),
				view === "skenario" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skenario, {
					bands,
					regime,
					lastNote,
					lastNoteAt,
					writing: noteMutation.isPending,
					onWrite: () => {
						if (!promptText) return;
						noteMutation.mutate();
					}
				}),
				view === "prompt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptPane, {
					promptText,
					onDownload: () => {
						if (!payload || !regime) return;
						downloadMarkdown(`neraca-pathway-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.md`, buildPathwayMarkdown({
							payload,
							assumptions,
							regime,
							bands,
							sectors
						}));
						toast("Berkas Markdown diunduh");
					}
				})
			]
		})]
	});
}
function Papan({ loading, error, payloadOk, idr, idrUp, regime, assumptions, setAssumption, resetAssumptions, quotes, fetchedAt, sourceNote, degraded }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-bg-elevated p-5 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-subtle uppercase",
						children: "Kejujuran desk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl text-fg sm:text-3xl",
						children: HONESTY.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 grid gap-3 text-sm leading-relaxed text-muted md:grid-cols-2",
						children: HONESTY.points.map((point) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "border-l border-border-strong pl-3",
							children: point
						}, point.slice(0, 24)))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-[1.2fr_0.8fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-border bg-bg-elevated p-5 sm:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-wide text-muted",
								children: "USD per IDR"
							}), degraded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "warn",
								children: "Sumber sebagian"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Live" })]
						}),
						loading && !idr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-20 animate-pulse rounded-md bg-bg-subtle" }) : error && !payloadOk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-sm text-down",
							children: "Harga gagal dimuat. Coba perbarui."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-5xl tabular-nums leading-none tracking-tight sm:text-6xl",
								children: idr?.price ? formatUsdIdr(idr.price) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap items-center gap-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: cn("inline-flex items-center gap-1 font-mono tabular-nums", signedTone(idr?.change1dPct, true)),
									children: [idrUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "size-4" }), idr?.change1dPct == null ? "hari ini n/a" : `${formatSignedPct(idr.change1dPct)} 1 hari`]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: idr?.change6mPct == null ? "" : `${formatSignedPct(idr.change6mPct)} 6 bulan`
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-subtle",
								children: [
									"Naik = rupiah melemah. 52 minggu ",
									idr?.low52 ? formatUsdIdr(idr.low52) : "—",
									" – ",
									idr?.high52 ? formatUsdIdr(idr.high52) : "—",
									"."
								]
							}),
							idr?.spark?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
								data: idr.spark,
								rising: idrUp,
								className: "mt-6 h-24"
							}) : null
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-subtle",
							children: fetchedAt ? `Cuplikan ${new Date(fetchedAt).toLocaleString("id-ID")}. ${sourceNote ?? ""}` : "Menunggu cuplikan pasar."
						})
					]
				}), regime && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "flex flex-col rounded-xl border border-border bg-bg-elevated p-5 sm:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted",
							children: "Skor tekanan IDR"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-5xl tabular-nums leading-none",
							children: regime.score
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-fg",
							children: regime.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-2 overflow-hidden rounded-full bg-bg-subtle",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("h-full rounded-full transition-[width] duration-[var(--motion-slow)]", regime.score >= 58 ? "bg-down" : regime.score <= 42 ? "bg-up" : "bg-warn"),
								style: { width: `${regime.score}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-relaxed text-muted",
							children: regime.body
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Pendorong yang ditonton desk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Inilah papan yang dibuka setiap pagi. Bukan kristal — hirarki."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid grid-cols-2 gap-3 md:grid-cols-4",
					children: [
						"DX-Y.NYB",
						"BZ=F",
						"^TNX",
						"^VIX",
						"GC=F",
						"HG=F",
						"JPY=X",
						"^JKSE"
					].map((symbol) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteCard, {
						quote: quotes?.[symbol],
						invert: symbol === "BZ=F" || symbol === "^TNX" || symbol === "^VIX" || symbol === "DX-Y.NYB"
					}, symbol))
				})
			] }),
			regime && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Mengapa skor itu"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-3 md:grid-cols-2",
				children: regime.drivers.map((driver) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-lg border border-border bg-bg-elevated p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-fg",
								children: driver.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								tone: driver.polarity === "tekan" ? "down" : driver.polarity === "dukung" ? "up" : "muted",
								children: [
									driver.polarity,
									" ",
									driver.contribution > 0 ? "+" : "",
									driver.contribution
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-lg tabular-nums",
							children: driver.valueLabel
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: driver.note
						})
					]
				}, driver.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-bg-elevated p-5 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Asumsi desk — database hidup Anda"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-2xl text-sm text-muted",
							children: "Harga di atas live. Angka ini tidak selalu publik real-time, jadi Anda yang menjaga: BI-Rate, Fed, SBN, CAD, cadangan. Ubah di sini, skor dan prompt OpsiDian ikut pindah."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: resetAssumptions,
							children: "Pulihkan bawaan"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 grid grid-cols-2 gap-3 md:grid-cols-4",
						children: [
							[
								"biRate",
								"BI-Rate %",
								.25
							],
							[
								"fedRate",
								"Fed funds %",
								.25
							],
							[
								"sbn10y",
								"SBN 10Y %",
								.05
							],
							[
								"inflation",
								"Inflasi %",
								.1
							],
							[
								"cadGdp",
								"CAD / PDB %",
								.1
							],
							[
								"fiscalGdp",
								"Fiskal / PDB %",
								.1
							],
							[
								"reservesBn",
								"Cadangan devisa $ mr",
								1
							],
							[
								"growth",
								"PDB %",
								.1
							]
						].map(([key, label, step]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberField, {
							label,
							value: assumptions[key],
							step,
							onChange: (value) => setAssumption(key, value)
						}, key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-subtle",
						children: "Bawaan mengikuti jalur kebijakan 2026: BI 5,75%, Fed sekitar 3,75%. Koreksi jika RDG atau FOMC sudah pindah."
					})
				]
			})
		]
	});
}
function Jalur() {
	const [open, setOpen] = (0, import_react.useState)(LAYERS[0].id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl",
				children: "Apa yang sebenarnya dilakukan pakar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
				children: "Bukan mantra. Delapan lapis ini adalah sistem operasi yang dipakai desk bank, IMF, dan ekonom yang merevisi — lalu dikemas ulang di sosmed seolah ramalan."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-3 md:grid-cols-2",
				children: WHAT_EXPERTS_ACTUALLY_DO.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-lg border border-border bg-bg-elevated p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium text-fg",
						children: item.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: item.text
					})]
				}, item.title))
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "flex flex-col gap-3",
			children: LAYERS.map((layer) => {
				const active = open === layer.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "overflow-hidden rounded-lg border border-border bg-bg-elevated",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex w-full items-start gap-4 p-4 text-left sm:p-5",
						onClick: () => setOpen(active ? "" : layer.id),
						"aria-expanded": active,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-sm text-subtle",
							children: layer.k
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-display text-xl text-fg",
								children: layer.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-sm text-muted",
								children: layer.lead
							})]
						})]
					}), active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3 border-t border-border px-4 py-4 text-sm leading-relaxed text-muted sm:px-5",
						children: layer.body.map((para) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: para }, para.slice(0, 32)))
					})]
				}, layer.id);
			})
		})]
	});
}
function Ritual({ done, toggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl",
				children: "Ritual pencarian harian"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
				children: "Ini yang mereka ketik di internet, jam berapa, dan mengapa. Centang seperti runbook. Status tersimpan di perangkat Anda."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "flex flex-col gap-3",
				children: DAILY_RITUAL.map((block) => {
					const on = done.includes(block.time);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg border border-border bg-bg-elevated p-4 sm:p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-xs text-subtle",
									children: [block.time, " WIB"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-1 font-display text-xl",
									children: block.title
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => toggle(block.time),
									className: cn("inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm", on ? "bg-up/15 text-up" : "bg-bg-subtle text-muted"),
									children: [on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : null, on ? "Selesai" : "Tandai"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted",
								children: block.why
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs tracking-wide text-subtle uppercase",
								children: "Yang dicari"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 flex flex-wrap gap-2",
								children: block.queries.map((query) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: query }) }, query))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-subtle",
								children: block.where
							})
						]
					}, block.time);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Tumpukan sumber"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-4 md:grid-cols-3",
				children: SOURCE_STACK.map((stack) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-lg border border-border bg-bg-elevated p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium",
						children: stack.tier
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-3",
						children: stack.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: item.url,
							target: "_blank",
							rel: "noreferrer",
							className: "text-sm text-accent underline-offset-2 hover:underline",
							children: item.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: item.use
						})] }, item.name))
					})]
				}, stack.tier))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Query yang diulang"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => void copyText("Daftar pencarian tersalin", SEARCH_QUERIES.join("\n")),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Salin semua"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 columns-1 gap-3 sm:columns-2",
				children: SEARCH_QUERIES.map((query) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "mb-2 break-inside-avoid font-mono text-sm text-muted",
					children: query
				}, query))
			})] })
		]
	});
}
function Transmisi({ sectors }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl",
				children: "Shock → saluran → IDR → sektor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted",
				children: "Inilah cara mereka “tahu” siapa untung dan siapa rugi tanpa meramal harga. Kausal, bukan ramalan titik."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-3",
				children: TRANSMISSION.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-lg border border-border bg-bg-elevated p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-medium text-fg",
							children: row.shock
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: row.channel
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-fg",
							children: row.idr
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid gap-2 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-up",
								children: ["Untung: ", row.winners]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-down",
								children: ["Rugi: ", row.losers]
							})]
						})
					]
				}, row.shock))
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Heat sektor dari rezim hari ini"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Bergerak otomatis dari harga live + asumsi desk. Ini kompas, bukan rekomendasi transaksi."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-3 md:grid-cols-2",
				children: sectors.map((sector) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-lg border border-border bg-bg-elevated p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-medium",
							children: sector.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: sector.stance === "untung" ? "up" : sector.stance === "rugi" ? "down" : "muted",
							children: sector.stance
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: sector.why
					})]
				}, sector.id))
			})
		] })]
	});
}
function Skenario({ bands, regime, lastNote, lastNoteAt, writing, onWrite }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: "Band, bukan ramalan sakti"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted",
					children: "Kompas dari skor rezim. Dipakai sebagai kerangka — desk bank akan menggeser ini setelah RDG, FOMC, atau shock minyak."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-3 md:grid-cols-3",
					children: bands.map((band) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-lg border border-border bg-bg-elevated p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: band.horizon
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 font-mono text-lg tabular-nums text-fg",
								children: [
									formatUsdIdr(band.low),
									" – ",
									formatUsdIdr(band.high)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: ["Dasar ", formatUsdIdr(band.base)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-subtle",
								children: band.method
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: band.caveat
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								tone: "warn",
								className: "mt-3",
								children: ["keyakinan ", band.confidence]
							})
						]
					}, band.horizon))
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Cabang 5–10 tahun"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-2xl text-sm text-muted",
					children: "Tidak ada titik. Hanya syarat. Ini yang ditulis IMF dan World Bank, lalu dipendekkan di X menjadi “tahun depan recesi” atau “tahun depan boom”."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-3 md:grid-cols-3",
					children: TEN_YEAR_BRANCHES.map((branch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-lg border border-border bg-bg-elevated p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-xl",
								children: branch.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Jika. "
								}), branch.ifTrue]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Maka IDR. "
								}), branch.idr]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Sektor. "
								}), branch.sectors]
							})
						]
					}, branch.id))
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-bg-elevated p-5 sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Catatan desk"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xl text-sm text-muted",
						children: "Menyusun memo dari OS + cuplikan live. Dipicu tombol, bukan setiap buka halaman."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: onWrite,
						disabled: writing || !regime,
						children: [writing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, writing ? "Menyusun" : "Susun catatan"]
					})]
				}), lastNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: lastNoteAt ? new Date(lastNoteAt).toLocaleString("id-ID") : ""
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => void copyText("Catatan tersalin", lastNote),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Salin"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-3 max-h-96 overflow-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted",
						children: lastNote
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-sm text-subtle",
					children: "Belum ada memo. Jalankan setelah harga termuat."
				})]
			})
		]
	});
}
function PromptPane({ promptText, onDownload }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: "Masukkan ke OpsiDian / Claude"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
					children: "Ini sistem operasi lengkap: larangan, saluran IDR, ritual, peta transmisi, plus snapshot harga hari ini. Tempel sebagai instruksi tetap, lalu kirim berita baru sebagai revisi — bukan sebagai ramalan baru dari nol."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => {
							if (!promptText) return;
							copyText("OS tersalin", promptText);
						},
						disabled: !promptText,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Salin operating system"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: onDownload,
						disabled: !promptText,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Unduh Markdown"]
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-bg-elevated p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-medium",
					children: "Aturan yang menempel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mt-3 max-h-64 overflow-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted",
					children: CLAUDE_RULES
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-xl border border-border bg-bg p-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-bg-subtle p-4 font-mono text-xs leading-relaxed text-muted",
					children: promptText || "Menunggu cuplikan pasar untuk merakit prompt…"
				})
			})
		]
	});
}
function Home() {
	const initialQuotes = Route.useLoaderData();
	const [client] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskApp, { initialQuotes })
	});
}
//#endregion
export { Home as component };
