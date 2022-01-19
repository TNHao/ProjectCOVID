const { db, pgp } = require('../../config/db');
const userM = require('../user/user.model');
class ManagerModel {
  account_tb = new pgp.helpers.TableName({ table: 'Account' });
  async createManager(username, password = '') {
    const user_manager = {
      username: username,
      password: password,
      permission: 2,
    };
    const rs = await userM.create(user_manager);
    return rs
  }
  async updatePasswordById(id, password) {
    const rs = userM.updatePasswordById(id, password);
  }
  async blockManagerWithId(id) {
    const new_permission = 3;
    const user = await userM.findById(id);
    if (user.data.permission == 2) {
      const queryString = `
       update $(table) set permission = $(new_permission) where account_id = $(id)
    `;
      await db.none(queryString, {
        table: this.account_tb,
        new_permission,
        id,
      });
    }
  }
}

module.exports = new ManagerModel();
