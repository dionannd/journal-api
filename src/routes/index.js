import { Router } from "express";
import journal from "../controller/jounal";
import transaction from "../controller/transaction";
import auth from "../controller/auth";
import { verify } from "../middleware/auth";

const app = Router();

app.use("/auth", auth);
app.use("/journal", verify, journal);
app.use("/transaction", verify, transaction);

export default app;
