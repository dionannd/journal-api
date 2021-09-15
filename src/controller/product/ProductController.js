import { mainDb } from "../../lib/db";
import fs from "fs";

class ProductController {
  constructor() {
    this.db = mainDb;
  }

  getProduct = async (req, res) => {
    try {
      const products = await this.db.query(
        `select * FROM products order by product_id desc`
      );
      const result = products.map((product) => {
        return {
          ...product,
          image: `${process.env.PUBLIC_PATH}/products/${product.image}`,
        };
      });
      res.status(200).send({ data: result });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  insertProduct = async (req, res) => {
    try {
      const { body } = req;
      body.image = req.file ? req.file.filename : null;
      const data = await this.db.query(
        `
                INSERT INTO products (product_name, qty, description, created_at, image)
                VALUES ($<product_name>, $<qty>, $<description>, to_timestamp(${Date.now()} / 1000.0), $<image>)
                RETURNING *
            `,
        req.body
      );

      res.status(200).send({ message: "Produk berhasil ditambahkan", data });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  editProduct = async (req, res) => {
    try {
      const { body } = req;
      body.product_id = req.params.id;
      body.image = req.file ? req.file.filename : null;

      if (req.file) {
        const selectProduct = await this.db.oneOrNone(
          `select image from products where product_id = $1`,
          req.params.id
        );
        if (selectProduct.image) {
          fs.unlinkSync(`public/images/products/${selectProduct.image}`);
        }
      }

      const data = await this.db.query(
        `
                UPDATE products SET product_name = $<product_name>, qty = $<qty>, description = $<description> WHERE product_id = $<product_id>
                RETURNING *
            `,
        req.body
      );

      if (req.file) {
        await this.db.query(
          `
                UPDATE products SET image = $<image> WHERE product_id = $<product_id>
                RETURNING *
            `,
          req.body
        );
      }

      res.status(200).send({ message: "Product berhasil diperbarui" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  deleteProduct = async (req, res) => {
    try {
      const selectProduct = await this.db.oneOrNone(
        `select image from products where product_id = $1`,
        req.params.id
      );
      await fs.unlinkSync(`public/images/products/${selectProduct.image}`);
      await this.db.query(
        ` DELETE FROM products WHERE product_id = $1`,
        req.params.id
      );
      res.status(200).send({ message: "Product berhasil dihapus" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  detailProduct = async (req, res) => {
    try {
      const detailProduct = await this.db.oneOrNone(
        `select * from products where product_id = $1`,
        req.params.id
      );
      detailProduct.image = `${process.env.PUBLIC_PATH}/products/${detailProduct.image}`;

      res.status(200).send({ data: detailProduct });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
}

export default ProductController;
