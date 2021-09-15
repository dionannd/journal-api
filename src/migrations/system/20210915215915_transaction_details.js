
exports.up = function(knex) {
  return knex.schema.raw(
      `create table if not exists transaction_details(
          transaction_detail_id serial primary key not null,
          transaction_id integer,
          description varchar,
          user_id integer,
          type varchar,
          amount numeric,
          transaction_date timestamptz
      )`
  )
};

exports.down = function(knex) {
  return knex.schema.raw(
      `drop table if exists transaction_details`
  )
};
