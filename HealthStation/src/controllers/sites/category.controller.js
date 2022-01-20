const categoryModel = require('../../models/sites/category.model');
const necessaryPacketModel = require('../../models/sites/necessaryPacket.model');

module.exports = {
    get: async (req, res) => {
        const { data: categories } = await categoryModel.findAll();
        const { id } = req.params;
        const { order } = req.query;

        const { isLoggedIn, user } = res.locals;

        const mainCategory = categories.find(category => Number(category.category_id) === Number(id));

        let { data: packages } = await necessaryPacketModel.getPackageByCategory(id);

        if (order !== undefined) {
            packages.sort(
                (a, b) => a.name.localeCompare(b.name)
            );

            if (order === "false") packages = [...packages].reverse();
        }

        if (!mainCategory)
            return res.redirect('/404-page-not-found');

        res.render('layouts/sites/category',
            {
                layout: 'sites/main',
                categories,
                mainCategory,
                packages,
                isLoggedIn,
                user,
                id
            }
        )
    },
}