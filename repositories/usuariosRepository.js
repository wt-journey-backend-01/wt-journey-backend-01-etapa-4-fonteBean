const db = require('../db/db');
const { findById } = require('./agentesRepository');



async function findAll() {
  try{
    const users = await db('usuarios').select("*");
    if(!users){
      return false;
    }
    return users;
  }catch(err){
    return false;
  }
}

async function findUserByEmail(email) {
  try{
    const user = await db('usuarios').where({email:email}).first();
    if(!user){
      return false;
    }
    return user;
  }catch(err){
    return false
  }
}
async function findUserById(id) {
  try {
    const user = await db('usuarios').where({ id }).first();
    return user || false;
  } catch (err) {
    return false;
  }
}


async function createUser(user) {
  try{
    const [userCreated] = await db('usuarios').insert(user).returning("*");
    return userCreated;
  }catch(err){
    console.error("Erro ao criar usuário no banco de dados:", err);
    return false
  }
}

async function deleteUser(id) {
  try {
    const deleted = await db('usuarios').where({ id }).del();
    return deleted > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = {
  findUserByEmail,
  findUserById,
  deleteUser,
  createUser,
  findAll
}