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

const categoryModel = require('../../models/sites/category.model')

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

    getCategory: async (req, res) => {
        const response = await categoryModel.findAll()
        const data = response.data

        res.render('layouts/manager/categoryManagement',
            {
                layout: 'manager/main',
                data: data,
                active: { catManagement: true }
            }
        )
    },

    createCategory: async (req, res) => {
        const name = req.body.name
        await categoryModel.create({name})
        res.redirect('/manager/category-management')
    },

    updateCategory: async (req, res) => {
        await categoryModel.update(req.body)
        res.redirect('/manager/category-management')
    },

    deleteCategory: async (req, res) => {
        const id = req.body.delete_category_id
        await categoryModel.deleteById(id)
        res.redirect('/manager/category-management')
    },
    
}