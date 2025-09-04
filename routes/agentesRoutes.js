const express = require('express');
const router = express.Router();
const agentesController = require('../controllers/agentesController');
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /agentes:
 *  get:
 *      summary: Lista de agentes
 *      tags: [Agentes]
 *      responses:
 *          200:
 *              description: Lista de agentes
 */
router.get('/', authMiddleware, agentesController.findAll);
/**
 * @swagger
 * /agentes/{id}:
 *  get:
 *      summary: Buscar por id de agente
 *      tags: [Agentes]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: Agente buscado por id com sucesso
 *          
 */
router.get('/:id', authMiddleware, agentesController.findById);
/**
 * @swagger
 * /agentes:
 *  post:
 *      summary: Resgistro de agentes
 *      tags: [Agentes]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: [nome, cargo, dataDeIncorporacao]
 *                      properties:
 *                          nome:
 *                              type: string
 *                          cargo:
 *                              type: string
 *                          dataDeIncorporacao:
 *                              type: string
 *                              format: date
 *      responses:
 *          201:
 *           description: Agente registrado com sucesso
 *
 */
router.post('/', authMiddleware, agentesController.create);
/**
 * @swagger
 * /agentes/{id}:
 *  put:
 *      summary: Atualização de agentes
 *      tags: [Agentes]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: [nome, cargo, dataDeIncorporacao]
 *                      properties:
 *                          nome:
 *                              type: string
 *                          cargo:
 *                              type: string
 *                          dataDeIncorporacao:
 *                              type: string
 *                              format: date
 *      responses:
 *          200:
 *           description: Agente atualizado com sucesso
 *
 */
router.put('/:id', authMiddleware, agentesController.update);
/**
 * @swagger
 * /agentes/{id}:
 *  patch:
 *      summary: Atualização de agentes
 *      tags: [Agentes]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: [nome, cargo, dataDeIncorporacao]
 *                      properties:
 *                          nome:
 *                              type: string
 *                          cargo:
 *                              type: string
 *                          dataDeIncorporacao:
 *                              type: string
 *                              format: date
 *      responses:
 *          200:
 *           description: Agente atualizado parcialmente com sucesso
 *
 */
router.patch('/:id', authMiddleware, agentesController.partialUpdate);
/**
 * @swagger
 * /agentes/{id}:
 *  delete:
 *      summary: Deletar agente
 *      tags: [Agentes]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          204:
 *           description: Agentes Deletado com sucesso
 *
 */
router.delete('/:id', authMiddleware, agentesController.deleteById);

module.exports = router;
