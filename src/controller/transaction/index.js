import { Router } from "express";
import TransactionController from "./transaction-handler";

const app = Router();
const handler = new TransactionController();

app.get("/:id", handler.getTransactionDetail);
app.post("/detail/:id/save", handler.saveTransactionDetail);
app.get("/detail/:id", handler.listTransactionDetail);
app.get("/detail/:id/tipe", handler.getTipeDetail);
app.delete("/detail/:id/delete", handler.deleteTransactionDetail);

export default app;
