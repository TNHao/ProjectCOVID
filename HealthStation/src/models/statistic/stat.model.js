const { db, pgp } = require('../../config/db');

const numPatientsLogModel = require('../sites/numPatientsLog.model');
const oderModel = require('../sites/order.model');
const orderDetailModel = require('../sites/order.model');
// const userPaymentModel = require('');
const packageModel = require('../sites/necessaryPacket.model');
const orderModel = require('../sites/order.model');

class stat {
    //Thong ke luong nguoi ở từng trạng thái theo thời gian
    async countUserByState(date) {
        const data = await numPatientsLogModel.findByDate(date).data
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
        const data = [];
        const packages = (await packageModel.findAll()).data;
        //const listOrder = orderModel.findAllDetail().data;

        //console.log(listOrder);

        for (const i of packages) {
            let total = 0;

            const listOrder = await orderModel.findDetailByPackageName(i.name);


            for (const order of listOrder.data) {
                total += order.amount;
            }
            data.push({ package_name: i.name, total: total });



            // data.push({ name: i.name, total: total })
        }

        return { data }
    }
    //Thống kê tiêu thụ các sản phẩm
    async neccessaryStat() {
        data = [];


    }
    //Thống kê dư nợ, thanh toán

}


module.exports = new stat();