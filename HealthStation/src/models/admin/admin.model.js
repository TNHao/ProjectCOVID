const fakeData = [
    {
        name: "Sage Rodriguez",
        country: 'Netherlands',
        city: 'Baileux',
        salary: '$56,142'
    },
    {
        name: 'Doris Greene',
        country: 'Malawi',
        city: 'Feldkirchen in Kärnten',
        salary: '$63,542',
    },
    {
        name: 'Mason Porter',
        country: 'Chile',
        city: 'Gloucester',
        salary: '$78,615',
    },
    {
        name: 'Jon Porter',
        country: 'Portugal',
        city: 'Gloucester',
        salary: '$98,615',
    },
]

const fakeIsolationWardData = [
    {
        name: "Sage Rodriguez",
        capacity: 5,
        used: 5,
    },
    {
        name: "Doris Greene",
        capacity: 5,
        used: 5,
    },
    {
        name: "Jon Porter",
        capacity: 5,
        used: 5,
    },
    {
        name: "Mason Porter",
        capacity: 5,
        used: 5,
    },
    {
        name: "Chet Faker",
        capacity: 5,
        used: 5,
    },
]

module.exports = {
    get: async (req, res) => {
        res.render('layouts/admin/createManagerAcc',
            {
                layout: 'admin/main',
                active: { createAcc: true }
            }
        )
    },
    getAccount: async (req, res) => {
        res.render('layouts/admin/accountManagement',
            {
                layout: 'admin/main',
                data: fakeData,
                active: { accManagement: true }
            }
        )
    },
    getIsolationWard: async (req, res) => {
        res.render('layouts/admin/isolationWardManagement',
            {
                layout: 'admin/main',
                data: fakeIsolationWardData,
                active: { isolationWardManagement: true }

            }
        )
    },
}