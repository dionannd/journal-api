import express from "express";
import bodyParser, { urlencoded } from "body-parser";
import cors from "cors";
import routes from "./routes";

const app = express();

const initServer = () => {
  app.use(bodyParser({ extends: { urlencoded: true } }));
  app.use(bodyParser.json());
  app.use(express.static("public"));
  app.use(cors());
  app.use("/api", routes);

  app.listen(3030, () => console.log("Server running on PORT 3030"));
};

initServer();
