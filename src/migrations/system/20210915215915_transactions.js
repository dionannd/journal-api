exports.up = function (knex) {
  return knex.schema.raw(
    `create table if not exists transactions(
          transaction_id serial primary key not null,
          journal_id integer,
          name varchar not null,
          user_id integer,
          tipe varchar not null,
          amount numeric not null,
          transaction_date timestamptz
      )`
  );
};

exports.down = function (knex) {
  return knex.schema.raw(`drop table if exists transactions`);
};
