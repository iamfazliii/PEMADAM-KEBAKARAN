import { ExtinguisherData, ExtinguisherType, Scenario, QuizQuestion } from '../types';

export const EXTINGUISHERS: Record<ExtinguisherType, ExtinguisherData> = {
  water: {
    id: 'water',
    name: 'Air (Water)',
    labelColorMalay: 'Merah (Red)',
    labelHex: '#e11d48',
    tagColor: '#dc2626',
    principle: 'Menyejukkan bahan api dengan menyerap haba pendam yang tinggi serta menurunkan suhu bahan terbakar di bawah takat suhu nyalaan.',
    classes: ['A'],
    suitableDesc: 'Bahan pepejal mudah terbakar: kayu, kertas, fabrik kain, perabot, dan kotak kadbod.',
    dangerDesc: 'BAHAYA RENJATAN MAUT jika disembur pada peralatan elektrik bertenaga! Dilarang pada kebakaran minyak masak / petrol kerana minyak akan memercik dan menyebarkan api.',
    coolingCapacity: 'Sangat Tinggi (Kapasiti haba tentu air 4,200 J/kg°C)',
    components: [
      { name: 'Silinder Bertekanan Merah', desc: 'Menyimpan cecair air di bawah tekanan kerja 12-14 bar dengan lapisan antikarat dalaman.' },
      { name: 'Hos Fleksibel Hitam', desc: 'Hos getah sintetik bertebat tahan lelasan untuk mengarahkan semburan air.' },
      { name: 'Muncung Jet (Jet Nozzle)', desc: 'Muncung tirus memfokuskan aliran air pada jarak balingan 4-6 meter terus ke pangkal api.' },
      { name: 'Tolok Tekanan (Pressure Gauge)', desc: 'Menunjukkan tekanan gas penolak nitrogen; jarum mesti berada dalam zon hijau (12-14 bar).' },
      { name: 'Picu & Tuil Pemegang', desc: 'Pemegang bawah untuk mengangkat tabung, tuil atas ditekan untuk menolak rod injap pelepasan.' },
      { name: 'Pin Keselamatan & Pengunci', desc: 'Mengunci tuil daripada ditekan secara tidak sengaja dan dilengkapi dawai keselamatan pengesahan.' }
    ],
    passSteps: [
      { letter: 'P', title: 'Pull (Tarik)', detail: 'Tarik pin keselamatan bagi memecahkan pengedap plastik atau dawai penentu sah.' },
      { letter: 'A', title: 'Aim (Halakan)', detail: 'Halakan muncung hos tepat ke bahagian dasar / pangkal api (bukan pada bahagian atas lidah api).' },
      { letter: 'S', title: 'Squeeze (Tekan)', detail: 'Tekan tuil picu pelepasan dengan genggaman kukuh untuk membebaskan pancutan air.' },
      { letter: 'S', title: 'Sweep (Layangkan)', detail: 'Layangkan muncung secara mendatar dari satu sisi ke sisi lain sehingga api terpadam sepenuhnya.' }
    ]
  },
  foam: {
    id: 'foam',
    name: 'Buih (Foam / AFFF)',
    labelColorMalay: 'Krim (Cream)',
    labelHex: '#e6c887',
    tagColor: '#d4a34b',
    principle: 'Menyelimut permukaan bahan cecair terbakar bagi memisahkan wap bahan api daripada gas oksigen serta memberikan kesan penyejukan cecair.',
    classes: ['A', 'B'],
    suitableDesc: 'Kelas A (Bahan pepejal seperti kayu/kertas) dan Kelas B (Cecair mudah terbakar: petrol, diesel, cat, minyak tar, dan pelarut organik).',
    dangerDesc: 'TIDAK SESUAI untuk kebakaran peralatan elektrik hidup kerana larutan buih berasaskan air yang boleh mengalirkan elektrik.',
    coolingCapacity: 'Sederhana (Membendung penyebaran wap hidrokarbon)',
    components: [
      { name: 'Silinder Merah Berlabel Krim', desc: 'Mengandungi campuran air dan cecair pekat pembuih filem akueus (AFFF).' },
      { name: 'Muncung Pengudaraan Buih (Aeration Nozzle)', desc: 'Muncung khas berliang udara untuk mencampurkan udara dan larutan bagi menghasilkan buih kembang.' },
      { name: 'Hos Pelepasan Hitam', desc: 'Hos tahan tekanan cecair buih dengan sambungan bebibir tembaga berkualiti.' },
      { name: 'Tolok Tekanan (Gauge)', desc: 'Memastikan gas penolak nitrogen bersedia memancutkan buih secara sekata.' },
      { name: 'Injap & Tuil Keluli Tahan Karat', desc: 'Membuka laluan tiub celup dalaman untuk mengalirkan larutan buih.' },
      { name: 'Pin Pengunci Emas', desc: 'Mencegah pembaziran buih dan mengelakkan picu terbuka semasa dialihkan.' }
    ],
    passSteps: [
      { letter: 'P', title: 'Pull (Tarik)', detail: 'Tarik pin keselamatan dengan menarik gelang cincin logam ke luar.' },
      { letter: 'A', title: 'Aim (Halakan)', detail: 'Halakan ke dinding belakang bekas cecair supaya buih mengalir perlahan menyelimuti minyak (elakkan semburan terus ke tengah tumpahan).' },
      { letter: 'S', title: 'Squeeze (Tekan)', detail: 'Tekan tuil pelepasan untuk memulakan semburan buih AFFF.' },
      { letter: 'S', title: 'Sweep (Layangkan)', detail: 'Gerakkan buih secara perlahan untuk menutup seluruh permukaan cecair tanpa mengocak bahan bakar.' }
    ]
  },
  drypowder: {
    id: 'drypowder',
    name: 'Debu Kering (Dry Powder / ABC)',
    labelColorMalay: 'Biru (Blue)',
    labelHex: '#0284c7',
    tagColor: '#0369a1',
    principle: 'Memutuskan tindak balas rantai kimia nyalaan (chemical chain reaction interruption) dan mengendapkan lapisan kalis oksigen.',
    classes: ['A', 'B', 'C'],
    suitableDesc: 'Pemadam kebakaran serba guna: Kelas A (Pepejal), Kelas B (Cecair), dan Kelas C (Gas mudah terbakar: butana, metana, propana, gas memasak LPG).',
    dangerDesc: 'Meninggalkan sisa habuk serbuk putih/kuning tebal yang boleh merosakkan peralatan optik sensitif, mikrocip pelayan, dan menyebabkan batuk di ruang tertutup.',
    coolingCapacity: 'Rendah (Fokus kepada tindak balas kimia dan pengasingan oksigen)',
    components: [
      { name: 'Silinder Keluli Berlabel Biru', desc: 'Diisi dengan serbuk halus monoamonium fosfat (MAP) atau natrium bikarbonat terfluidum.' },
      { name: 'Hos Bertetulang & Nozel Penyebar', desc: 'Nozel kon melebar untuk menyebarkan kepulan kabus debu halus ke zon nyalaan.' },
      { name: 'Tolok Tekanan Kerja', desc: 'Tolok tembaga yang menunjukkan kestabilan gas nitrogen kering di dalam silinder.' },
      { name: 'Tiub Celup Dalaman (Dip Tube)', desc: 'Tiub dalaman yang menyalurkan debu dari dasar silinder ke atas apabila tuil ditekan.' },
      { name: 'Perhimpunan Injap Loyang', desc: 'Injap pengawal kedap habuk untuk mencegah pembentukan gumpalan serbuk lembap.' },
      { name: 'Pin Penahan Keselamatan', desc: 'Pin gelang keselamatan dengan penanda meterai bomba.' }
    ],
    passSteps: [
      { letter: 'P', title: 'Pull (Tarik)', detail: 'Tarik pin keselamatan keluar untuk melepaskan sekatan tuil picu.' },
      { letter: 'A', title: 'Aim (Halakan)', detail: 'Halakan corong penyebar debu ke bahagian hadapan pangkal nyalaan dari jarak selamat 2-3 meter.' },
      { letter: 'S', title: 'Squeeze (Tekan)', detail: 'Tekan tuil untuk memancutkan kepulan kabus serbuk debu kering serba guna.' },
      { letter: 'S', title: 'Sweep (Layangkan)', detail: 'Layangkan nozel ke kiri dan kanan dengan gerakan mengipas untuk menutup semua lidah api.' }
    ]
  },
  co2: {
    id: 'co2',
    name: 'Karbon Dioksida (CO₂)',
    labelColorMalay: 'Hitam (Black)',
    labelHex: '#27272a',
    tagColor: '#18181b',
    principle: 'Menyesakkan api dengan merendahkan kepekatan gas oksigen di sekitar nyalaan (<15%) serta penyejukan pantas ais kering (-78.5°C) tanpa sisa.',
    classes: ['B', 'E'],
    suitableDesc: 'Kelas E (Peralatan elektrik bertenaga: suis agihan, kabel, komputer, server bilik pelayan) dan Kelas B (Cecair mudah terbakar). Bersih dan tidak konduktif.',
    dangerDesc: 'AMARAN RADANG DINGIN (FROSTBITE): Suhu corong mencecah -78°C! Jangan pegang bahagian corong plastik; pegang HANYA pada pemegang bertebat. Di ruang sempit tanpa pengudaraan, waspada risiko sesak nafas.',
    coolingCapacity: 'Pantas & Bersih (Gas tersejat serta merta meninggalkan kawasan bersih)',
    components: [
      { name: 'Silinder Keluli Tempa Tekanan Tinggi', desc: 'Dinding silinder sangat tebal tanpa sambungan kimpalan untuk menahan gas CO₂ cecair pada 50-60 bar.' },
      { name: 'Corong Pelepasan Lebar (Discharge Horn)', desc: 'Corong hitam berprofil kon besar untuk menukarkan cecair CO₂ kepada gas kembang dan salji sejuk.' },
      { name: 'Genggaman Penebat Haba (Insulated Grip)', desc: 'Pemegang plastik tebal khas untuk melindungi tangan pengendali daripada radang dingin yang parah.' },
      { name: 'Injap Roda / Tuil Beban Berat', desc: 'Injap tembaga tugas berat dengan cakera pelepas tekanan lampau terbina dalam (tanpa tolok biasa).' },
      { name: 'Tiub Logam Sambungan Tekanan Tinggi', desc: 'Menghubungkan injap utama ke corong pelepasan dengan fleksibiliti sudut terarah.' },
      { name: 'Pin Keluli Keselamatan Teguh', desc: 'Pin tugas berat dengan penanda segel pengilang.' }
    ],
    passSteps: [
      { letter: 'P', title: 'Pull (Tarik)', detail: 'Tarik pin keselamatan sambil memastikan jari tidak menyentuh bahagian corong hitam.' },
      { letter: 'A', title: 'Aim (Halakan)', detail: 'Halakan corong pelepasan CO₂ ke dasar api sambil memegang penebat getah/plastik yang disediakan.' },
      { letter: 'S', title: 'Squeeze (Tekan)', detail: 'Picit tuil injap pelepasan ke bawah untuk melepaskan gas sejuk beku bertekanan tinggi.' },
      { letter: 'S', title: 'Sweep (Layangkan)', detail: 'Layangkan ke seluruh zon api sehingga nyalaan lemas dan padam sepenuhnya.' }
    ]
  }
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'sc-1',
    title: 'Kebakaran Bakul Sampah di Makmal Kimia',
    location: 'Makmal Kimia Sekolah Tingkatan 4',
    fuelType: 'Kertas turas, cebisan kadbod dan batang mancis',
    fireClass: 'A',
    description: 'Semasa amali tamat, api sisa mancis telah menyalakan timbunan kertas turas dan kotak kadbod di dalam bakul sampah tepi tingkap. Nyalaan marak tetapi belum menyentuh suis atau peralatan elektrik.',
    correctExtinguisher: 'water',
    acceptableAlternative: 'foam',
    explanation: 'Kebakaran melibatkan bahan pepejal organik (Kelas A). Alat pemadam Air (Water) adalah pilihan paling tepat kerana mempunyai kapasiti haba tinggi untuk menyejukkan bahan terbakar ke bawah takat pencucuhan dan meresap ke dalam gentian kertas bagi mengelakkan penyalaan semula.',
    warningNote: 'Sentiasa pastikan tiada sambungan plag elektrik atau kabel komputer di bawah bakul sampah sebelum menggunakan air.'
  },
  {
    id: 'sc-2',
    title: 'Tumpahan Minyak Pelarut & Cat di Bengkel RBT',
    location: 'Bengkel Reka Bentuk & Teknologi (RBT)',
    fuelType: 'Cecair thiner (pelarut organik) & cat minyak',
    fireClass: 'B',
    description: 'Satu tin thiner tumpah ke lantai bengkel dan disambar percikan api pemotong logam. Cecair sedang membakar dan mula merebak perlahan di atas lantai simen bengkel.',
    correctExtinguisher: 'foam',
    acceptableAlternative: 'drypowder',
    explanation: 'Kebakaran melibatkan cecair mudah terbakar (Kelas B). Alat pemadam Buih (Foam / AFFF) membentuk lapisan selimut filem akueus yang terapung di atas permukaan cecair bagi menyekat bekalan gas oksigen dan membendung wap hidrokarbon.',
    warningNote: 'DILARANG menggunakan Air kerana air lebih tumpat daripada minyak, menyebabkan minyak terapung dan percikan api merebak ke seluruh bengkel!'
  },
  {
    id: 'sc-3',
    title: 'Litar Pintas di Rak Pelayan Komputer (Server Room)',
    location: 'Bilik Server & Data Sekolah',
    fuelType: 'Papan litar elektronik, kabel rangkaian & unit bekalan kuasa (PSU)',
    fireClass: 'E',
    description: 'Satu unit bekalan kuasa pelayan komputer mengalami litar pintas. Asap hitam dan percikan elektrik kelihatan membakar penebat kabel semasa arus elektrik masih mengalir.',
    correctExtinguisher: 'co2',
    acceptableAlternative: 'drypowder',
    explanation: 'Kebakaran peralatan elektrik bertenaga (Kelas E). Alat pemadam Karbon Dioksida (CO₂) adalah yang terbaik kerana merupakan gas bersih tidak konduktif, tidak merosakkan litar mikro berharga, dan tidak meninggalkan sebarang sisa debu atau cecair.',
    warningNote: 'DILARANG menggunakan Air atau Buih kerana kedua-duanya mengalirkan arus elektrik dan membawa bahaya renjatan maut kepada pengguna! Pegang HANYA pemegang bertebat corong CO₂.'
  },
  {
    id: 'sc-4',
    title: 'Kebocoran Gas Butana Terbakar di Dapur Sains Rumah Tangga',
    location: 'Bilik Sains Rumah Tangga (SRT)',
    fuelType: 'Gas butana / propana (LPG)',
    fireClass: 'C',
    description: 'Hujung hos penyambung silinder gas mudah alih mengalami kebocoran dan terbakar dengan nyalaan biru marak di tepi dinding dapur.',
    correctExtinguisher: 'drypowder',
    acceptableAlternative: undefined,
    explanation: 'Kebakaran gas mudah terbakar (Kelas C). Alat pemadam Debu Kering (Dry Powder) amat pantas memutuskan tindak balas rantai kimia zarah gas api. Tindakan serentak ialah menutup injap bekalan gas sekiranya selamat.',
    warningNote: 'Keutamaan nombor satu dalam kebakaran gas ialah menutup punca bekalan gas jika boleh dilakukan dengan selamat sebelum memadamkan api sepenuhnya untuk mengelakkan letupan gas.'
  },
  {
    id: 'sc-5',
    title: 'Minyak Masak Terbakar Marak di Kuali Menggoreng',
    location: 'Kantin Sekolah / Dapur Asrama',
    fuelType: 'Minyak kelapa sawit suhu tinggi (>360°C)',
    fireClass: 'F',
    description: 'Kuali minyak panas ditinggalkan tanpa pengawasan semasa menggoreng dan mencapai suhu nyalaan sendiri (auto-ignition). Nyalaan marak membubung tinggi di atas kuali.',
    correctExtinguisher: 'foam',
    acceptableAlternative: 'co2',
    explanation: 'Kebakaran minyak masak (Kelas F). Selimut api (Fire Blanket) atau alat pemadam khas buih saponifikasi adalah kaedah ideal. Jika menggunakan pemadam biasa, buih/selimut membendung api. PERINGATAN: Menuang air ke dalam minyak panas akan menyebabkan letupan stim (boilover/fireball) serta-merta!',
    warningNote: 'JANGAN sesekali simbah air ke dalam kuali minyak panas! Air akan bertukar menjadi wap stim serta-merta dan meledakkan titisan minyak terbakar ke seluruh ruang.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Berdasarkan piawaian keselamatan makmal Sains KSSM, apakah warna jalur label pengenalan bagi alat pemadam api jenis Air?',
    options: ['Hitam', 'Krim', 'Merah', 'Biru'],
    correctIndex: 2,
    explanation: 'Alat pemadam api jenis Air mempunyai kod jalur label berwarna Merah, sesuai untuk memadamkan kebakaran pepejal organik seperti kayu dan kertas (Kelas A).',
    topic: 'Kod Warna Label'
  },
  {
    id: 2,
    question: 'Apakah warna jalur label bagi alat pemadam api jenis Karbon Dioksida (CO₂)?',
    options: ['Merah', 'Krim', 'Hitam', 'Biru'],
    correctIndex: 2,
    explanation: 'Alat pemadam api Karbon Dioksida (CO₂) mempunyai jalur label berwarna Hitam dan dilengkapi corong pelepasan (horn) berbentuk kon lebar.',
    topic: 'Kod Warna Label'
  },
  {
    id: 3,
    question: 'Mengapakah alat pemadam api jenis Air dilarang sama sekali digunakan untuk memadamkan kebakaran peralatan elektrik yang masih bertenaga?',
    options: [
      'Air akan menyejukkan litar terlalu cepat dan memecahkan cip',
      'Air merupakan konduktor elektrik dan boleh mengakibatkan renjatan elektrik maut',
      'Air akan menghasilkan gas toksik apabila terkena wayar kuprum',
      'Air akan menyebabkan hos pemadam api meletup serta-merta'
    ],
    correctIndex: 1,
    explanation: 'Air mengandungi mineral dan ion terlarut yang mengalirkan arus elektrik. Jika disembur pada perkakasan bertenaga elektrik, arus boleh mengalir balik melalui pancutan air kepada pengguna dan mendatangkan renjatan maut.',
    topic: 'Keselamatan Elektrik'
  },
  {
    id: 4,
    question: 'Apakah prinsip asas tindakan pemadaman utama bagi alat pemadam api jenis Buih (Foam / AFFF)?',
    options: [
      'Menyingkirkan punca bahan api secara kimia',
      'Menyelimut permukaan cecair terbakar bagi menyekat bekalan gas oksigen',
      'Menurunkan tekanan atmosfera di dalam bilik',
      'Mengeluarkan habuk tebal untuk memerangkap api'
    ],
    correctIndex: 1,
    explanation: 'Buih menghasilkan lapisan selimut berterusan (blanketing effect) di atas cecair mudah terbakar, mengasingkan oksigen atmosfera daripada wap bahan api serta memberi kesan penyejukan cecair.',
    topic: 'Prinsip Pemadaman'
  },
  {
    id: 5,
    question: 'Alat pemadam api Debu Kering (Dry Powder) dikenali sebagai alat pemadam serba guna kerana mampu memadamkan kebakaran kelas:',
    options: ['Kelas A, B dan C sahaja', 'Kelas D sahaja', 'Kelas F sahaja', 'Kelas E sahaja'],
    correctIndex: 0,
    explanation: 'Debu Kering (ABC) sangat serba guna kerana serbuk monoamonium fosfat berkesan terhadap bahan pepejal (A), cecair mudah terbakar (B), dan gas memasak / hidrokarbon (C).',
    topic: 'Kelas Kebakaran'
  },
  {
    id: 6,
    question: 'Mengapakah pengendali TIDAK BOLEH memegang corong pelepasan hitam (Horn) semasa memancutkan alat pemadam Karbon Dioksida (CO₂)?',
    options: [
      'Corong tersebut boleh menjadi terlalu panas sehingga melecurkan kulit',
      'Pengembangan gas CO₂ yang mendadak menyebabkan suhu jatuh ke -78°C dan membawa risiko radang dingin (frostbite)',
      'Arus elektromagnet terkumpul di corong dan menghasilkan kilat mikro',
      'Corong akan berputar secara automatik dan boleh mencederakan tangan'
    ],
    correctIndex: 1,
    explanation: 'Apabila gas CO₂ cecair bertekanan tinggi (55 bar) mengembang ke tekanan atmosfera, ia mengalami penurunan suhu drastik (kesan Joule-Thomson) hingga -78.5°C. Menyentuh corong tanpa penebat boleh mengakibatkan kecederaan radang dingin yang teruk.',
    topic: 'Keselamatan Pengendalian'
  },
  {
    id: 7,
    question: 'Apakah maksud huruf "A" dalam prosedur tatacara penggunaan alat pemadam api mengikut kaedah P.A.S.S?',
    options: [
      'Apply (Sapukan ke seluruh kawasan)',
      'Aim (Halakan muncung tepat ke bahagian dasar / pangkal api)',
      'Alert (Jerit meminta pertolongan rakan sekelas)',
      'Activate (Hidupkan suis keselamatan tabung)'
    ],
    correctIndex: 1,
    explanation: 'PASS bermaksud: P = Pull (Tarik pin), A = Aim (Halakan muncung ke pangkal api), S = Squeeze (Tekan tuil), S = Sweep (Layangkan ke kiri dan kanan).',
    topic: 'Kaedah PASS'
  },
  {
    id: 8,
    question: 'Semasa melakukan pemeriksaan berkala alat pemadam api di makmal sekolah, di manakah kedudukan jarum tolok tekanan yang menandakan tabung selamat dan bersedia digunakan?',
    options: [
      'Zon Merah di sebelah kiri (Tekanan Rendah)',
      'Zon Hijau di bahagian tengah (Tekanan Kerja Selamat)',
      'Zon Merah di sebelah kanan (Tekanan Berlebihan)',
      'Tolok mesti sentiasa berada di angka sifar'
    ],
    correctIndex: 1,
    explanation: 'Jarum pada zon hijau menandakan tekanan gas penolak nitrogen mencukupi (biasanya antara 12-14 bar) untuk memancutkan agen pemadam dengan jarak dan tempoh yang ditetapkan pengilang.',
    topic: 'Pemeriksaan & Audit'
  },
  {
    id: 9,
    question: 'Di antara alat pemadam api berikut, yang manakah TIDAK mempunyai tolok tekanan biasa kerana menggunakan silinder tempaan keluli tekanan tinggi?',
    options: [
      'Air (Water)',
      'Buih (Foam)',
      'Debu Kering (Dry Powder)',
      'Karbon Dioksida (CO₂)'
    ],
    correctIndex: 3,
    explanation: 'Silinder CO₂ tidak menggunakan tolok tekanan jarum biasa kerana gas disimpan dalam keadaan cecair bertekanan amat tinggi (sekitar 50-60 bar). Kandungannya ditentukan secara audit penimbangan berat silinder (weight inspection).',
    topic: 'Reka Bentuk Komponen'
  },
  {
    id: 10,
    question: 'Dalam bilik pelayan komputer (Server Room), mengapakah alat pemadam api Karbon Dioksida (CO₂) lebih diutamakan berbanding Debu Kering?',
    options: [
      'Kerana CO₂ adalah gas bersih yang meruap sepenuhnya tanpa meninggalkan sisa serbuk yang merosakkan papan mikrocip sensitif',
      'Kerana CO₂ menghasilkan haruman bunga yang menyenangkan',
      'Kerana debu kering memerlukan air tambahan untuk dipadamkan',
      'Kerana silinder CO₂ lebih ringan daripada tabung air'
    ],
    correctIndex: 0,
    explanation: 'CO₂ adalah agen bersih (clean agent) yang tidak meninggalkan sisa kotoran atau hakisan pada komponen elektronik sensitif, berbanding serbuk debu kering yang sukar dibersihkan dan boleh menyebabkan kakisan litar mikro.',
    topic: 'Aplikasi Praktikal Makmal'
  }
];
