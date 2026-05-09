const express = require("express");
const router = express.Router();
const db = require("../config/db");

// =====================
// ĐĂNG KÝ
// =====================
router.post("/register", (req, res) => {
    const { username, password } = req.body;

    // 1. CHECK TRÙNG USERNAME
    const checkSql = "SELECT * FROM users WHERE username = ?";
    db.query(checkSql, [username], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi server" });
        }

        // 👉 Nếu đã tồn tại
        if (result.length > 0) {
            return res.json({ message: "Tên đăng nhập đã tồn tại!" });
        }

        // 2. CHƯA TỒN TẠI → INSERT
        const insertSql = "INSERT INTO users (username, password) VALUES (?, ?)";
        db.query(insertSql, [username, password], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Lỗi khi đăng ký" });
            }

            res.json({ message: "Đăng ký thành công" });
        });
    });
});

// ================= LOGIN =================
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi server" });
        }

        if (result.length > 0) {
            res.json({
                message: "Đăng nhập thành công",
                user: result[0]
            });
        } else {
            res.json({ message: "Sai tài khoản hoặc mật khẩu" });
        }
    });
});

module.exports = router;