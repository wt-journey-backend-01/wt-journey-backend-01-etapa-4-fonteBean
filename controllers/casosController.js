const casosRepository = require("../repositories/casosRepository.js")
const agentesRepository = require("../repositories/agentesRepository.js")
const errorResponse = require("../utils/errorHandler.js");
const db = require("../db/db.js");


async function getCasos(req,res){
  const casos = await casosRepository.findAll();
  const agente_id = req.query.agente_id
  const status = req.query.status
  if(status){
    if( status != "aberto" && status != "solucionado")
    {
      return  errorResponse(res,400,"Status nao permitido ")
    }
    const casosStatus = casos.filter(c=> c.status == status)
    if(casosStatus.length == 0){
     return errorResponse(res,404,`Casos com status ${status} nao encotrados`)
    }
    return res.status(200).json(casosStatus)
  }

  if(agente_id){
    const casosAgente  = casos.filter(c => c.agente_id === Number(agente_id))
    if(casosAgente.length === 0){
      return errorResponse(res,404,`Casos do agente ${agente_id}, nao encontrados`)
    }
    return res.status(200).json(casosAgente)
  }

  res.status(200).json(casos)
}

async function getCaso(req,res){
  const casoId = req.params.id;
  const caso = await casosRepository.findById(casoId);
  if(!caso){
   return  errorResponse(res,404,"caso nao encontrado")
  }
  res.status(200).json(caso)
}

async function getAgentebyCaso(req,res){
  const casoId = req.params.id;
  const caso = await casosRepository.findById(casoId);
  if(!caso){
   return  errorResponse(res,404,"caso nao encontrado")
  }
  const agente = await agentesRepository.findById(caso.agente_id)
  if(!agente){
   return errorResponse(res,404,"Agente nao encontrado")
  }
  res.status(200).json(agente)
}

async function searchEmCaso(req,res){
  const busca = req.query.q ? req.query.q.toLowerCase() : ""
  if(!busca){
    return errorResponse(res,404,"Parametro de busca nao encontrado")
  }
 
  const casosFiltrados = await casosRepository.buscaPalavraEmCaso(busca)
  if(casosFiltrados.length === 0){
   return errorResponse(res,404,`Casos com a palavra ${busca} nao encotrados`)
  }
  res.status(200).json(casosFiltrados);
}

async function createCaso(req,res){
  const {titulo ,descricao ,status, agente_id} = req.body;
  if(!titulo || !descricao ||  !status || !agente_id){
   return errorResponse(res,400,"Titulo, descricao, status e agente obrigatorios")
  }

  if( status != "aberto" && status != "solucionado")
    {
   return  errorResponse(res,400,"Status nao permitido ")
    }
  const agente = await agentesRepository.findById(agente_id);
  if (!agente) {
    return errorResponse(res,404,"Agente não encontrado para o agente_id fornecido");
  }
    const novoCaso = {
      titulo,
      descricao,
      status,
      agente_id
    }
  const create = await casosRepository.criarCaso(novoCaso);
  if(!create){
    return errorResponse(res,400,"Erro ao criar caso");
  }
  res.status(201).json(create[0]);
}

async function deleteCaso(req,res){
    const casoId = req.params.id;
   const sucesso = await casosRepository.deleteCaso(casoId);
   if(!sucesso){
    return errorResponse(res,404,`Erro ao deletar caso ${casoId}`)
   }
  res.status(204).send();
}

async function updateCaso(req, res) {
  const casoId = req.params.id;
  const { titulo, descricao, status, agente_id } = req.body;
  if ('id' in req.body) {
  return errorResponse(res,400,"Não é permitido alterar o ID do caso.");
}

  if (!titulo || !descricao || !status || !agente_id) {
    return errorResponse(res,400,"Todos os campos são obrigatórios para atualização completa.");
  }

  const caso = await casosRepository.findById(casoId);
  if (!caso) {
    return errorResponse(res,404,"caso não encontrado.");
  }
 
    if( status != "aberto" && status != "solucionado")
    {
     return  errorResponse(res,400,"Status nao permitido ")
    }
    caso.status = status
  
  const agente = await agentesRepository.findById(agente_id);
  if (!agente) {
    return errorResponse(res,404,"Agente não encontrado para o agente_id fornecido");
  }

  const update = await casosRepository.updateCaso(casoId,{
      titulo,
   descricao,
    status,
   agente_id
  })
  if(!update){
    return errorResponse(res,404,"Erro ao atualizar caso");
  }
  res.status(200).json(update[0]);
}

async function patchCaso(req, res) {
  const id  = req.params.id;
  const { titulo, descricao, status, agente_id } = req.body;

  const dadosParaAtualizar = {};

  if (titulo !== undefined) {
    dadosParaAtualizar.titulo = titulo;
  }

  if (descricao !== undefined) {
    dadosParaAtualizar.descricao = descricao;
  }

  if (status !== undefined) {
    if (status !== "aberto" && status !== "solucionado") {
      return errorResponse(res,400,"Status não permitido.");
    }
    dadosParaAtualizar.status = status;
  }

  if (agente_id !== undefined) {
    const agenteExiste = await agentesRepository.findById(agente_id);
    if (!agenteExiste) {
      return res.status(404).json({ error: "Agente não encontrado para o agente_id fornecido." });
    }
    dadosParaAtualizar.agente_id = agente_id;
  }
  
  
  if (Object.keys(dadosParaAtualizar).length === 0) {
    return errorResponse(res,400,"Nenhum dado válido fornecido para atualização." );
  }
  
  const casoAtualizado = await casosRepository.patchCaso(id,dadosParaAtualizar);
  if(!casoAtualizado){
    return errorResponse(res,400,"Erro ao atualizar caso")
  }

  res.status(200).json(casoAtualizado[0]);
}

module.exports = {
  getCaso,
  getCasos,
  getAgentebyCaso,
  createCaso,
  deleteCaso,
  updateCaso,
  patchCaso,
  searchEmCaso,
};