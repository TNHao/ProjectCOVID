const utils = require('../../lib/utils');

const fakePaymentData = [
  {
    name: 'Sage Rodriguez',
    debt: 50000,
    status: 'F0',
  },
  {
    name: 'Doris Greene',
    debt: 10000,
    status: 'F1',
  },
  {
    name: 'Mason Porter',
    debt: 0,
    status: 'F2',
  },
  {
    name: 'Jon Porter',
    debt: 40000,
    status: 'F0',
  },
];

const fakeData = [
  {
    name: 'Sage Rodriguez',
    country: 'Netherlands',
    city: 'Baileux',
    status: 'F0',
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
];


const fakePaymentChartData = {
  months: "['Tháng 6 - 2021', 'Tháng 7 - 2021', 'Tháng 8 - 2021', 'Tháng 9 - 2021', 'Tháng 10 - 2021', 'Tháng 11 - 2021', 'Tháng 12 - 2021', 'Tháng 1 - 2022']",
  data: {
    debt: "[16326000, 32883000, 41044000, 23759000, 37569000, 27091000, 34904000, 25865000]",
    payment: "[63101000, 49837000, 23081000, 47989000, 22778000, 52021000, 29205000, 76020000]"
  }
}


const categoryModel = require("../../models/sites/category.model");
const productModel = require("../../models/sites/product.model");
const packageModel = require("../../models/sites/necessaryPacket.model");
const userModel = require("../../models/user/user.model");
const minimumPaymentModel = require("../../models/sites/minimumPayment.model");
const quarantineLocationModel = require("../../models/sites/location.model");
const logModel = require("../../models/sites/log.model");
const numPatientsLogModel = require('../../models/sites/numPatientsLog.model')
const orderModel = require('../../models/sites/order.model');
const { uploadMultipleFiles, uploadFile, deleteFile } = require("../../config/firebase");
const moment = require('moment')

const {
  updateStateOfAllRelated,
  updateStateById,
} = require('../../models/user/user.model');
const { PERMISSIONS } = require('../../constants/index');
const { db } = require('../../config/db');
const { callBankingApi } = require('../../lib/utils');
const locationModel = require('../../models/sites/location.model');

module.exports = {
  get: async (req, res) => {
    const { data } = await userModel.findAllPatient();
    const { data: locations } =
      await quarantineLocationModel.findAvailableLocation();
    res.render('layouts/manager/createAcc', {
      layout: 'manager/main',
      data: data,
      quarantine_location: locations,
      active: { createAcc: true },
    });
    console.log(res.locals.user.account_id);
  },

  addPatient: async (req, res) => {
    //console.log(req.body);
    const user = {
      fullname: req.body.fullname,
      username: req.body.identity,
      dob: req.body.birthday,
      state: req.body.status,
      city: req.body.city,
      district: req.body.district,
      ward: req.body.ward,
      national_id: req.body.identity,

      quarantine_location_id: req.body.isolation,
      password: '',
      permission: PERMISSIONS['user'],
    };
    const related_id = req.body.relate.split(',');
    const add_create = await userModel.create(user);
    if (add_create != true) {
      res.render('layouts/manager/createAcc', {
        layout: 'manager/main',
        data: data.data,
        quarantine_location: location.data,
        active: { createAcc: true },
        message: { status: 'danger', content: add_create },
      });
    } else {
      const { data: selected_location } =
        await quarantineLocationModel.findByLocationId(req.body.isolation);
      selected_location.num_patients += 1;
      const update_selected_location = await quarantineLocationModel.update(
        selected_location
      );
      const user_id = (await userModel.findByUsername(user.username)).data
        .account_id;
      await logModel.create(
        res.locals.user.account_id,
        'Account',
        'add',
        null,
        req.body.status,
        'state',
        user_id,
        `Thêm ${req.body.identity} vào khu cách ly ${selected_location.name}`
      );
      await callBankingApi('/auth/register', 'POST', { id: user_id });

      for (let i = 0; i < related_id.length; i++) {
        await userModel.createRelated(user_id, related_id[i]);
        await userModel.createRelated(related_id[i], user_id);
      }
      return res.redirect('/manager');
    }
  },

  getAccount: async (req, res) => {
    const data = await userModel.findAllPatient();
    let response = await numPatientsLogModel.findAll();
    response.data = response.data.slice(Math.max(response.data.length - 10, 0));
    const chart_data = {
      dates: [],
      data: {
        normal: [],
        F0: [],
        F1: [],
        F2: [],
        F3: [],
      },
    };
    for (let i = 0; i < response.data.length; i++) {
      chart_data.dates.push(
        moment(response.data[i].date_created).format('DD-MM-YYYY')
      );
      chart_data.data.normal.push(response.data[i].normal);
      chart_data.data.F0.push(response.data[i].f0);
      chart_data.data.F1.push(response.data[i].f1);
      chart_data.data.F2.push(response.data[i].f2);
      chart_data.data.F3.push(response.data[i].f3);
    }
    chart_data.dates = utils.arrayStringToString(chart_data.dates);
    chart_data.data.normal = utils.arrayNumberToString(chart_data.data.normal);
    chart_data.data.F0 = utils.arrayNumberToString(chart_data.data.F0);
    chart_data.data.F1 = utils.arrayNumberToString(chart_data.data.F1);
    chart_data.data.F2 = utils.arrayNumberToString(chart_data.data.F2);
    chart_data.data.F3 = utils.arrayNumberToString(chart_data.data.F3);


    res.render("layouts/manager/accountManagement", {
      layout: "manager/main",
      data: data.data,
      chart_data: chart_data,
      active: { accManagement: true },
    });
  },


  getAccountDetails: async (req, res) => {
    console.log(req.params);
    const data = await userModel.findById(parseInt(req.params.id));
    let { data: managementData = [] } = await logModel.findByUserId(req.params.id);
    managementData = managementData.map(item => ({
      type: item.action,
      description: item.description,
      create_at: moment(item.date).format('YYYY-MM-DD')
    }))

    const related_id = await userModel.findAllRelatedById(
      parseInt(req.params.id)
    );
    const related = [];
    for (let i = 0; i < related_id.data.length; i++) {
      related.push((await userModel.findById(related_id.data[i])).data);
    }
    console.log(related);
    res.render('layouts/manager/accountDetails', {
      layout: 'manager/main',
      data: managementData,
      username: data.data.username,
      fullname: data.data.fullname,
      relate: related,
      active: { accManagement: true },
    });
  },

  getAccountEdit: async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { data: user } = await userModel.findById(id);
    let { data: locations } = await quarantineLocationModel.findAll();

    locations = locations.map((location) => {
      if (
        location.num_patients < location.capacity ||
        location.location_id == user.quarantine_location_id
      ) {
        return location;
      }
    });
    const related_base_data = (await userModel.findAllPatientWithout(id)).data;
    const related_with_user = (await userModel.findAllRelatedById(id)).data;
    user.relate = related_with_user.join(',');
    user.dob = moment(user.dob).format('YYYY-MM-DD');
    res.render('layouts/manager/editAcc', {
      layout: 'manager/main',
      relate: related_base_data,
      patient: user,
      quarantine_location: locations,
      active: { accManagement: true },
    });
  },
  updatePatient: async (req, res) => {
    console.log(req.body);
    const user = {
      username: req.body.identity,
      national_id: req.body.identity,
      permission: 4,
      fullname: req.body.fullname,
      dob: req.body.birthday,
      city: req.body.city,
      state: req.body.state == 'KB' ? null : req.body.state,
      district: req.body.district,
      ward: req.body.ward,
      quarantine_location_id: req.body.isolation,
    };
    console.log(user);
    const update_patient = await userModel.updatePatientInformation(user);

    console.log(update_patient);
    if (update_patient == 'Success') {
      if (req.body.state != req.body.oldState) {
        if (req.body.state == 'KB') {
          await logModel.create(
            res.locals.user.account_id,
            'Account',
            'update',
            req.body.oldState,
            null,
            'quarantine_location',
            req.params.id,
            `Cho ${req.body.identity} xuất viện`
          );
        } else {
          const oldState = `F${req.body.state}`;
          const newState = `F${req.body.state}`;
          await logModel.create(
            res.locals.user.account_id,
            'Account',
            'update',
            req.body.oldState,
            req.body.state,
            'quarantine_location',
            req.params.id,
            `Đổi trạng thái ${req.body.identity} từ ${oldState} sang ${newState}`
          );
        }
      }
      if (req.body.isolation != req.body.oldIsolation) {
        let oldName = ''
        if (req.body.oldIsolation != '') {
          oldName = (await locationModel.findById(req.body.oldIsolation))
            .data.name;
        }
        const newName = (await locationModel.findById(req.body.isolation)).data
          .name;
        await logModel.create(
          res.locals.user.account_id,
          'Account',
          'update',
          req.body.oldIsolation,
          req.body.isolation,
          'quarantine_location',
          req.params.id,
          `Chuyển bệnh nhân ${req.body.identity} từ ${oldName} sang ${newName}`
        );
        if (req.body.oldIsolation != '') {
          const old_q_location = await quarantineLocationModel.findById(
            parseInt(req.body.oldIsolation)
          );
          old_q_location.data.num_patients -= 1;
          const update_old_location = await quarantineLocationModel.update(
            old_q_location.data
          );
        }
        const new_q_location = await quarantineLocationModel.findById(
          parseInt(req.body.isolation)
        );
        new_q_location.data.num_patients += 1;
        const update_new_location = await quarantineLocationModel.update(
          new_q_location.data
        );
      }
      const related_remove_1 = await userModel.deleteAllRelatedAccount(
        req.body.account_id
      );
      const related_remove_2 = await userModel.deleteAllWithRelatedId(
        req.body.account_id
      );
      console.log(related_remove_1, related_remove_2);
      const new_related = req.body.relate.split(',');
      if (user.state != null) {
        for (let i = 0; i < new_related.length; i++) {
          const create1 = await userModel.createRelated(
            req.body.account_id,
            new_related[i]
          );
          const create2 = await userModel.createRelated(
            new_related[i],
            req.body.account_id
          );
          console.log(create1, create2);
        }
      }
      console.log('Heloal related Create');

      console.log('Done');
      res.redirect('/manager/account-management');
    } else {
      const id = parseInt(
        (await userModel.findByUsername(req.body.identity)).data.account_id
      );
      const { data: user } = await userModel.findById(id);
      const { data: locations } =
        await quarantineLocationModel.findAvailableLocation();
      const related_base_data = (await userModel.findAllPatientWithout(id))
        .data;
      const related_with_user = (await userModel.findAllRelatedById(id)).data;
      user.relate = related_with_user.join(',');
      user.dob = moment(user.dob).format('YYYY-MM-DD');
      res.render('layouts/manager/editAcc', {
        layout: 'manager/main',
        relate: related_base_data,
        patient: user,
        quarantine_location: locations,
        active: { accManagement: true },
        message: {
          status: 'Failed',
          content: 'Something went wrong under the hood!',
        },
      });
    }
  },

  // start category
  getCategory: async (req, res) => {
    const { data } = await categoryModel.findAll();
    res.render('layouts/manager/categoryManagement', {
      layout: 'manager/main',
      data: data,
      active: { catManagement: true },
    });
  },

  createCategory: async (req, res) => {
    const name = req.body.name;
    await categoryModel.create({ name });
    await logModel.create(
      res.locals.user.account_id,
      'Category',
      'add',
      null,
      null,
      null,
      null,
      `Thêm ${name} vào Category`
    );
    res.redirect('/manager/category-management');
  },

  updateCategory: async (req, res) => {
    await categoryModel.update(req.body);
    res.redirect('/manager/category-management');
  },

  deleteCategory: async (req, res) => {
    const id = req.body.delete_category_id;
    const name = (await categoryModel.findById(id)).data.name;
    await categoryModel.deleteById(id);
    await logModel.create(
      res.locals.user.account_id,
      'Category',
      'delete',
      null,
      null,
      null,
      null,
      `Xóa ${name} khỏi Category`
    );
    res.redirect('/manager/category-management');
  },
  // end category

  // start product
  getProduct: async (req, res) => {
    const { data } = await productModel.findAll();
    for (const product of data) {
      const category = await categoryModel.findById(product.category_id);
      product.category_name = category.data.name;
    }
    const chart_data = {
      dates: [],
      data: []
    }

    const response = await orderModel.statProductsByDate();
    for (let i of response.data) {
      if (!chart_data.dates.includes(i.date)) {
        chart_data.dates.push(i.date)
      }
    }

    for (let i of response.data) {
      const product = {
        name: i.necessary_name,
        data: [],
        color: utils.randomColor()
      }
      let j;
      for (j = 0; j < chart_data.data.length; j++) {
        if (chart_data.data[j].name === i.necessary_name) {
          break;
        }
      }
      if (j == chart_data.data.length) {
        for (let k = 0; k < chart_data.dates.length; k++) {
          product.data.push(0);
        }
        chart_data.data.push(product);
      }
    }

    for (let i = 0; i < chart_data.dates.length; i++) {
      for (let j = 0; j < response.data.length; j++) {
        for (let k = 0; k < chart_data.data.length; k++) {
          if (response.data[j].date == chart_data.dates[i] && response.data[j].necessary_name == chart_data.data[k].name) {
            chart_data.data[k].data[i] += parseInt(response.data[j].count);
          }
        }
      }
    }

    chart_data.dates = utils.arrayStringToString(chart_data.dates);
    for (let i = 0; i < chart_data.data.length; i++) {
      chart_data.data[i].name = `"` + chart_data.data[i].name + `"`;
      chart_data.data[i].data = utils.arrayNumberToString(chart_data.data[i].data);
    }

    res.render("layouts/manager/productManagement", {
      layout: "manager/main",
      data: data,
      chart_data: chart_data,
      active: { proManagement: true },
    });
  },

  getCreateProduct: async (req, res) => {
    const { data: categories } = await categoryModel.findAll();
    res.render('layouts/manager/createProd', {
      layout: 'manager/main',
      categories: categories,
      active: { proManagement: true },
    });
  },

  postCreateProduct: async (req, res) => {
    const files = await uploadMultipleFiles(req.files);
    const product = { ...req.body, images: files };
    await productModel.create(product);
    await logModel.create(
      res.locals.user.account_id,
      'Necessary',
      'add',
      null,
      null,
      null,
      null,
      `Thêm ${req.body.name} vào danh sách sản phẩm`
    );
    res.redirect('/manager/product-management');
  },

  detailsProduct: async (req, res) => {
    const { data: categoriesData } = await categoryModel.findAll();
    const id = parseInt(req.params.id);
    const { data: productData } = await productModel.findById(id);
    res.render('layouts/manager/editProd', {
      layout: 'manager/main',
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
    await logModel.create(
      res.locals.user.account_id,
      'Necessary',
      'update',
      null,
      null,
      null,
      null,
      `Sửa sản phẩm ${req.body.name}`
    );
    res.redirect('/manager/product-management/');
  },

  deleteProduct: async (req, res) => {
    const id = req.body.delete_product_id;
    const name = (await productModel.findById(id)).data.name;
    await productModel.deleteById(id);
    await logModel.create(
      res.locals.user.account_id,
      'Necessary',
      'delete',
      null,
      null,
      null,
      null,
      `Xóa ${name} khỏi danh sách sản phẩm`
    );
    res.redirect('/manager/product-management');
  },
  // end product

  // start package
  getPackage: async (req, res) => {
    const { data } = await packageModel.findAll();

    const chart_data = {
      dates: [],
      data: []
    }

    const response = await orderModel.statPackagesByDate();
    for (let i of response.data) {
      if (!chart_data.dates.includes(i.date)) {
        chart_data.dates.push(i.date)
      }
    }

    for (let i of response.data) {
      const package = {
        name: i.package_name,
        data: [],
        color: utils.randomColor()
      }
      let j;
      for (j = 0; j < chart_data.data.length; j++) {
        if (chart_data.data[j].name === i.package_name) {
          break;
        }
      }
      if (j == chart_data.data.length) {
        for (let k = 0; k < chart_data.dates.length; k++) {
          package.data.push(0);
        }
        chart_data.data.push(package);
      }
    }

    for (let i = 0; i < chart_data.dates.length; i++) {
      for (let j = 0; j < response.data.length; j++) {
        for (let k = 0; k < chart_data.data.length; k++) {
          if (response.data[j].date == chart_data.dates[i] && response.data[j].package_name == chart_data.data[k].name) {
            chart_data.data[k].data[i] += parseInt(response.data[j].count);
          }
        }
      }
    }

    chart_data.dates = utils.arrayStringToString(chart_data.dates);
    for (let i = 0; i < chart_data.data.length; i++) {
      chart_data.data[i].name = `"` + chart_data.data[i].name + `"`;
      chart_data.data[i].data = utils.arrayNumberToString(chart_data.data[i].data);
    }

    res.render("layouts/manager/packageManagement", {
      layout: "manager/main",
      data: data,
      chart_data: chart_data,
      active: { packManagement: true },
    });
  },

  getCreatePackage: async (req, res) => {
    const { data: productsData } = await productModel.findAll();
    res.render('layouts/manager/createPack', {
      layout: 'manager/main',
      products: productsData,
      active: { packManagement: true },
    });
  },

  postCreatePackage: async (req, res) => {
    const file = await uploadFile(req.files[0]);
    let _package;
    if (file) {
      _package = { ...req.body, file };
    } else {
      _package = { ...req.body };
    }
    _package.products = _package.products
      .split(',')
      .filter((product) => product !== '')
      .map((product) => {
        return {
          necessary_id: product.split('-')[0],
          max_necessary_per_package: product.split('-')[1],
        };
      });

    await packageModel.create(_package);
    await logModel.create(
      res.locals.user.account_id,
      'Package',
      'add',
      null,
      null,
      null,
      null,
      `Thêm ${req.body.name} vào danh sách giỏ hàng`
    );
    res.redirect('/manager/package-management');
  },

  detailsPackage: async (req, res) => {
    const { data: productsData } = await productModel.findAll();
    const id = parseInt(req.params.id);
    const { data: packageData } = await packageModel.findById(id);

    let inputValue = '';

    for (const product of packageData.products) {
      let temp = product.necessary_id + '-' + product.max_necessary_per_package;
      inputValue += temp;
      inputValue += ',';
    }

    res.render('layouts/manager/editPack', {
      layout: 'manager/main',
      products: productsData,
      package: packageData,
      inputValue: inputValue,
      active: { packManagement: true },
    });
  },

  updatePackage: async (req, res) => {
    let file = null;

    if (req.files && req.files.length > 0) {
      file = await uploadFile(req.files[0]);
    } else file = req.body.file;

    const id = req.params.id;
    const oldPackage = (await packageModel.findById(id)).data.name;
    const _package = { ...req.body, package_id: id };
    _package.products = _package.products
      .split(',')
      .filter((product) => product !== '')
      .map((product) => {
        return {
          necessary_id: product.split('-')[0],
          max_necessary_per_package: product.split('-')[1],
        };
      });

    await packageModel.update(_package);
    await logModel.create(
      res.locals.user.account_id,
      'Package',
      'update',
      null,
      null,
      null,
      null,
      `Sửa ${req.body.name} trong danh sách giỏ hàng`
    );
    res.redirect('/manager/package-management');
  },

  deletePackage: async (req, res) => {
    const id = req.body.delete_package_id;
    const name = (await packageModel.findById(id)).data.name;
    await packageModel.deleteById(id);
    await logModel.create(
      res.locals.user.account_id,
      'Package',
      'delete',
      null,
      null,
      null,
      null,
      `Xóa ${name} khỏi danh sách gói`
    );
    res.redirect('/manager/package-management');
  },
  // end package

  // start payment
  getPayment: async (req, res, next) => {
    const { data: amount } = await minimumPaymentModel.find();

    res.render('layouts/manager/paymentManagement', {
      layout: 'manager/main',
      amount: amount,
      data: fakePaymentData,
      chart_data: fakePaymentChartData,
      active: { paymentManagement: true },
    });
  },

  updatePayment: async (req, res, next) => {
    const amount = req.body.amount;
    await minimumPaymentModel.update(amount);
    await logModel.create(
      res.locals.user.account_id,
      'Minimum_Payment',
      'update',
      null,
      null,
      null,
      null,
      `Sửa hạn mức`
    );
    res.redirect('/manager/payment-management');
  },
  // end payment
};
