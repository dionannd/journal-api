import { mainDb } from "../../lib/db";
import JournalRepository from "./journal-repository";

class JournalController {
  constructor() {
    this.db = mainDb;
    this.repository = new JournalRepository();
  }

  getList = async (req, res) => {
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
        `select j.*, (
          select coalesce(sum(amount), 0) as total
          from transactions t
          where t.transaction_id = j.journal_id
        ) from journals j
        where user_id = $<user_id>
        ${where}
        group by j.journal_id
        `,
        bindParams
      );
      return res.status(200).send({ data });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  save = async (req, res) => {
    try {
      const { body } = req;
      const session = req.user;
      await this.repository.insert(this.db, session, body);
      return res.status(200).send({ message: "Save successfully added" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const checkData = await db.one(
        `
        select count(*) from transactions where transaction_id = $1
      `,
        id
      );

      if (checkData && checkData.count > 0) {
        return res.status(400).send({ message: "Data in use" });
      }
      await this.repository.delete(this.db, id);
      res.status(200).send({ message: "Journal has been deleted" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
}

export default JournalController;
