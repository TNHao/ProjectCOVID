module.exports = {
    get: async (req, res) => {
        res.render('layouts/sites/login',
            {
                layout: false,
            }
        )
    },
}