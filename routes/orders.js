const router = require("express").Router();
const db = require("../config/db");

// CREATE ORDER
router.post("/", (req, res) => {
    const { user_id, name, phone, address, cart } = req.body;

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    //Tạo order
    db.query("INSERT INTO orders (user_id, total_price, address, phone) VALUES (?, ?, ?, ?)", [user_id, total, address, phone], (err, result) => {
        if (err) return res.status(500).json(err);

        const orderId = result.insertId;

        //Tạo mảng values
        const values = cart.map(item => [
            orderId,
            item.product_id,
            item.quantity,
            item.price
        ]);

        // Insert đầy đủ dữ liệu
        db.query("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?", [values], (err2) => {
            if (err) return res.status(500).json(err2);
            res.json({ message: "Đặt hàng thành công" });
        });
    });
});


router.get("/", (req, res) => {
    const sql = `
        SELECT o.*, u.username AS name
        FROM orders o 
        LEFT JOIN users u ON o.user_id = u.id 
        ORDER BY o.id DESC
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

router.get("/:id/items", (req, res) => {
    const ordertId = req.params.id;

    const sql = `
        SELECT oi.*, p.name
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
    `;

    db.query(sql, [ordertId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

router.delete("/:id", (req, res) => {
    const orderId = req.params.id;

    db.query("DELETE FROM order_items WHERE order_id = ?", [orderId], (err) => {
        if (err) return res.status(500).json(err);

        db.query("DELETE FROM orders WHERE id = ?", [orderId], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Đã xóa đơn hàng" });
        });
    });
});

router.put("/:id/status", (req, res) => {
    const { status } = req.body;

    db.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Cập nhật trạng thái đơn hàng thành công" });
    });
});

module.exports = router;