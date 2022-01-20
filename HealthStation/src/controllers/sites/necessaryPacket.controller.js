const necessaryPacketModel = require("../../models/sites/necessaryPacket.model");
const productModel = require("../../models/sites/product.model");
const categoryModel = require('../../models/sites/category.model');

module.exports = {
    get: async (req, res) => {
        const { isLoggedIn, user } = res.locals;
        const { id } = req.params;

        const { data: package } = await necessaryPacketModel.findById(id);
        let { data: products } = await productModel.findByPackageId(package.package_id);

        
        products = products.map(product => {
            package.products.forEach(_product => {
                if(product.necessary_id === _product.necessary_id) {
                    product.max_necessary_per_package = _product.max_necessary_per_package
                } 
            })
            return product
        })

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

        let packages = [];
        let isEmpty = false;

        if (category !== "")
            packages = (await necessaryPacketModel.searchPackageWithCategory(searchTerm, category)).data;
        else
            packages = (await necessaryPacketModel.searchPackage(searchTerm)).data;

        if (packages.length === 0)
            isEmpty = true;

        res.render('layouts/sites/search',
            {
                layout: 'sites/main',
                isLoggedIn,
                user,
                categories,
                packages,
                searchTerm,
                isEmpty
            }
        )
    },
}