import { createServerFn } from "@tanstack/react-start";
import type { LiveQuote, QuoteSymbol, QuotesPayload, SparkPoint } from "./types";

const SYMBOLS: { symbol: QuoteSymbol; name: string; unit: string }[] = [
  { symbol: "IDR=X", name: "USD/IDR", unit: "IDR" },
  { symbol: "DX-Y.NYB", name: "DXY", unit: "idx" },
  { symbol: "BZ=F", name: "Brent", unit: "USD" },
  { symbol: "CL=F", name: "WTI", unit: "USD" },
  { symbol: "GC=F", name: "Emas", unit: "USD" },
  { symbol: "^TNX", name: "UST 10Y", unit: "%" },
  { symbol: "^IRX", name: "T-bill 13w", unit: "%" },
  { symbol: "^VIX", name: "VIX", unit: "idx" },
  { symbol: "HG=F", name: "Tembaga", unit: "USD" },
  { symbol: "JPY=X", name: "USD/JPY", unit: "JPY" },
  { symbol: "CNY=X", name: "USD/CNY", unit: "CNY" },
  { symbol: "^JKSE", name: "IHSG", unit: "idx" },
];

type YahooChart = {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice?: number;
        fiftyTwoWeekHigh?: number;
        fiftyTwoWeekLow?: number;
        chartPreviousClose?: number;
      };
      timestamp?: number[];
      indicators?: { quote?: Array<{ close?: Array<number | null> }> };
    }>;
  };
};

function downsample(points: SparkPoint[], n = 64): SparkPoint[] {
  if (points.length <= n) return points;
  const step = (points.length - 1) / (n - 1);
  return Array.from({ length: n }, (_, i) => points[Math.round(i * step)]!);
}

function pct(from: number | null, to: number | null): number | null {
  if (from == null || to == null || from === 0) return null;
  return ((to - from) / from) * 100;
}

function pickClose(points: SparkPoint[], offset: number): number | null {
  if (points.length === 0) return null;
  const idx = Math.max(0, points.length - 1 - offset);
  return points[idx]?.v ?? null;
}

async function fetchYahoo(symbol: QuoteSymbol): Promise<LiveQuote> {
  const meta = SYMBOLS.find((item) => item.symbol === symbol)!;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1y&interval=1d`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`yahoo ${symbol} ${res.status}`);
  const body = (await res.json()) as YahooChart;
  const result = body.chart?.result?.[0];
  if (!result) throw new Error(`yahoo empty ${symbol}`);
  const times = result.timestamp ?? [];
  const closes = result.indicators?.quote?.[0]?.close ?? [];
  const points: SparkPoint[] = [];
  for (let i = 0; i < times.length; i++) {
    const v = closes[i];
    const t = times[i];
    if (typeof v === "number" && Number.isFinite(v) && typeof t === "number") {
      points.push({ t: t * 1000, v });
    }
  }
  const price = result.meta?.regularMarketPrice ?? points.at(-1)?.v ?? null;
  return {
    symbol,
    name: meta.name,
    unit: meta.unit,
    price,
    change1dPct: pct(pickClose(points, 1), price),
    change1mPct: pct(pickClose(points, 21), price),
    change6mPct: pct(pickClose(points, 126), price),
    high52: result.meta?.fiftyTwoWeekHigh ?? null,
    low52: result.meta?.fiftyTwoWeekLow ?? null,
    spark: downsample(points),
  };
}

async function fetchErIdr(): Promise<number | null> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { rates?: { IDR?: number } };
    return body.rates?.IDR ?? null;
  } catch {
    return null;
  }
}

export async function loadQuotes(): Promise<QuotesPayload> {
  const settled = await Promise.allSettled(
    SYMBOLS.map((item) => fetchYahoo(item.symbol)),
  );
  const quotes: QuotesPayload["quotes"] = {};
  let ok = 0;
  settled.forEach((item, index) => {
    const symbol = SYMBOLS[index]!.symbol;
    if (item.status === "fulfilled") {
      quotes[symbol] = item.value;
      ok += 1;
    }
  });

  if (!quotes["IDR=X"]?.price) {
    const er = await fetchErIdr();
    if (er) {
      quotes["IDR=X"] = {
        symbol: "IDR=X",
        name: "USD/IDR",
        unit: "IDR",
        price: er,
        change1dPct: null,
        change1mPct: null,
        change6mPct: null,
        high52: null,
        low52: null,
        spark: [],
      };
      ok += 1;
    }
  }

  return {
    fetchedAt: new Date().toISOString(),
    degraded: ok < 6,
    sourceNote:
      ok >= 6
        ? "Harga sesi dari Yahoo Finance; kurs cadangan dari open.er-api bila perlu."
        : "Sebagian sumber harga gagal. Angka yang tampil mungkin tidak lengkap.",
    quotes,
  };
}

export const fetchQuotes = createServerFn({ method: "GET" }).handler(
  async (): Promise<QuotesPayload> => loadQuotes(),
);
