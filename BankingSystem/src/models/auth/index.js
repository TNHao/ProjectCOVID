const { db, pgp } = require('../../config/db');
const { genPassword } = require('../../lib/utils');

const table = new pgp.helpers.TableName({ table: 'Payment_Account', schema: 'public' })

module.exports = {
    addNewUser: async (id) => {
        const password = null;

        const data = await db.one('insert into ${table}(${columns:name}) values(${values:csv}) returning *', {
            table: table,
            columns: ["account_id", "balance", "password"],
            values: [id, 0, password]
        })
            .then(res => res)

        return { data }
    },
    editPassword: async (id, pw) => {
        const password = await genPassword(pw);

        const data = await db.one('update $1 set "password"=$2 where "account_id"=$3 returning *', [table, password, id])
            .then(res => res)

        return { data }
    },
    findUser: async (id) => {
        const data = await db.oneOrNone('select * from $1 where "account_id"=$2', [table, id])
            .then(res => res)
        return { data };
    }
}