const { db, pgp } = require('../../config/db')
const productModel = require('./product.model')


// example:
//   const _package = {
//     name: 'Gói hỗ trợ 69',
//     max_per_person: 2,
//     package_id: 1,
//     period: 4,
//     products: [
//         {necessary_id: 2, max_necessary_per_package: 4},
//         {necessary_id: 3, max_necessary_per_package: 2},
//     ]
//   }

class NecessaryPacketModel {
  table = new pgp.helpers.TableName({ table: "Package" });

  necessaryPackageTable = new pgp.helpers.TableName({ table: "Necessary_Package" });

  helpers = {
    findNecessaryPackageById: async (id) => {
      const necessaryQueryString = `select * from $(table) where package_id = $(id)`
      const necessaries = await db.any(necessaryQueryString, {
        table: this.necessaryPackageTable,
        id: id
      })
      return necessaries
    },
    createNecessaryPackageById: async (package_id, products) => {
      const necessaryQueryString = `insert into $(table)(package_id, necessary_id, max_necessary_per_package) values($(package_id), $(necessary_id), $(max))`
      for (const product of products) {
        await db.none(necessaryQueryString, {
          table: this.necessaryPackageTable,
          package_id: package_id,
          necessary_id: product.necessary_id,
          max: product.max_necessary_per_package
        })
      }
    },
    deleteNecessaryPackageById: async (id) => {
      const packagePackageQueryString = `delete from $(table) where package_id = $(id)`
      await db.none(packagePackageQueryString, {
        table: this.necessaryPackageTable,
        id: id
      })
    },
  }

  async findAll() {
    const response = await db.any('select package_id from $1 order by package_id', this.table)
    const ids = response.map(item => item.package_id)
    const data = []
    for (const id of ids) {
      const _package = await this.findById(id)
      const item = await _package.data
      data.push(item)
    }

    return { data };
  }

  async findById(id) {
    const _package = await db.one('select * from ${table} where package_id = ${id}', {
      table: this.table,
      id: id,
    });
    const necessaries = await this.helpers.findNecessaryPackageById(id)
    const data = { ..._package, products: necessaries }
    return { data };
  }

  async findByName(name) {
    const _package = await db.one('select * from ${table} where name = ${name}', {
      table: this.table,
      name: name,
    });
    const necessaries = await this.helpers.findNecessaryPackageById(_package.package_id)
    const data = { ..._package, products: necessaries }
    return { data };
  }

  async create(_package) {
    const queryString = `
        insert into $(table)(name, max_per_person, period)
        values($(name), $(max_per_person), $(period))
        returning package_id;
    `;
    const response = await db.one(queryString, {
      table: this.table,
      name: _package.name,
      max_per_person: _package.max_per_person,
      period: _package.period,
    });

    const id = response.package_id
    await this.helpers.createNecessaryPackageById(id, _package.products)
  }

  async deleteById(id) {
    await this.helpers.deleteNecessaryPackageById(id)
    const queryString = `
       delete from $(table) where package_id=$(id)
    `;
    await db.none(queryString, {
      table: this.table,
      id
    });
  }

  async update(_package) {
    const queryString = `
       update $(table) set name = $(name), max_per_person = $(max_per_person), period = $(period) where package_id = $(id)
    `;
    await db.none(queryString, {
      table: this.table,
      id: _package.package_id,
      name: _package.name,
      max_per_person: _package.max_per_person,
      period: _package.period,
    });

    await this.helpers.deleteNecessaryPackageById(_package.package_id)
    await this.helpers.createNecessaryPackageById(_package.package_id, _package.products)
  }

  async getPackageByCategory(category_id) {
    const queryString = `
      Select distinct P.package_id, P.name, P.period, P.max_per_person
      from public."Package" P, public."Necessary_Package" NP, public."Necessary" N
      where 
        P.package_id = NP.package_id 
        and NP.necessary_id = N.necessary_id 
        and N.category_id=$(id)
    `

    const data = await db.manyOrNone(queryString, { id: category_id });
    return { data }
  }
}

module.exports = new NecessaryPacketModel();
