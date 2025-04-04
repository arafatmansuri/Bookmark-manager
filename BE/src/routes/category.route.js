const { Router } = require("express");
const {
  addCategory,
  getAllCategories,
  deleteCategory,
} = require("../controllers/category.controller.js");

const categoryRouter = Router();

categoryRouter.route("/add").post(addCategory);
categoryRouter.route("/display").get(getAllCategories);
categoryRouter.route("/delete/:id").delete(deleteCategory);

module.exports = categoryRouter;
