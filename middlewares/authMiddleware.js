const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ mensagem: "Token Necessario" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ mensagem: "Token Necessario" });
  }

    const secret = process.env.JWT_SECRET || "chave_secreta";

    jwt.verify(token, secret, (err, user) => {
    if (err) {
        return res.status(401).json({ mensagem: "Token Necessario" });
    }
    req.user = user;
    next();
    });
}

module.exports = authMiddleware;