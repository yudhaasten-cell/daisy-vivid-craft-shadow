import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/desk/sparkline";
import { writeDeskNote } from "@/lib/macro/desk-note";
import {
  computeBands,
  computeRegime,
  computeSectors,
} from "@/lib/macro/engine";
import {
  APP_NAME,
  APP_TAGLINE,
  CLAUDE_RULES,
  DAILY_RITUAL,
  HONESTY,
  LAYERS,
  SEARCH_QUERIES,
  SOURCE_STACK,
  TEN_YEAR_BRANCHES,
  TRANSMISSION,
  WHAT_EXPERTS_ACTUALLY_DO,
} from "@/lib/macro/knowledge";
import { buildOpsiDianPrompt, buildPathwayMarkdown } from "@/lib/macro/prompt";
import { fetchQuotes } from "@/lib/macro/quotes";
import { useDeskStore } from "@/lib/macro/store";
import type { DeskAssumptions, DeskView, LiveQuote, QuotesPayload } from "@/lib/macro/types";
import { cn, formatIdNumber, formatSignedPct, formatUsdIdr } from "@/lib/utils";

const VIEWS: { id: DeskView; label: string }[] = [
  { id: "papan", label: "Papan" },
  { id: "jalur", label: "Jalur" },
  { id: "ritual", label: "Ritual" },
  { id: "transmisi", label: "Transmisi" },
  { id: "skenario", label: "Skenario" },
  { id: "prompt", label: "OpsiDian" },
];

async function copyText(label: string, text: string) {
  await navigator.clipboard.writeText(text);
  toast(label);
}

