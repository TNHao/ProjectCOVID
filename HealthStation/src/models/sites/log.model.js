const { db, pgp } = require('../../config/db')
class log {
    table = new pgp.helpers.TableName({ table: "log" });
    async findAll() {
        const data = await db.any(`select * from $1 order by log_id`, this.table)
        return { data }
    }

    async create(log) {
        const queryString =
            `
        insert into $(table)(account_id, tablename, type, before, after)
        values($(account_id), $(tablename), $(type),$(before),$(after));
        `;
        await db.none(queryString, {
            table: this.table,
            account_id=log.account_id,
            tablename = log.tablename,
            type = log.type,
            before= log.before,
            after  = log.after
        });
    }
    async deleteById(id) {
        const queryString =
            `delete from $(table) where log_id=$(id)`;
        await db.none(queryString, {
            table: this.table,
            id
        });
    }
    async deleteByAccountId(id) {
        const queryString =
            `delete from $(table) where account_id=$(id)`;
        await db.none(queryString, {
            table: this.table,
            id
        });
    }
    async findByAccountId(id) {
        const queryString =
            `select * from $(table) where account_id=$(id)`;
        const data = await db.manyOrNone(queryString, {
            table: this.table,
            id
        })
        return { data };
    }
    async update(log) {
        const queryString = `
       update $(table) set account_id = $(account_id), tablename = $(tablename),type = $(type),before = $(before), afer = $(after) where log_id = $(id)
    `;
        await db.none(queryString, {
            table: this.table,
            account_id=log.account_id,
            tablename = log.tablename,
            type = log.type,
            before= log.before,
            after  = log.after
        });
    }
}
module.exports = new log();