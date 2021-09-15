import jwt from "jsonwebtoken"
import { JWT } from "../lib/constant"

export const verify = (req, res, next) => {
    try {
        const token = req.headers.authorization || "";
        let jwtPayload;
        try {
            jwtPayload = jwt.verify(token, JWT.secretKey)
            req.user = jwtPayload;
            next()
        } catch (error) {
            res.status(400).send({message: "Not Authorized"})
        }
        const newToken = jwt.sign(jwtPayload, JWT.secretKey, {
            expiresIn: "6h"
        })
        res.setHeader("token", newToken)
        next()
        return
    } catch(error) {
        return error
    }
}