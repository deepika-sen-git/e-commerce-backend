require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./src/config/db");

connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Make io globally accessible
app.set("io", io);

require("./src/config/socket")(io);

// Routes
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/products", require("./src/routes/product.routes"));
app.use("/api/orders", require("./src/routes/order.routes"));
app.use("/api/reports", require("./src/routes/report.routes"));

// Error Middleware
app.use(require("./src/middlewares/error.middleware"));

server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
