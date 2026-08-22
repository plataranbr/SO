# Stock Opname — Plataran Indonesia

Webapp stock opname untuk dipakai di lapangan (HP), berjalan penuh tanpa internet setelah dibuka sekali.

## Isi repo

| File | Fungsi | Perlu diubah? |
|---|---|---|
| `index.html` | Seluruh aplikasi (tampilan + logika) | Hanya saat ada perbaikan/fitur baru |
| `sw.js` | Membuat app tetap bisa dibuka tanpa sinyal | Naikkan nomor `CACHE` setiap `index.html` berubah |
| `manifest.json` | Agar app bisa ditambahkan ke layar utama HP | Tidak |
| `master/<UNIT>.json` | Daftar item per unit | **Ya — diganti tiap bulan** |

## Pemasangan (sekali saja)

1. Buat repo baru di GitHub, pilih **Public**.
2. **Add file → Upload files** → unggah `index.html`, `sw.js`, `manifest.json`.
3. Buat folder `master` (saat upload, ketik `master/PLD.json` pada nama file) → unggah file master tiap unit.
4. **Settings → Pages** → Source: *Deploy from a branch*, Branch: `main`, folder `/ (root)` → **Save**.
5. Tunggu ±2 menit. Alamat app: `https://<username>.github.io/<nama-repo>/`

## Pekerjaan rutin tiap bulan (Cost Control)

1. Buka app → **Import Master Item (SOH)** → pilih unit, isi periode (contoh `2026-07`), pilih file Onhand VHP
   (`.txt` untuk VHP desktop, `.csv` untuk VHP cloud).
2. Periksa tabel hasil parsing yang muncul (jumlah item per kategori dan per store).
3. Tekan **Buat File Master untuk Di-upload ke Server** → dihasilkan `<UNIT>.json`.
4. Unggah file itu ke folder `master/` di repo (menimpa file bulan lalu).
5. Beritahu tim untuk menekan **Ambil Master dari Server** saat masih ada sinyal.

## Pekerjaan petugas SO

1. Buka link app **saat masih ada sinyal**. Disarankan: menu browser → *Tambahkan ke Layar Utama*.
2. **Ambil Master dari Server** → pilih unit → Ambil & Simpan.
3. **Mulai / Lanjutkan Stock Opname** → pilih unit dan store bagiannya → hitung.
   Sejak titik ini app tidak butuh internet lagi.
4. Selesai → **Download Excel (.xlsx)** dan **Download Semua Foto (.zip)** → kirim ke Cost Control.

## Catatan penting

- **File master tidak memuat harga.** Repo GitHub Pages bersifat publik, sehingga harga beli sengaja
  tidak disertakan. Kolom `Price` dan `Amount` pada file export akan berisi 0 dan diisi oleh makro
  Report Cost Control lewat pencocokan ArtNo.
- **Setiap kali `index.html` diperbarui, naikkan `CACHE` di `sw.js`** (`so-plataran-v1` → `v2` → dst).
  Bila tidak, HP petugas akan tetap memakai versi lama yang tersimpan.
- Data hitung tersimpan di HP masing-masing (IndexedDB). Lakukan **Backup JSON** berkala,
  terutama di iPhone, karena penyimpanan situs dapat dihapus sistem bila lama tidak dibuka.
- Penjumlahan qty berlaku **di dalam satu store**: item yang ditemukan di dua tempat pada store yang sama
  ditambahkan, sedangkan store lain tetap tercatat terpisah.

## Format kolom file export (kontrak dengan Report Cost Control)

Kolom A–H tidak boleh berubah karena dibaca oleh makro:

`ArtNo | Description | Unit | Qty Fisik | Price | Amount | Catatan | Ada Foto (Y/N)`

Kolom tambahan setelahnya: `Store | Qty Sistem | Selisih | Terdaftar di Store`.

`Terdaftar di Store` hanya terisi bila item ditemukan di store yang berbeda dari pendaftarannya
di sistem. Qty dicatat atas nama store tempat barang secara fisik ditemukan, sehingga item tersebut
akan tampak *lebih* di store penemu dan *kurang* di store asal — keduanya perlu direkonsiliasi
oleh Report Cost Control.
