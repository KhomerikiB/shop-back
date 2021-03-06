require("dotenv/config");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const itemRoute = require("./routes/items");
const cartRoute = require("./routes/carts");
const categoryRoute = require("./routes/category");
const app = express();

// connect to MONGOOSE
mongoose.connect(
  "mongodb+srv://admin:admin@cluster0-qvfhl.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("CONNECTED TO DB");
  }
);
mongoose.set("useFindAndModify", false);
// MIDDLEWARES

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTE MIDDLEWARES

app.use("/api/auth", authRoute);
app.use("/api/item", itemRoute);
app.use("/api/cart", cartRoute);
app.use("/api/category", categoryRoute);
app.listen(process.env.PORT, () => {
  console.log("SERVER IS LISTENING", process.env.PORT);
});
