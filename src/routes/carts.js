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
  const checkIfItemExists = await User.find({ "cart.productId": productId });
  if (checkIfItemExists.length > 0) {
    const result = await User.findOneAndUpdate(
      {
        _id: userId,
        "cart.productId": productId
      },
      {
        $inc: {
          "cart.$.quantity": 1
        }
      }
    );
  } else {
    user.cart.push({ productId, quantity: 1 });
    await user.save();
  }
  res.status(200).json({ success: "success" });
});
route.put("/", isAuth, async (req, res) => {
  const id = req.body.id;
  try {
    await User.updateOne({}, { $pull: { cart: { _id: id } } });
    return res
      .status(200)
      .json({ succes: "You have successfully deleted a cart item" });
  } catch (error) {
    return res.status(400).json({ error: "Cannot delete a cart item" });
  }
});
module.exports = route;
