const categoryModel = require("../../models/sites/category.model")

module.exports = {
    get: async (req, res) => {
        const { data: categories } = await categoryModel.findAll()

        const { isLoggedIn, user } = res.locals;

        res.render('layouts/sites/home',
            {
                layout: 'sites/main',
                categories,
                isLoggedIn,
                user
            }
        )
    },
}