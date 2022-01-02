const { db, pgp } = require('../../config/db');
const userM = require('../user/user.model');
class AdminModel {
  account_tb = new pgp.helpers.TableName({ table: 'Account' });
  quarantine_location_tb = new pgp.helpers.TableName({
    table: 'Quarantine_Location',
  });
  async createAdmin(password) {
    const user_admin = {
      username: 'admin',
      password,
      permission: 1,
    };
    const rs = await userM.create(user_admin);
  }
  async updatePasswordById(id, new_password) {
    const rs = await userM.updatePasswordById(id, new_password);
  }
}

module.exports = new AdminModel();
