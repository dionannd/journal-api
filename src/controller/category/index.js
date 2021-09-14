import { Router } from "express";
import CategoryController from "./CategoryController";

const app = Router();
const handler = new CategoryController();

app.get("/", handler.getCategory);
app.post("/", handler.insertCategory);

export default app;
