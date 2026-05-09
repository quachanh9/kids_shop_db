const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
    const result = {};

    // ✅ CHART (không JOIN)
    db.query(`
        SELECT 
            DATE(created_at) AS date, 
            SUM(total_price) AS revenue
        FROM orders
        GROUP BY DATE(created_at)
        ORDER BY date ASC
    `, (err, revenueData) => {
        if (err) return res.status(500).json(err);

        // ✅ lấy quantity riêng
        db.query(`
            SELECT 
                DATE(o.created_at) AS date,
                SUM(oi.quantity) AS total_quantity
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            GROUP BY DATE(o.created_at)
        `, (err, quantityData) => {
            if (err) return res.status(500).json(err);

            // 👉 merge 2 dữ liệu
            const chart = revenueData.map(r => {
                const revenueDate = new Date(r.date).toISOString().split("T")[0];

                const q = quantityData.find(item => {
                    const quantityDate = new Date(item.date).toISOString().split("T")[0];
                    return quantityDate === revenueDate;
                });

                return {
                    date: r.date,
                    revenue: r.revenue,
                    total_quantity: q ? Number(q.total_quantity) : 0
                };
            });

            result.chart = chart;

            // ===== TOP PRODUCT =====
            db.query(`
                SELECT p.name, SUM(oi.quantity) AS sold 
                FROM order_items oi 
                JOIN products p ON oi.product_id = p.id 
                GROUP BY oi.product_id 
                ORDER BY sold DESC 
                LIMIT 5
            `, (err, topProducts) => {
                if (err) return res.status(500).json(err);

                result.topProducts = topProducts;

                // ===== RECENT ORDERS =====
                db.query(`
                    SELECT id, total_price 
                    FROM orders 
                    ORDER BY id DESC 
                    LIMIT 5
                `, (err, recentOrders) => {
                    if (err) return res.status(500).json(err);

                    result.recentOrders = recentOrders;

                    res.json(result);
                });
            });
        });
    });
});

module.exports = router;