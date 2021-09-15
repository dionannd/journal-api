import { Router } from "express"
import TransactionController from "./TransactionController"
import TransactionDetailController from "./TransactionDetailController";

const app = Router();
const handler = new TransactionController();
const routes = new TransactionDetailController()

// Transaction
app.get("/", handler.transaction)
app.post("/", handler.insertTransaction)
app.put("/:id", handler.editTransaction)
app.delete("/:id", handler.deleteTransaction)
app.get("/:id", handler.detailTransaction)

// Transaction Detail
app.post("/detail/", routes.insertTransactionDetail)
app.delete("/detail/:id", routes.deleteTransactionDetail)

export default app