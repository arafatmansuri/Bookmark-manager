import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/category.controller";

const categoryRouter = Router();

categoryRouter.route("/add").post(addCategory);
categoryRouter.route("/display").get(getAllCategories);
categoryRouter.route("/delete/:id").delete(deleteCategory);
categoryRouter.route("/update/:id").put(updateCategory);

export default categoryRouter;
