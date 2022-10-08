# SPP API

REST API untuk sistem pembayaran sekolah menggunakan framework Express.js dan MongoDB.

## Cara Instalasi

Clone project ini dan masuk ke dalam direktori project.

Pastikan MongoDB Service sudah berjalan. Buat file `.env` di dalam root project, tambahkan:

```
PROJECT_PORT=3001
PROJECT_KEY=<key-random-kamu>
MONGO_URI=<mongo-uri-kamu>
```

Jalankan perintah berikut untuk menginstal semua dependensi yang dibutuhakn project ini:

```
npm install
```

Jalankan server menggunakan perintah:

```
npm start
```

> Jika `nodemon` belum ada, instal `nodemon` dengan perintah `npm install -g nodemon`. Selesai instalasi, jalankan server kembali dengan perintah `npm start`.

## Insomnia

Jika ingin mencobanya terlebih dahulu, import file `INSOMNIA-SPP-API-1.0.0.json` ke Insomnia.
