const userRepository = require('../repositories/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const errorResponse = require('../utils/errorHandler');
const { json } = require('zod');

const login = async (req,res,next)=> {
  try{
    const {email,password} = req.body;
    const user = await userRepository.findUserByEmail(email);

    if(!user){
      return next( errorResponse(res,404,"Not found"));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return next(errorResponse(res,401,"Password incorrect"));
    }
    
    const token = jwt.sign({id: user.id, name:user.name, email:user.email}, process.env.JWT_PASSWORD,{
      expiresIn: "1d"
    });
    return res.status(200),json({
      message: "Login OK",
      token
    })
  }catch(error){
    return next(errorResponse(res,500, error));
    
  }
}

const sing = async (req,res,next)=>{
  try{
    const {name,email,password} = req.body;
    if(!name | !email | !password){
      return next(errorResponse(res,401,"Bad Request"))
    }
    const user = await userRepository.findUserByEmail(email);
    if(user){
      return next(errorResponse(res,400,"User already exists"))
    }
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = await userRepository.createUser({
      name: name,
      email: email,
      password: hashedPassword,
    })
    if(!newUser){
      return next(errorResponse(res,401,"Bad Request"));
    }
    res.status(201).json({
      message: "User creates",
      user: newUser
    })
  }catch(error){
    next(res,500,"Internal error")
  }
}
module.exports = {
  login,
  sign,
}