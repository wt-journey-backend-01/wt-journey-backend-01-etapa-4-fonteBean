const jwt = require('jsonwebtoken');
const errorResponse = require('../utils/errorHandler')

async function authMiddleware(req,res,next){
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if(!token){
   return   errorResponse(res,401,"Token Necessario");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
    if(err){
      return errorResponse(res,401,"Token invalido");
    }
    req.user = decoded;
    next();
  }) 
}

module.exports = authMiddleware;