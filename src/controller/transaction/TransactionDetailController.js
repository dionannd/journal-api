import { mainDb } from "../../lib/db";

class TransactionDetailController {
  constructor() {
    this.db = mainDb;
  }

  transactionDetail = async (req, res) => {
    try {
      const { id } = req.params;
      const { user } = req;
      const result = await this.db.oneOrNone(
        `select * from transaction_header where transaction_id = $1 and user_id = $2
      `,
        [id, user.user_id]
      );
      return res.status(200).send({ data: result });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

  insertTransactionDetail = async (req, res) => {
    try {
      const { body } = req;
      body.user_id = req.user.id;
      body.transaction_id = req.params.id;
      await this.db.query(
        `insert into transaction_details (transaction_id, description, tipe, amount, user_id, transaction_date) values ($<transaction_id>, $<description>, $<tipe>, $<amount>, $<user_id>, NOW())`,
        body
      );
      res.status(200).send({ message: "Transaksi berhasil ditambahkan" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  listTransactionDetail = async (req, res) => {
    try {
      const { id } = req.params;
      const { page, pageSize, q } = req.query;
      let limit = "";
      let where = "";
      let bindParams = {
        transaction_id: id,
      };
      if (page) {
        const offset = (page - 1) * pageSize;
        limit = ` limit $<pageSize> offset ${offset}`;
        bindParams = { ...bindParams, pageSize };
      }
      if (q) {
        where += ` AND ((description ~* $<q>))`;
        bindParams = { ...bindParams, q };
      }
      const result = await this.db.query(
        `
      select * from transaction_details
      where transaction_id = $<transaction_id>
      ${where}
      order by transaction_date desc
      ${limit}
      `,
        bindParams
      );

      const total = await this.db.one(
        "select count(*) from transaction_details"
      );

      return res
        .status(200)
        .send({ data: result, totalCount: Number(total.count) });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

  deleteTransactionDetail = async (req, res) => {
    try {
      const { body } = req;
      await this.db.query(
        `delete from transaction_details where transaction_detail_id in ($1:csv)`,
        [body.transaction_id]
      );
      res.status(200).send({ message: "Transaksi berhasil dihapus" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  getTipeDetail = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.db.query(
        `
      select
        coalesce(sum(case td.tipe when 'pemasukan' then amount end), 0) as pemasukan,
        coalesce(sum(case td.tipe when 'pengeluaran' then amount end), 0) as pengeluaran
      from transaction_details td where transaction_id = $1
      `,
        [id.transaction_id]
      );
      const income = await this.db.one("select count(*) from pemasukan");
      const loss = await this.db.one("select count(*) from pengeluaran");
      res
        .send(200)
        .send({ data: result, totalIncome: income, totalLoss: loss });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
}

export default TransactionDetailController;
