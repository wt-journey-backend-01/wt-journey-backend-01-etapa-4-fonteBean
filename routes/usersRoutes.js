const authController = require('../controllers/authController');
const express =require('express');
const router = express.Router();


router.get('/auth/login', authController.login);
router.post('/auth/sign', authController.signUP);

module.exports = router;