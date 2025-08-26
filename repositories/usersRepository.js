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
    const create = await db('users').insert(user);
    if(!create){
      return false;
    }
    return user;
  }catch(err){
    return false
  }
}

module.exports = {
  findUserByEmail,
  createUser
}