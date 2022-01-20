const { db, pgp } = require('../../config/db');

class quarantineLocation {
  table = new pgp.helpers.TableName({ table: 'Quarantine_Location' });
  async findAll() {
    const data = await db.any(
      `select * from $1 order by location_id`,
      this.table
    );
    return { data };
  }
  async findById(id) {
    const data = await db.one(
      'select * from public."Quarantine_Location" where location_id = ${id}',
      {
        id: id,
      }
    );
    return { data };
  }
  async create(location) {
    const queryString = `
        insert into $(table)(name,num_patients, capacity)
        values($(name), $(num_patients), $(capacity));
        `;
    await db.none(queryString, {
      table: this.table,
      name: location.name,
      num_patients: location.num_patients,
      capacity: location.capacity,
    });
  }
  async findAvailableLocation() {
    const data = await db.any(
      'select * from ${table} where "num_patients" < "capacity"',
      {
        table: this.table,
      }
    );
    return { data };
  }
  async deleteById(id) {
    const queryString = `delete from $(table) where location_id=$(id)`;
    await db.none(queryString, {
      table: this.table,
      id,
    });
  }
  async findByLocationId(id) {
    const queryString = `select * from $(table) where location_id=$(id)`;
    const data = await db.oneOrNone(queryString, {
      table: this.table,
      id,
    });
    return { data };
  }
  async update(location) {
    const queryString = `
       update $(table) set name = $(name),num_patients = $(num_patients),capacity = $(capacity) where location_id = $(id)
    `;
    await db.none(queryString, {
      table: this.table,
      id: location.location_id,
      name: location.name,
      num_patients: location.num_patients,
      capacity: location.capacity,
    });
  }
}

module.exports = new quarantineLocation();
