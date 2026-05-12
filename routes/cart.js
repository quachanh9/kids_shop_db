const express = require("express");
const router = express.Router();
const db = require("../config/db");

//Lấy giỏ hàng theo user
router.get("/:user_id", (req, res) => {
    const user_id = req.params.user_id;

    const sql = `
    SELECT cart_items.id, cart_items.product_id, cart_items.quantity, cart_items.size, products.name, products.price, products.image
    FROM carts
    JOIN cart_items ON carts.id = cart_items.cart_id
    JOIN products ON products.id = cart_items.product_id
    WHERE carts.user_id = ?
    `;

    db.query(sql, [user_id], (err,result) => {
        if (err) return res.json({ error: err });
        res.json(result);
    });
});

//Thêm vào giỏ hàng
router.post("/", (req, res) => {
    const { user_id, product_id, quantity,size } = req.body;

    //kiểm tra giỏ hàng đã có chưa
    const findCart = "SELECT * FROM carts WHERE user_id = ?";

    db.query(findCart, [user_id], (err, carts) => {
        if (err) return res.json({ error: err });

        if (carts.length === 0) {
            //chưa có -> tạo giỏ hàng
            db.query("INSERT INTO carts (user_id) VALUES (?)", [user_id], (err, result) => {
                if (err) return res.json({ error: err });
                const cart_id = result.insertId;
                addItem(cart_id);
            });
        } else {
            addItem(carts[0].id);
        }
    });

    //kiểm tra đã có sản phẩm chưa
    function addItem(cart_id) {
        const checkItem = "SELECT * FROM cart_items WHERE cart_id = ? AND product_id =? AND size = ?";
        db.query(checkItem, [cart_id, product_id, size], (err, items) => {
            if (err) return res.json({ error: err });
            if (items.length > 0) {
                db.query("UPDATE cart_items SET quantity = quantity + ? WHERE id = ?", [quantity, items[0].id], (err) => {
                    if (err) return res.json({ error: err });
                    res.json({ message: "Đã cập nhật giỏ hàng "});
                });
            } else {
                db.query("INSERT INTO cart_items (cart_id, product_id, quantity, size) VALUES (?, ?, ?, ?)", [cart_id, product_id, quantity, size], (err) => {
                    if (err) return res.json({ error: err });
                    res.json({ message: "Đã thêm vào giỏ hàng" });
                });
            }
        });
    }
});

//Xóa Item
router.delete("/:id", (req, res) => {
    db.query("DELETE FROM cart_items WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.json({ error: err });
        res.json({ message: "Đã xóa "});
    });
});

//Update sl
router.put("/:id", (req, res) => {
    const { quantity } = req.body;

    db.query("UPDATE cart_items SET quantity = ? WHERE id = ?", [quantity, req.params.id], (err) => {
        if (err) {
            return res.json({ error: err });
        }

        res.json({ message: "Đã cập nhật giỏ hàng" });
    });
});

module.exports = router;