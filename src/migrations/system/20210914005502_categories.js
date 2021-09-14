exports.up = function (knex) {
  return knex.schema.raw(`
  CREATE TABLE IF NOT EXISTS categories(
      category_id serial primary key not null,
      category_name varchar not null,
      icon varchar,
      created_at timestamptz
  )
  `);
};

exports.down = function (knex) {};
