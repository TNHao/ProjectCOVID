const fakeData = [
    {
        name: "Sage Rodriguez",
        country: 'Netherlands',
        city: 'Baileux',
        status: 'F0'
    },
    {
        name: 'Doris Greene',
        country: 'Malawi',
        city: 'Feldkirchen in Kärnten',
        status: 'F1',
    },
    {
        name: 'Mason Porter',
        country: 'Chile',
        city: 'Gloucester',
        status: 'F2',
    },
    {
        name: 'Jon Porter',
        country: 'Portugal',
        city: 'Gloucester',
        status: 'F0',
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

const fakeManagementData = [
    {
        type: 'Thêm mới',
        description: 'Thêm bệnh nhân A vào danh sách những người F0 ',
        create_at: '22/12/2021',
    },
    {
        type: 'Thêm nhu yếu phẩm',
        description: 'Thêm Đường vào danh sách nhu yếu phẩm',
        create_at: '22/12/2021',
    },
    {
        type: 'Xóa gói nhu yếu phẩm',
        description: 'Xóa gói hỗ trợ 69',
        create_at: '22/12/2021',
    },
    {
        type: 'Chuyển nơi điều trị',
        description: 'Chuyền bệnh nhân X từ khu cách ly A sang khu cách ly B',
        create_at: '22/12/2021',
    },
    {
        type: 'Xuất viện',
        description: 'Cho phép bệnh nhân A rời khỏi khu cách ly',
        create_at: '22/12/2021',
    },
]

const fakePatientData = {
    fullname: 'Nguyễn Hoàng Tiến',
    identity: '123456789',
    birthday: '2001-12-21',
    status: 1,
    city: 2,
    district: 3,
    ward: 4,
    isolation: 2,
    relate: '1,3,2'
}

module.exports = {
    get: async (req, res) => {
        res.render('layouts/manager/createAcc',
            {
                layout: 'manager/main',
                data: fakeData,
                active: { createAcc: true }
            }
        )
    },
    getAccount: async (req, res) => {
        res.render('layouts/manager/accountManagement',
            {
                layout: 'manager/main',
                data: fakeData,
                active: { accManagement: true }
            }
        )
    },
    getAccountHistory: async (req, res) => {
        res.render('layouts/manager/accountHistory',
            {
                layout: 'manager/main',
                data: fakeManagementData,
                active: { accManagement: true }
            }
        )
    },

    getAccountEdit: async(req, res, next) => {
        res.render('layouts/manager/editAcc',
            {
                layout: 'manager/main',
                data: fakeData,
                patient: fakePatientData,
                active: { accManagement: true }
            }
        )
    },

    getIsolationWard: async (req, res) => {
        res.render('layouts/manager/isolationWardManagement',
            {
                layout: 'manager/main',
                data: fakeIsolationWardData,
                active: { isolationWardManagement: true }
            }
        )
    },
}