const db = require('../db/db');

async function create({nome, email, senha}) {
    const [usuarios] = await db ('usuarios').insert({nome, email, senha}).
    returning('*');
    return usuarios;
}

async function findByEmail(email) {
    const usuarios = await db('usuarios').where({email}).first();
    return usuarios;
}

async function findAll() {
  const usuarios = await db('usuarios').select('*');
  return usuarios;
}

async function findById(id) {
  const usuarios = await db('usuarios').where({ id }).first();
  return usuarios;
}

async function update(id,dados ) {
  const usuarios = await db('usuarios').where({ id }).update(dados).returning('*');
  return usuarios[0];
}

async function deleteById(id) {
  return await db('usuarios').where({ id }).del();
}

module.exports = {
    create,
    findByEmail,
    findById,
    findAll,
    update,
    deleteById,
}