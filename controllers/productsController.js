const pool = require("../database/db");

// =======================
// GET ALL PRODUCTS
// =======================
const getAllProducts = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM products ORDER BY id ASC"
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: err.message,
            detail: err.detail
        });
    }
};

// =======================
// CREATE PRODUCT
// =======================
const createProduct = async (req, res) => {
    try {
        const { title, description, logo, prices } = req.body;

        const result = await pool.query(
            `INSERT INTO products
            (title, description, logo, prices)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                title,
                description,
                logo,
                JSON.stringify(prices)
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: err.message,
            detail: err.detail
        });
    }
};

// =======================
// UPDATE PRODUCT
// =======================
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, logo, prices } = req.body;

        const result = await pool.query(
            `UPDATE products
             SET
                title = $1,
                description = $2,
                logo = $3,
                prices = $4
             WHERE id = $5
             RETURNING *`,
            [
                title,
                description,
                logo,
                JSON.stringify(prices),
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Produk tidak ditemukan"
            });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: err.message,
            detail: err.detail
        });
    }
};

// =======================
// DELETE PRODUCT
// =======================
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM products WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Produk tidak ditemukan"
            });
        }

        res.json({
            message: "Produk berhasil dihapus"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: err.message,
            detail: err.detail
        });
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct
};