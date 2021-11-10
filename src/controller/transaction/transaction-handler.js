import { mainDb } from "../../lib/db";
import TransactionRepository from "./transaction-repository";

class TransactionDetailController {
  constructor() {
    this.db = mainDb;
    this.repository = new TransactionRepository();
  }

  getTransaction = async (req, res) => {
    try {
      const { id } = req.params;
      const session = req;

      const result = await this.repository.getTransaction(
        this.db,
        session.user_id,
        id
      );
      return res.status(200).send({ data: result });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

  save = async (req, res) => {
    try {
      const { body } = req;
      body.user_id = req.user.user_id;
      body.journal_id = req.params.id;
      await this.repository.insert(this.db, body);
      return res.status(200).send({ message: "Saved successfully" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

  list = async (req, res) => {
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
      select * from transactions
      where journal_id = $<journal_id>
      ${where}
      order by transaction_date desc
      ${limit}
      `,
        bindParams
      );

      const total = await this.db.one(`select count(*) from transactions`);
      return res
        .status(200)
        .send({ data: result, totalCount: Number(total.count) });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const { body } = req;
      console.log(body);
      await this.db.query(
        `delete from transactions where transactionid in ($1:csv)`,
        [body.journal_id]
      );
      res.status(200).send({ message: "Transaction has been deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  };

  getTipe = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.db.query(
        `
      select
        coalesce(sum(case t.tipe when 'pemasukan' then amount end), 0) as pemasukan,
        coalesce(sum(case t.tipe when 'pengeluaran' then amount end), 0) as pengeluaran
      from transactions t where journal_id = $1
      `,
        id
      );
      res.status(200).send({ data: result[0] });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
}

export default TransactionDetailController;
