/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  await knex('casos').del()
  await knex("agentes").del();

  await knex("agentes").insert([
    { nome: "Veronica Ramos", dataDeIncorporacao: "2019-12-12", cargo: "Delegada" },
    { nome: "Arlindo Amado", dataDeIncorporacao: "2002-05-03", cargo: "Procurador" },
  ]);
};