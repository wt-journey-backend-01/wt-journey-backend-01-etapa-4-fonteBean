const casosController = require('../controllers/casosController.js')
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware.js')
const router = express.Router()

router.get('/',authMiddleware, casosController.getCasos);
router.get('/search',authMiddleware, casosController.searchEmCaso)
router.get('/:id',authMiddleware, casosController.getCaso);
router.get('/:id/agente',authMiddleware, casosController.getAgentebyCaso);
router.post('/',authMiddleware, casosController.createCaso);
router.put('/:id', authMiddleware,casosController.updateCaso);
router.patch('/:id',authMiddleware, casosController.patchCaso);
router.delete('/:id',authMiddleware, casosController.deleteCaso);

module.exports = router