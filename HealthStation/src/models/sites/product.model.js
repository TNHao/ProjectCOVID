module.exports = {
    get: async (req, res) => {
        res.render('layouts/sites/product',
            {
                layout: 'sites/main',
            }
        )
    },
}