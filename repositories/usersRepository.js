const db = require('../db/db')


async function findUserByEmail(email) {
  try{
    const user = await db('users').where({email:email});
    if(!user){
      return false;
    }
    return user;
  }catch(err){
    return false
  }
}


async function createUser(user) {
  try{
    const [userCreated] = await db('users').insert(user).returning("*");
    return userCreated;
  }catch(err){
    console.error("Erro ao criar usuário no banco de dados:", err);
    return false
  }
}

module.exports = {
  findUserByEmail,
  createUser
}