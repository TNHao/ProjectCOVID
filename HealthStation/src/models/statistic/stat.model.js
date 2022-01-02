const { db, pgp } = require('../../config/db');

const numPatientsLogModel = require('../sites/numPatientsLog.model');
const oderModel = require('...');
const orderDetailModel = require('...');
const userPaymentModel = require('...');
const packageModel = require('...');

class stat {
    //Thong ke luong nguoi ở từng trạng thái theo thời gian
    async countUserByState(date) {
        const data = numPatientsLogModel.findByDate(date).data
        return { data }
    }
    //Thống kê cac thong tin, số chuyển trạng thái, số khỏi bệnh trong toàn bộ thời gian
    async statOfPatients() {
        // so luong người khỏi bệnh
        const queryString = `select count(*) from public."Log"
        where columnname= "state" and after = null`
        const well = await db.one(queryString).data // lấy trường luu số đếm
        // so luong người dương tính 
        queryString = `select count(*) from public."Log"
        where columnname= "state" and after = "0"`
        const positive = await db.one(queryString).data // lấy trường luu số đếm
        // dem so luong nguy co hiện tại
        queryString = `select count(*) from public."Account"
        where state = "1"`
        const danger = await db.one(queryString).data
        const data = {
            well: well,
            positive: positive,
            danger: danger
        }
        return { data }
    }
    //hong ke tiêu thụ các gói Nhu yếu phẩm
    async packageStat() {
        data = [];
        const packages = packageModel.findAll().data;
        const total = 0
        for (package of packages) {
            total = 0;
            listOrder = orderDetailModel.findById(package.package_id).data;
            for (order of listOrder) {
                total += order.amount
            }
            data.push({ name: package.name, total: total })
        }
        return { data }
    }
    //Thống kê tiêu thụ các sản phẩm

    //Thống kê dư nợ, thanh toán

}


module.exports = new stat();