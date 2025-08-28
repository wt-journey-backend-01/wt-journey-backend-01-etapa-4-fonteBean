const authController = require('../controllers/authController.js');
const authMiddleware = require('../middlewares/authMiddleware.js')
const express =require('express');
const router = express.Router();


router.post('/auth/login', authController.login);

router.get('/auth/usuarios',authMiddleware, authController.getUsers);
router.get('/usuarios/me', authMiddleware, authController.getMe);
router.post('/auth/register', authController.signUp);
module.exports = router;