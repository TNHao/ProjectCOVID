const { db, pgp } = require('../../config/db');
class MinimumPaymentModel {
  minimum_payment_tb = new pgp.helpers.TableName({ table: 'Minimum_Payment' });

  async find() {
    const { amount: data } = await db.one(`select * from $(table)`, {
      table: this.minimum_payment_tb
    })
    return { data }
  }

  async update(amount) {
    try {
      await db.none(`update $(table) set amount = $(amount)`, {
        table: this.minimum_payment_tb,
        amount: amount
      })
      return true;

    } catch(err) {
      return false;
    }
  }
}

module.exports = new MinimumPaymentModel();
