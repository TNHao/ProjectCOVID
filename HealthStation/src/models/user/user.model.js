const { db, pgp } = require('../../config/db');
class UserModel {
  account_tb = new pgp.helpers.TableName({ table: 'Account' });
  account_related_tb = new pgp.helpers.TableName({ table: 'Related_Account' });
  payment_account_tb = new pgp.helpers.TableName({ table: 'Payment_Account' });
  async findAll() {
    const data = await db.any(
      `select * from $1 order by account_id `,
      this.account_tb
    );
    return { data };
  }

  async findById(id) {
    const data = await db.one(
      'select * from ${table} where account_id = ${id}',
      {
        table: this.account_tb,
        id: id,
      }
    );
    return { data };
  }
  async findByUsername(username) {
    const data = await db.one(
      'select * from ${table} where username = ${username}',
      {
        table: this.account_tb,
        username,
      }
    );
    return { data };
  }
  async create(user) {
    const queryString = `
        insert into $(table)(username,password,permission,fullname,national_id,dob,state,quarantine_location_id,city,district,ward)
        values($(username),$(password),$(permission),$(fullname),$(national_id),$(dob),$(state),$(quarantine_location_id),$(city),$(district),$(ward));
    `;
    await db.none(queryString, {
      table: this.account_tb,
      username: user.username,
      password: user.password,
      permission: user.permission,
      fullname: user.fullname,
      national_id: user.national_id,
      dob: user.dob,
      state: user.state,
      quarantine_location_id: user.quarantine_location_id,
      city: user.city,
      district: user.district,
      ward: user.ward,
    });
  }
  async update(user) {
    const queryString = `
        update $(table) 
        set username = $(username), 
        password = $(password), 
        permission = $(permission), 
        fullname = $(fullname), 
        national_id = $(national_id), 
        dob = $(dob), 
        state = $(state), 
        quarantine_location_id = $(quarantine_location_id), 
        city =  $(city), 
        district = $(district), 
        ward = $(ward)
        where account_id = $(id)
    `;
    try {
      await db.none(queryString, {
        table: this.account_tb,
        id: user.account_id,
        username: user.username,
        password: user.password,
        permission: user.permission,
        fullname: user.fullname,
        national_id: user.national_id,
        dob: user.dob,
        state: user.state,
        quarantine_location_id: user.quarantine_location_id,
        city: user.city,
        district: user.district,
        ward: user.ward,
      });
      return 'Success';
    } catch (error) {
      return error;
    }
  }

  async deleteById(id) {
    await this.deleteAllRelatedAccount(id);
    await this.deleteAllWithRelatedId(id);

    const queryString = `
       delete from $(table) where account_id=$(id)
    `;
    await db.none(queryString, {
      table: this.account_tb,
      id,
    });
  }
  // Success is for query only, user can still not exist
  async updatePasswordById(id, new_password) {
    const queryString = `
       update $(table) set password = $(password) where account_id = $(id)
    `;
    try {
      await db.none(queryString, {
        table: this.account_tb,
        id,
        password: new_password,
      });
      return 'Success';
    } catch (error) {
      return error;
    }
  }
  async updateStateById(id, newState) {
    const user = await this.findById(id);
    const cur_state = parseInt(user.data.state);
    if (parseInt(newState) < cur_state) {
      const queryString = `
       update $(table) set state = $(state) where account_id = $(id)
    `;
      try {
        await db.none(queryString, {
          table: this.account_tb,
          state: newState,
          id,
        });
        await this.updateStateOfAllRelated(id);
        return 'Success';
      } catch (error) {
        return error;
      }
    }
    return 'Unchanged';
  }
  async updateStateOfAllRelated(id) {
    const user_data = await this.findById(id);
    const new_state = parseInt(user_data.data.state) + 1 + '';
    const all_related_id = await this.findAllRelatedById(id);
    all_related_id.data.forEach(async (e) => {
      try {
        let rs = await this.updateStateById(e, new_state + '');
        return 'Success';
      } catch (error) {
        return error;
      }
    });
  }
  async findAllRelatedById(id) {
    const queryString = `select related_id from $(table) where account_id = $(id)`;
    const data = [];
    const q_data = await db.any(queryString, {
      table: this.account_related_tb,
      id,
    });
    q_data.forEach((e) => {
      data.push(e.related_id);
    });
    return { data };
  }
  async getBalanceById(id) {
    const queryString = `select balance from $(table) where account_id = $(id)`;
    const data = await db.one(queryString, {
      table: this.payment_account_tb,
      id,
    });
    return { data };
  }
  async createRelated(id, related_id) {
    const queryString = `insert into $(table)(account_id,related_id)
        values($(account_id),$(related_id))`;
    try {
      await db.none(queryString, {
        table: this.account_related_tb,
        account_id: id,
        related_id,
      });
      await this.updateStateOfAllRelated(id);
      return 'Success';
    } catch (error) {
      return error;
    }
  }
  async deleteAllWithRelatedId(related_id) {
    const queryString = `
       delete from $(table) where related_id=$(id)
    `;
    await db.none(queryString, {
      table: this.account_related_tb,
      id: related_id,
    });
  }
  async deleteAllRelatedAccount(account_id) {
    const queryString = `
       delete from $(table) where account_id=$(id)
    `;
    await db.none(queryString, {
      table: this.account_related_tb,
      id: account_id,
    });
  }
}
module.exports = new UserModel();
