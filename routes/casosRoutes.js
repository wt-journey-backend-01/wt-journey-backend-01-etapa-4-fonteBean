const express = require("express");
const router = express.Router();
const casosController = require("../controllers/casosController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /casos:
 *  get:
 *      summary: Lista de casos
 *      tags: [Casos]
 *      responses:
 *          200:
 *              description: Lista de casos
 *
 */
router.get("/", authMiddleware, casosController.findAll);
/**
 * @swagger
 * /casos/{id}:
 *  get:
 *      summary: Busca por id do caso
 *      tags: [Casos]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: Caso buscado por id com sucesso
 */
router.get("/:id", authMiddleware, casosController.findById);
/**
 * @swagger
 * /casos:
 *  post:
 *      summary: Resgistro de casos
 *      tags: [Casos]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: [titulo, descricao, status, agente_id]
 *                      properties:
 *                          titulo:
 *                              type: string
 *                          descricao:
 *                              type: string
 *                          status:
 *                              enum: [aberto, solucionado]
 *                              type: string
 *                          agente_id:
 *                              type: string
 *      responses:
 *          201:
 *           description: Caso registrado com sucesso
 *
 */
router.post("/", authMiddleware, casosController.create);
/**
 * @swagger
 * /casos/{id}:
 *  put:
 *      summary: Atualização de casos
 *      tags: [Casos]
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
 *                      required: [titulo, descricao, status, agente_id]
 *                      properties:
 *                          titulo:
 *                              type: string
 *                          descricao:
 *                              type: string
 *                          status:
 *                              enum: [aberto, solucionado]
 *                              type: string
 *                          agente_id:
 *                              type: string
 *      responses:
 *          200:
 *           description: Casos atualizado com sucesso
 *
 */
router.put("/:id", authMiddleware, casosController.update);
/**
 * @swagger
 * /casos/{id}:
 *  patch:
 *      summary: Atualizar de casos
 *      tags: [Casos]
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
 *                      required: [titulo, descricao, status, agente_id]
 *                      properties:
 *                          titulo:
 *                              type: string
 *                          descricao:
 *                              type: string
 *                          status:
 *                              enum: [aberto, solucionado]
 *                              type: string
 *                          agente_id:
 *                              type: string
 *      responses:
 *          200:
 *           description: Caso atualizado parcialmente com sucesso
 *
 */
router.patch("/:id", authMiddleware, casosController.partialUpdate);
/**
 * @swagger
 * /casos/{id}:
 *  deleteById:
 *      summary: Deletar caso
 *      tags: [Casos]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          204:
 *           description: Casos Deletado com sucesso
 *
 */
router.delete("/:id", authMiddleware, casosController.deleteById);

module.exports = router;