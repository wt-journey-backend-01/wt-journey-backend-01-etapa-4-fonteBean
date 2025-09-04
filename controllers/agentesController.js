const agentesRepository = require('../repositories/agentesRepository');

function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const date = new Date(dateString);
  const today = new Date();
  return !isNaN(date.getTime()) && date <= today;
}

function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

module.exports = {
  async findAll(req, res) {
    try {
      let agentes = await agentesRepository.findAll();
      const { cargo, sort } = req.query;

      if (cargo) {
        agentes = agentes.filter(agente =>
          agente.cargo.toLowerCase() === cargo.toLowerCase()
        );
      }

      if (sort === 'dataDeIncorporacao') {
        agentes = agentes.sort((a, b) =>
          new Date(a.dataDeIncorporacao) - new Date(b.dataDeIncorporacao)
        );
      } else if (sort === '-dataDeIncorporacao') {
        agentes = agentes.sort((a, b) =>
          new Date(b.dataDeIncorporacao) - new Date(a.dataDeIncorporacao)
        );
      }

      agentes = agentes.map(a => ({
        ...a,
        dataDeIncorporacao: formatDate(a.dataDeIncorporacao)
      }));

      res.json(agentes);
    } catch (error) {
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  },

  async findById(req, res) {
    const agente = await agentesRepository.findById(id);
    if (!agente) {
      return res.status(404).json({ message: "Agente não encontrado" });
    }
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
    return res.status(404).json({ message: "ID inválido" });
    }
    agente.dataDeIncorporacao = formatDate(agente.dataDeIncorporacao);
    res.json(agente);
  },

  async create(req, res) {
    const { nome, dataDeIncorporacao, cargo } = req.body;
    const errors = [];

    if (!nome || typeof nome !== 'string' || nome.trim() === '') {
      errors.push({ field: "nome", message: "Nome é obrigatório e deve ser uma string não vazia" });
    }
    if (!cargo || typeof cargo !== 'string' || cargo.trim() === '') {
      errors.push({ field: "cargo", message: "Cargo é obrigatório e deve ser uma string não vazia" });
    }
    if (!dataDeIncorporacao || !isValidDate(dataDeIncorporacao)) {
      errors.push({ field: "dataDeIncorporacao", message: "Data inválida ou no futuro" });
    }

    if (errors.length > 0) {
      return res.status(400).json({ status: 400, message: "Parâmetros inválidos", errors });
    }

    const agenteCriado = await agentesRepository.create({ nome, dataDeIncorporacao, cargo });
    agenteCriado.dataDeIncorporacao = formatDate(agenteCriado.dataDeIncorporacao);
    return res.status(201).json(agenteCriado);
  },

  async update(req, res) {
    const dadosAtualizados = req.body;

    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(404).json({ message: "ID inválido" });
    }

    const errors = [];
    if (!dadosAtualizados.nome || typeof dadosAtualizados.nome !== 'string' || dadosAtualizados.nome.trim() === '') {
      errors.push({ field: "nome", message: "Nome é obrigatório e deve ser uma string não vazia" });
    }
    if (!dadosAtualizados.cargo || typeof dadosAtualizados.cargo !== 'string' || dadosAtualizados.cargo.trim() === '') {
      errors.push({ field: "cargo", message: "Cargo é obrigatório e deve ser uma string não vazia" });
    }
    if (!dadosAtualizados.dataDeIncorporacao || !isValidDate(dadosAtualizados.dataDeIncorporacao)) {
      errors.push({ field: "dataDeIncorporacao", message: "Data inválida ou no futuro" });
    }

    if (errors.length > 0) {
      return res.status(400).json({ status: 400, message: "Parâmetros inválidos", errors });
    }

    const agenteAtualizado = await agentesRepository.update(id, dadosAtualizados); 
    if (!agenteAtualizado) {
      return res.status(404).json({ error: 'Agente não encontrado' });
    }
    agenteAtualizado.dataDeIncorporacao = formatDate(agenteAtualizado.dataDeIncorporacao);
    res.status(200).json(agenteAtualizado);
  },

  async partialUpdate(req, res) {
    const dadosAtualizados = { ...req.body };

    if (Object.keys(dadosAtualizados).length === 0) {
      return res.status(400).json({
        status: 400,
        message: "Nenhum dado para atualizar foi fornecido."
      });
    }

    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(404).json({ message: "ID inválido" });
    }
    const errors = [];
    if ('nome' in dadosAtualizados && 
        (typeof dadosAtualizados.nome !== 'string' || dadosAtualizados.nome.trim() === '')) {
      errors.push({ field: "nome", message: "Nome deve ser uma string não vazia" });
    }
    if ('cargo' in dadosAtualizados && 
        (typeof dadosAtualizados.cargo !== 'string' || dadosAtualizados.cargo.trim() === '')) {
      errors.push({ field: "cargo", message: "Cargo deve ser uma string não vazia" });
    }
    if ('dataDeIncorporacao' in dadosAtualizados && !isValidDate(dadosAtualizados.dataDeIncorporacao)) {
      errors.push({ field: "dataDeIncorporacao", message: "Data inválida ou no futuro" });
    }

    if (errors.length > 0) {
      return res.status(400).json({ status: 400, message: "Parâmetros inválidos", errors });
    }

    const agenteAtualizado = await agentesRepository.update(id, dadosAtualizados); 
    if (!agenteAtualizado) {
      return res.status(404).json({ error: 'Agente não encontrado' });
    }
    agenteAtualizado.dataDeIncorporacao = formatDate(agenteAtualizado.dataDeIncorporacao);
    res.status(200).json(agenteAtualizado);
  },

  async deleteById(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(404).json({ message: "ID inválido" });
    }
    const deletado = await agentesRepository.deleteById(id);
    if (!deletado) {
      return res.status(404).json({ message: "Agente não encontrado" });
    }
    return res.status(204).send();
  }
};