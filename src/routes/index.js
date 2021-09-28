import { Router } from "express";
import transaction from "../controller/transaction";
import auth from "../controller/auth";
import { verify } from "../middleware/auth";

const app = Router();

app.use("/transaction", verify, transaction);
app.use("/auth", auth);

export default app;
