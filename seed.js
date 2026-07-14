const pool = require("./database/db");
const products = require("./data/products");

async function seed() {
    try {
        for (const p of products) {
            await pool.query(
                `INSERT INTO products(title, description, logo, prices)
                 VALUES ($1,$2,$3,$4)`,
                [
                    p.title,
                    p.desc,
                    p.logo,
                    JSON.stringify(p.prices)
                ]
            );
        }

        console.log("Semua produk berhasil dimasukkan.");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();