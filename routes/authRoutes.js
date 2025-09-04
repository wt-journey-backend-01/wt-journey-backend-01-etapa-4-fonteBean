const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/me', authMiddleware, authController.me);
router.get('/', authMiddleware, authController.findAll);
router.get('/:id', authMiddleware, authController.findById);
router.post('/', authMiddleware, authController.findByEmail);

router.post('/login', authController.login);
router.post('/register', authController.create);
router.post('/logout', authController.logout);
router.get('/logout', authController.logout);

module.exports = router;