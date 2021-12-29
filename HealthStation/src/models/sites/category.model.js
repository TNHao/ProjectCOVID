const {db, pgp} = require('../../config/db')

class CategoryModel {
  table = new pgp.helpers.TableName({ table: "Category"});

  async findAll() {
    const data = await db.any(`select * from $1 order by category_id `, this.table);
    return {data: data};
  }

  async findById(id) {
    const data = await db.one('select * from ${table} where category_id = ${id}', {
      table: this.table,
      id: id,
    });
    return {data};
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

  async delete(id) {
    const queryString = `
       delete from $(table) where category_id=$(id)
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
      id: category.id,
      name: category.name
    });
  }
}

module.exports = new CategoryModel();
