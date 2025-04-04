const { Router } = require("express");
const { addCategory } = require("../controllers/category.controller.js");

const categoryRouter = Router();

categoryRouter.route("/add").post(addCategory);

module.exports = categoryRouter;
