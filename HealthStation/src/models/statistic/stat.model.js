// const { db, pgp } = require('../../config/db');

// const userModel = require('...');
// const oderModel = require('...');
// const orderDetailModel = require('...');
// const userPaymentModel = require('...');
// const packageModel = require('...');

// class stat {
//     //Thong ke luong nguoi ở từng trạng thái theo thời gian
//     async countUserByState(state, time) {

//     }
//     //Thống kê cac thong tin, số chuyển trạng thái, số khỏi bệnh

//     //hong ke tiêu thụ các gói Nhu yếu phẩm
//     async packageStat() {
//         data = [];
//         const packages = packageModel.findAll().data;
//         const total = 0
//         for (package of packages) {
//             total = 0;
//             listOrder = orderDetailModel.findById(package.package_id).data;
//             for (order of listOrder) {
//                 total += order.amount
//             }
//             data.push({ name: package.name, total: total })
//         }
//         return { data }
//     }
//     //Thống kê tiêu thụ các sản phẩm

//     //Thống kê dư nợ, thanh toán

// }


// module.exports = new stat();