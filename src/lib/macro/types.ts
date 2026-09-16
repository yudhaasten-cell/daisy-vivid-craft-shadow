export type QuoteSymbol =
  | "IDR=X"
  | "DX-Y.NYB"
  | "CL=F"
  | "BZ=F"
  | "GC=F"
  | "^TNX"
  | "^VIX"
  | "HG=F"
  | "JPY=X"
  | "CNY=X"
  | "^IRX"
  | "^JKSE";

export type SparkPoint = { t: number; v: number };

export type LiveQuote = {
  symbol: QuoteSymbol;
  name: string;
  unit: string;
  price: number | null;
  change1dPct: number | null;
  change1mPct: number | null;
  change6mPct: number | null;
  high52: number | null;
  low52: number | null;
  spark: SparkPoint[];
};

export type QuotesPayload = {
  fetchedAt: string;
  degraded: boolean;
  sourceNote: string;
  quotes: Partial<Record<QuoteSymbol, LiveQuote>>;
};

export type DeskAssumptions = {
  biRate: number;
  fedRate: number;
  sbn10y: number;
  inflation: number;
  cadGdp: number;
  fiscalGdp: number;
  reservesBn: number;
  growth: number;
};

export type PressureDriver = {
  id: string;
  label: string;
  valueLabel: string;
  contribution: number;
  note: string;
  polarity: "tekan" | "dukung" | "netral";
};

export type RegimeCall = {
  score: number;
  label: string;
  headline: string;
  body: string;
  drivers: PressureDriver[];
};

export type HorizonBand = {
  horizon: string;
  method: string;
  low: number;
  base: number;
  high: number;
  confidence: "rendah" | "sedang" | "terbatas";
  caveat: string;
};

export type SectorCall = {
  id: string;
  name: string;
  stance: "untung" | "rugi" | "campuran";
  score: number;
  why: string;
};

export type DeskView = "papan" | "jalur" | "ritual" | "transmisi" | "skenario" | "prompt";
