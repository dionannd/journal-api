import { Router } from "express";
import TransactionController from "./TransactionController";
import TransactionDetailController from "./TransactionDetailController";

const app = Router();
const handler = new TransactionController();
const route = new TransactionDetailController();

app.get("/", handler.transaction);
app.post("/", handler.insertTransaction);
app.put("/:id", handler.editTransaction);
app.delete("/:id", handler.deleteTransaction);

app.get("/:id", route.getTipeDetail);
app.get("/detail/:id", route.listTransactionDetail);
app.post("/detail/:id", route.insertTransactionDetail);
app.delete("/detail/delete", route.deleteTransactionDetail);

export default app;
