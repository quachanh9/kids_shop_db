const express = require("express");
const router = express.Router();
const db = require("../config/db");

// === ĐĂNG KÝ ===
router.post("/register", (req, res) => {
    const { username, email, password } = req.body;

    // CHECK EMAIL
    const checkSql = "SELECT * FROM users WHERE email = ?";

    db.query(checkSql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi server" });
        }

        //email đã tồn tại
        if (result.length > 0) {
            return res.json({ message: "Email đã tồn tại!" });
        }

        //insert user
        const insertSql = "INSERT INTO users (username,email, password) VALUES (?, ?, ?)";

        db.query(insertSql, [username, email, password], (err, result) => {
            if (err) {
                return res.status(500).json ({ message: "Lỗi đăng ký" });
            }

            res.json({ message: "Đăng ký thành công" });
        });
    });
});

// === ĐĂNG NHẬP ===
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi server" });
        }

        if (result.length > 0) {
            res.json({ message: "Đăng nhập thành công", user: result[0] });
        } else {
            res.json({ message: "Sai email hoặc mật khẩu" });
        }
    });
});

module.exports = router;