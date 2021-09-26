import { Router } from "express";
import TransactionController from "./TransactionController";
import DetailController from "./DetailController";

const app = Router();
const handler = new TransactionController();
const route = new DetailController();

app.get("/", handler.transaction);
app.post("/", handler.insertTransaction);
app.put("/:id", handler.editTransaction);
app.delete("/:id", handler.deleteTransaction);

app.get("/:id", route.getDetail);

export default app;
