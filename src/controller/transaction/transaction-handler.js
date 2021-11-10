import { mainDb } from "../../lib/db";
import TransactionRepository from "./transaction-repository";

class TransactionDetailController {
  constructor() {
    this.db = mainDb;
    this.repository = new TransactionRepository();
  }

  save = async (req, res) => {
    try {
      const { body } = req;
      body.user_id = req.user.id;
      body.journal_id = req.params.id;
      await this.repository.insert(this.db, body);
      return res.status(200).send({ message: "Saved successfully" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

  getTransaction = async (req, res) => {
    try {
      const session = req;
      const result = await this.repository.getTransaction(
        this.db,
        session.params.id,
        session.user.id
      );
      return res.status(200).send({ data: result });
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
        journal_id: id,
      };
      if (page) {
        const offset = (page - 1) * pageSize;
        limit = ` limit $<pageSize> offset ${offset}`;
        bindParams = { ...bindParams, pageSize };
      }
      if (q) {
        where += ` AND ((name ~* $<q>))`;
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
      await this.repository.delete(this.db, body);
      res.status(200).send({ message: "Transaction has been deleted" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  getTipe = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.repository.tipe(this.db, id);
      res.status(200).send({ data: result[0] });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
}

export default TransactionDetailController;
