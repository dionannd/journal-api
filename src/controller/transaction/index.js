import { Router } from "express";
import TransactionController from "./TransactionController";
import TransactionDetailController from "./TransactionDetailController";

const app = Router();
const handler = new TransactionController();
const route = new TransactionDetailController();

app.get("/", handler.getTransaction);
app.post("/save", handler.saveTransaction);
app.delete("/:id/delete", handler.deleteTransaction);
app.get("/:id", route.getTransactionDetail);
app.post("/detail/:id/save", route.saveTransactionDetail);
app.get("/detail/:id", route.listTransactionDetail);
app.get("/detail/:id/tipe", route.getTipeDetail);
app.delete("/detail/:id/delete", route.deleteTransactionDetail);

export default app;
