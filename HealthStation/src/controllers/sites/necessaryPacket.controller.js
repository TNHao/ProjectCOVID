module.exports = {
    get: async (req, res) => {
        res.render('layouts/sites/necessaryPacket',
            {
                layout: 'sites/main',
            }
        )
    },
}