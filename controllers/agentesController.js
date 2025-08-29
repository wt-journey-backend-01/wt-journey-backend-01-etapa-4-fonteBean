const agentesRepository = require('../repositories/agentesRepository')
const errorResponse = require('../utils/errorHandler')
const {z} = require('zod');



async function getAgentes(req, res) {
 try{
  const {cargo,sort} = req.query;
  const filter = {};
  if(cargo) filter.cargo = cargo;
  if(sort) filter.sort = sort;
  let agentes =  await agentesRepository.findAll(filter);
  if (!agentes || agentes.length === 0) {
      return errorResponse(res, 404, "Nenhum caso encontrado com os filtros aplicados");
    }

  res.status(200).json(agentes);
 }catch(err){
    return errorResponse(res,500,"Erro interno");
 }
}

async function getAgenteById(req, res) {
  const agenteId = Number(req.params.id);
  if (isNaN(agenteId) || agenteId <= 0) {
    return errorResponse(res, 400, "ID inválido");
  }
  const agente = await agentesRepository.findById(agenteId);
  if (!agente) {
    return errorResponse(res, 404, "Agente não encontrado");
  }
  res.status(200).json(agente);
}


const agenteSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cargo: z.string().min(1, "Cargo é obrigatório"),
  dataDeIncorporacao: z.string().refine(dateStr => !isNaN(new Date(dateStr).getTime()), {
    message: "Data de incorporação inválida"
  }),
}).strict();

async function createAgente(req, res) {
  try {
    const agenteData = agenteSchema.parse(req.body);
    const data = new Date(agenteData.dataDeIncorporacao);
    const agora = new Date();
    if (data > agora) {
      return errorResponse(res, 400, "Data de incorporação não pode ser no futuro.");
    }
    const novoAgente = {
      nome: agenteData.nome,
      cargo: agenteData.cargo,
      dataDeIncorporacao: data.toISOString().split('T')[0],
    };
    const create = await agentesRepository.criarAgente(novoAgente);
    if (!create) {
      return errorResponse(res, 400, "Erro ao criar agente");
    }
    res.status(201).json(create[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
    }
    return errorResponse(res, 500, "Erro interno");
  }
}

async function updateAgente(req, res) {
 const agenteId = Number(req.params.id);
  if (isNaN(agenteId)) {
    return errorResponse(res, 400, "ID inválido");
  }
   const agenteData = agenteSchema.parse(req.body);
    const data = new Date(agenteData.dataDeIncorporacao);
    const agora = new Date();
    if (data > agora) {
      return errorResponse(res, 400, "Data de incorporação não pode ser no futuro.");
    }
    if ('id' in req.body) {
    return errorResponse(res,400,"Não é permitido alterar o ID do agente.");
    }
    const agenteUpdated = {
      id: agenteId,
      nome: agenteData.nome,
      cargo: agenteData.cargo,
      dataDeIncorporacao: data.toISOString().split('T')[0],
    };



  const agenteAtualizado = await agentesRepository.updateAgente(agenteUpdated);

  if (!agenteAtualizado) {
    return errorResponse(res,404,"Agente não encontrado.");
  }

  res.status(200).json(agenteAtualizado[0]);
}


async function patchAgente(req, res) {
  const agenteId = Number(req.params.id);
  if (isNaN(agenteId)) {
    return errorResponse(res, 400, "ID inválido");
  }
  const { nome, cargo, dataDeIncorporacao } = req.body;

  if ('id' in req.body) {
    return errorResponse(res,400,"Não é permitido alterar o ID do agente.");
  }
  if (nome === undefined && cargo === undefined && dataDeIncorporacao === undefined) {
    return errorResponse(res,400,"Nenhum campo válido para atualização foi enviado.");
  }

  const agente =  await agentesRepository.findById(agenteId);
  if (!agente) {
    return errorResponse(res,404,"Agente não encontrado.");
  }
  const dadosParaAtualizar = {};
  if (nome !== undefined) dadosParaAtualizar.nome = nome;
  if (cargo !== undefined) dadosParaAtualizar.cargo = cargo;
 
  if (dataDeIncorporacao !== undefined) {
    const data = new Date(dataDeIncorporacao);
    const agora = new Date();
    if (isNaN(data.getTime())) {
      return errorResponse(res,400,"Data de incorporação inválida.");
    }
    if (data > agora) {
      return errorResponse(res,400,"Data de incorporação não pode ser no futuro.");
    }
     dadosParaAtualizar.dataDeIncorporacao = data.toISOString().split('T')[0];
  }

  const agenteAtualizado = await agentesRepository.updateAgente(agenteId, dadosParaAtualizar);
  if (!agenteAtualizado) {
    return errorResponse(res, 404, "Agente não encontrado.");
  }
  res.status(200).json(agenteAtualizado[0]);
}


async function deleteAgente(req,res){
  const agenteId = Number(req.params.id);
  if(isNaN(agenteId)) {
   return errorResponse(res, 400, "ID inválido");
  }
    
  const sucesso = await agentesRepository.deleteAgente(agenteId);
  if(!sucesso){
    return errorResponse(res,404,`Error ao deletar ${agenteId}`)
  }
  res.status(204).send();
}

module.exports = {
  getAgenteById,
  getAgentes,
  createAgente,
  deleteAgente,
  updateAgente,
  patchAgente,
};