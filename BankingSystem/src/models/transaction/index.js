const { db, pgp } = require('../../config/db');

const table = new pgp.helpers.TableName({ table: 'Transaction', schema: 'public' })
const tablePayment = new pgp.helpers.TableName({ table: 'Payment_Account', schema: 'public' })

module.exports = {
    newTransaction: async (transaction) => {
        const data = await db.one('insert into ${table}(${columns:name}) values(${values:csv}) returning *', {
            table: table,
            columns: ["send_id", "amount", "action"],
            values: [transaction.send_id, transaction.amount, transaction.action]
        })
            .then(res => res)

        return { data }
    },
    updateBalance: async (account_id, amount) => {
        const data = await db.oneOrNone('update $1 set "balance"="balance"+$2 where "account_id"=$3 returning *', [tablePayment, amount, account_id])
            .then(res => res)

        return { data }
    },
    getTransaction: async (account_id) => {
        const data = await db.many('SELECT * FROM $1 where "send_id"=$2', [table, account_id])
            .then(res => res)
        return { data }
    },
}