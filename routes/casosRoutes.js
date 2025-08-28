const casosController = require('../controllers/casosController.js')
const express = require('express');
const router = express.Router()

router.get( casosController.getCasos);
router.get('/search', casosController.searchEmCaso)
router.get('/:id', casosController.getCaso);
router.get('/:id/agente', casosController.getAgentebyCaso);
router.post( casosController.createCaso);
router.put('/:id', casosController.updateCaso);
router.patch('/:id', casosController.patchCaso);
router.delete('/:id', casosController.deleteCaso);

module.exports = router