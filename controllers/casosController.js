const casosRepository = require("../repositories/casosRepository.js")
const agentesRepository = require("../repositories/agentesRepository.js")
const errorResponse = require("../utils/errorHandler.js");
const {z} = require("zod");


async function getCasos(req, res) {
  try {

    const { status, agente_id } = req.query;

    if (status && status !== "aberto" && status !== "solucionado") {
      return errorResponse(res, 400, "Status nao permitido");
    }


    const filters = {};
    if (status) filters.status = status;
    if (agente_id) filters.agente_id = agente_id;
    const casos = await casosRepository.findAll(filters);
    if (!casos || casos.length === 0) {
      return errorResponse(res, 404, "Nenhum caso encontrado com os filtros aplicados");
    }

    res.status(200).json(casos);

  } catch (error) {
    console.error("Erro ao buscar casos:", error);
    return errorResponse(res, 500, "Erro interno do servidor");
  }
}

async function getCaso(req,res){
  const casoId = Number(req.params.id);
  if(isNaN(casoId)) {
    return errorResponse(res, 400, "ID inválido");
  }
  const caso = await casosRepository.findById(casoId);
  if(!caso){
   return  errorResponse(res,404,"caso nao encontrado")
  }
  res.status(200).json(caso)
}

async function getAgentebyCaso(req,res){
  const casoId = Number(req.params.id);
if (isNaN(casoId)) {
  return errorResponse(res, 400, "ID inválido");
}
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


const casoSchema = z.object({
  titulo: z
    .string({
      required_error: "Titulo é obrigatório",
      invalid_type_error: "Titulo deve ser uma string",
    })
    .min(1, "Titulo não pode ser vazio"),

  descricao: z
    .string({
      required_error: "Descrição é obrigatória",
      invalid_type_error: "Descrição deve ser uma string",
    })
    .min(1, "Descrição não pode ser vazia"),

  status: z.enum(["aberto", "solucionado"], {
    required_error: "Status é obrigatório",
    invalid_type_error: "Status inválido, use 'aberto' ou 'solucionado'",
  }),

  agente_id: z
    .number({
      required_error: "agente_id é obrigatório",
      invalid_type_error: "agente_id deve ser um número",
    })
    .int("agente_id deve ser inteiro")
    .positive("agente_id deve ser positivo"),
});



async function createCaso(req,res){
  const novoCaso = casoSchema.safeParse(req.body);
 if (!novoCaso.success) {
    return res.status(400).json({
      error: parseResult.error.errors.map(err => err.message),
    });
  }
  const agente = await agentesRepository.findById(novoCaso.agente_id);
  if (!agente) {
    return errorResponse(res,404,"Agente não encontrado para o agente_id fornecido");
  }
   
  const create = await casosRepository.criarCaso(novoCaso);
  if(!create){
    return errorResponse(res,400,"Erro ao criar caso");
  }
  res.status(201).json(create[0]);
}

async function deleteCaso(req,res){
   const casoId = Number(req.params.id);
  if (isNaN(casoId)) {
    return errorResponse(res, 400, "ID inválido");
  }
   const sucesso = await casosRepository.deleteCaso(casoId);
   if(!sucesso){
    return errorResponse(res,404,`Erro ao deletar caso ${casoId}`)
   }
  res.status(204).send();
}

async function updateCaso(req, res) {
  const casoId = Number(req.params.id);
  if (isNaN(casoId)) {
    return errorResponse(res, 400, "ID inválido");
  } 
  if ('id' in req.body) {
  return errorResponse(res,400,"Não é permitido alterar o ID do caso.");
}
   const uptatedCaso = casoSchema.safeParse(req.body);
   if (!uptatedCaso.success) {
    return res.status(400).json({
      error: parseResult.error.errors.map(err => err.message),
    });
  }

 

  const caso = await casosRepository.findById(casoId);
  if (!caso) {
    return errorResponse(res,404,"caso não encontrado.");
  }
 
  
  const agente = await agentesRepository.findById(uptatedCaso.agente_id);
  if (!agente) {
    return errorResponse(res,404,"Agente não encontrado para o agente_id fornecido");
  }

  const update = await casosRepository.updateCaso(casoId,uptatedCaso)
  if(!update){
    return errorResponse(res,404,"Erro ao atualizar caso");
  }
  res.status(200).json(update[0]);
}

async function patchCaso(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id)) {  
    return errorResponse(res, 400, "ID inválido");
  }
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