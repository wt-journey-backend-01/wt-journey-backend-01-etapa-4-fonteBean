const jwt = require('jsonwebtoken');

async function authMiddleware(req,res,next){
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if(!token){
   return res.status(404).json({"message": "Token nao encontrado"});
  }
  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decoded)=>{
    if(err){
      return res.status(401).json({"message": "Token invalido"});
    }
    req.user = decoded;
    next();
  }) 
}

module.exports = authMiddleware;