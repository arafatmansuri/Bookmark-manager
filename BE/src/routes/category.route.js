const { Router } = require("express");
const {
  addCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
} = require("../controllers/category.controller.js");

const categoryRouter = Router();

categoryRouter.route("/add").post(addCategory);
categoryRouter.route("/display").get(getAllCategories);
categoryRouter.route("/delete/:id").delete(deleteCategory);
categoryRouter.route("/update/:id").put(updateCategory);

module.exports = categoryRouter;
