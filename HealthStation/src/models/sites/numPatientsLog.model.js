const { db, pgp } = require('../../config/db')
class log {
    table = new pgp.helpers.TableName({ table: "Num_Patients_Log" });
    async findAll() {
        const data = await db.any(`select * from $1 order by date_created`, this.table)
        return { data }
    }
    async findByDate(date) {
        const data = await db.any(`select * from $1 order by date_created where date_created = $(date)`, this.table)
        return { data }
    }
    async create(log) {

    }
    async deleteByDate(date) {

    }

    async update(log) {

    }
}
module.exports = new log();