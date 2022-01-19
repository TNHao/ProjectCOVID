const fakePaymentData = [
  {
    name: "Sage Rodriguez",
    debt: 50000,
    status: "F0",
  },
  {
    name: "Doris Greene",
    debt: 10000,
    status: "F1",
  },
  {
    name: "Mason Porter",
    debt: 0,
    status: "F2",
  },
  {
    name: "Jon Porter",
    debt: 40000,
    status: "F0",
  },
];

const fakeData = [
  {
    name: "Sage Rodriguez",
    country: "Netherlands",
    city: "Baileux",
    status: "F0",
  },
  {
    name: "Doris Greene",
    country: "Malawi",
    city: "Feldkirchen in Kärnten",
    status: "F1",
  },
  {
    name: "Mason Porter",
    country: "Chile",
    city: "Gloucester",
    status: "F2",
  },
  {
    name: "Jon Porter",
    country: "Portugal",
    city: "Gloucester",
    status: "F0",
  },
];

const fakeManagementData = [
  {
    type: "Thêm mới",
    description: "Thêm bệnh nhân A vào danh sách những người F0 ",
    create_at: "22/12/2021",
  },
  {
    type: "Thêm nhu yếu phẩm",
    description: "Thêm Đường vào danh sách nhu yếu phẩm",
    create_at: "22/12/2021",
  },
  {
    type: "Xóa gói nhu yếu phẩm",
    description: "Xóa gói hỗ trợ 69",
    create_at: "22/12/2021",
  },
  {
    type: "Chuyển nơi điều trị",
    description: "Chuyền bệnh nhân X từ khu cách ly A sang khu cách ly B",
    create_at: "22/12/2021",
  },
  {
    type: "Xuất viện",
    description: "Cho phép bệnh nhân A rời khỏi khu cách ly",
    create_at: "22/12/2021",
  },
];



const categoryModel = require("../../models/sites/category.model");
const productModel = require("../../models/sites/product.model");
const packageModel = require("../../models/sites/necessaryPacket.model");
const userModel = require("../../models/user/user.model");
const minimumPaymentModel = require("../../models/sites/minimumPayment.model");
const quarantineLocationModel = require("../../models/sites/location.model");
const { uploadMultipleFiles, deleteFile } = require("../../config/firebase");
const moment = require('moment')
const {
  updateStateOfAllRelated,
  updateStateById,
} = require("../../models/user/user.model");
const { PERMISSIONS } = require('../../constants/index')
const { callBankingApi } = require('../../lib/utils')

