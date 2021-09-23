exports.up = function (knex) {
  return knex.schema.raw(
    `create table if not exists transaction_headers(
          transaction_id serial primary key not null,
          name varchar,
          description varchar,
          user_id integer,
          created_at timestamptz
      )`
  );
};

exports.down = function (knex) {
  return knex.schema.raw(`drop table if exists transaction_headers`);
};
