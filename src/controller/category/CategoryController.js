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

  editCategory = async (req, res) => {
    try {
      const { body } = req;
      body.category_id = req.params.id;

      const data = await this.db.query(
        `UPDATE categories SET category_name = $<category_name>, icon = $<icon> WHERE category_id = $<category_id>
        RETURNING *`,
        req.body
      );
      res.status(200).send({ message: "Category berhasil diperbarui" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  deleteCategory = async (req, res) => {
    try {
      await this.db.query(
        `delete from categories where category_id = $1`,
        req.params.id
      );
      res.status(200).send({ message: "Category berhasil dihapus" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
}

export default CategoryController;
