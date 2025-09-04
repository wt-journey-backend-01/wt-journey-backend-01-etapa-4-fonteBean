const jwt = require('jsonwebtoken');
const errorResponse = require('../utils/errorHandler');

function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        
        if(!token) {
            return next(errorResponse(res,'Token não fornecido.', 401));
        }

        jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
            if(err) {
                return next(errorResponse(res,'Token inválido ou expirado.', 401));
            }

            req.user = user;
            next();
        });    
    } 
    catch (error) {
        return next(errorResponse(res,'Erro de autenticação de usuário.', 401));
    }
}

module.exports = authMiddleware;