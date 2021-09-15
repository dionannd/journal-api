import { mainDb } from "../../lib/db";
import Bcrypt from "bcrypt"
import { generateToken } from "../../lib/helpers";

class AuthController {
    constructor() {
        this.db = mainDb;
    }

    register = async (req, res) => {
        
        try {
            const {body} = req;
            const checkEmail = await this.db.oneOrNone(
                `select email from users where email = $1`
            , body.email)

            if (checkEmail) {
                return res.status(400).send({message: "Email sudah terdaftar"});
            }
            const salt = Bcrypt.genSaltSync(15)
            body.password = Bcrypt.hashSync(body.password, salt)
            
            await this.db.query(
                `insert into users (email, password) values ($<email>, $<password>)`, body
            )
            res.status(200).send({message: "Telah berhasil register"})
        } catch (error) {
            res.status(500).send({message: error.message})
        }
    }

    login = async (req, res) => {
        try {
            const {body} = req
            const checkUser = await this.db.oneOrNone(
                `select * from users where email = $1`, body.email
            )
            if (!checkUser) {
                res.status(400).send({message: "Email belum terdaftar"})
            }
            const comparePassword = Bcrypt.compareSync(body.password, checkUser.password)
            if (!comparePassword) {
                res.status(400).send({message: "Email atau password salah"})
            }

            const token = await generateToken(checkUser)
            return res.status(200).send({message: "Login berhasil", user: checkUser, token})
        } catch (error) {
            res.status(500).send({message: error.message})
        }
    }
}

export default AuthController