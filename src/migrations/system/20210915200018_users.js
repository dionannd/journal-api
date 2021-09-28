
exports.up = function(knex) {
  return knex.schema.raw(
      `create table if not exists users(
          user_id serial primary key not null,
          email varchar,
          password varchar
      )`
  )
};

exports.down = function(knex) {
  
};
