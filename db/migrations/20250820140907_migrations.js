/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const { table } = require("console");

exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
     table.increments("id").primary();
        table.string("name").notNullable();
        table.string("email").unique().notNullable();
        table.string("password").notNullable(); 
    }).then(() =>
      knex.schema.createTable("casos", (table) => {
        table.increments("id").primary();
        table.string("titulo").notNullable();
        table.string("descricao").notNullable();
        table.string("status").notNullable(); 
        table.integer("agente_id").references("id").inTable("agentes").nullable().onDelete("set null");
      })
    ).then(() =>
      knex.schema.createTable("agentes", (table) => {
         table.increments("id").primary();
          table.string("nome").notNullable();
          table.date("dataDeIncorporacao").notNullable();
          table.string("cargo").notNullable();
      })
    );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function (knex) {
  return knex.schema
    .dropTable("users")
  
};