const { db, pgp } = require('../../config/db');
const { API_URL } = require('../../constants');
const { getTransactionName } = require('../../lib/utils');
const axios = require('axios');
const moment = require('moment');
const bcrypt = require('bcrypt');
const saltRounds = 10;
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
  // Hàm này là tìm cho user ( bao gồm cả bệnh và không luôn )
  async findAllPatient() {
    try {
      const data = await db.any(
        `select * from public."Account" where "permission"=4 order by account_id`
      );
      return { data };
    } catch (error) {
      console.log(error);
    }
  }
  // Hàm này là tìm cho user ( bao gồm cả bệnh và không luôn ) trừ thằng id
  async findAllPatientWithout(id) {
    try {
      const data = await db.any(
        `select * from public."Account" where "permission"=4 and "account_id"!=${id} order by account_id`
      );
      return { data };
    } catch (error) {
      console.log(error);
    }
  }
  async findById(id) {
    const data = await db.one(
      'select * from public."Account" where account_id = ${id}',
      {
        id: id,
      }
    );
    return { data };
  }
  async findByUsername(username) {
    const data = await db.oneOrNone(
      'select * from ${table} where username = ${username}',
      {
        table: this.account_tb,
        username,
      }
    );
    return { data };
  }
  async create(user) {
    const hashedPass = await bcrypt.hash(user.password, saltRounds);
    const q_checkUsername = await this.findByUsername(user.username);
    if (q_checkUsername.data) {
      return 'Username already exists';
    }
    const queryString = `
        insert into $(table)(username,password,permission,fullname,national_id,dob,state,quarantine_location_id,city,district,ward)
        values($(username),$(password),$(permission),$(fullname),$(national_id),$(dob),$(state),$(quarantine_location_id),$(city),$(district),$(ward));
    `;
    try {
      await db.none(queryString, {
        table: this.account_tb,
        username: user.username,
        password: hashedPass,
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
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async update(user, isHash = false) {
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
      const hashedPass = await bcrypt.hash(user.password, saltRounds);
      console.log(hashedPass);
      await db.none(queryString, {
        table: this.account_tb,
        id: user.account_id,
        username: user.username,
        password: isHash ? user.password : hashedPass,
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
  async updatePatientInformation(user) {
    const queryString = `
        update $(table) 
        set permission = $(permission), 
        fullname = $(fullname), 
        national_id = $(national_id), 
        dob = $(dob), 
        state = $(state), 
        quarantine_location_id = $(quarantine_location_id), 
        city =  $(city), 
        district = $(district), 
        ward = $(ward)
        where username = $(username)
    `;
    try {
      await db.none(queryString, {
        table: this.account_tb,
        username: user.username,
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
    const new_hashedPass = await bcrypt.hash(new_password, saltRounds);
    const queryString = `
       update $(table) set password = $(password) where account_id = $(id)
    `;
    try {
      await db.none(queryString, {
        table: this.account_tb,
        id,
        password: new_hashedPass,
      });
      return 'Success';
    } catch (error) {
      return error;
    }
  }
  async updateStateById(id, newState) {
    id = parseInt(id);
    const user = await this.findById(id);
    const cur_state = user.data.state;
    if (parseInt(newState) < parseInt(cur_state) && cur_state != null) {
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
    id = parseInt(id);
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
  async updateBankingToken(account_id, banking_token) {
    const queryString = `update $(table) set banking_token = $(banking_token) where account_id = $(id)`;
    try {
      await db.none(queryString, {
        table: this.account_tb,
        id: account_id,
        banking_token: banking_token,
      });
      return 'Success';
    } catch (error) {
      return error;
    }
  }
  async getPaymentData(id, token) {
    let { data } = await axios({
      method: 'GET',
      url: `${API_URL}/api/transactions/history/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    if (data)
      data = data.map((item) => ({
        ...item,
        action: getTransactionName(item.action),
        date: moment(item.create_at).format('MMMM Do YYYY, h:mm:ss'),
      }));

    return { data };
  }
  async getBalance(id, token) {
    let { data } = await axios({
      method: 'GET',
      url: `${API_URL}/api/accounts/${id}/get-balance`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));
    return { data };
  }
  async checkVerify(id) {
    let response = await axios({
      method: 'POST',
      url: `${API_URL}/auth/verify`,
      data: { id },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    return { data: response.verified };
  }
  async deposit(send_id, amount, token) {
    let data = await axios({
      method: 'POST',
      url: `${API_URL}/api/transactions/deposit`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { send_id, amount },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    return { data };
  }
  async getUserQuarantineLocation(account_id) {
    const queryString = `
      select QL.location_id, Ql.name
      from public."Account" A, public."Quarantine_Location" QL
      where A.account_id=$(id)
        and A.quarantine_location_id=QL.location_id
    `;
    const data = await db.oneOrNone(queryString, { id: account_id });
    return { data };
  }
  async setToken(account_id, token) {
    const queryString = `
      UPDATE public."Account"
      SET banking_token=$(token)
      WHERE account_id=$(id);
    `;
    const data = await db.oneOrNone(queryString, {
      id: account_id,
      token: token,
    });
    return { data };
  }
}
module.exports = new UserModel();
