export const APP_NAME = "Neraca";
export const APP_TAGLINE = "Desk intelijen makro Indonesia";

export const HONESTY = {
  title: "Yang jujur dulu, sebelum pathway",
  points: [
    "Tidak ada pakar — di X, di bank, di IMF — yang bisa meramal titik USD/IDR 1–10 tahun ke depan dengan akurasi 100%. Yang selalu “tepat” di sosmed hampir selalu menang karena seleksi: ramalan yang kena diumumkan, yang meleset dilupakan, dan hampir semua ditulis dalam rentang.",
    "Yang mereka miliki bukan ramalan gaib. Mereka punya peta sebab-akibat, hirarki data, dan kebiasaan membaca rezim. Mereka tahu sektor mana yang diuntungkan JIKA minyak naik, JIKA Fed menahan, JIKA cadangan devisa menipis — bukan “tahu masa depan”.",
    "Horizon 0–3 bulan: nowcast + aliran + intervensi BI. Horizon 1–2 tahun: jalur kebijakan + siklus. Horizon 5–10 tahun: skenario struktural. Mencampur ketiga horizon seolah satu angka adalah cara paling cepat kelihatan pintar dan paling cepat salah.",
    "Pakar institusi (riset bank, IMF Article IV, World Bank IEQ) merevisi. Pakar sinyal sosmed jarang merevisi di depan umum. Kalau Anda ingin meniru yang “terpercaya”, tiru proses revisi, bukan gaya yakin.",
  ],
};

