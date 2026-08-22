/* ============================================================
   Service Worker — Stock Opname Plataran
   Fungsi: menyimpan app di alat petugas supaya tetap bisa dibuka
           di area tanpa sinyal (gudang / basement).

   PENTING SAAT UPDATE APP:
   setiap kali index.html diubah, naikkan nomor CACHE di bawah
   (v1 -> v2 -> v3 ...). Kalau tidak dinaikkan, alat petugas akan
   tetap memakai versi lama yang tersimpan.
   ============================================================ */
var CACHE = 'so-plataran-v9';
var ASSETS = ['./', './index.html', './manifest.json'];

/* Saat pertama dipasang: simpan file app ke cache */
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }).then(function(){ self.skipWaiting(); }));
});

/* Saat versi baru aktif: hapus cache versi lama */
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.map(function(k){ if(k!==CACHE) return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

/* Saat halaman diminta: ambil dari internet kalau ada sinyal (supaya dapat versi terbaru),
   kalau gagal/offline ambil dari cache. */
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  /* File master (master/PLD.json dst) TIDAK di-cache dan tidak diganti index.html.
     Master sudah disimpan permanen di IndexedDB oleh app, jadi biarkan gagal apa adanya
     saat offline supaya app bisa menampilkan pesan yang benar. */
  if(e.request.url.indexOf('/master/') >= 0) return;
  e.respondWith(
    fetch(e.request).then(function(res){
      var copy = res.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
      return res;
    }).catch(function(){
      return caches.match(e.request).then(function(hit){
        return hit || caches.match('./index.html');
      });
    })
  );
});
