import { CLAUDE_RULES, DAILY_RITUAL, LAYERS, SEARCH_QUERIES, TEN_YEAR_BRANCHES, TRANSMISSION } from "./knowledge";
import type { DeskAssumptions, HorizonBand, QuotesPayload, RegimeCall, SectorCall } from "./types";
import { narrativeForCopy } from "./engine";

function fmt(value: number | null | undefined, digits = 2) {
  if (value == null || Number.isNaN(value)) return "n/a";
  return value.toLocaleString("id-ID", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

export function buildOpsiDianPrompt(input: {
  payload: QuotesPayload;
  assumptions: DeskAssumptions;
  regime: RegimeCall;
  bands: HorizonBand[];
  sectors: SectorCall[];
}) {
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

  const drivers = input.regime.drivers
    .map(
      (d) =>
        `- ${d.label} ${d.valueLabel} (${d.polarity}, kontribusi ${d.contribution > 0 ? "+" : ""}${d.contribution}): ${d.note}`,
    )
    .join("\n");

  const bands = input.bands
    .map(
      (b) =>
        `- ${b.horizon}: ${b.low.toLocaleString("id-ID")} – ${b.base.toLocaleString("id-ID")} – ${b.high.toLocaleString("id-ID")} | ${b.method} | keyakinan ${b.confidence}. ${b.caveat}`,
    )
    .join("\n");

  const sectors = input.sectors
    .map((s) => `- ${s.name}: ${s.stance} (skor ${s.score}). ${s.why}`)
    .join("\n");

  const jalur = LAYERS.map((l) => `### ${l.k} ${l.title}\n${l.lead}\n${l.body.join(" ")}`).join(
    "\n\n",
  );

  const ritual = DAILY_RITUAL.map(
    (r) =>
      `- ${r.time} ${r.title}: cari ${r.queries.join("; ")}. Sumber: ${r.where}. Alasan: ${r.why}`,
  ).join("\n");

  const transmisi = TRANSMISSION.map(
    (t) =>
      `- Shock ${t.shock} → ${t.channel} → IDR: ${t.idr}. Untung: ${t.winners}. Rugi: ${t.losers}.`,
  ).join("\n");

  const cabang = TEN_YEAR_BRANCHES.map(
    (c) => `- ${c.title}: JIKA ${c.ifTrue} MAKA ${c.idr} Sektor: ${c.sectors}`,
  ).join("\n");

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

export function buildPathwayMarkdown(input: {
  payload: QuotesPayload;
  assumptions: DeskAssumptions;
  regime: RegimeCall;
  bands: HorizonBand[];
  sectors: SectorCall[];
}) {
  return `# Pathway Neraca — live database prediksi IDR

Diperbarui: ${new Date().toISOString()}

${buildOpsiDianPrompt(input)}
`;
}
