const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const userRoutes = require("./routers/user.route.js");
const productRoutes = require("./routers/product.route.js");
const path = require("path");
const errorHandler = require("./middleware/errorHandler.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const orderRoutes = require("./routers/order.route.js");

dotenv.config();
connectDB();

const app = express();

// Middleware

app.use(express.json());
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
