import { Router } from "express";
import TransactionController from "./transaction-handler";

const app = Router();
const handler = new TransactionController();

app.get("/:id", handler.getTransaction);
app.post("/:id", handler.save);
app.get("/list/:id", handler.list);
app.get("/tipe/:id", handler.getTipe);
app.delete("/:id", handler.delete);

export default app;