export const LAYERS = [
  {
    id: "rezim",
    k: "01",
    title: "Tentukan rezim, bukan angka",
    lead: "Pertanyaan pertama desk bukan “IDR akan 18.000”. Pertanyaannya: kita sedang di mesin yang mana?",
    body: [
      "Empat saklar yang hampir semua ekonom IDR baca setiap pagi: (1) dolar global — DXY dan imbal hasil UST; (2) selera risiko — VIX, aliran ke emerging market; (3) komoditas Indonesia — minyak, CPO, batu bara, nikel, tembaga; (4) reaksi kebijakan — Fed, BI-Rate, SRBI, intervensi spot/DNDF/NDF.",
      "Rezim yang berbeda menghasilkan ramalan yang bertolak belakang dari data yang sama. Minyak $105 di rezim risk-off (VIX 30) menekan IDR lebih dalam daripada minyak $105 di rezim risk-on (VIX 15) karena yang kedua masih menarik aliran ke aset berisiko, termasuk SBN.",
      "Tulis satu kalimat rezim sebelum menulis angka. Contoh: “Yield dolar tinggi + energi mahal + ekuitas tenang.” Kalimat itu sudah 60% kerja desk.",
    ],
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
      "Tier 3 — 5–10 tahun: demografi, bauran energi dan subsidi, hilirisasi nikel, produktivitas, kualitas institusi, peta geopolitik, iklim. Di sini yang ditulis adalah cabang skenario, bukan titik.",
    ],
  },
  {
    id: "carry",
    k: "03",
    title: "Mesin carry dan diferensial suku bunga",
    lead: "IDR adalah mata uang carry. Selisih BI vs Fed adalah gravitasi, bukan ramalan.",
    body: [
      "Intuisi uncovered interest parity: jika imbal hasil dolar naik lebih cepat daripada rupiah, modal portfolio cenderung keluar, IDR melemah, sampai BI menaikkan suku bunga, menaikkan SRBI, atau menjual dolar.",
      "Yang dibaca: BI-Rate, Fed funds (atau ^IRX sebagai proksi cepat), UST 10Y (harga diskonto semua aset), imbal hasil SBN 10Y, dan selisihnya. Selisih nominal 200 bps belum tentu cukup jika inflasi ID lebih tinggi atau jika premi risiko geopolitik membengkak.",
      "SRBI adalah tuas modern BI: menarik dolar tanpa selalu menaikkan BI-Rate ke ekonomi domestik. Kalau Anda hanya menonton BI-Rate, Anda buta setengah instrumen.",
    ],
  },
  {
    id: "neraca",
    k: "04",
    title: "Neraca luar negeri dan terms of trade",
    lead: "Nilai tukar jangka menengah adalah cerita surplus/defisit, bukan opini.",
    body: [
      "Indonesia sering “setengah eksportir komoditas, setengah importir energi”. Minyak naik: tagihan BBM dan subsidi membesar, current account menekan IDR. CPO, batu bara, nikel, tembaga naik: devisa masuk, IDR ditopang. Dua arah ini bisa hidup bersamaan — itulah mengapa desk memisahkan “minyak” dari “komoditas non-migas”.",
      "Cadangan devisa dan import cover adalah bensin intervensi. Kalau cadangan menipis sambil defisit transaksi berjalan melebar, pasar menguji BI. Kalau cadangan tebal dan asing masuk SRBI, IDR bisa tenang meski DXY naik.",
      "Neraca perdagangan BPS/Kemendag adalah nowcast kasar current account. Perhatikan volume vs harga: surplus karena harga batu bara ≠ surplus karena daya saing pabrik.",
    ],
  },
  {
    id: "fiskal",
    k: "05",
    title: "Fiskal, subsidi, dan premi risiko",
    lead: "Defisit APBN dan desain subsidi BBM adalah saluran IDR yang sering dilupakan trader.",
    body: [
      "Minyak mahal + kurs lemah = tekanan subsidi dan belanja. Jika pemerintah menahan harga, defisit yang menanggung. Jika harga diserahkan ke pasar, inflasi yang menanggung — lalu BI yang menahan. Tidak ada jalan gratis.",
      "Utang pemerintah/GDP Indonesia relatif rendah dibanding banyak negara, tapi yang diuji pasar adalah kebutuhan pembiayaan (lelang SBN) dan porsi asing. Saat UST 10Y 5%, SBN harus membayar premi. Itu menekan harga obligasi, menekan perbankan, dan bisa menekan IDR bersamaan.",
      "Kalender politik dan kualitas belanja (program padat anggaran) masuk premi risiko. Desk institusi menuliskannya sebagai “tail”, bukan sebagai ramalan harian.",
    ],
  },
  {
    id: "pemain",
    k: "06",
    title: "BI adalah pemain, bukan peramal",
    lead: "Ramalan IDR tanpa fungsi reaksi BI adalah fanfiksi.",
    body: [
      "Bank Indonesia menstabilkan, bukan memaksimalkan. Instrumen: BI-Rate, koridor DF/LF, SRBI, intervensi spot, DNDF, NDF offshore, twisto/forward, dan insentif makroprudensial untuk aliran masuk.",
      "Baca siaran pers RDG dan pidato Gubernur sebagai fungsi reaksi: apa yang mereka takutkan minggu ini — inflasi, pertumbuhan, atau kurs? Satu kalimat di press conference sering lebih mahal daripada 40 indikator.",
      "JISDOR vs kurs pasar: gap yang melebar = tekanan, kemungkinan intervensi, atau keduanya. Pakar yang “tahu besok” sering hanya sedang menonton gap itu plus cadangan devisa.",
    ],
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
      "10 tahun: produktivitas, demografi, iklim, peta industri. Hampir semua “prediksi 10 tahun” yang viral adalah narasi, bukan model. Yang boleh ditulis: apa yang harus benar agar IDR riil menguat, dan apa yang merusaknya.",
    ],
  },
  {
    id: "output",
    k: "08",
    title: "Format output yang dipakai desk institusi",
    lead: "Meniru pakar = meniru bentuk jawabannya, bukan meramal lebih berani.",
    body: [
      "Selalu: (1) rezim satu kalimat, (2) tiga pendorong utama, (3) band USD/IDR bukan titik, (4) pemicu yang mematahkan tes, (5) siapa diuntungkan/dirugikan, (6) apa yang dicek 7 hari ke depan, (7) tingkat keyakinan.",
      "Jangan tulis “IDR pasti 16.000 di 2027”. Tulis “Dasar 12 bulan 17.200–18.400 jika UST 10Y bertahan 4,5–5,2% dan Brent $85–110; rusak jika Fed memangkas cepat atau jika cadangan devisa jebol”.",
      "Revisi adalah fitur. Tanggal setiap panggilan. Kalau data berubah, panggilan berubah. Itu yang membedakan live database dari opini beku.",
    ],
  },
] as const;

