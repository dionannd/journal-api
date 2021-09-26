import { mainDb } from "../../lib/db";

class DetailController {
  constructor() {
    this.db = mainDb;
  }

  getDetail = async (req, res) => {
    try {
      const data = await this.db.query(
        `select * from transaction_details where user_id = $1 and transaction_id = $2`,
        [req.user.id, req.params.id]
      );

      return res.status(200).send({ data });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  insertDetail = async (req, res) => {
    try {
      const { body } = req;
      body.user_id = req.user.id;
      await this.db.query(
        `insert into transaction_details (transaction_id, description, type, amount, transaction_date) values ($<transaction_id>, $<description>, $<type>, $<amount>, $<transaction_date>)`,
        body
      );
      res.status(200).send({ message: "Transaksi berhasil ditambahkan" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  deleteDetail = async (req, res) => {
    try {
      await this.db.query(
        `delete from transaction_details where transaction_detail_id = $1`,
        req.params.id
      );
      res.status(200).send({ message: "Transaksi berhasil dihapus" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
}

export default DetailController;
