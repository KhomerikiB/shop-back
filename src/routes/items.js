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
    price,
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
    const allItems = await Item.find().populate("category");
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

// GET ITEM BY CATEGORY ID
route.get("/categoryId/:categoryId", async (req, res) => {
  const id = req.params.categoryId;
  try {
    const item = await Item.findOne({ category: id });
    if (!item) return res.status(200).json({ error: "item not found" });
    return res.status(200).json({ data: item });
  } catch (error) {
    return res.json({ error });
  }
});
module.exports = route;
