const express = require("express");
const app = express();
const cors = require('cors')
app.use(cors());
require("./db_connect");
const userRouter = require("./routes/user");
const userAuthRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");

app.use(express.json());
app.use("/api/auth", userRouter);

app.use("/api/user", userAuthRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// app.get("/api/test", (req, res) => {
//     res.send("Hello World!");
// });


app.listen(process.env.PORT , () => {
  console.log(`Server is running on port`);
});