module.exports = {
  get: async (req, res) => {
    const { data } = await userModel.findAllPatient();
    const { data: locations } = await quarantineLocationModel.findAvailableLocation();
    res.render("layouts/manager/createAcc", {
      layout: "manager/main",
      data: data,
      quarantine_location: locations,
      active: { createAcc: true },
    });
  },

  addPatient: async (req, res) => {
    console.log(req.body);
    const user = {
      fullname: req.body.fullname,
      username: req.body.identity,
      dob: req.body.birthday,
      state: req.body.status,
      city: req.body.city,
      district: req.body.district,
      ward: req.body.ward,
      national_id: req.body.identity,
      password: "",
      permission: PERMISSIONS['user'],
    };
    const related_id = req.body.relate.split(",");
    const add_create = await userModel.create(user);
    if (add_create != true) {
      const data = await userModel.findAllPatient();
      const location = await quarantineLocationModel.findAvailableLocation();
      console.log(location.data);
      res.render("layouts/manager/createAcc", {
        layout: "manager/main",
        data: data.data,
        quarantine_location: location.data,
        active: { createAcc: true },
        message: { status: "danger", content: add_create },
      });
    } else {
      const user_id = (await userModel.findByUsername(user.username)).data
        .account_id;

      await callBankingApi('/auth/register', "POST", { id: user_id})
      
      for (let i = 0; i < related_id.length; i++) {
        await userModel.createRelated(user_id, related_id[i]);
        await userModel.createRelated(related_id[i], user_id);
      }
      return res.redirect("/manager");
    }
  },

  getAccount: async (req, res) => {
    const data = await userModel.findAllPatient();
    res.render("layouts/manager/accountManagement", {
      layout: "manager/main",
      data: data.data,
      active: { accManagement: true },
    });
  },

  getAccountDetails: async (req, res) => {
    console.log(req.params);
    const data = await userModel.findById(parseInt(req.params.id));
    const related_id = await userModel.findAllRelatedById(
      parseInt(req.params.id)
    );
    const related = [];
    for (let i = 0; i < related_id.data.length; i++) {
      related.push((await userModel.findById(related_id.data[i])).data);
    }
    console.log(related);
    res.render("layouts/manager/accountDetails", {
      layout: "manager/main",
      data: fakeManagementData,
      username: data.data.username,
      fullname: data.data.fullname,
      relate: related,
      active: { accManagement: true },
    });
  },

  getAccountEdit: async (req, res, next) => {
    const id = parseInt(req.params.id)
    const { data: user } = await userModel.findById(id);
    const { data: relatedId } = await userModel.findAllRelatedById(id);
    const { data: locations } = await quarantineLocationModel.findAvailableLocation();
    const related = [];
    for (let i = 0; i < relatedId.length; i++) {
      const { data: relatedUser } = await userModel.findById(relatedId[i])
      related.push(relatedUser);
    }
    console.log(related);
    user.dob = moment(user.dob).format('YYYY-MM-DD')
    res.render("layouts/manager/editAcc", {
      layout: "manager/main",
      relate: related,
      patient: user,
      quarantine_location: locations,
      active: { accManagement: true },
    });
  },

  // start category
  getCategory: async (req, res) => {
    const { data } = await categoryModel.findAll();

    res.render("layouts/manager/categoryManagement", {
      layout: "manager/main",
      data: data,
      active: { catManagement: true },
    });
  },

  createCategory: async (req, res) => {
    const name = req.body.name;
    await categoryModel.create({ name });
    res.redirect("/manager/category-management");
  },

  updateCategory: async (req, res) => {
    await categoryModel.update(req.body);
    res.redirect("/manager/category-management");
  },

  deleteCategory: async (req, res) => {
    const id = req.body.delete_category_id;
    await categoryModel.deleteById(id);
    res.redirect("/manager/category-management");
  },
  // end category

  // start product
  getProduct: async (req, res) => {
    const { data } = await productModel.findAll();
    for (const product of data) {
      const category = await categoryModel.findById(product.category_id);
      product.category_name = category.data.name;
    }

    res.render("layouts/manager/productManagement", {
      layout: "manager/main",
      data: data,
      active: { proManagement: true },
    });
  },

  getCreateProduct: async (req, res) => {
    const { data: categories } = await categoryModel.findAll();
    res.render("layouts/manager/createProd", {
      layout: "manager/main",
      categories: categories,
      active: { proManagement: true },
    });
  },

  postCreateProduct: async (req, res) => {
    const files = await uploadMultipleFiles(req.files);
    const product = { ...req.body, images: files };
    await productModel.create(product);
    res.redirect("/manager/product-management");
  },

  detailsProduct: async (req, res) => {
    const { data: categoriesData } = await categoryModel.findAll();
    const id = parseInt(req.params.id);
    const { data: productData } = await productModel.findById(id);
    res.render("layouts/manager/editProd", {
      layout: "manager/main",
      categories: categoriesData,
      product: productData,
      active: { proManagement: true },
    });
  },

  updateProduct: async (req, res) => {
    const id = req.params.id;
    const files = await uploadMultipleFiles(req.files);
    const product = { ...req.body, images: files, necessary_id: id };
    await productModel.update(product);
    res.redirect("/manager/product-management/");
  },

  deleteProduct: async (req, res) => {
    const id = req.body.delete_product_id;
    await productModel.deleteById(id);
    res.redirect("/manager/product-management");
  },
  // end product

  // start package
  getPackage: async (req, res) => {
    const { data } = await packageModel.findAll();

    res.render("layouts/manager/packageManagement", {
      layout: "manager/main",
      data: data,
      active: { packManagement: true },
    });
  },

  getCreatePackage: async (req, res) => {
    const { data: productsData } = await productModel.findAll();
    res.render("layouts/manager/createPack", {
      layout: "manager/main",
      products: productsData,
      active: { packManagement: true },
    });
  },

  postCreatePackage: async (req, res) => {
    const _package = { ...req.body };

    _package.products = _package.products
      .split(",")
      .filter((product) => product !== "")
      .map((product) => {
        return {
          necessary_id: product.split("-")[0],
          max_necessary_per_package: product.split("-")[1],
        };
      });

    await packageModel.create(_package);
    res.redirect("/manager/package-management");
  },

  detailsPackage: async (req, res) => {
    const { data: productsData } = await productModel.findAll();
    const id = parseInt(req.params.id);
    const { data: packageData } = await packageModel.findById(id);

    let inputValue = "";

    for (const product of packageData.products) {
      let temp = product.necessary_id + "-" + product.max_necessary_per_package;
      inputValue += temp;
      inputValue += ",";
    }

    res.render("layouts/manager/editPack", {
      layout: "manager/main",
      products: productsData,
      package: packageData,
      inputValue: inputValue,
      active: { packManagement: true },
    });
  },

  updatePackage: async (req, res) => {
    const id = req.params.id;
    const _package = { ...req.body, package_id: id };
    _package.products = _package.products
      .split(",")
      .filter((product) => product !== "")
      .map((product) => {
        return {
          necessary_id: product.split("-")[0],
          max_necessary_per_package: product.split("-")[1],
        };
      });

    await packageModel.update(_package);
    res.redirect("/manager/package-management");
  },

  deletePackage: async (req, res) => {
    const id = req.body.delete_package_id;
    await packageModel.deleteById(id);
    res.redirect("/manager/package-management");
  },
  // end package

  // start payment
  getPayment: async (req, res, next) => {
    const { data: amount } = await minimumPaymentModel.find();
    res.render("layouts/manager/paymentManagement", {
      layout: "manager/main",
      amount: amount,
      data: fakePaymentData,
      active: { paymentManagement: true },
    });
  },

  updatePayment: async (req, res, next) => {
    const amount = req.body.amount;
    await minimumPaymentModel.update(amount);
    res.redirect("/manager/payment-management");
  },
};
