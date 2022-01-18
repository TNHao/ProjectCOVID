const necessaryPacketModel = require("../../models/sites/necessaryPacket.model");
const productModel = require("../../models/sites/product.model");

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
}