# Eksplorasi 3D: Jenis-Jenis Alat Pemadam Api

Aplikasi pembelajaran digital interaktif berteraskan sukatan pelajaran Sains Tingkatan 4 KSSM (Topik Keselamatan Kebakaran & Pemadam Api). Dibina menggunakan React, Vite, Tailwind CSS, dan Three.js (PBR 3D Shaders).

---

## Cara Deploy ke GitHub Pages (Penyelesaian Skrin Putih / Blank Page)

Masalah **skrin putih (blank page)** berlaku kerana pelayan GitHub Pages lazimnya mengehoskan laman web di bawah sub-laluan direktori (contoh: `https://<username>.github.io/<nama-repo>/`). Jika laluan aset (*asset path*) menggunakan laluan mutlak `/assets/...`, pelayar tidak dapat mencari fail JavaScript dan CSS (ralat 404).

Projek ini telah dikonfigurasi dengan:
1. `base: './'` dalam `vite.config.ts` supaya semua fail aset merujuk kepada laluan relatif.
2. Fail `.nojekyll` dalam folder `public/` untuk menghalang enjin Jekyll daripada menyekat fail binaan.
3. Fail salinan `404.html` dijana secara automatik daripada `dist/index.html` semasa `npm run build`.
4. Alur kerja GitHub Actions `.github/workflows/deploy.yml` disediakan secara automatik.

---

### Kaedah 1: Menggunakan GitHub Actions (Paling Mudah & Disyorkan)

1. Tekan / *push* kod repositori ini ke GitHub pada cawangan (*branch*) `main` atau `master`.
2. Di repositori GitHub anda, pergi ke tab **Settings** > **Pages** (di menu kiri).
3. Di bahagian **Build and deployment** > **Source**, pilih **GitHub Actions**.
4. GitHub Actions akan membina (`npm run build`) dan menerbitkan aplikasi secara automatik ke GitHub Pages.

---

### Kaedah 2: Deploy Menggunakan Branch `gh-pages` atau Folder `/dist`

Sekiranya anda membina secara setempat (*local build*):
1. Jalankan arahan:
   ```bash
   npm run build
   ```
2. Folder `dist/` yang terhasil mengandungi semua fail siap bina (`index.html`, `404.html`, `.nojekyll`, dan folder `assets/`).
3. Muat naik isi kandungan folder `dist/` ke cawangan `gh-pages` repositori anda.
4. Di **Settings** > **Pages**, pilih **Deploy from a branch** > branch `gh-pages` > folder `/(root)`.

---

## Menjalankan Projek Secara Setempat (Local Development)

```bash
# Pasang modul kebergantungan
npm install

# Jalankan pelayan pembangunan
npm run dev

# Bina untuk produksi
npm run build
```
