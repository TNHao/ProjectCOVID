const categoryModel = require('../../models/sites/category.model')

module.exports = {
    get: async (req, res) => {

        const response = await categoryModel.findAll()
        const data = response.data

        console.log(data)

        res.render('layouts/sites/category',
            {
                layout: 'sites/main',
                data
            }
        )
    },
}