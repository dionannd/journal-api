import { mainDb } from "../../lib/db";

class TransactionController {
  constructor() {
    this.db = mainDb;
  }

  transaction = async (req, res) => {
    try {
      const data = await this.db.query(
        `select th.*, (
          select coalesce(sum(amount), 0) as total
          from transaction_details td
          where td.transaction_id = th.transaction_id
        ) from transaction_headers th
        where user_id = $1
        group by th.transaction_id`,
        req.user.id
      );
      return res.status(200).send({ data });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  insertTransaction = async (req, res) => {
    try {
      const { body } = req;
      body.user_id = req.user.id;
      await this.db.query(
        `insert into transaction_headers (name, description, user_id, created_at) values ($<name>, $<description>, $<user_id>, NOW())`,
        body
      );
      res.status(200).send({ message: "Transaksi berhasil ditambahkan" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  editTransaction = async (req, res) => {
    try {
      const { body } = req;
      body.transaction_header_id = req.params.id;
      await this.db.query(
        `update transaction_headers set name = $<name> where transaction_id = $<transaction_id>
                returning *`,
        body
      );
      res.status(200).send({ message: "Transaksi berhasil diperbaharui" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  deleteTransaction = async (req, res) => {
    try {
      await this.db.query(
        `delete from transaction_headers where transaction_id = $1`,
        req.params.id
      );
      res.status(200).send({ message: "Transaksi berhasil dihapus" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
}

export default TransactionController;
