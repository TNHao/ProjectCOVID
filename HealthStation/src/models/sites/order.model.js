const {db, pgp} = require('../../config/db')

const table = new pgp.helpers.TableName({table: "Order", schema: "public"})
const orderDetailTable = new pgp.helpers.TableName({table: "Order_Details", schema: "public"})

// Ví dụ trả về 1 đơn hàng
//  {
//      data: {
//          order_id: 1,
//          account_id: 1,
//          create_at: 2021-12-28T17:00:00.000Z,
//          total: 100000,
//          packages: [
//              { package_name: 'Gói nhu yếu phẩm 01', amount: 2, total: 20000 },
//              { package_name: 'Gói nhu yếu phẩm 02', amount: 3, total: 60000 },
//              { package_name: 'Gói nhu yếu phẩm 03', amount: 4, total: 20000 }
//          ]
//      }
//  }
// 1 đơn hàng -> { data: Object}
// nhiều đơn hàng -> { data: [Object, Object,...] }

module.exports = {
    // Tìm thông tin của tất cả đơn hàng
    findAllOrder: async () => {
        return await db.task(async t => {
            const orders = await t.any('Select * from $(table)', { table });
            for (let order of orders) {
                order.packages = await t.any('Select package_name, amount, total from $(table) where order_id = $(order_id)', { 
                    table: orderDetailTable, 
                    order_id: order.order_id
                });
            }
            return {data: orders}
        })
    },
    // Tìm thông tin của một đơn hàng theo order_id
    findOrderByID: async (order_id) => {
        return await db.task(async t => {
            const order = await t.oneOrNone('Select * from $(table) where order_id = $(order_id)', { table, order_id });
            if (order == null) {
                return {data: null}
            }
            order.packages = await t.any('Select package_name, amount, total from $(table) where order_id = $(order_id)', { 
                table: orderDetailTable, 
                order_id: order.order_id
            });
            return {data: order}
        })
    },
    // Tìm tất cả các đơn hàng mua bởi 1 tài khoản bất kỳ
    findOrderByAccountID: async (account_id) => {
        return await db.task(async t => {
            const orders = await t.any('Select * from $(table) where account_id = $(account_id)', { table, account_id });
            for (let order of orders) {
                order.packages = await t.any('Select package_name, amount, total from $(table) where order_id = $(order_id)', { 
                    table: orderDetailTable, 
                    order_id: order.order_id
                });
            }
            return {data: orders}
        })
    },
    // Tìm thông tin tất cả đơn hàng có mua gói hàng tên package_name
    // Dữ liệu trả về
    // {
    //     data: {
    //         package_name,
    //         orders: [ { order_id, account_id, create_at, total, amount },... ]
    //     }
    // }
    findOrderByPackageName: async (package_name) => {
        data = {
            package_name,
            orders: []
        }
        return await db.task(async t => {
            const orders = await t.any('Select order_id, amount from $(table) where package_name = $(package_name)', {
                table: orderDetailTable,
                package_name
            })
            for (let order of orders) {
                const o = await db.oneOrNone('Select * from $(table) where order_id = $(order_id)', { 
                    table, 
                    order_id: order.order_id
                });
                o.amount = order.amount;
                data.orders.push(o);
            }
            return {data}
        });
    },
    // Tìm tất cả đơn hàng mua trong một khoảng thời gian
    // typeof(start, end) = timestamp
    // Ex: '2021-12-29 00:00:00'
    findOrderByCreateAt: async (start, end) => {
        return await db.task(async t => {
            const orders = await t.any('Select * from $(table) where create_at between $(start) and $(end)', { table, start, end });
            for (let order of orders) {
                order.packages = await t.any('Select package_name, amount, total from $(table) where order_id = $(order_id)', { 
                    table: orderDetailTable, 
                    order_id: order.order_id
                });
            }
            return {data: orders}
        })
    },
    // Tìm tất cả đơn hàng mua trong khoảng tổng giá trị đơn hàng [min, max]
    findOrderByTotal: async (min, max) => {
        return await db.task(async t => {
            const orders = await t.any('Select * from $(table) where total between $(min) and $(max)', { table, min, max });
            for (let order of orders) {
                order.packages = await t.any('Select package_name, amount, total from $(table) where order_id = $(order_id)', { 
                    table: orderDetailTable, 
                    order_id: order.order_id
                });
            }
            return {data: orders}
        })
    },
    // Lọc đơn hàng theo các tiêu chí truyền vào
    // Ko xét thì truyền null
    filter: async (account_id, create_at_start, create_at_end, total_min, total_max) => {
        let conditions = [];
        let context = { table };
        if (account_id) {
            conditions.push('account_id = $(account_id)');
            context.account_id = account_id
        };
        if (create_at_start && create_at_end) {
            conditions.push('create_at between $(create_at_start) and $(create_at_end)');
            context.create_at_start = create_at_start
            context.create_at_end = create_at_end
        };
        if (total_min && total_max) {
            conditions.push('total between $(total_min) and $(total_max)');
            context.total_min = total_min;
            context.total_max = total_max;
        };
        let qStr = 'Select * from $(table)';

        for (let i = 0; i < conditions.length; i++) {
            if (i == 0) {
                qStr += ' where ' + conditions[i] + ' ';
            }
            else {
                qStr += ' and ' + conditions[i] + ' ';
            }
        }

        return await db.task(async t => {
            const orders = await t.any(qStr, context);
            for (let order of orders) {
                order.packages = await t.any('Select package_name, amount, total from $(table) where order_id = $(order_id)', { 
                    table: orderDetailTable, 
                    order_id: order.order_id
                });
            }
            return {data: orders}
        })
    },
    // order: { account_id, create_at, total } 
    // package: [
    //     { package_name, amonut, total }, ...
    // ]
    createOrder: async (order, packages) => {
        try {
            const qStr1 = pgp.helpers.insert(order, ["account_id", "create_at", "total"], table) + ' RETURNING order_id';
            const o = await db.one(qStr1);

            for (let package of packages) {
                const orderDetail = {
                    order_id: o.order_id,
                    package_name: package.package_name,
                    amount: package.amount,
                    total: package.total
                }
                const qStr2 = pgp.helpers.insert(orderDetail, ["order_id", "package_name", "amount", "total"], orderDetailTable);
                await db.none(qStr2);
            }
        }
        catch (error) {
            console.log('orderModel/create', error);
        }
    }
}