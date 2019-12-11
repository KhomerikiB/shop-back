const route = require("express").Router();
const Category = require("../modules/Category");
const { isAuth } = require("../middleware/isAuth");

// ADD CATEGORY
route.post("/", isAuth, async (req, res) => {
  const { name } = req.body;
  const category = new Category({
    name
  });
  try {
    const result = await category.save();
    res.status(200).json({ success: result });
  } catch (error) {
    return res.status(403).json({ error: error });
  }
});
// GET ALL CATEGORY
route.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ data: categories });
  } catch (error) {
    return res.json({ error });
  }
});
// DELETE CATEGORY BY ID
route.delete("/:categoryId", isAuth, async (req, res) => {
  const id = req.params.categoryId;
  try {
    await Category.deleteOne({ _id: id });
    res
      .status(200)
      .json({ success: "You have successfully deleted a category" });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});
module.exports = route;
