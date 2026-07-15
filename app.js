require("dotenv").config();

const express = require("express");
const path = require("path");

const productRoutes = require("./routes/products");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Folder assets
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Halaman utama
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// API Produk
app.use("/api/products", productRoutes);

// Jalankan server
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});