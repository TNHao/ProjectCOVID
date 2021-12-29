module.exports = {
    get: async (req, res) => {
        res.render('layouts/sites/home',
            {
                layout: 'sites/main',
            }
        )
    },
}