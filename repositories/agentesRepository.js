const db = require("../db/db")


async function findAll(filter = {}) {
  let query = db('agentes');
  if (filter.cargo) {
    query = query.where('cargo', filter.cargo);
  }
  if (filter.sort) {
    const direction = filter.sort.startsWith('-') ? 'desc' : 'asc';
    const column = filter.sort.replace('-', '');
    query = query.orderBy(column, direction);
  }
  return await query.select('*');
}


async function findById(id) {
    try{
      const agente = await db("agentes").where({id: id});
      if(!agente){
         return false;
      }
      return agente
    }catch(err){
      console.log(err);
      return false;
   }
}



async function criarAgente(agente) {
  try {
    const novoAgente = await db("agentes").insert(agente);
    return novoAgente;
  } catch (err) {
    console.log(err);
    return false;
  }
}


async function updateAgente(id,dadosAtualizados) {
  try{
    const query = await db("agentes").where({id:id}).update(dadosAtualizados);
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