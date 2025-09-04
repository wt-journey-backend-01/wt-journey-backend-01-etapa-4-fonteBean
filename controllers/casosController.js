const casosRepository = require("../repositories/casosRepository.js")
const agentesRepository = require("../repositories/agentesRepository.js")
const {z} = require("zod");
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
}).strict();


async function getCasos(req, res) {
  try {

    const { status, agente_id } = req.query;

    if (status && status !== "aberto" && status !== "solucionado") {
      return res.status(400).json({message: "Status nao permitido"});
    }


    const filters = {};
    if (status) filters.status = status;
    if (agente_id) filters.agente_id = agente_id;
    const casos = await casosRepository.findAll(filters);
    if (!casos || casos.length === 0) {
      return res.status(404).json({message:"Nenhum caso encontrado com os filtros aplicados"});
    }

    res.status(200).json(casos);

  } catch (error) {
    console.error("Erro ao buscar casos:", error);
    return res.status(500).json({message:"Erro interno do servidor"});
  }
}

async function getCaso(req,res){
  const casoId = Number(req.params.id);
  if(isNaN(casoId)) {
    return res.status(400).json({message:"ID inválido"});
  }
  const caso = await casosRepository.findById(casoId);
  if(!caso){
   return res.status(404).json({message:"caso nao encontrado"})
  }
  res.status(200).json(caso)
}

async function getAgentebyCaso(req,res){
  const casoId = Number(req.params.id);
if (isNaN(casoId)) {
  return res.status(400).json({message:"ID inválido"});
}
  const caso = await casosRepository.findById(casoId);
  if(!caso){
   return  res.status(404).json({message:"caso nao encontrado"})
  }
  const agente = await agentesRepository.findById(caso.agente_id)
  if(!agente){
   return res.status(404).json({message:"Agente nao encontrado"})
  }
  res.status(200).json(agente)
}

async function searchEmCaso(req,res){
  const busca = req.query.q ? req.query.q.toLowerCase() : ""
  if(!busca){
    return res.status(404).json({message:"Parametro de busca nao encontrado"})
  }
 
  const casosFiltrados = await casosRepository.buscaPalavraEmCaso(busca)
  if(casosFiltrados.length === 0){
   return res.status(404).json({message:`Casos com a palavra ${busca} nao encotrados`})
  }
  res.status(200).json(casosFiltrados);
}






async function createCaso(req,res){
  const novoCaso = casoSchema.safeParse(req.body);
 if (!novoCaso.success) {
    return res.status(400).json({message: "Erro ao criar caso"});
  }
  const agente = await agentesRepository.findById(novoCaso.agente_id);
  if (!agente) {
    return res.status(404).json({message:"Agente não encontrado para o agente_id fornecido"});
  }
   
  const create = await casosRepository.criarCaso(novoCaso);
  if(!create){
    return res.status(400).json({message: "Erro ao criar caso"});
  }
  res.status(201).json(create[0]);
}

async function deleteCaso(req,res){
   const casoId = Number(req.params.id);
  if (isNaN(casoId)) {
    return res.status(400).json({message: "Id invalido"});
  }
   const sucesso = await casosRepository.deleteCaso(casoId);
   if(!sucesso){
    return res.status(404).json({message:`Erro ao deletar caso ${casoId}`})
   }
  res.status(204).send();
}

async function updateCaso(req, res) {
  const casoId = Number(req.params.id);
  if (isNaN(casoId)) {
    return res.status(400).json({message: "Id invalido"});
  } 
  if ('id' in req.body) {
  return res.status(400).json({message: "Nao eh permitido alterar id"});
}
   const uptatedCaso = casoSchema.safeParse(req.body);
   if (!uptatedCaso.success) {
    return res.status(400).json({
      message: "Erro ao atualizar caso",
    });
  }

 

  const caso = await casosRepository.findById(casoId);
  if (!caso) {
    return res.status(404).json({message:"caso não encontrado."});
  }
 
  
  const agente = await agentesRepository.findById(uptatedCaso.agente_id);
  if (!agente) {
      return res.status(404).json({message:"Agente não encontrado para o agente_id fornecido"});
  }

  const update = await casosRepository.updateCaso(casoId,uptatedCaso)
  if(!update){
     return res.status(400).json({
      message: "Erro ao atualizar caso",
    });
  }
  res.status(200).json(update[0]);
}

async function patchCaso(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id)) {  
       return res.status(400).json({message:"id invalido"});
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
    return res.status(400).json({message:"Status invalido"});;
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
    return res.status(400).json({message:"Nenhum dado válido fornecido para atualização." });
  }
  
  const casoAtualizado = await casosRepository.patchCaso(id,dadosParaAtualizar);
  if(!casoAtualizado){
    return res.status(400).json({message:"Erro ao atualizar caso"})
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