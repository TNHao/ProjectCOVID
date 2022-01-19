const productModel = require("../../models/sites/product.model");
const categoryModel = require("../../models/sites/category.model");

module.exports = {
    get: async (req, res) => {
        const { isLoggedIn, user } = res.locals;

        const { id } = req.params;
        const { data: product } = await productModel.findById(id);

        if (!product)
            return res.redirect('/404-page-not-found');

        const { data: category } = await categoryModel.findById(product.category_id);

        res.render('layouts/sites/product',
            {
                layout: 'sites/main',
                isLoggedIn,
                user,
                product,
                category
            }
        )
    },
}