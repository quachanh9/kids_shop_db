const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//ROUTES
app.use("/products", require("./routes/products"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", require("./routes/orders"));
app.use("/cart", require("./routes/cart")); 
app.use("/dashboard", require("./routes/dashboard"));
app.use("/dashboard-pro", require("./routes/dashboard-pro"));

app.listen(3000, () => {
    console.log("Server chạy tại http://localhost:3000");
});