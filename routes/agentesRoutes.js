const agentesController = require('../controllers/agentesController.js');
const express = require('express');
const router = express.Router();

router.get('/', agentesController.getAgentes);
router.get('/:id', agentesController.getAgenteById);
router.post('/', agentesController.createAgente);
router.put('/:id', agentesController.updateAgente);
router.patch('/:id', agentesController.patchAgente);
router.delete('/:id', agentesController.deleteAgente);

module.exports = router;
