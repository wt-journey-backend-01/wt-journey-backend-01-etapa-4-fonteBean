/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('users').del()
  await knex('users').insert([
    {
      name: 'Everaldo Cano',
      email : "everaldo@example.com",
      password: "hash1"

    },
      {
      name: 'Ronaldo Fenomeno',
      email : "r9@example.com",
      password: "hash2"

    },
      {
      name: 'Angela Silveira',
      email : "angela@example.com",
      password: "hash3"

    },
    
  ]);
};
