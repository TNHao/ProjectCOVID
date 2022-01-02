const { db, pgp } = require('../../config/db')

class log {
    table = new pgp.helpers.TableName({ table: "Num_Patients_Log" });
    async findAll() {
        const data = await db.any(`select * from $1 order by date_created`, this.table)
        return { data }
    }
    async findByDate(date) {
        const data = await db.any(`select * from $(table)  where date_created = $(date)`, { table: this.table, date: date })
        return { data }
    }
    async create(date) {
        const queryString = `
        insert into $(table) (date_created, f0,f1,f2,f3,f4) 
        values($(date),$(f0),$(f1),$(f2),$(f3),$(f4))
        `
        //Count số luong 
        const countQuery = `
        select count(*) from (public."Account")
        where state = $(state)
        `
        listState = []
        for (const i = 0; i <= 4; i++) {
            const num = await db.one(countQuery, {
                state: String(i)
            })
            listState.push(num.data)// trường data trả về ...
        }
        await db.none(queryString, {
            date: date,
            f0: listState[0],
            f1: listState[1],
            f2: listState[2],
            f3: listState[3],
            f4: listState[4]
        })

    }
    async deleteByDate(date) {

    }

    async update(log) {

    }
}
module.exports = new log();