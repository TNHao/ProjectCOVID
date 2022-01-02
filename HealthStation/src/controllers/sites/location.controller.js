const locationModel = require('../../models/sites/location.model')

module.exports = {
    get: async (req, res) => {
        location = { name: 'Tram so 2 ', num_patients: '11', capacity: '50' }
        const response = await locationModel.findById(1)

        const data = response.data

        console.log(data)
        res.send('hello')
    },
}