const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
    db.query("SELECT id, username, email, role, created_at FROM users ORDER BY id DESC", (err, data) => {
        if (err) return res.json(err);
        res.json(data);
    });
});

router.delete("/:id", (req, res) => {
    db.query("DELETE FROM users WHERE id=?", [req.params.id], (err, result) => {
        if (err) return res.json(err);
        res.json({ message:"Đã xóa" });
    });
});

module.exports = router;