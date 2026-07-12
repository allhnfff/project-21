const express = require("express");

const path = require("path");

const app = express();

const PORT = 3000;

// Menampilkan file statis
app.use(express.static(__dirname));

// Route utama
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});