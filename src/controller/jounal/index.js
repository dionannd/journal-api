import { Router } from "express";
import JournalController from "./journal-handler";

const app = Router();
const handler = new JournalController();

app.get("/", handler.getTransaction);
app.post("/save", handler.saveTransaction);
app.delete("/:id/delete", handler.deleteTransaction);

export default app;
