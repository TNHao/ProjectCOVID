
const categoryModel = require("../../models/sites/category.model");
const statModel = require("../../models/statistic/stat.model");
const packageModel = require('../../models/sites/necessaryPacket.model');
const logModel = require('../../models/sites/log.model');
module.exports = {
    get: async (req, res) => {
        const { data: categories } = await categoryModel.findAll();
        const { isLoggedIn, user } = res.locals;
        const packageStat = (await statModel.packageStat()).data;
        const necessaryStat = (await statModel.necessaryStat()).data;
        var sorters = {
            byAmount: function (a, b) {
                return (b.total - a.total);
            },
        };
        packageStat.sort(sorters.byAmount);
        //console.log(packageStat);
        const trendingPackage = [];
        for (let i = 0; i < 5; i++) {
            if (packageStat.lenght < i) break;
            trendingPackage.push((await packageModel.findByName(packageStat[i].package_name)).data)
        }
        const package = trendingPackage;
        res.render('layouts/sites/home',
            {
                layout: 'sites/main',
                categories,
                isLoggedIn,
                user,
                package
            }
        )
    },
}