export const DAILY_RITUAL = [
  {
    time: "05:30–06:30",
    title: "Tutup AS / buka Asia",
    queries: [
      "DXY index last close",
      "US 10 year yield",
      "WTI Brent crude",
      "VIX",
      "Fed speakers overnight",
    ],
    where: "Yahoo Finance, CME FedWatch, Reuters, Federal Reserve calendar",
    why: "80% arah IDR sesi Asia sudah tertulis di malam AS: dolar, yield, minyak.",
  },
  {
    time: "06:30–07:30",
    title: "Kompleks Asia dan Tiongkok",
    queries: [
      "USD/CNH USD/JPY USD/KRW USD/SGD",
      "China credit impulse PMI",
      "LME nickel copper",
      "CPO price BMD MPOB",
      "Newcastle coal price",
    ],
    where: "Investing.com, TradingView, MPOB, LME via berita, Argus/IHS ringkasan di riset bank",
    why: "IDR bergerak dalam keranjang Asia. Jika KRW dan THB lemah bersamaan, itu dolar — bukan berita Jakarta.",
  },
  {
    time: "07:30–09:00",
    title: "Papan lokal",
    queries: [
      "JISDOR hari ini",
      "kurs Jakarta interbank",
      "IHSG futures / buka",
      "imbal hasil SBN 10Y",
      "berita BI Kemenkeu",
    ],
    where: "bi.go.id, idx.co.id, DJPPR, CNBC Indonesia, Kontan, Bisnis.com",
    why: "Bandingkan JISDOR vs pasar. Gap + cadangan devisa = peta intervensi.",
  },
  {
    time: "09:00–12:00",
    title: "Aliran dan fiskal",
    queries: [
      "kepemilikan asing SBN SRBI",
      "lelang SUN hasil",
      "cadangan devisa terbaru",
      "neraca perdagangan BPS",
      "inflasi BPS inti vs volatile food",
    ],
    where: "bi.go.id statistik, DJPPR, bps.go.id, kemenkeu.go.id",
    why: "Ini daging 1–12 bulan. Trader X jarang menonton lelang SUN; desk bank selalu.",
  },
  {
    time: "12:00–16:00",
    title: "Sesi Eropa dan energi",
    queries: [
      "Brent ICE",
      "Middle East shipping Hormuz Red Sea",
      "EURUSD",
      "gas TTF jika relevan ke minyak",
    ],
    where: "Reuters, Bloomberg, EIA, ICE via Yahoo CL=F BZ=F",
    why: "Shock minyak masuk ke IDR lewat BBM, subsidi, dan inflasi — bukan lewat ‘sentimen’ semata.",
  },
  {
    time: "19:30–21:30",
    title: "Buka AS dan tulis catatan",
    queries: [
      "UST auction / 10Y",
      "FOMC priced in",
      "S&P VIX",
      "tulis rezim 1 kalimat + 3 pemicu",
    ],
    where: "Fed, Treasury, CME, catatan desk sendiri",
    why: "Pakar yang kelihatan “selalu siap” hanya rajin menulis. Bukan lebih pintar dari data.",
  },
] as const;

export const SOURCE_STACK = [
  {
    tier: "Primer — wajib",
    items: [
      { name: "Bank Indonesia", url: "https://www.bi.go.id", use: "BI-Rate, RDG, JISDOR, cadangan devisa, SRBI, survei" },
      { name: "BPS", url: "https://www.bps.go.id", use: "Inflasi, PDB, neraca perdagangan, ketenagakerjaan" },
      { name: "Kemenkeu / DJPPR", url: "https://www.kemenkeu.go.id", use: "APBN, lelang SBN, realisasi defisit" },
      { name: "Federal Reserve", url: "https://www.federalreserve.gov", use: "FFR, SEP/dot plot, pidato, Beige Book" },
      { name: "US Treasury", url: "https://home.treasury.gov", use: "Imbal hasil UST, lelang" },
      { name: "EIA", url: "https://www.eia.gov", use: "Stok minyak, produksi, outlook" },
    ],
  },
  {
    tier: "Harga — setiap sesi",
    items: [
      { name: "Yahoo Finance USD/IDR", url: "https://finance.yahoo.com/quote/IDR=X", use: "USDIDR, DXY, WTI, Brent, emas, VIX, UST 10Y" },
      { name: "CME FedWatch", url: "https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html", use: "Probabilitas Fed, bukan opini Twitter" },
      { name: "Investing.com / TradingView", url: "https://www.investing.com/currencies/usd-idr", use: "Keranjang Asia, CPO, nikel" },
    ],
  },
  {
    tier: "Riset yang ditiru nada dan metodenya",
    items: [
      { name: "IMF Article IV Indonesia", url: "https://www.imf.org", use: "CAD, REER, utang, skenario 2–5 tahun" },
      { name: "World Bank IEQ", url: "https://www.worldbank.org/en/country/indonesia", use: "Pertumbuhan, fiskal, kemiskinan energi" },
      { name: "BCA / Mandiri / Danamon / UOB / DBS / HSBC research", url: "https://www.bca.co.id", use: "Format tiga skenario + band IDR — ini yang ditiru" },
      { name: "LPEM UI, INDEF, CSIS", url: "https://www.lpem.org", use: "Fiskal, industri, politik ekonomi" },
    ],
  },
] as const;

