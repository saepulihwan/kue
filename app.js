const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

// --- 1. KONFIGURASI MIDDLEWARE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS sebagai template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- 2. KONEKSI DATABASE ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Kosongkan jika pakai XAMPP default
    database: 'db_kue'
});

db.connect((err) => {
    if (err) {
        console.error('Gagal koneksi ke database: ' + err.stack);
        return;
    }
    console.log('✅ Database db_kue Terhubung! ID:' + db.threadId);
});

// --- 3. ROUTE HALAMAN UTAMA (Tampilan Produk) ---
app.get('/', (req, res) => {
    const dataKue = [
        { nama: 'Nastar Premium', harga: 85000, deskripsi: 'Lembut dengan selai nanas asli pilihan.', gambar: '/images/nastar.jpg' },
        { nama: 'Brownies Panggang', harga: 65000, deskripsi: 'Cokelat lumer dengan topping almond renyah.', gambar: '/images/brownies.jpg' },
        { nama: 'Kue Lapis Legit', harga: 120000, deskripsi: 'Resep tradisional dengan 18 lapis sempurna.', gambar: '/images/lapis.jpg' },
        { nama: 'Putri Salju', harga: 75000, deskripsi: 'Kue kacang lembut dengan taburan gula dingin.', gambar: '/images/putri-salju.jpg' },
        { nama: 'Kastengel Keju', harga: 90000, deskripsi: 'Full keju edam yang gurih dan garing.', gambar: '/images/kastengel.jpg' },
        { 
            nama: 'Custom Your Cake', 
            harga: 0, 
            isCustom: true, 
            deskripsi: 'Punya ide kue sendiri? Request rasa dan desain sesukamu di sini!', 
            gambar: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=600&q=80' 
        }
    ];
    // Pastikan kamu punya file views/index.ejs
    res.render('index', { daftarKue: dataKue });
});

// --- 4. ENDPOINT UNTUK MENYIMPAN PESANAN ---
app.post('/api/pesan', (req, res) => {
    const { total, metode, items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Keranjang kosong' });
    }

    // A. Simpan ke tabel induk (pesanan)
    const sqlPesanan = "INSERT INTO pesanan (total_bayar, metode_bayar) VALUES (?, ?)";
    db.query(sqlPesanan, [total, metode], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Gagal simpan ke tabel pesanan' });
        }

        const idPesanan = result.insertId;

        // B. Simpan semua item ke detail_pesanan
        const sqlDetail = "INSERT INTO detail_pesanan (id_pesanan, nama_kue, qty, subtotal) VALUES ?";
        const values = items.map(item => [idPesanan, item.nama, item.qty, item.total]);

        db.query(sqlDetail, [values], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Gagal simpan ke detail_pesanan' });
            }
            console.log(`📩 Pesanan baru masuk! ID: ${idPesanan}`);
            res.json({ status: 'Berhasil simpan ke Database!', id: idPesanan });
        });
    });
});

// --- 5. JALANKAN SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server Sweet Pastry berjalan di http://localhost:${PORT}`);
});

// Export jika dibutuhkan di file lain
module.exports = db;