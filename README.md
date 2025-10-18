# KuliNastra - Sistem Halaman Produk

Sistem halaman produk untuk UMKM KuliNastra yang dibangun menggunakan HTML, CSS, dan JavaScript murni tanpa framework.

## Fitur

- **Halaman Produk Utama**: Menampilkan semua produk dari file `data.json`
- **Halaman Detail Produk**: Menampilkan detail produk berdasarkan ID dari URL parameter
- **Navigasi Dinamis**: Klik produk untuk melihat detail dengan URL `product-detail.html?id=nama-produk`
- **Responsive Design**: Tampilan yang responsif untuk berbagai ukuran layar
- **Loading States**: Animasi loading saat data sedang dimuat
- **Styling Modern**: Desain yang menarik dengan efek hover dan transisi

## Struktur File

```
KULINASTRA/
├── data.json                    # Data produk dalam format JSON
├── index.html                   # Halaman utama/demo
├── view/
│   ├──  product.html             # Halaman daftar produk
│   └── product-detail.html      # Halaman detail produk
├── public/
│   ├── css/
│   │   └── product.css          # Styling untuk halaman produk
│   ├── js/
│   │   └── products.js          # JavaScript untuk logika produk
│   └── assets/
│       └── images/
│           └── products/        # Gambar produk
└── README.md                   # Dokumentasi ini
```

## Cara Menggunakan

### 1. Menjalankan Website

1. Buka file `index.html` di browser untuk melihat halaman utama
2. Klik tombol "Lihat Produk Kami" untuk masuk ke halaman produk
3. Atau langsung buka `view/product.html` untuk melihat daftar produk

### 2. Navigasi Produk

- **Halaman Produk**: Buka `view/product.html` untuk melihat semua produk
- **Detail Produk**: Klik pada kartu produk untuk melihat detail
- **URL Detail**: Format URL detail produk: `product-detail.html?id=klepon`

### 3. Menambah/Mengubah Produk

Edit file `data.json` untuk menambah atau mengubah data produk:

```json
{
  "products": [
    {
      "id": "nama-produk",
      "name": "Nama Produk",
      "price": 10000,
      "image": "path/to/image.jpg",
      "description": "Deskripsi produk...",
      "categories": ["kategori1", "kategori2"],
      "rating": 5,
      "stock": "Tersedia",
      "comments": [
        {
          "id": 1,
          "username": "Nama User",
          "rating": 5,
          "text": "Komentar user...",
          "date": "2024-01-15"
        }
      ]
    }
  ]
}
```

### 4. Menambah Gambar Produk

1. Simpan gambar produk di folder `public/assets/images/products/`
2. Update path gambar di `data.json`

## Struktur Data JSON

Setiap produk memiliki struktur berikut:

- `id`: ID unik produk (untuk URL parameter)
- `name`: Nama produk
- `price`: Harga produk (dalam Rupiah)
- `image`: Path ke gambar produk
- `description`: Deskripsi lengkap produk
- `categories`: Array kategori produk
- `rating`: Rating produk (1-5)
- `stock`: Status stok produk
- `comments`: Array komentar dari user

## Kategori Produk

Sistem mendukung kategori berikut:

- `manis`: Makanan manis
- `gurih`: Makanan gurih
- `nabati`: Bahan nabati
- `hewani`: Bahan hewani
- `jajan`: Jajanan tradisional
- `makanan-berat`: Makanan berat

## Teknologi yang Digunakan

- **HTML5**: Struktur halaman web
- **CSS3**: Styling dan animasi
- **JavaScript (ES6+)**: Logika aplikasi
- **Bootstrap 5**: Framework CSS untuk responsive design
- **Fetch API**: Mengambil data dari JSON file

## Browser Support

Sistem ini kompatibel dengan browser modern yang mendukung:

- ES6+ JavaScript
- Fetch API
- CSS Grid dan Flexbox
- CSS Transitions dan Animations

## Pengembangan Lebih Lanjut

Untuk pengembangan lebih lanjut, Anda dapat:

1. **Menambah Fitur Filter**: Implementasi filter berdasarkan kategori dan harga
2. **Sistem Komentar**: Backend untuk menyimpan komentar user
3. **Sistem Rating**: Backend untuk menyimpan rating dari user
4. **Keranjang Belanja**: Fitur untuk menambah produk ke keranjang
5. **Integrasi WhatsApp**: Link langsung ke WhatsApp untuk pemesanan
6. **SEO Optimization**: Meta tags dan structured data

## Demo

Buka `index.html` untuk melihat demo sistem atau langsung akses:

- Halaman Produk: `view/product.html`
- Detail Klepon: `view/product-detail.html?id=klepon`
- Detail Lemper: `view/product-detail.html?id=lemper`

## Kontak

UMKM KuliNastra
Jl. Melati Indah No. 23, Kota Nusantara, Jawa Tengah
