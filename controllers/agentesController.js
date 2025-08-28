const agentesRepository = require('../repositories/agentesRepository')
const errorResponse = require('../utils/errorHandler')
const express = require('express');




async function getAgentes(req, res) {
    let agentes =  await agentesRepository.findAll();

    const cargo = req.query.cargo;
    const sort = req.query.sort;

    if (cargo) {
        agentes = agentes.filter(a => a.cargo === cargo);

        if (agentes.length === 0) {
            return errorResponse(res,404,`Agentes com cargo "${cargo}" não encontrados.`) ;
        }
    }

    if (sort === 'dataDeIncorporacao') {
        agentes.sort((a, b) => {
            if (a.dataDeIncorporacao < b.dataDeIncorporacao) return -1;
            if (a.dataDeIncorporacao > b.dataDeIncorporacao) return 1;
            return 0;
        });
    } else if (sort === '-dataDeIncorporacao') {
        agentes.sort((a, b) => {
            if (a.dataDeIncorporacao > b.dataDeIncorporacao) return -1;
            if (a.dataDeIncorporacao < b.dataDeIncorporacao) return 1;
            return 0;
        });
    }

    res.status(200).json(agentes);
}

async function getAgenteById(req,res){
  const agenteId = req.params.id;
  const agente = await agentesRepository.findById(agenteId);
  if(!agente){
       return errorResponse(res,404,"Agente nao encontrado");
    }
     res.status(200).json(agente);
}




async function createAgente(req, res) {
  const {nome,cargo,dataDeIncorporacao } = req.body;

  if (!nome || !cargo || !dataDeIncorporacao) {
    return errorResponse(res,400,"Nome, Cargo e dataDeIncorporacao são obrigatórios.");
  }

  const data = new Date(dataDeIncorporacao);
  const agora = new Date();

  if (isNaN(data.getTime())) {
    return errorResponse(res,400,"Data de incorporação inválida.");
  }

  if (data > agora) {
    return errorResponse(res,400,"Data de incorporação não pode ser no futuro.");
  }

  const novoAgente = {
    nome,
    cargo,
    dataDeIncorporacao: data.toISOString().split('T')[0],
  };

  const create =  await agentesRepository.criarAgente(novoAgente);
  if(!create){
    return errorResponse(res,400,"Erro ao criar agente");
  }
  
  res.status(201).json(create[0]);
}

async function updateAgente(req, res) {
  const agenteId = req.params.id;
  const { nome, cargo, dataDeIncorporacao } = req.body;

  if ('id' in req.body) {
    return errorResponse(res,400,"Não é permitido alterar o ID do agente.");
  }

  if (!nome || !cargo || !dataDeIncorporacao) {
    return errorResponse(res,400,"Todos os campos são obrigatórios para atualização completa.");
  }

  const data = new Date(dataDeIncorporacao);
  const agora = new Date();

  if (isNaN(data.getTime())) {
    return errorResponse(res,400,"Data de incorporação inválida.");
  }

  if (data > agora) {
    return errorResponse(res,400,"Data de incorporação não pode ser no futuro.");
  }

  const agenteAtualizado = await agentesRepository.updateAgente(agenteId, {
    nome,
    cargo,
    dataDeIncorporacao: data.toISOString().split('T')[0],
  });

  if (!agenteAtualizado) {
    return errorResponse(res,404,"Agente não encontrado.");
  }

  res.status(200).json(agenteAtualizado);
}


async function patchAgente(req, res) {
  const agenteId = req.params.id;
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
  const agenteId =req.params.id;
    
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