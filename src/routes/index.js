import { application, Router } from "express";
import product from "../controller/product";
import category from "../controller/category";
import transaction from "../controller/transaction";
import auth from "../controller/auth";
import { verify } from "../middleware/auth";

const app = Router();

app.use("/product", verify,product);
app.use("/category", category);
app.use("/transaction", verify,transaction);
app.use("/auth", auth);

export default app;
