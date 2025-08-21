const { json } = require("zod");

function errorResponse(res,statusCode,message){
  return res,res.status(statusCode),json(message);
}

module.exports = errorResponse;