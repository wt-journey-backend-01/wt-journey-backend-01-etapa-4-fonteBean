/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('usuarios').del()
  await knex('usuarios').insert([
    {
      nome: 'Everaldo Cano',
      email : "everaldo@example.com",
      senha: "hash1"

    },
      {
      nome: 'Ronaldo Fenomeno',
      email : "r9@example.com",
      senha: "hash2"

    },
      {
      nome: 'Angela Silveira',
      email : "angela@example.com",
      senha: "hash3"
    },
  ]);
};
