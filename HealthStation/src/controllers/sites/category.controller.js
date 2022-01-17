const categoryModel = require('../../models/sites/category.model')

module.exports = {
    get: async (req, res) => {
        const { data: categories } = await categoryModel.findAll();
        const { id } = req.params;

        const mainCategory = categories.find(category => Number(category.category_id) === Number(id));

        if (!mainCategory)
            return res.redirect('/404-page-not-found');

        res.render('layouts/sites/category',
            {
                layout: 'sites/main',
                categories,
                mainCategory
            }
        )
    },
}