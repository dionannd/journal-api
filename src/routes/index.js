import { application, Router } from "express";
import product from "../controller/product";

const app = Router();

app.use('/product', product)

export default app;