const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
    db.query("SELECT * FROM sizes", (err, data) => {
        if (err) return res.json(err);
        res.json(data);
    });
});

router.post("/", (req, res) => {
    const { name } = req.body;

    db.query("INSERT INTO sizes(name) VALUES(?)", [name], (err, result) => {
        if (err) return res.json(err);
        res.json({ message:"Thêm thành công" });
    });
});

router.delete("/:id", (req, res) => {
    db.query("DELETE FROM sizes WHERE id=?", [req.params.id], (err, result) => {
        if (err) return res.json(err);
        res.json({ message:"Đã xóa" });
    });
});

module.exports = router;