export const TRANSMISSION = [
  {
    shock: "UST 10Y naik tajam",
    channel: "Harga diskonto global + outflow portfolio dari SBN",
    idr: "Melemah, sering bersamaan dengan DXY naik",
    winners: "Kas dolar, eksportir yang sudah hedging",
    losers: "Perbankan (mark-to-market SBN), properti, emiten USD debt",
  },
  {
    shock: "Fed menahan / hawkish",
    channel: "Diferensial vs BI menyempit, dolar diminta",
    idr: "Tekanan; BI cenderung defensif (SRBI / rate)",
    winners: "Deposan berbunga tinggi, bank dengan LDR longgar",
    losers: "Kredit pemakai bunga, properti, UMKM rate-sensitive",
  },
  {
    shock: "Brent melonjak",
    channel: "Impor BBM + subsidi APBN + inflasi bergejolak",
    idr: "Menekan via CAD dan fiskal; kecuali harga batubara/CPO ikut jauh lebih kuat",
    winners: "Hulu energi, batu bara (sering ikut), sebagian nikel jika demand kuat",
    losers: "Maskapai, logistik, PLN/IPP berbahan bakar, konsumen, fiskal",
  },
  {
    shock: "CPO / batubara / nikel naik",
    channel: "Terms of trade + devisa ekspor",
    idr: "Menopang, terutama jika volume tidak jebol",
    winners: "Perkebunan, tambang, pelayaran curah, APBN bea keluar",
    losers: "Industri makanan (CPO), smelter jika biaya energi ikut naik",
  },
  {
    shock: "VIX lonjak / risk-off",
    channel: "Flight to USD, jual EM indiscriminate",
    idr: "Melemah cepat, sering overshoot, lalu BI intervensi",
    winners: "USD cash, emas (kadang), defensive",
    losers: "IHSG, asing di SBN, emiten beta tinggi",
  },
  {
    shock: "Tiongkok menstimulus kredit",
    channel: "Permintaan komoditas + selera risiko Asia",
    idr: "Menopang lewat nikel, batubara, CPO, tembaga",
    winners: "Tambang, CPO, terkait Tiongkok",
    losers: "Importir Tiongkok yang bersaing harga di pasar lokal",
  },
  {
    shock: "Cadangan devisa turun beruntun",
    channel: "Kapasitas intervensi diragukan",
    idr: "Premi risiko naik, uji level psikologis",
    winners: "Spekulan short IDR (berisiko vs BI)",
    losers: "Semua yang butuh dolar: importir, korporasi unhedged",
  },
  {
    shock: "IDR melemah 3%+ dalam sebulan",
    channel: "Pass-through ke inflasi barang impor 1–2 kuartal",
    idr: "Bisa self-reinforcing sampai BI bertindak",
    winners: "Eksportir murni (tekstil, CPO, tambang) yang biaya lokal",
    losers: "Ritel barang impor, otomotif CKD, farmasi, gadget, wisata outbound",
  },
] as const;

