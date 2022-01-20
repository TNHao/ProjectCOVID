const {db, pgp} = require('../../config/db')
const productModel = require('./product.model')


// example:
//   const category = {
//     name: 'Thực phẩm',
//     category_id: 2,
//   }

class CategoryModel {
  table = new pgp.helpers.TableName({ table: "Category"});

  async findAll() {
    const data = await db.any(`select * from $1 where is_delete = '0' order by category_id `, this.table);
    return { data };
  }

  async findById(id) {
    const data = await db.one(`select * from $(table) where category_id = $(id) and is_delete = '0'`, {
      table: this.table,
      id: id,
    });
    return { data };
  }

  async create(category) {
    const queryString = `
        insert into $(table)(name)
        values($(name));
    `;
    await db.none(queryString, {
      table: this.table,
      name: category.name
    });
  }

  async deleteById(id) {

    await productModel.deleteByCategoryId(id)

    const queryString = `
       update $(table) set is_delete = '1' where category_id=$(id)
    `;
    await db.none(queryString, {
      table: this.table,
      id
    });
  }

  async update(category) {
    const queryString = `
       update $(table) set name = $(name) where category_id = $(id)
    `;
    await db.none(queryString, {
      table: this.table,  
      id: category.category_id,
      name: category.name
    });
  }
}

module.exports = new CategoryModel();
