const {db, pgp} = require('../../config/db')
const tableName = "Order"
const schema = "public"
const table = new pgp.helpers.TableName({table: tableName, schema: schema})

module.exports = {
    findAll: async () => {
        const qStr = 'Select * from $(table)';
        const data = await db.any(qStr, {
            table
        });
        return {data}
    },
    findByID: async (id) => {
        const qStr = 'Select * from $(table) where order_id = $(order_id)';
        const data = await db.one(qStr, {
            table,
            order_id: id
        })
        return {data}
    },
    create: async (order) => {
        try {
            const qStr = pgp.helpers.insert(order, ["account_id", "create_at", "total"], table);
            await db.none(qStr);
            // TODO: Thêm vào bảng log
        }
        catch (error) {
            // TODO: Thêm vào bảng log
        }
    },
    delete: async (id) => {
        try {
            const qStr = 'Delete from $(table) where order_id = $(order_id)';
            await db.none(qStr, {
                table,
                order_id: id
            });
            // TODO: Thêm vào bảng log
        }
        catch (error) {
            // TODO: Thêm vào bảng log
        }
    },
    update: async (order) => {
        try {
            const condition = pgp.as.format('Where order_id = $(order_id)', order)
            const qStr = pgp.helpers.update(order, ["account_id", "create_at", "total"], table) + condition;
            await db.none(qStr);
            // TODO: Thêm vào bảng log
        }
        catch (error) {
            // TODO: Thêm vào bảng log
        }
    },
    // Tìm tất cả các đơn hàng mua bởi 1 tài khoản bất kỳ
    findByAccountID: async (account_id) => {
        const qStr = 'Select * from $(table) where account_id = $(account_id)';
        const data = await db.any(qStr, {
            table,
            account_id
        })
        return {data}
    },
    // Tìm tất cả đơn hàng mua trong một khoảng thời gian
    // typeof(start, end) = timestamp
    // Ex: '2021-12-29 00:00:00'
    findByCreateAt: async (start, end) => {
        const qStr = `Select * from $(table) 
                    where create_at >= $(start) and create_at <= $(end)`;
        const data = await db.any(qStr, {
            start,
            end
        })
        return {data}
    },
    // Tìm tất cả đơn hàng mua trong khoảng tổng giá trị đơn hàng [min, max]
    findByTotal: async (min, max) => {
        const qStr = `Select * from $(table) 
                    where total >= $(min) and create_at <= $(table)`;
        const data = await db.any(qStr, {
            min,
            max
        })
        return {data}
    },
    // Lọc đơn hàng theo các tiêu chí truyền vào
    // Ko xét thì truyền null
    filter: async (account_id, create_at_start, create_at_end, total_min, total_max) => {
        let condition = ' where ';
        let cdt = [];
        let context = {};
        if (account_id) {
            cdt.append('account_id = $(account_id)');
            context = { account_id }
        };
        if (create_at_start && create_at_end) {
            cdt.append('create_at >= $(start) and create_at <= $(end)');
            context = { create_at_start, create_at_end }
        };
        if (total_min && total_max) {
            cdt.append('create_at >= $(start) and create_at <= $(end)');
            context = { total_min, total_max }
        };
        let qStr = 'Select * from $(table)';

        for (let i = 0; i < cdt.length; i++) {
            if (i == 0) {
                qStr += ' where ' + cdt[i] + ' ';
            }
            else {
                qStr += ' and ' + cdt[i] + ' ';
            }
        }

        const data = await db.any(qStr, context);

        return {data}
    }

}