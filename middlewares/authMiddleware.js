const jwt = require("jsonwebtoken");
require('dotenv').config();
const errorResponse = require('../utils/errorHandler');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return errorResponse(res,404,"Token não fornecido");
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return errorResponse(res,401,"Token invalido");
        }
        req.user = decoded;
        next();
    });
}

module.exports = {
    authMiddleware
};