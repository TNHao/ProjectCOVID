const {db, pgp} = require('../../config/db')

class ProductModel {
  table = new pgp.helpers.TableName({ table: "Necessary"});

  imagesTable = new pgp.helpers.TableName({ table: "Necessary_Images"});

  necessaryPackageTable = new pgp.helpers.TableName({ table: "Necessary_Package"});

  helpers = {
    findImagesById: async(id) => {
        const imagesQueryString = `select img_url from $(table) where necessary_id = $(id)`
        const images = await db.any(imagesQueryString, {
            table: this.imagesTable,
            id: id
        })
        return images 
    },
    deleteImagesById: async (id) => {
        const imagesQueryString = `delete from $(table) where necessary_id = $(id)`
        await db.none(imagesQueryString, {
            table: this.imagesTable,
            id: id
        })
    },
    createImagesById: async(id, images) => {
        const imagesQueryString = `insert into $(table)(necessary_id, img_url) values($(id), $(image))`
          images.forEach(async(image) => {
            await db.none(imagesQueryString, {
                table: this.imagesTable,
                id: id,
                image: image
            })
        })
    },
    deleteNecessaryPackageById: async(id) => {
        const necessaryPackageQueryString = `delete from $(table) where necessary_id = $(id)`
        await db.none(necessaryPackageQueryString, {
            table: this.necessaryPackageTable,
            id: id
        })
    },
  }

  async findAll() {
    const response = await db.any('select necessary_id from $1 order by necessary_id', this.table)
    const ids = response.map(item => item.necessary_id)
    const data = []
    for(const id of ids) {
        const necessary = await this.findById(id)
        const item = await necessary.data
        data.push(item)
    }

    return {data};
  }

  async findById(id) {
    const necessary = await db.one('select * from ${table} where necessary_id = ${id}', {
      table: this.table,
      id: id,
    });
    const images = await this.helpers.findImagesById(necessary.necessary_id)
    const data = {...necessary, images: images}
    return {data};
  }

  async findByCategoryId(categoryId) {
    const response = await db.any('select necessary_id from ${table} where category_id = ${id}', {
      table: this.table,
      id: categoryId,
    });
    const ids = response.map(item => item.necessary_id)
    const data = []
    for(const id of ids) {
        const necessary = await this.findById(id)
        const item = await necessary.data
        data.push(item)
    }
    return {data};
  }

  async create(necessary) {
    const queryString = `
        insert into $(table)(name, category_id, price, unit)
        values($(name), $(category_id), $(price), $(unit))
        returning necessary_id;
    `;
    const response = await db.one(queryString, {
      table: this.table,
      name: necessary.name,
      category_id: necessary.category_id,
      price: necessary.price,
      unit: necessary.unit,
    });

    const id = response.necessary_id
    await this.helpers.createImagesById(id, necessary.images)
  }

  async deleteById(id) {
    await this.helpers.deleteImagesById(id)
    await this.helpers.deleteNecessaryPackageById(id)
    const queryString = `
       delete from $(table) where necessary_id=$(id)
    `;
    await db.none(queryString, {
      table: this.table,
      id
    });
  }

  async deleteByCategoryId(id) {
    const response = await this.findByCategoryId(id)
    const ids = response.data.map(necessary => necessary.necessary_id)
    ids.forEach(async(necessaryId) => {
        await this.deleteById(necessaryId)
    })
  }

  async update(necessary) {
    const queryString = `
       update $(table) set name = $(name), category_id = $(category_id), price = $(price), unit = $(unit), where necessary_id = $(id)
    `;
    await db.none(queryString, {
      table: this.table,  
      id: necessary.necessary_id,
      name: necessary.name,
      category_id: necessary.category_id,
      price: necessary.price,
      unit: necessary.unit,
    });

    await this.helpers.deleteImagesById(necessary.necessary_id)
    await this.helpers.createImagesById(necessary.necessary_id, necessary.images)
  }
}

module.exports = new ProductModel();
