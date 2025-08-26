const jwt = require('jsonwebtoken');
const errorResponse = require('../utils/errorHandler')
function authMiddleware(req,res,next){
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if(!token){
   return   errorResponse(res,401,"Token Necessario");
  }
  jwt.verify(token,process.env.JWT_SECRET, (err)=>{
    if(err){
      return errorResponse(res,400,"Token invalido");
    }
  }) 
  next();
}

module.exports = authMiddleware;