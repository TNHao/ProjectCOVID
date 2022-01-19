const { db, pgp } = require('../../config/db');
const userM = require('../user/user.model');
class AdminModel {
  account_tb = new pgp.helpers.TableName({ table: 'Account' });
  firstGenerate_tb = new pgp.helpers.TableName({ table: 'First_Generate' });
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
    return rs;
  }
  async updatePasswordById(id, new_password) {
    const rs = await userM.updatePasswordById(id, new_password);
  }
  async isFirstGenerate() {
    const data = await db.one(`select * from public."First_Generate"`);
    if (data.isGenerate == false) {
      return true;
    }
    return false;
  }
  async setFirstGenerate() {
    const queryString = `
        UPDATE public."First_Generate"
	SET "isGenerate"= true
	WHERE "isGenerate"= false;
    `;
    try {
      await db.none(queryString, {
        isGenerate: true,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new AdminModel();
