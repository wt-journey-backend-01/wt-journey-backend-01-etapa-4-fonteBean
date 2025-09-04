const agentesController = require('../controllers/agentesController.js');
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware.js')
const router = express.Router();

router.get('/',authMiddleware, agentesController.getAgentes);
router.get('/:id',authMiddleware, agentesController.getAgenteById);
router.post('/',authMiddleware, agentesController.createAgente);
router.put('/:id',authMiddleware, agentesController.updateAgente);
router.patch('/:id',authMiddleware, agentesController.patchAgente);
router.delete('/:id',authMiddleware, agentesController.deleteAgente);

module.exports = router;
