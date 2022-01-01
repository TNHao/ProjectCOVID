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
const productModel = require('../../models/sites/product.model')
const packageModel = require('../../models/sites/necessaryPacket.model')
const { uploadMultipleFiles, deleteFile } = require('../../config/firebase')

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
    getAccountDetails: async (req, res) => {
        res.render('layouts/manager/accountDetails',
            {
                layout: 'manager/main',
                data: fakeManagementData,
                relate: fakeData,
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

    // start category
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
    // end category

    // start product
    getProduct: async (req, res) => {
        const response = await productModel.findAll()
        const data = response.data
        res.render('layouts/manager/productManagement',
            {
                layout: 'manager/main',
                data: data,
                active: { proManagement: true }
            }
        )
    },

    getCreateProduct: async (req, res) => {
        const categories = await categoryModel.findAll()
        const categoriesData = categories.data
        res.render('layouts/manager/createProd', {
            layout: 'manager/main',
            categories: categoriesData,
            active: { proManagement: true }
        })
    },


    postCreateProduct: async (req, res) => {
        const files = await uploadMultipleFiles(req.files)
        const product = {...req.body, images: files}
        await productModel.create(product)
        res.redirect('/manager/product-management')
    },

    detailsProduct: async (req, res) => {
        const categories = await categoryModel.findAll()
        const categoriesData = categories.data
        const id = parseInt(req.params.id)
        const product = await productModel.findById(id)
        const productData = product.data
        res.render('layouts/manager/editProd', {
            layout: 'manager/main',
            categories: categoriesData,
            product: productData,
            active: { proManagement: true }
        })
    },
    

    updateProduct: async (req, res) => {
        const id = req.params.id
        const files = await uploadMultipleFiles(req.files)
        const product = {...req.body, images: files, necessary_id: id}
        await productModel.update(product)
        res.redirect('/manager/product-management/')
    },

    deleteProduct: async (req, res) => {
        const id = req.body.delete_product_id
        await productModel.deleteById(id)
        res.redirect('/manager/product-management')
    },
    // end product
    

    // start package
    getPackage: async (req, res) => {
        const response = await packageModel.findAll()
        const data = response.data

        res.render('layouts/manager/packageManagement',
            {
                layout: 'manager/main',
                data: data,
                active: { packManagement: true }
            }
        )
    },


    getCreatePackage: async (req, res) => {
        const products = await productModel.findAll()
        const productsData = products.data
        res.render('layouts/manager/createPack', {
            layout: 'manager/main',
            products: productsData,
            active: { packManagement: true }
        })
    },


    postCreatePackage: async (req, res) => {
        const _package = {...req.body}
        console.log(_package)

        _package.products = 
                _package.products
                    .split(',')
                    .filter(product => product !== '')
                    .map(product => {
                        return {
                            necessary_id: product.split('-')[0],
                            max_necessary_per_package: product.split('-')[1],
                        }
                    })

        
        await packageModel.create(_package)
        res.redirect('/manager/package-management')
    },

    detailsPackage: async (req, res) => {
        const products = await productModel.findAll()
        const productsData = products.data
        const id = parseInt(req.params.id)
        const _package = await packageModel.findById(id)
        const packageData = _package.data

        let inputValue = ''

        for(const product of packageData.products) {
            let temp = product.necessary_id + '-' + product.max_necessary_per_package
            inputValue += temp
            inputValue += ','
        }

        res.render('layouts/manager/editPack', {
            layout: 'manager/main',
            products: productsData,
            package: packageData,
            inputValue: inputValue,
            active: { packManagement: true }
        })
    },
    

    updatePackage: async (req, res) => {
        const id = req.params.id
        const _package = {...req.body, package_id: id}
        _package.products = 
                _package.products
                    .split(',')
                    .filter(product => product !== '')
                    .map(product => {
                        return {
                            necessary_id: product.split('-')[0],
                            max_necessary_per_package: product.split('-')[1],
                        }
                    })


        await packageModel.update(_package)
        res.redirect('/manager/package-management')
    },
   
 

    deletePackage: async (req, res) => {
        const id = req.body.delete_package_id
        await packageModel.deleteById(id)
        res.redirect('/manager/package-management')
    },
    // end package

}