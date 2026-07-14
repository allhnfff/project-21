const express = require("express");
const router = express.Router();

const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productsController");

// READ
router.get("/", getAllProducts);

// CREATE
router.post("/", createProduct);

// UPDATE
router.put("/:id", updateProduct);

// DELETE
router.delete("/:id", deleteProduct);

module.exports = router;