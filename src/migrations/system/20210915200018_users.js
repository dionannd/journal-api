exports.up = function (knex) {
  return knex.schema.raw(
    `create table if not exists users(
          user_id serial primary key not null,
          name varchar not null,
          email varchar not null,
          password varchar not null
      )`
  );
};

exports.down = function (knex) {};
