import { mainDb } from "../../lib/db";

class TransactionController {
  constructor() {
    this.db = mainDb;
  }

  getTransaction = async (req, res) => {
    try {
      const { q } = req.query;
      let where = "";
      let bindParams = {
        user_id: req.user.id,
      };
      if (q && q.length > 0) {
        where += ` AND ((name ~* $<q>))`;
        bindParams = { ...bindParams, q };
      }
      const data = await this.db.query(
        `select th.*, (
          select coalesce(sum(amount), 0) as total
          from transaction_details td
          where td.transaction_id = th.transaction_id
        ) from transaction_headers th
        where user_id = $<user_id>
        ${where}
        group by th.transaction_id
        `,
        bindParams
      );
      return res.status(200).send({ data });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  saveTransaction = async (req, res) => {
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

  deleteTransaction = async (req, res) => {
    try {
      const { id } = req.params;
      const checkData = await this.db.one(
        `
        select count(*) from transaction_details where transaction_id = $1
      `,
        id
      );

      if (checkData && checkData.count > 0) {
        return res.status(400).send({ message: "Data sedang digunakan" });
      }

      await this.db.query(
        `delete from transaction_headers where transaction_id = $1`,
        id
      );
      res.status(200).send({ message: "Transaksi berhasil dihapus" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
}

export default TransactionController;