function downloadMarkdown(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function signedTone(value: number | null | undefined, invert = false) {
  if (value == null || Math.abs(value) < 0.02) return "text-muted";
  const up = value > 0;
  const bad = invert ? up : !up;
  return bad ? "text-down" : "text-up";
}

function QuoteCard({
  quote,
  invert,
}: {
  quote?: LiveQuote;
  invert?: boolean;
}) {
  if (!quote || quote.price == null) {
    return (
      <div className="rounded-lg border border-border bg-bg-elevated p-4">
        <p className="text-xs text-muted">Memuat</p>
      </div>
    );
  }
  const digits = quote.unit === "IDR" || quote.unit === "idx" ? 0 : quote.unit === "%" ? 2 : 2;
  const rising = (quote.change1dPct ?? 0) > 0;
  return (
    <article className="rounded-lg border border-border bg-bg-elevated p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-wide text-muted">{quote.name}</p>
          <p className="mt-1 font-mono text-lg tabular-nums text-fg">
            {quote.unit === "USD" ? "$" : ""}
            {formatIdNumber(quote.price, { maximumFractionDigits: digits })}
            {quote.unit === "%" ? "%" : ""}
          </p>
        </div>
        <span className={cn("font-mono text-xs tabular-nums", signedTone(quote.change1dPct, invert))}>
          {quote.change1dPct == null ? "—" : formatSignedPct(quote.change1dPct)}
        </span>
      </div>
      <Sparkline data={quote.spark} rising={invert ? rising : !rising} className="mt-3" />
    </article>
  );
}

function NumberField({
  label,
  value,
  step,
  onChange,
}: {
  label: string;
  value: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const decimals = step >= 1 ? 0 : step >= 0.1 ? 1 : 2;
  const shown = Number.isFinite(value) ? Number(value.toFixed(decimals)) : 0;
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-muted">{label}</span>
      <input
        type="number"
        step={step}
        value={shown}
        onChange={(event) => {
          const next = Number(event.target.value);
          onChange(Number.isFinite(next) ? Number(next.toFixed(decimals)) : 0);
        }}
        className="h-11 rounded-md border border-border bg-bg px-3 font-mono text-sm tabular-nums text-fg outline-none focus:border-accent"
      />
    </label>
  );
}

export function DeskApp({ initialQuotes }: { initialQuotes: QuotesPayload | null }) {
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
    initialData: initialQuotes ?? undefined,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
    retry: 1,
  });

  const payload = quotesQuery.data;
  const regime = useMemo(
    () => (payload ? computeRegime(payload, assumptions) : null),
    [payload, assumptions],
  );
  const bands = useMemo(
    () => (payload && regime ? computeBands(payload, regime) : []),
    [payload, regime],
  );
  const sectors = useMemo(
    () => (payload && regime ? computeSectors(payload, assumptions, regime) : []),
    [payload, assumptions, regime],
  );

  const promptText = useMemo(() => {
    if (!payload || !regime) return "";
    return buildOpsiDianPrompt({ payload, assumptions, regime, bands, sectors });
  }, [payload, assumptions, regime, bands, sectors]);

  const noteMutation = useMutation({
    mutationFn: () => writeDeskNote({ data: { prompt: promptText } }),
    onSuccess: (result) => {
      if (result.ok) {
        setLastNote(result.text);
        toast("Catatan desk siap");
        setView("skenario");
      } else {
        toast(result.error);
      }
    },
    onError: () => toast("Gagal menyusun catatan"),
  });

  const idr = payload?.quotes["IDR=X"];
  const idrUp = (idr?.change1dPct ?? 0) > 0;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs tracking-widest text-subtle uppercase">Desk makro</p>
              <h1 className="font-display text-4xl leading-none text-fg sm:text-5xl">{APP_NAME}</h1>
              <p className="mt-2 max-w-xl text-sm text-muted">{APP_TAGLINE}. Fokus IDR dan dolar, dengan minyak dan aliran global sebagai saluran.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => quotesQuery.refetch()}
                disabled={quotesQuery.isFetching}
              >
                <RefreshCw className={cn("size-4", quotesQuery.isFetching && "animate-spin")} />
                Perbarui harga
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (!promptText) return;
                  void copyText("Pathway tersalin — tempel di OpsiDian", promptText);
                }}
                disabled={!promptText}
              >
                <Copy className="size-4" />
                Salin OS
              </Button>
            </div>
          </div>
          <nav className="flex flex-wrap gap-1" aria-label="Bagian desk">
            {VIEWS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={cn(
                  "h-11 shrink-0 rounded-full px-4 text-sm transition-colors duration-[var(--motion-quick)]",
                  view === item.id
                    ? "bg-fg text-bg"
                    : "text-muted hover:bg-bg-subtle hover:text-fg",
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {view === "papan" && (
          <Papan
            loading={quotesQuery.isPending && !payload}
            error={quotesQuery.isError}
            payloadOk={Boolean(payload)}
            idr={idr}
            idrUp={idrUp}
            regime={regime}
            assumptions={assumptions}
            setAssumption={setAssumption}
            resetAssumptions={resetAssumptions}
            quotes={payload?.quotes}
            fetchedAt={payload?.fetchedAt}
            sourceNote={payload?.sourceNote}
            degraded={payload?.degraded}
          />
        )}
        {view === "jalur" && <Jalur />}
        {view === "ritual" && (
          <Ritual done={ritualDone} toggle={toggleRitual} />
        )}
        {view === "transmisi" && <Transmisi sectors={sectors} />}
        {view === "skenario" && (
          <Skenario
            bands={bands}
            regime={regime}
            lastNote={lastNote}
            lastNoteAt={lastNoteAt}
            writing={noteMutation.isPending}
            onWrite={() => {
              if (!promptText) return;
              noteMutation.mutate();
            }}
          />
        )}
        {view === "prompt" && (
          <PromptPane
            promptText={promptText}
            onDownload={() => {
              if (!payload || !regime) return;
              downloadMarkdown(
                `neraca-pathway-${new Date().toISOString().slice(0, 10)}.md`,
                buildPathwayMarkdown({ payload, assumptions, regime, bands, sectors }),
              );
              toast("Berkas Markdown diunduh");
            }}
          />
        )}
      </main>
    </div>
  );
}

function Papan({
  loading,
  error,
  payloadOk,
  idr,
  idrUp,
  regime,
  assumptions,
  setAssumption,
  resetAssumptions,
  quotes,
  fetchedAt,
  sourceNote,
  degraded,
}: {
  loading: boolean;
  error: boolean;
  payloadOk: boolean;
  idr?: LiveQuote;
  idrUp: boolean;
  regime: ReturnType<typeof computeRegime> | null;
  assumptions: DeskAssumptions;
  setAssumption: (key: keyof DeskAssumptions, value: number) => void;
  resetAssumptions: () => void;
  quotes?: Partial<Record<string, LiveQuote>>;
  fetchedAt?: string;
  sourceNote?: string;
  degraded?: boolean;
}) {
  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-xl border border-border bg-bg-elevated p-5 sm:p-6">
        <p className="text-xs tracking-wide text-subtle uppercase">Kejujuran desk</p>
        <h2 className="mt-2 font-display text-2xl text-fg sm:text-3xl">{HONESTY.title}</h2>
        <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-muted md:grid-cols-2">
          {HONESTY.points.map((point) => (
            <li key={point.slice(0, 24)} className="border-l border-border-strong pl-3">
              {point}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-xl border border-border bg-bg-elevated p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs tracking-wide text-muted">USD per IDR</p>
            {degraded ? <Badge tone="warn">Sumber sebagian</Badge> : <Badge>Live</Badge>}
          </div>
          {loading && !idr ? (
            <div className="mt-6 h-20 animate-pulse rounded-md bg-bg-subtle" />
          ) : error && !payloadOk ? (
            <p className="mt-6 text-sm text-down">Harga gagal dimuat. Coba perbarui.</p>
          ) : (
            <>
              <p className="mt-3 font-display text-5xl tabular-nums leading-none tracking-tight sm:text-6xl">
                {idr?.price ? formatUsdIdr(idr.price) : "—"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className={cn("inline-flex items-center gap-1 font-mono tabular-nums", signedTone(idr?.change1dPct, true))}>
                  {idrUp ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                  {idr?.change1dPct == null ? "hari ini n/a" : `${formatSignedPct(idr.change1dPct)} 1 hari`}
                </span>
                <span className="text-muted">
                  {idr?.change6mPct == null ? "" : `${formatSignedPct(idr.change6mPct)} 6 bulan`}
                </span>
              </div>
              <p className="mt-2 text-xs text-subtle">
                Naik = rupiah melemah. 52 minggu {idr?.low52 ? formatUsdIdr(idr.low52) : "—"} – {idr?.high52 ? formatUsdIdr(idr.high52) : "—"}.
              </p>
              {idr?.spark?.length ? (
                <Sparkline data={idr.spark} rising={idrUp} className="mt-6 h-24" />
              ) : null}
            </>
          )}
          <p className="mt-4 text-xs text-subtle">
            {fetchedAt
              ? `Cuplikan ${new Date(fetchedAt).toLocaleString("id-ID")}. ${sourceNote ?? ""}`
              : "Menunggu cuplikan pasar."}
          </p>
        </article>

        {regime && (
          <article className="flex flex-col rounded-xl border border-border bg-bg-elevated p-5 sm:p-6">
            <p className="text-xs tracking-wide text-muted">Skor tekanan IDR</p>
            <p className="mt-2 font-display text-5xl tabular-nums leading-none">{regime.score}</p>
            <p className="mt-2 text-sm text-fg">{regime.label}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-bg-subtle">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-[var(--motion-slow)]",
                  regime.score >= 58 ? "bg-down" : regime.score <= 42 ? "bg-up" : "bg-warn",
                )}
                style={{ width: `${regime.score}%` }}
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{regime.body}</p>
          </article>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl">Pendorong yang ditonton desk</h2>
        <p className="mt-1 text-sm text-muted">Inilah papan yang dibuka setiap pagi. Bukan kristal — hirarki.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {(["DX-Y.NYB", "BZ=F", "^TNX", "^VIX", "GC=F", "HG=F", "JPY=X", "^JKSE"] as const).map(
            (symbol) => (
              <QuoteCard
                key={symbol}
                quote={quotes?.[symbol]}
                invert={
                  symbol === "BZ=F" ||
                  symbol === "^TNX" ||
                  symbol === "^VIX" ||
                  symbol === "DX-Y.NYB"
                }
              />
            ),
          )}
        </div>
      </section>

      {regime && (
        <section>
          <h2 className="font-display text-2xl">Mengapa skor itu</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {regime.drivers.map((driver) => (
              <article key={driver.id} className="rounded-lg border border-border bg-bg-elevated p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-fg">{driver.label}</p>
                  <Badge
                    tone={
                      driver.polarity === "tekan"
                        ? "down"
                        : driver.polarity === "dukung"
                          ? "up"
                          : "muted"
                    }
                  >
                    {driver.polarity} {driver.contribution > 0 ? "+" : ""}
                    {driver.contribution}
                  </Badge>
                </div>
                <p className="mt-1 font-mono text-lg tabular-nums">{driver.valueLabel}</p>
                <p className="mt-2 text-sm text-muted">{driver.note}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-xl border border-border bg-bg-elevated p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Asumsi desk — database hidup Anda</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted">
              Harga di atas live. Angka ini tidak selalu publik real-time, jadi Anda yang menjaga: BI-Rate, Fed, SBN, CAD, cadangan. Ubah di sini, skor dan prompt OpsiDian ikut pindah.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={resetAssumptions}>
            Pulihkan bawaan
          </Button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {(
            [
              ["biRate", "BI-Rate %", 0.25],
              ["fedRate", "Fed funds %", 0.25],
              ["sbn10y", "SBN 10Y %", 0.05],
              ["inflation", "Inflasi %", 0.1],
              ["cadGdp", "CAD / PDB %", 0.1],
              ["fiscalGdp", "Fiskal / PDB %", 0.1],
              ["reservesBn", "Cadangan devisa $ mr", 1],
              ["growth", "PDB %", 0.1],
            ] as const
          ).map(([key, label, step]) => (
            <NumberField
              key={key}
              label={label}
              value={assumptions[key]}
              step={step}
              onChange={(value) => setAssumption(key, value)}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-subtle">
          Bawaan mengikuti jalur kebijakan 2026: BI 5,75%, Fed sekitar 3,75%. Koreksi jika RDG atau FOMC sudah pindah.
        </p>
      </section>
    </div>
  );
}

function Jalur() {
  const [open, setOpen] = useState<string>(LAYERS[0]!.id);
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="font-display text-3xl">Apa yang sebenarnya dilakukan pakar</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Bukan mantra. Delapan lapis ini adalah sistem operasi yang dipakai desk bank, IMF, dan ekonom yang merevisi — lalu dikemas ulang di sosmed seolah ramalan.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {WHAT_EXPERTS_ACTUALLY_DO.map((item) => (
            <article key={item.title} className="rounded-lg border border-border bg-bg-elevated p-4">
              <h3 className="text-sm font-medium text-fg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-3">
        {LAYERS.map((layer) => {
          const active = open === layer.id;
          return (
            <article key={layer.id} className="overflow-hidden rounded-lg border border-border bg-bg-elevated">
              <button
                type="button"
                className="flex w-full items-start gap-4 p-4 text-left sm:p-5"
                onClick={() => setOpen(active ? "" : layer.id)}
                aria-expanded={active}
              >
                <span className="font-mono text-sm text-subtle">{layer.k}</span>
                <span className="flex-1">
                  <span className="block font-display text-xl text-fg">{layer.title}</span>
                  <span className="mt-1 block text-sm text-muted">{layer.lead}</span>
                </span>
              </button>
              {active && (
                <div className="space-y-3 border-t border-border px-4 py-4 text-sm leading-relaxed text-muted sm:px-5">
                  {layer.body.map((para) => (
                    <p key={para.slice(0, 32)}>{para}</p>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}

function Ritual({
  done,
  toggle,
}: {
  done: string[];
  toggle: (time: string) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="font-display text-3xl">Ritual pencarian harian</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Ini yang mereka ketik di internet, jam berapa, dan mengapa. Centang seperti runbook. Status tersimpan di perangkat Anda.
        </p>
      </section>
      <ol className="flex flex-col gap-3">
        {DAILY_RITUAL.map((block) => {
          const on = done.includes(block.time);
          return (
            <li key={block.time} className="rounded-lg border border-border bg-bg-elevated p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-subtle">{block.time} WIB</p>
                  <h3 className="mt-1 font-display text-xl">{block.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(block.time)}
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm",
                    on ? "bg-up/15 text-up" : "bg-bg-subtle text-muted",
                  )}
                >
                  {on ? <Check className="size-4" /> : null}
                  {on ? "Selesai" : "Tandai"}
                </button>
              </div>
              <p className="mt-3 text-sm text-muted">{block.why}</p>
              <p className="mt-3 text-xs tracking-wide text-subtle uppercase">Yang dicari</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {block.queries.map((query) => (
                  <li key={query}>
                    <Badge>{query}</Badge>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-subtle">{block.where}</p>
            </li>
          );
        })}
      </ol>
      <section>
        <h2 className="font-display text-2xl">Tumpukan sumber</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {SOURCE_STACK.map((stack) => (
            <article key={stack.tier} className="rounded-lg border border-border bg-bg-elevated p-4">
              <h3 className="text-sm font-medium">{stack.tier}</h3>
              <ul className="mt-3 space-y-3">
                {stack.items.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-accent underline-offset-2 hover:underline"
                    >
                      {item.name}
                    </a>
                    <p className="text-xs text-muted">{item.use}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl">Query yang diulang</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void copyText("Daftar pencarian tersalin", SEARCH_QUERIES.join("\n"))}
          >
            <Copy className="size-4" />
            Salin semua
          </Button>
        </div>
        <ul className="mt-4 columns-1 gap-3 sm:columns-2">
          {SEARCH_QUERIES.map((query) => (
            <li key={query} className="mb-2 break-inside-avoid font-mono text-sm text-muted">
              {query}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Transmisi({ sectors }: { sectors: ReturnType<typeof computeSectors> }) {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="font-display text-3xl">Shock → saluran → IDR → sektor</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Inilah cara mereka “tahu” siapa untung dan siapa rugi tanpa meramal harga. Kausal, bukan ramalan titik.
        </p>
        <div className="mt-5 grid gap-3">
          {TRANSMISSION.map((row) => (
            <article key={row.shock} className="rounded-lg border border-border bg-bg-elevated p-4">
              <h3 className="text-sm font-medium text-fg">{row.shock}</h3>
              <p className="mt-2 text-sm text-muted">{row.channel}</p>
              <p className="mt-2 text-sm text-fg">{row.idr}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <p className="text-sm text-up">Untung: {row.winners}</p>
                <p className="text-sm text-down">Rugi: {row.losers}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-display text-2xl">Heat sektor dari rezim hari ini</h2>
        <p className="mt-1 text-sm text-muted">
          Bergerak otomatis dari harga live + asumsi desk. Ini kompas, bukan rekomendasi transaksi.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {sectors.map((sector) => (
            <article key={sector.id} className="rounded-lg border border-border bg-bg-elevated p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-medium">{sector.name}</h3>
                <Badge
                  tone={
                    sector.stance === "untung" ? "up" : sector.stance === "rugi" ? "down" : "muted"
                  }
                >
                  {sector.stance}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted">{sector.why}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Skenario({
  bands,
  regime,
  lastNote,
  lastNoteAt,
  writing,
  onWrite,
}: {
  bands: ReturnType<typeof computeBands>;
  regime: ReturnType<typeof computeRegime> | null;
  lastNote: string | null;
  lastNoteAt: string | null;
  writing: boolean;
  onWrite: () => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="font-display text-3xl">Band, bukan ramalan sakti</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Kompas dari skor rezim. Dipakai sebagai kerangka — desk bank akan menggeser ini setelah RDG, FOMC, atau shock minyak.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {bands.map((band) => (
            <article key={band.horizon} className="rounded-lg border border-border bg-bg-elevated p-4">
              <p className="text-xs text-muted">{band.horizon}</p>
              <p className="mt-2 font-mono text-lg tabular-nums text-fg">
                {formatUsdIdr(band.low)} – {formatUsdIdr(band.high)}
              </p>
              <p className="mt-1 text-sm text-muted">Dasar {formatUsdIdr(band.base)}</p>
              <p className="mt-3 text-xs text-subtle">{band.method}</p>
              <p className="mt-2 text-xs text-muted">{band.caveat}</p>
              <Badge tone="warn" className="mt-3">
                keyakinan {band.confidence}
              </Badge>
            </article>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-display text-2xl">Cabang 5–10 tahun</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Tidak ada titik. Hanya syarat. Ini yang ditulis IMF dan World Bank, lalu dipendekkan di X menjadi “tahun depan recesi” atau “tahun depan boom”.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {TEN_YEAR_BRANCHES.map((branch) => (
            <article key={branch.id} className="rounded-lg border border-border bg-bg-elevated p-4">
              <h3 className="font-display text-xl">{branch.title}</h3>
              <p className="mt-3 text-sm text-muted">
                <span className="text-fg">Jika. </span>
                {branch.ifTrue}
              </p>
              <p className="mt-3 text-sm text-muted">
                <span className="text-fg">Maka IDR. </span>
                {branch.idr}
              </p>
              <p className="mt-3 text-sm text-muted">
                <span className="text-fg">Sektor. </span>
                {branch.sectors}
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="rounded-xl border border-border bg-bg-elevated p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Catatan desk</h2>
            <p className="mt-1 max-w-xl text-sm text-muted">
              Menyusun memo dari OS + cuplikan live. Dipicu tombol, bukan setiap buka halaman.
            </p>
          </div>
          <Button onClick={onWrite} disabled={writing || !regime}>
            {writing ? <LoaderCircle className="size-4 animate-spin" /> : null}
            {writing ? "Menyusun" : "Susun catatan"}
          </Button>
        </div>
        {lastNote ? (
          <div className="mt-5">
            <div className="flex justify-between gap-3">
              <p className="text-xs text-subtle">
                {lastNoteAt ? new Date(lastNoteAt).toLocaleString("id-ID") : ""}
              </p>
              <Button variant="ghost" size="sm" onClick={() => void copyText("Catatan tersalin", lastNote)}>
                <Copy className="size-4" />
                Salin
              </Button>
            </div>
            <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted">
              {lastNote}
            </pre>
          </div>
        ) : (
          <p className="mt-5 text-sm text-subtle">Belum ada memo. Jalankan setelah harga termuat.</p>
        )}
      </section>
    </div>
  );
}

function PromptPane({
  promptText,
  onDownload,
}: {
  promptText: string;
  onDownload: () => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="font-display text-3xl">Masukkan ke OpsiDian / Claude</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Ini sistem operasi lengkap: larangan, saluran IDR, ritual, peta transmisi, plus snapshot harga hari ini. Tempel sebagai instruksi tetap, lalu kirim berita baru sebagai revisi — bukan sebagai ramalan baru dari nol.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={() => {
              if (!promptText) return;
              void copyText("OS tersalin", promptText);
            }}
            disabled={!promptText}
          >
            <Copy className="size-4" />
            Salin operating system
          </Button>
          <Button variant="outline" onClick={onDownload} disabled={!promptText}>
            <Download className="size-4" />
            Unduh Markdown
          </Button>
        </div>
      </section>
      <section className="rounded-xl border border-border bg-bg-elevated p-5">
        <h3 className="text-sm font-medium">Aturan yang menempel</h3>
        <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted">
          {CLAUDE_RULES}
        </pre>
      </section>
      <section className="rounded-xl border border-border bg-bg p-1">
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-bg-subtle p-4 font-mono text-xs leading-relaxed text-muted">
          {promptText || "Menunggu cuplikan pasar untuk merakit prompt…"}
        </pre>
      </section>
    </div>
  );
}
