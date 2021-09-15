import { mainDb } from "../../lib/db";

class TransactionController {
    constructor() {
        this.db = mainDb
    }

    transaction = async (req, res) => {
        try {
             const data = await this.db.query(
                `select * from transaction_headers order by transaction_header_id desc`
            )
            const result = data.map((transaction) => {
                return {
                ...transaction,
                };
            });
            res.status(200).send({data:result })
        } catch (error) {
            res.status(500).send({message: error.message})
        }
    }

    insertTransaction = async (req, res) => {
        try {
            const {body} = req
            body.user_id = req.user.id;
            await this.db.query(
                `insert into transaction_headers (name, user_id, created_at) values ($<name>, $<user_id>, to_timestamp(${Date.now()} / 1000.0))`, body
            )
            res.status(200).send({message: "Transaksi berhasil ditambahkan"})
        } catch (error) {
            res.status(500).send({message: error.message})
        }
    }

    editTransaction = async (req, res) => {
        try {
            const {body} = req
            body.transaction_header_id = req.params.id;
            await this.db.query(
                `update transaction_headers set name = $<name> where transaction_header_id = $<transaction_header_id>
                returning *`, body
            )
            res.status(200).send({message: "Transaksi berhasil diperbaharui"})
        } catch (error) {
            res.status(500).send({message: error.message})
        }
    }

    deleteTransaction = async (req, res) => {
        try {
        await this.db.query(
            `delete from transaction_headers where transaction_header_id = $1`,
            req.params.id
        );
        res.status(200).send({ message: "Transaksi berhasil dihapus" });
        } catch (error) {
        res.status(500).send({ message: error.message });
        }
    };
    detailTransaction = async (req, res) => {
    try {
      const detailTransaction = await this.db.oneOrNone(
        `select * from transaction_headers where transaction_header_id = $1`,
        req.params.id
      );
    
      res.status(200).send({ data: detailTransaction });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
}

export default TransactionController