
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  await knex("casos").del();

  await knex("casos").insert([
    {
      titulo: "Roubo de Dados",
      descricao: "A empresa de tecnologia 'Innovatech' reportou uma invasão aos seus servidores e o roubo de dados de clientes.",
      status: "aberto",
      agente_id: 1,
    },
    {
      titulo: "Falsificação de Obras de Arte",
      descricao: "Um colecionador de arte denunciou que as pinturas de sua galeria, avaliadas em milhões, são falsificações.",
      status: "aberto",
      agente_id: 2,
    },
    {
      titulo: "Incêndio Suspeito",
      descricao: "Um grande incêndio destruiu o armazém da 'Logística Rápida'. A causa ainda é desconhecida, mas há indícios de sabotagem.",
      status: "solucionado",
      agente_id: 1,
    },
    {
      titulo: "Tráfico de Influência",
      descricao: "Vazou um áudio onde políticos e empresários discutem a venda de favores e licitações públicas.",
      status: "solucionado",
      agente_id: 2,
    },
  ]);
};