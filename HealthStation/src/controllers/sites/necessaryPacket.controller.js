module.exports = {
    get: async (req, res) => {
        const { isLoggedIn, user } = res.locals;

        res.render('layouts/sites/necessaryPacket',
            {
                layout: 'sites/main',
                isLoggedIn,
                user
            }
        )
    },
}