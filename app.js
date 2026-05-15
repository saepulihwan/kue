const express = require('express');
const app = express();
const path = require('path');
app.use(express.static('public'));

// Pengaturan agar server bisa membaca data JSON dan Form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Route Halaman Utama
    app.get('/', (req, res) => {
    const dataKue = [
        { nama: 'Nastar Premium', harga: 85000, deskripsi: 'Lembut dengan selai nanas asli pilihan.', gambar: '/images/nastar.jpg' },
        { nama: 'Brownies Panggang', harga: 65000, deskripsi: 'Cokelat lumer dengan topping almond renyah.', gambar: '/images/brownies.jpg' },
        { nama: 'Kue Lapis Legit', harga: 120000, deskripsi: 'Resep tradisional dengan 18 lapis sempurna.', gambar: '/images/lapis.jpg' },
        { nama: 'Putri Salju', harga: 75000, deskripsi: 'Kue kacang lembut dengan taburan gula dingin.', gambar: '/images/putri-salju.jpg' },
        { nama: 'Kastengel Keju', harga: 90000, deskripsi: 'Full keju edam yang gurih dan garing.', gambar: '/images/kastengel.jpg' },
        // Produk ke-6: Custom Order
        { 
            nama: 'Custom Your Cake', 
            harga: 0, 
            isCustom: true, 
            deskripsi: 'Punya ide kue sendiri? Request rasa dan desain sesukamu di sini!', 
            gambar: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=600&q=80' 
        }
    ];
    res.render('index', { daftarKue: dataKue });
});
// Route Checkout
app.post('/checkout', (req, res) => {
    const items = req.body.items;
    res.json({ message: "Data diterima", items });
});

// Jalankan Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server Toko Kue berjalan di http://localhost:${PORT}`);
});

//databse connection
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Kosongkan jika pakai XAMPP default
    database: 'db_bakery'
});

connection.connect((err) => {
    if (err) {
        console.error('Gagal koneksi ke database: ' + err.stack);
        return;
    }
    console.log('Terhubung ke database MySQL sebagai id ' + connection.threadId);
});

module.exports = connection;
