const db = require("../db/db")


async function findAll() {
    try{
      const agentes = await db("agentes").select("*");
      return agentes;
    }catch(err){
      console.log(err);
      return false  ;
   }
}


async function findById(id) {
    try{
      const agente = await db("agentes").where({id: id}).first();
      if(!agente) return false;
      
      return agente
    }catch(err){
      console.log(err);
      return false;
   }
}



async function criarAgente(agente) {
  try {
    const novoAgente = await db("agentes").insert(agente).returning('*');
    return novoAgente;
  } catch (err) {
    console.log(err);
    return false;
  }
}


async function updateAgente(id,dadosAtualizados) {
  try{
    const query = await db("agentes").where({id:id}).update(dadosAtualizados).returning('*');
    if (!query || query.length === 0) {
  return false;
}
    return query
  }catch(err) {
    console.log(err);
    return false 
  }
}

async function deleteAgente(id) {
  try{
    const query = await db("agentes").where({id:id}).del()
    if(!query){
      return false
    }
    return true
  }catch(err){
    console.log(err);
    return false;
  }
}

module.exports  = {
  findAll,
  findById,
  criarAgente,
  updateAgente,
  deleteAgente
}