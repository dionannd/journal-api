import { Router } from "express";
import ProductController from "./ProductController";
import { upload } from "../../lib/upload-lib";

const app = Router();
const handler = new ProductController();

app.get("/", handler.getProduct);
app.post("/", upload.single("files"), handler.insertProduct);
app.put("/:id", upload.single("files"), handler.editProduct);
app.delete("/:id", handler.deleteProduct);
app.get("/:id", handler.detailProduct);

export default app;
