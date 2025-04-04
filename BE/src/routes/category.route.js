const { Router } = require("express");
const {
  addCategory,
  getAllCategories,
} = require("../controllers/category.controller.js");

const categoryRouter = Router();

categoryRouter.route("/add").post(addCategory);
categoryRouter.route("/display").get(getAllCategories);

module.exports = categoryRouter;
