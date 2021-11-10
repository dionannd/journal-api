import { Router } from "express";
import AuthController from "./auth-handler";

const app = Router();
const auth = new AuthController();

app.post("/register", auth.register);
app.post("/login", auth.login);

export default app;
