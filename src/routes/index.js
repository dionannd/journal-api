import { application, Router } from "express";
import product from "../controller/product";
import category from "../controller/category";

const app = Router();

app.use("/product", product);
app.use("/category", category);

export default app;
