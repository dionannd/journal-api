import { mainDb } from "../../lib/db";

class CategoryController {
  constructor() {
    this.db = mainDb;
  }

  getCategory = async (req, res) => {
    try {
      const categories = await this.db.query(
        `select * FROM categories order by category_id desc`
      );
      const result = categories.map((category) => {
        return {
          ...category,
        };
      });
      res.status(200).send({ data: result });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  insertCategory = async (req, res) => {
    try {
      const { body } = req;
      const data = await this.db.query(
        `insert INTO categories (category_name, icon, created_at) values ($<category_name>, $<icon>, to_timestamp(${Date.now()} / 1000.0))
        returning *`,
        req.body
      );
      res.status(200).send({ message: "Kategori berhasil ditambahkan" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
}

export default CategoryController;
