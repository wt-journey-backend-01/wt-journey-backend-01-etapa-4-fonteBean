const authController = require('../controllers/authController.js');
const authMiddleware = require('../middlewares/authMiddleware.js')
const express =require('express');
const router = express.Router();


router.post('/login', authController.login);
router.get('/usuarios',authMiddleware, authController.getUsers);
router.get('/usuarios/me', authMiddleware, authController.getMe);
router.post('/register', authController.signUp);
router.post('/logout',authMiddleware, authController.logout)
router.delete('/usuarios/:id', authMiddleware, authController.deleteUser);
module.exports = router;