export const SECTOR_BASE = [
  { id: "cpo", name: "CPO & perkebunan", tags: ["eksportir", "komoditas"] },
  { id: "coal", name: "Batu bara", tags: ["eksportir", "energi"] },
  { id: "nickel", name: "Nikel & smelter", tags: ["eksportir", "Tiongkok", "energi-intensif"] },
  { id: "bank", name: "Perbankan", tags: ["suku-bunga", "SBN"] },
  { id: "property", name: "Properti", tags: ["suku-bunga", "domestik"] },
  { id: "airline", name: "Maskapai & aviasi", tags: ["minyak", "USD"] },
  { id: "retail", name: "Ritel barang impor", tags: ["USD", "konsumen"] },
  { id: "telco", name: "Telko", tags: ["domestik", "USD-capex"] },
  { id: "infra", name: "Infrastruktur & semen", tags: ["fiskal", "domestik"] },
  { id: "consumer", name: "Konsumer staples", tags: ["inflasi", "CPO"] },
  { id: "tech", name: "Emas / safe haven", tags: ["risiko", "dolar"] },
  { id: "export-manuf", name: "Manufaktur ekspor", tags: ["eksportir", "upah"] },
] as const;

export const SEARCH_QUERIES = [
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
  "real effective exchange rate Indonesia",
] as const;

export const WHAT_EXPERTS_ACTUALLY_DO = [
  {
    title: "Mereka tidak “tahu” — mereka mempersempit",
    text: "Setiap pagi kerja desk adalah membuang skenario yang tidak konsisten dengan harga semalam. Bukan menambah ramalan baru.",
  },
  {
    title: "Mereka membaca fungsi reaksi, bukan kristal",
    text: "Fed dan BI punya mandat. Jika inflasi AS lengket, Fed tidak memangkas hanya karena saham turun. Jika IDR diuji dan cadangan masih ada, BI hampir selalu memilih stabilitas kurs dulu. Itu prediksi kelembagaan, bukan magis.",
  },
  {
    title: "Mereka membeli data mahal, lalu mengulang yang gratis",
    text: "Terminal Bloomberg/Refinitiv, aliran primary dealer, survei konsensus. Di internet publik, 70% sinyal yang sama ada di Yahoo, BI, BPS, Fed, CME. Yang mahal adalah kecepatan dan posisi — bukan rumus rahasia.",
  },
  {
    title: "Mereka menulis band dan pemicu",
    text: "Riset bank menulis “17.500–18.200, rusak jika UST 10Y > 5,2%”. Itu kelihatan kurang heroik di sosmed, dan justru itu yang bisa diaudit 12 bulan kemudian.",
  },
  {
    title: "Mereka hidup dari kalender",
    text: "RDG BI, FOMC, rilis CPI AS, inflasi BPS, neraca perdagangan, lelang SUN, payrolls. “Pakar yang selalu akurat” sering hanya tidak pernah ketinggalan kalender.",
  },
] as const;

export const TEN_YEAR_BRANCHES = [
  {
    id: "lunak",
    title: "Cabang lunak",
    ifTrue: "Produktivitas naik, hilirisasi nikel bernilai tambah, fiskal tertib, energi bertransisi tanpa meledakkan subsidi, Tiongkok tidak keras jatuh.",
    idr: "IDR riil stabil-menguat; nominal tetap melemah pelan mengikuti inflasi relatif, bukan krisis.",
    sectors: "Manufaktur, infrastruktur berkualitas, bank dengan kredit produktif.",
  },
  {
    id: "dasar",
    title: "Cabang dasar",
    ifTrue: "Pertumbuhan 4,5–5,2%, komoditas berfluktuasi, twin deficit terkelola, BI tetap defensif pada kurs.",
    idr: "Melemah bertahap mengikuti diferensial inflasi + premi EM. Lonjakan sesekali, lalu intervensi.",
    sectors: "Campuran: komoditas tetap tulang devisa, domestik mengikuti suku bunga.",
  },
  {
    id: "keras",
    title: "Cabang keras",
    ifTrue: "Minyak struktural mahal, UST tinggi lama, Tiongkok lemah, fiskal longgar, cadangan tergerus.",
    idr: "Overshoot berulang, premi risiko menempel, suku bunga domestik tinggi lebih lama.",
    sectors: "Eksportir komoditas vs penderitaan impor/energi/utang valas.",
  },
] as const;

export const CLAUDE_RULES = `Kamu adalah desk economist Indonesia, bukan dukun angka.

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
