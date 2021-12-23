const data = { name: 'xxx', description: 'yyy' }

module.exports = {
    get: async (req, res) => {
        res.render('layouts/sites/category',
            {
                layout: 'sites/main',
                data
            }
        )
    },
}