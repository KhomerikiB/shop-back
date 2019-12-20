const route = require("express").Router();
const Item = require("../modules/Item");
const { isAuth } = require("../middleware/isAuth");

// ADD ITEM
route.post("/", isAuth, async (req, res) => {
  const {
    brand,
    category,
    description,
    modelId,
    price,
    images,
    title,
    quantity
  } = req.body;
  const item = new Item({
    brand,
    category,
    description,
    modelId,
    price: parseInt(price).toFixed(2),
    images,
    title,
    quantity
  });
  try {
    const result = await item.save();
    res.status(200).json({ success: result });
  } catch (error) {
    return res.status(403).json({ error: error });
  }
});
// GET ALL ITEMS
route.get("/", async (req, res) => {
  try {
    // const allItems = await Item.find().populate("category");
    const allItems = await Item.find();
    return res.status(200).json({ data: allItems });
  } catch (error) {
    return res.json({ error });
  }
});
// GET ITEM BY ID
route.get("/:itemId", async (req, res) => {
  const id = req.params.itemId;
  try {
    const item = await Item.findById(id);
    if (!item) return res.status(200).json({ error: "item not found" });
    return res.status(200).json({ data: item });
  } catch (error) {
    return res.json({ error });
  }
});

// GET ITEMS BY CATEGORY ID
route.get("/category/id", async (req, res) => {
  const { id, itemId } = req.query;
  try {
    const item = await Item.find({ category: id });
    if (!item) return res.status(200).json({ error: "item not found" });
    if (typeof itemId !== "undefined") {
      const items = item.filter(_item => {
        return _item.id !== itemId;
      });
      return res.status(200).json({ data: items });
    }
    return res.status(200).json({ data: item });
  } catch (error) {
    return res.json({ error });
  }
});
// SEARCH ITEM BY NAME
route.get("/search/:text", async (req, res) => {
  const fullInfo = req.body.type;
  const text = req.params.text;
  if (fullInfo) {
    try {
      const regText = new RegExp(text, "i"); // 'i' makes it case insensitive
      const result = await Item.find({
        $or: [{ description: regText }, { title: regText }, { brand: regText }]
      });
      res.status(200).json({ result });
    } catch (error) {
      return res.json({ error });
    }
  } else {
    try {
      const regText = new RegExp(text, "i"); // 'i' makes it case insensitive
      const result = await Item.find({
        $or: [{ description: regText }, { title: regText }, { brand: regText }]
      }).select("title");
      res.status(200).json({ result });
    } catch (error) {
      return res.json({ error });
    }
  }
});
module.exports = route;
