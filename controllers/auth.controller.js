const userRepository = require('../repositories/usersRepository.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const errorResponse = require('../utils/errorHandler');
const { json } = require('zod');

async function login (req,res,next){
  try{
    console.log(user);
    const {email,password} = req.body;
    const user = await userRepository.findUserByEmail(email);
  

    if(!user){
      return next(errorResponse(res,404,"Not found"));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return next(errorResponse(res,401,"Password incorrect"));
    }
    console.log("2");
    const token = jwt.sign({id: user.id, name:user.name, email:user.email}, process.env.JWT_PASSWORD,{
      expiresIn: "1d"
    });
    res.status(200).json("Login OK")
  }catch(error){
    console.log("entrei");
    return next(errorResponse(res,500, error));
    
  }
}

async function signUP (req,res,next){
  try{
    const {name,email,password} = req.body;
    if(!name | !email | !password){
      return next(errorResponse(res,401,"Bad Request"))
    }
    const userExists = await userRepository.findUserByEmail(email);
    if(userExists){
      return next(errorResponse(res,400,"User already exists"))
    }
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS || 10));
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
  signUP,
}