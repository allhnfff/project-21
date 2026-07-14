# H&T Store

## Deskripsi

H&T Store adalah aplikasi web untuk mengelola dan menjual produk digital seperti Netflix Premium, Canva Pro, Spotify Premium, ChatGPT Plus, dan layanan digital lainnya.

Aplikasi dibuat menggunakan ExpressJS sebagai backend, PostgreSQL sebagai database, dan JavaScript untuk frontend.

---

## Tech Stack

- Node.js
- ExpressJS
- PostgreSQL
- HTML
- CSS
- JavaScript

---

## Struktur Folder

```
project-21
│
├── assets
│   ├── css
│   ├── img
│   └── js
│
├── controllers
├── routes
├── middleware
├── database
├── uploads
├── app.js
├── package.json
└── README.md
```

---

## Cara Menjalankan

Install dependency

```bash
npm install
```

Jalankan server

```bash
node app.js
```

Server berjalan pada

```
http://localhost:3000
```

---

## Fitur

- CRUD Produk
- Search Produk
- Filter Kategori
- Detail Produk
- SweetAlert Notification
- Copy WhatsApp Order
- Copy Nomor Admin

---

## Database

Database menggunakan PostgreSQL.

Konfigurasi terdapat pada

```
database/db.js
```

---

# API Endpoint

## Mengambil semua produk

GET

```
/api/products
```

---

## Mengambil satu produk

GET

```
/api/products/:id
```

---

## Menambah produk

POST

```
/api/products
```

---

## Mengubah produk

PUT

```
/api/products/:id
```

---

## Menghapus produk

DELETE

```
/api/products/:id
```
---

# Docker

Build Docker Image

```bash
docker build -t htstore .
```

Menjalankan Container

```bash
docker run -d -p 3000:3000 htstore
```

---

# Docker Compose

Menjalankan seluruh service

```bash
docker compose up -d
```

Menghentikan service

```bash
docker compose down
```

---

# Deployment

Deployment menggunakan Docker dan Docker Compose.

Tahapan deployment:

- Build Docker Image
- Menjalankan Docker Compose
- Reverse Proxy menggunakan Nginx
- HTTPS menggunakan Let's Encrypt
- Monitoring menggunakan Uptime Kuma

Deployment ke VPS akan dilakukan setelah server tersedia.

---

# Monitoring

Monitoring aplikasi menggunakan Uptime Kuma.

Fitur monitoring:

- HTTP Monitoring
- Status Service
- Response Time
- Availability

Konfigurasi dilakukan setelah VPS tersedia.

---

# Backup

Backup database PostgreSQL dilakukan secara otomatis menggunakan Cron Job.

Backup meliputi:

- Database
- Upload File
- Konfigurasi Docker

Konfigurasi dilakukan setelah VPS tersedia.

---

# Recovery

Recovery dilakukan apabila server mengalami kegagalan.

Langkah recovery:

1. Restore database
2. Jalankan Docker Compose
3. Verifikasi aplikasi
4. Verifikasi database
5. Verifikasi endpoint API

---

# Author

Muhamad Muslim Al Hanif

STMIK Tazkia

Sistem Informasi