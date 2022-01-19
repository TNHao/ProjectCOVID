const necessaryPacketModel = require("../../models/sites/necessaryPacket.model");
const productModel = require("../../models/sites/product.model");
const categoryModel = require('../../models/sites/category.model');

module.exports = {
    get: async (req, res) => {
        const { isLoggedIn, user } = res.locals;
        const { id } = req.params;

        const { data: package } = await necessaryPacketModel.findById(id);
        const { data: products } = await productModel.findByPackageId(package.package_id);

        res.render('layouts/sites/necessaryPacket',
            {
                layout: 'sites/main',
                isLoggedIn,
                user,
                package,
                products
            }
        )
    },
    search: async (req, res) => {
        const { isLoggedIn, user } = res.locals;
        const { searchTerm, category } = req.query;

        const { data: categories } = await categoryModel.findAll();
        const { data: packages } = await necessaryPacketModel.searchPackage(searchTerm);                 

        res.render('layouts/sites/search',
            {
                layout: 'sites/main',
                isLoggedIn,
                user,
                categories,
                packages,
                searchTerm
            }
        )
    },
}