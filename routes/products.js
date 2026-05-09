const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");

// ======================
// CẤU HÌNH UPLOAD CHUẨN
// ======================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        // 🔥 Làm sạch tên file (tránh lỗi tiếng Việt)
        const cleanName = file.originalname
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-")
            .toLowerCase();

        cb(null, Date.now() + "-" + cleanName);
    }
});

const upload = multer({ storage });

// ======================
// GET ALL PRODUCTS
// ======================
router.get("/", (req, res) => {
    db.query("SELECT * FROM products", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// ======================
// ADD PRODUCT
// ======================
router.post("/", upload.single("image"), (req, res) => {
    try {
        const { name, price, stock, description } = req.body;

        // 🔥 bắt buộc có ảnh
        if (!req.file) {
            return res.status(400).json({ message: "Chưa chọn ảnh" });
        }

        // ✅ CHỈ LƯU filename
        const image = req.file.filename;

        const sql = `
            INSERT INTO products (name, price, stock, image, description)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(sql, [name, price, stock, image, description], (err) => {
            if (err) {
                console.log("SQL ERROR:", err);
                return res.status(500).json({ message: "Lỗi DB" });
            }

            res.json({ message: "Thêm thành công" });
        });

    } catch (err) {
        console.log("SERVER ERROR:", err);
        res.status(500).json({ message: "Server lỗi" });
    }
});

// ======================
// DELETE
// ======================
router.delete("/:id", (req, res) => {
    db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Xóa thành công" });
    });
});

// UPDATE PRODUCT
router.put("/:id", upload.single("image"), (req, res) => {
    const id = req.params.id;
    const { name, price, stock, description } = req.body;

    let image = null;

    // 🔥 CHỈ LƯU filename (QUAN TRỌNG)
    if (req.file) {
        image = req.file.filename;
    }

    let sql = `
        UPDATE products 
        SET name=?, price=?, stock=?, description=? 
        ${image ? ", image=?" : ""}
        WHERE id=?
    `;

    let params = [name, price, stock, description];

    if (image) params.push(image);
    params.push(id);

    db.query(sql, params, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Cập nhật thành công" });
    });
});

module.exports = router;