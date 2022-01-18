module.exports = {
    get: async (req, res) => {
        const { isLoggedIn, user } = res.locals;

        res.render('layouts/sites/product',
            {
                layout: 'sites/main',
                isLoggedIn,
                user
            }
        )
    },
}