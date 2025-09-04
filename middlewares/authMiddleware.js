

const jwt = require('jsonwebtoken');

async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ "message": "Token não fornecido." });
        }

        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ "message": "Formato de token inválido. Use: Bearer <token>" });
        }

        const token = parts[1];

        // if (!process.env.JWT_SECRET) {
        //      throw new Error("JWT_SECRET não está definido no arquivo .env");
        // }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    
        req.user = decoded; 

        return next();

    } catch (err) {
        
        return res.status(401).json({ "message": "Token inválido ou expirado." });
    }
}

module.exports = authMiddleware;
