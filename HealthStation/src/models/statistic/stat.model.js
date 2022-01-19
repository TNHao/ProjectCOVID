const { db, pgp } = require('../../config/db');

const numPatientsLogModel = require('../sites/numPatientsLog.model');
const oderModel = require('../sites/order.model');
const orderDetailModel = require('../sites/order.model');
// const userPaymentModel = require('');
const packageModel = require('../sites/necessaryPacket.model');
const orderModel = require('../sites/order.model');
const logTable = new pgp.helpers.TableName({ table: "Log", schema: "public" });
const accountTable = new pgp.helpers.TableName({ table: "Account", schema: "public" });
class stat {
    //Thong ke luong nguoi ở từng trạng thái theo thời gian
    async countPatientByState(date) {
        const data = (await numPatientsLogModel.findByDate(date)).data
        return { data }
    }
    //Thống kê cac thong tin, số chuyển trạng thái, số khỏi bệnh trong toàn bộ thời gian
    async statOfPatients() {
        // so luong người khỏi bệnh
        const queryString1 = 'select count(*) from $(table) where tablename=$(tablename) and columnname=$(state) and before = $(before) and after is null'
        const well = await db.oneOrNone(queryString1, {
            table: logTable,
            tablename: "Account",
            state: "state",
            before: "0",
        })
        console.log("well: ", well.count);
        //so luong người dương tính 
        const queryString2 = 'select count(*) from $(table) where tablename=$(tablename) and columnname=$(state) and after =$(after)'
        const positive = await db.oneOrNone(queryString2, {
            table: logTable,
            tablename: "Account",
            state: "state",
            after: "0",
        })
        console.log("positive: ", parseInt(positive.count) + parseInt(well.count));

        // dem so luong nguy co hiện tại
        const queryString3 = 'select count(*) from $(table) where state = $(state)'
        const indanger = await db.one(queryString3, {
            table: accountTable,
            state: "1"
        })
        const data = {
            well: parseInt(well.count),
            positive: parseInt(positive.count) + parseInt(well.count),
            indanger: parseInt(indanger.count)
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