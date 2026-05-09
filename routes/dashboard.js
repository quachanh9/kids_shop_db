const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { route } = require("./products");

router.get("/", (req, res) => {
    const result = {};

    //Doanh thu
    db.query("SELECT IFNULL(SUM(total_price),0) AS totalRevenue FROM orders", (err, data) => {
        if (err) return res.status(500).json(err);
        result.totalRevenue = data[0].totalRevenue;

        //Đơn hàng
        db.query("SELECT COUNT(*) AS totalOrders FROM orders", (err, data) => {
            if (err) return res.status(500).json(err);
            result.totalOrders = data[0].totalOrders;

            //Sản phẩm 
            db.query("SELECT COUNT(*) AS totalProducts FROM products", (err, data) => {
                if (err) return res.status(500).json(err);
                result.totalProducts = data[0].totalProducts;

                //Khách hàng
                db.query("SELECT COUNT(*) AS totalUsers FROM users", (err, data) => {
                    if (err) return res.status(500).json(err);
                    result.totalUsers = data[0].totalUsers;
                    res.json(result);
                });
            });
        });
    });
});

module.exports = router;