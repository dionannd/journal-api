
exports.up = function(knex) {
  return knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS products(
        product_id serial primary key not null,
        product_name varchar not null,
        qty integer not null,
        description text,
        image varchar,
        created_at timestamptz 
    )
  `)
};

exports.down = function(knex) {
  
};
