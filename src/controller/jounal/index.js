import { Router } from "express";
import JournalController from "./journal-handler";

const app = Router();
const handler = new JournalController();

app.get("/", handler.getList);
app.post("/", handler.save);
app.delete("/:id", handler.delete);

export default app;
