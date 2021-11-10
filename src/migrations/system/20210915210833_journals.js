exports.up = function (knex) {
  return knex.schema.raw(
    `create table if not exists journals(
          journal_id serial primary key not null,
          name varchar not null,
          description varchar,
          user_id integer,
          created_at timestamptz
      )`
  );
};

exports.down = function (knex) {
  return knex.schema.raw(`drop table if exists journals`);
};
