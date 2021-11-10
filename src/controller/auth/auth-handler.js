import { mainDb } from "../../lib/db";
import { generateToken } from "../../lib/helpers";
import Bcrypt from "bcrypt";

class AuthController {
  constructor() {
    this.db = mainDb;
  }

  register = async (req, res) => {
    try {
      const { body } = req;
      const checkEmail = await this.db.oneOrNone(
        `select email from users where email = $1`,
        body.email
      );

      if (checkEmail) {
        return res.status(400).send({ message: "Email already registered" });
      }

      if (body.password_confirm !== body.password) {
        return res.status(400).send({ message: "Password don't match" });
      }

      if (body.name === "") {
        return res.status(400).send({ message: "Recheck the form" });
      } else if (body.email === "") {
        return res.status(400).send({ message: "Recheck the form" });
      } else if (body.password === "") {
        return res.status(400).send({ message: "Recheck the form" });
      }

      const salt = Bcrypt.genSaltSync(15);
      body.password = Bcrypt.hashSync(body.password, salt);

      await this.db.query(
        `insert into users (name, email, password) values ($<name>, $<email>, $<password>)`,
        body
      );
      return res.status(200).send({ message: "Registered successfully" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const { body } = req;
      const checkUser = await this.db.oneOrNone(
        `select * from users where email = $1`,
        body.email
      );
      if (!checkUser) {
        return res.status(400).send({ message: "Wrong email or unregistered" });
      }
      const comparePassword = Bcrypt.compareSync(
        body.password,
        checkUser.password
      );
      if (!comparePassword) {
        return res.status(400).send({ message: "Wrong email or password." });
      }

      const token = await generateToken(checkUser);
      return res.status(200).send({ message: "Login success", token });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
}

export default AuthController;
