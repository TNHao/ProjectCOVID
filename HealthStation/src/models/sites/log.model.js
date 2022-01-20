const { db, pgp } = require('../../config/db')
class log {
    table = new pgp.helpers.TableName({ table: "Log" });
    async findAll() {
        const data = await db.any(`select * from $1 order by log_id`, this.table)
        return { data }
    }
    async create(manager_id, tablename, action, before, after, columnname, user_id, description) {

        const queryString =
            `
        insert into $(table)(manager_id, tablename, action, before, after,columnname, user_id, description)
        values($(manager_id), $(tablename), $(action),$(before),$(after),$(columnname),$(user_id),$(description));
        `;
        await db.none(queryString, {
            table: this.table,
            user_id: user_id,
            tablename: tablename,
            action: action,
            before: before,
            //create_at: `now()`,
            after: after,
            columnname: columnname,
            manager_id: manager_id,
            description: description
        });
    }
    // async deleteById(id) {
    //     const queryString =
    //         `delete from $(table) where log_id=$(id)`;
    //     await db.none(queryString, {
    //         table: this.table,
    //         id: id
    //     });
    // }
    // async deleteByAccountId(id) {
    //     const queryString =
    //         `delete from $(table) where account_id=$(id)`;
    //     await db.none(queryString, {
    //         table: this.table,
    //         id
    //     });
    // }
    async findByManagerId(id) {
        const queryString =
            `select * from $(table) where manager_id=$(id)`;
        const listLog = await db.manyOrNone(queryString, {
            table: this.table,
            id: id
        })
        const data = [];
        for (const log of listLog) {
            data.push({
                action: log.action,
                description: log.description,
                date: log.create_at
            })
        }
        return { data };
    }
    async findByUserId(id) {
        const queryString =
            `select * from $(table) where user_id=$(id)`;
        const listLog = await db.manyOrNone(queryString, {
            table: this.table,
            id: id
        })
        let data = [];
        for (const log of listLog) {
            data.push({
                action: log.action,
                description: log.description,
                date: log.create_at,
                // manager: manager_id
            })
        }
        return { data };
    }
    async update(log) {
        const queryString = `
       update $(table) set account_id = $(account_id), tablename = $(tablename),type = $(type),before = $(before), afer = $(after), manager_id = $(manager_id) where log_id = $(id)
    `;
        await db.none(queryString, {
            table: this.table,
            account_id: log.account_id,
            tablename: log.tablename,
            type: log.type,
            before: log.before,
            after: log.after,
            manager_id: log.manager_id
        });
    }
}
module.exports = new log();