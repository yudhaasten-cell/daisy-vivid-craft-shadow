import type {
  DeskAssumptions,
  HorizonBand,
  LiveQuote,
  PressureDriver,
  QuoteSymbol,
  QuotesPayload,
  RegimeCall,
  SectorCall,
} from "./types";

export const DEFAULT_ASSUMPTIONS: DeskAssumptions = {
  biRate: 5.75,
  fedRate: 3.75,
  sbn10y: 6.9,
  inflation: 3.1,
  cadGdp: -1.1,
  fiscalGdp: -2.8,
  reservesBn: 148,
  growth: 5.0,
};

function q(payload: QuotesPayload, symbol: QuoteSymbol): LiveQuote | undefined {
  return payload.quotes[symbol];
}

function n(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function getQuote(payload: QuotesPayload, symbol: QuoteSymbol) {
  return q(payload, symbol);
}

export function computeRegime(
  payload: QuotesPayload,
  a: DeskAssumptions,
): RegimeCall {
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

  const drivers: PressureDriver[] = [];
  let score = 50;

  const push = (
    driver: Omit<PressureDriver, "contribution"> & { contribution: number },
  ) => {
    score += driver.contribution;
    drivers.push(driver);
  };

  if (dxyPx != null) {
    const contribution =
      dxyPx >= 103 ? 11 : dxyPx >= 100.5 ? 6 : dxyPx >= 98 ? 1 : -7;
    push({
      id: "dxy",
      label: "DXY",
      valueLabel: dxyPx.toFixed(2),
      contribution,
      polarity: contribution > 1 ? "tekan" : contribution < -1 ? "dukung" : "netral",
      note:
        contribution > 1
          ? "Dolar global kuat biasanya menyeret keranjang Asia, termasuk IDR."
          : contribution < -1
            ? "Dolar lunak membuka ruang aliran ke EM."
            : "DXY di zona netral — bukan mesin utama hari ini.",
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
      note:
        contribution > 1
          ? "Imbal hasil dolar tinggi = diskonto EM + saingan SBN. Ini saluran paling mahal untuk IDR."
          : "Yield dolar mereda, carry IDR lebih mudah dijual ke asing.",
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
      note:
        contribution > 1
          ? "Indonesia net importir BBM. Minyak mahal menekan CAD, subsidi, dan inflasi bergejolak."
          : "Minyak jinak meringankan fiskal dan tagihan impor.",
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
      note:
        vixPx >= 20
          ? "Risk-off: dolar diminta, EM dijual tanpa pilih kasih."
          : "Ekuitas tenang. Jika IDR tetap tertekan, mesinnya yield/minyak — bukan panic.",
    });
  }

  const carryContrib = carry < 1 ? 11 : carry < 1.6 ? 6 : carry > 2.6 ? -8 : carry > 2 ? -3 : 1;
  push({
    id: "carry",
    label: "Carry BI−Fed",
    valueLabel: `${carry.toFixed(2)} pp`,
    contribution: carryContrib,
    polarity: carryContrib > 1 ? "tekan" : carryContrib < -1 ? "dukung" : "netral",
    note:
      carryContrib > 1
        ? "Diferensial tipis. Asing tidak dibayar cukup untuk menahan IDR tanpa bantuan SRBI."
        : "Carry masih ada. Berguna hanya jika premi risiko tidak menelannya.",
  });

  if (copperChg != null) {
    const contribution = copperChg >= 10 ? -5 : copperChg <= -10 ? 4 : 0;
    if (contribution !== 0) {
      push({
        id: "copper",
        label: "Tembaga 6 bln",
        valueLabel: `${copperChg >= 0 ? "+" : ""}${copperChg.toFixed(1)}%`,
        contribution,
        polarity: contribution < 0 ? "dukung" : "tekan",
        note: "Tembaga = proksi siklus Tiongkok/industri. Ikut menopang nikel dan selera komoditas ID.",
      });
    }
  }

  if (a.cadGdp <= -1.8) {
    push({
      id: "cad",
      label: "CAD/PDB",
      valueLabel: `${a.cadGdp.toFixed(1)}%`,
      contribution: 6,
      polarity: "tekan",
      note: "Defisit transaksi berjalan yang melebar = kebutuhan dolar struktural.",
    });
  } else if (a.cadGdp >= 0) {
    push({
      id: "cad",
      label: "CAD/PDB",
      valueLabel: `${a.cadGdp.toFixed(1)}%`,
      contribution: -4,
      polarity: "dukung",
      note: "Neraca berjalan longgar menopang kurs.",
    });
  }

  if (a.reservesBn < 140) {
    push({
      id: "reserves",
      label: "Cadangan devisa",
      valueLabel: `$${a.reservesBn.toFixed(0)} mr`,
      contribution: 7,
      polarity: "tekan",
      note: "Buffer intervensi menipis. Pasar lebih berani menguji level.",
    });
  } else if (a.reservesBn > 155) {
    push({
      id: "reserves",
      label: "Cadangan devisa",
      valueLabel: `$${a.reservesBn.toFixed(0)} mr`,
      contribution: -4,
      polarity: "dukung",
      note: "Buffer masih memberi BI amunisi.",
    });
  }

  if (idr?.high52 && idrPx != null && idr.low52) {
    const span = idr.high52 - idr.low52;
    if (span > 0) {
      const pos = (idrPx - idr.low52) / span;
      if (pos > 0.82) {
        push({
          id: "range",
          label: "Posisi 52 minggu",
          valueLabel: `${Math.round(pos * 100)}% ke lemah`,
          contribution: 4,
          polarity: "tekan",
          note: "IDR sudah di zona lemah 52 minggu. Overshoot mudah; intervensi juga lebih sering.",
        });
      } else if (pos < 0.25) {
        push({
          id: "range",
          label: "Posisi 52 minggu",
          valueLabel: `${Math.round(pos * 100)}% ke lemah`,
          contribution: -2,
          polarity: "dukung",
          note: "IDR masih jauh dari zona stres 52 minggu.",
        });
      }
    }
  }

  score = Math.max(8, Math.min(92, Math.round(score)));

  const label =
    score >= 72
      ? "Tekanan IDR tinggi"
      : score >= 58
        ? "Waspada — condong lemah"
        : score >= 45
          ? "Seimbang, rapuh"
          : score >= 32
            ? "IDR relatif ditopang"
            : "Angin belakang untuk IDR";

  const bits: string[] = [];
  if (ust != null && ust >= 4.7) bits.push("yield dolar tinggi");
  if (oil != null && oil >= 95) bits.push("energi mahal");
  if (vixPx != null && vixPx < 18) bits.push("ekuitas tenang");
  else if (vixPx != null && vixPx >= 22) bits.push("risk-off");
  if (dxyPx != null && dxyPx >= 100) bits.push("dolar kokoh");
  if (copperChg != null && copperChg > 8) bits.push("logam industri kuat");
  if (oilChg != null && oilChg > 8) bits.push("minyak sedang tren naik");
  const headline =
    bits.length > 0
      ? `Rezim: ${bits.slice(0, 3).join(" + ")}.`
      : "Rezim: data campuran, belum ada mesin tunggal.";

  const goldNote =
    n(gold?.change6mPct) != null && (gold?.change6mPct ?? 0) < -8
      ? " Emas yang mundur selaras dengan yield riil tinggi — bukan sinyal risk-on murni."
      : "";

  const body = `${headline} Carry BI−Fed sekitar ${carry.toFixed(2)} poin. Skor tekanan ${score}/100 adalah kompas rezim (bukan model bank): semakin tinggi, semakin banyak saluran yang berbaris melemahkan rupiah bersamaan.${goldNote} Pakai sebagai filter skenario, jangan sebagai target kurs.`;

  return { score, label, headline, body, drivers };
}

export function computeBands(
  payload: QuotesPayload,
  regime: RegimeCall,
): HorizonBand[] {
  const spot = n(q(payload, "IDR=X")?.price) ?? 17680;
  const tilt = (regime.score - 50) / 50;

  const band = (
    horizon: string,
    method: string,
    width: number,
    drift: number,
    confidence: HorizonBand["confidence"],
    caveat: string,
  ): HorizonBand => {
    const base = Math.round(spot * (1 + drift) / 50) * 50;
    const pad = Math.round((spot * width) / 50) * 50;
    return {
      horizon,
      method,
      low: Math.round(base - pad),
      base,
      high: Math.round(base + pad),
      confidence,
      caveat,
    };
  };

  return [
    band(
      "3 bulan",
      "Nowcast: harga + carry + minyak + fungsi reaksi BI",
      0.028 + Math.abs(tilt) * 0.01,
      tilt * 0.018,
      regime.score >= 70 || regime.score <= 30 ? "sedang" : "sedang",
      "Intervensi BI dan berita geopolitik bisa mematahkan band ini dalam hitungan sesi.",
    ),
    band(
      "12 bulan",
      "Jalur Fed/BI + terms of trade + CAD",
      0.055 + Math.abs(tilt) * 0.015,
      tilt * 0.035 + 0.012,
      "sedang",
      "Asumsi diam-diam: tidak ada krisis cadangan dan tidak ada pemangkasan Fed yang agresif.",
    ),
    band(
      "24 bulan",
      "Siklus kebijakan + komoditas + fiskal",
      0.09,
      tilt * 0.04 + 0.025,
      "terbatas",
      "Dua tahun adalah siklus, bukan garis. Cabangkan, jangan kunci.",
    ),
  ];
}

export function computeSectors(
  payload: QuotesPayload,
  a: DeskAssumptions,
  regime: RegimeCall,
): SectorCall[] {
  const oil = n(q(payload, "BZ=F")?.price) ?? n(q(payload, "CL=F")?.price) ?? 80;
  const ust = n(q(payload, "^TNX")?.price) ?? 4.2;
  const vix = n(q(payload, "^VIX")?.price) ?? 18;
  const copperChg = n(q(payload, "HG=F")?.change6mPct) ?? 0;
  const idrChg = n(q(payload, "IDR=X")?.change6mPct) ?? 0;
  const idrWeak = idrChg > 3 || regime.score >= 60;
  const ratesHigh = ust >= 4.6 || a.biRate >= 5.5;

  const rows: SectorCall[] = [
    {
      id: "cpo",
      name: "CPO & perkebunan",
      score: (idrWeak ? 18 : 4) + (oil > 95 ? 6 : 0) - 8,
      why: "Pendapatan dolar, biaya sebagian besar rupiah. IDR lemah = angin belakang, selama harga CPO tidak jebol.",
      stance: "campuran",
    },
    {
      id: "coal",
      name: "Batu bara",
      score: (idrWeak ? 14 : 2) + (oil > 100 ? 10 : oil > 85 ? 4 : -4),
      why: "Sering bergerak bersama energi. Menopang devisa saat minyak mahal, tergantung kuota dan Tiongkok.",
      stance: "campuran",
    },
    {
      id: "nickel",
      name: "Nikel & smelter",
      score: copperChg * 0.6 + (idrWeak ? 8 : 0) - (oil > 100 ? 8 : 0),
      why: "Tiongkok + tembaga sebagai proksi. Energi mahal memakan margin smelter.",
      stance: "campuran",
    },
    {
      id: "bank",
      name: "Perbankan",
      score: (ratesHigh ? 6 : 2) - (ust >= 5 ? 14 : 0) - (vix > 22 ? 6 : 0),
      why: "NIM bisa naik, tetapi mark-to-market SBN dan kualitas kredit tertekan jika UST dan IDR bergejolak.",
      stance: "campuran",
    },
    {
      id: "property",
      name: "Properti",
      score: ratesHigh ? -18 : 4,
      why: "Suku bunga tinggi menahan KPR dan kredit pengembang. Ini saluran domestik paling jelas.",
      stance: "rugi",
    },
    {
      id: "airline",
      name: "Maskapai & aviasi",
      score: oil > 100 ? -22 : oil > 85 ? -10 : 2 - (idrWeak ? 8 : 0),
      why: "Avtur dolar + tiket sebagian rupiah. Minyak mahal dan IDR lemah adalah kombinasi buruk.",
      stance: "rugi",
    },
    {
      id: "retail",
      name: "Ritel barang impor",
      score: idrWeak ? -16 : -2,
      why: "Elektronik, fashion, otomotif CKD: harga modal naik sebelum daya beli bergerak.",
      stance: "rugi",
    },
    {
      id: "export-manuf",
      name: "Manufaktur ekspor",
      score: idrWeak ? 12 : 0 - (a.growth < 4.6 ? 6 : 0),
      why: "IDR lemah menolong daya saing harga, asalkan permintaan global tidak jatuh.",
      stance: "campuran",
    },
    {
      id: "consumer",
      name: "Konsumer staples",
      score: a.inflation > 3.5 ? -8 : 2 - (oil > 100 ? 4 : 0),
      why: "Bisa teruskan harga, tetapi volume rapuh jika beras/CPO/BBM menekan kantong.",
      stance: "campuran",
    },
    {
      id: "infra",
      name: "Infrastruktur",
      score: a.fiscalGdp < -3.2 ? 4 : 0 - (ratesHigh ? 8 : 0),
      why: "Fiskal longgar bisa mengisi proyek; suku bunga tinggi memakan BUMN karya dan semen.",
      stance: "campuran",
    },
  ];

  return rows
    .map((row) => {
      const stance: SectorCall["stance"] =
        row.score >= 8 ? "untung" : row.score <= -8 ? "rugi" : "campuran";
      return { ...row, score: Math.round(row.score), stance };
    })
    .sort((x, y) => y.score - x.score);
}

export function narrativeForCopy(
  payload: QuotesPayload,
  a: DeskAssumptions,
  regime: RegimeCall,
) {
  const px = (symbol: QuoteSymbol) => n(q(payload, symbol)?.price);
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
    regime,
  };
}
