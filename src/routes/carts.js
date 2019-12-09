const route = require("express").Router();
const { isAuth } = require("../middleware/isAuth");
const User = require("../modules/User");
// GET ALL CARTS
route.get("/", isAuth, async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId).populate("cart.productId");

  if (!user) return res.status(400).json({ error: "User not found" });
  res.status(200).json({ cart: user.cart });
});

// ADD PRODUCT ID TO  USER'S CART
route.post("/", isAuth, async (req, res) => {
  const { id: productId } = req.body;
  const userId = req.userId;
  const user = await User.findById(userId);
  if (!user) return res.status(400).json({ error: "User not found" });
  user.cart.push({ productId });
  await user.save();
  res.status(200).json({ success: "success" });
});

module.exports = route;
