# Fitur Filter

Website KuliNastra dilengkapi dengan sistem filter yang canggih untuk membantu pengguna menemukan produk yang sesuai dengan preferensi mereka. Fitur filter ini terintegrasi di halaman **Produk** (`view/product.html`) dan menggunakan JavaScript untuk memberikan pengalaman pencarian yang dinamis dan responsif.

## 🎯 **Jenis Filter yang Tersedia**

### 1. **Filter Kategori Makanan**
- **Manis** - Produk dengan rasa manis
- **Gurih** - Produk dengan rasa gurih/savory
- **Nabati** - Produk berbahan dasar tumbuhan
- **Hewani** - Produk berbahan dasar hewani
- **Jajan** - Produk kategori jajanan/camilan
- **Makanan Berat** - Produk kategori makanan utama

### 2. **Filter Harga**
- **Harga Minimum** - Input untuk menentukan harga terendah
- **Harga Maksimum** - Input untuk menentukan harga tertinggi
- **Range Harga** - Mendukung pencarian dalam rentang harga tertentu

### 3. **Filter Rating**
- **Rating 4+** - Menampilkan produk dengan rating 4 bintang ke atas
- **Sistem Bintang** - Visualisasi rating menggunakan emoji bintang (⭐)

## 🔧 **Cara Kerja Sistem Filter**

### **File-file yang Terlibat:**
- `public/js/filter.js` - Logika utama sistem filter
- `public/js/products.js` - Loading data produk dari `data.json`
- `view/product.html` - Interface filter dan tampilan produk
- `public/css/product.css` - Styling untuk tampilan filter

### **Alur Kerja Filter:**

1. **Inisialisasi** (`initializeFilters()`)
   - Event listener untuk checkbox kategori
   - Event listener untuk input harga
   - Event listener untuk checkbox rating

2. **Penerapan Filter** (`applyFilters()`)
   - Mengumpulkan semua kriteria filter yang dipilih
   - Memfilter array produk berdasarkan kriteria
   - Menampilkan hasil yang sesuai

3. **Tampilan Hasil** (`displayFilteredProducts()`)
   - Render produk yang sudah difilter
   - Menampilkan pesan jika tidak ada hasil

4. **Badge Filter** (`updateFilterBadges()`)
   - Menampilkan filter aktif dalam bentuk badge
   - Memungkinkan penghapusan filter individual
   - Breadcrumb navigation untuk filter

## 🎨 **Fitur UI/UX Filter**

### **Sidebar Filter**
- **Toggle Sidebar** - Bisa dibuka/ditutup untuk menghemat ruang
- **Auto-close** - Sidebar otomatis tertutup setelah memilih filter
- **Responsive Design** - Menyesuaikan dengan ukuran layar

### **Filter Badges**
- **Visual Feedback** - Menampilkan filter aktif dalam bentuk badge
- **Individual Removal** - Setiap badge bisa dihapus dengan tombol ✕
- **Breadcrumb Style** - Navigasi filter dengan ikon dan panah

### **Real-time Filtering**
- **Instant Results** - Hasil filter langsung muncul saat input berubah
- **No Page Reload** - Semua filter bekerja tanpa reload halaman
- **Smooth Animation** - Transisi yang halus saat filter diterapkan

## 📱 **Responsivitas Filter**

### **Desktop (≥768px)**
- Sidebar filter tetap terlihat di sisi kiri
- Grid produk 3 kolom
- Badge filter horizontal

### **Mobile (<768px)**
- Sidebar filter bisa disembunyikan
- Grid produk 2 kolom atau 1 kolom
- Badge filter responsif

## 🔍 **Contoh Penggunaan Filter**

### **Skenario 1: Mencari Jajanan Manis**
1. Pilih checkbox "Manis"
2. Pilih checkbox "Jajan"
3. Hasil: Produk seperti Klepon, Onde-onde, Apem

### **Skenario 2: Mencari Produk Murah**
1. Set harga maksimum Rp 10.000
2. Pilih checkbox "Rating 4+"
3. Hasil: Produk berkualitas dengan harga terjangkau

### **Skenario 3: Mencari Makanan Nabati**
1. Pilih checkbox "Nabati"
2. Set harga minimum Rp 5.000
3. Hasil: Produk berbahan tumbuhan dengan harga sesuai

## 🛠 **Teknologi yang Digunakan**

- **Vanilla JavaScript** - Tanpa framework, performa optimal
- **Bootstrap 5** - Styling dan komponen UI
- **CSS Grid/Flexbox** - Layout responsif
- **JSON Data** - Data produk dari `data.json`
- **Event Delegation** - Efisien handling event

## 🎯 **Keunggulan Sistem Filter**

1. **Multi-criteria Filtering** - Bisa menggabungkan beberapa filter sekaligus
2. **User-friendly** - Interface yang intuitif dan mudah digunakan
3. **Performance** - Filter bekerja dengan cepat tanpa lag
4. **Accessibility** - Mendukung keyboard navigation dan screen reader
5. **Extensible** - Mudah ditambahkan filter baru di masa depan

Sistem filter KuliNastra memberikan pengalaman pencarian yang komprehensif dan user-friendly, memungkinkan pelanggan menemukan produk yang tepat sesuai dengan kebutuhan dan preferensi mereka.