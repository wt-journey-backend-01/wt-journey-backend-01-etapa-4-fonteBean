const userRepository = require('../repositories/usuariosRepository.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const errorResponse = require('../utils/errorHandler.js');
const {z} = require('zod');


async function login (req,res,next){
    const {email,senha} = req.body;
    const user = await userRepository.findUserByEmail(email);
    if(!user){
      return next(errorResponse(res,404,"Not found"));
    }
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if(!isPasswordValid){
      return next(errorResponse(res,401,"Password incorrect"));
    }
    const token = jwt.sign({id: user.id, nome:user.nome, email:user.email}, process.env.JWT_SECRET
      ,{
      expiresIn: "1d"
    });
    res.status(200).json({"access-token": token})
}

const userSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  senha: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[a-z]/, "Senha deve conter letra minúscula")
    .regex(/[A-Z]/, "Senha deve conter letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter número")
    .regex(/[^a-zA-Z0-9]/, "Senha deve conter caractere especial"),
});

async function signUp (req,res){
    const userData = userSchema.parse(req.body);
    const userExists = await userRepository.findUserByEmail(userData.email);
    if(userExists){
      return errorResponse(res,400,"User already exists")
    }
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS || 10));
    const hashedPassword = await bcrypt.hash(userData.senha,salt);
    userData.senha = hashedPassword;
    const newUser = await userRepository.createUser(userData)

    if(!newUser){
      return errorResponse(res,400,"Bad Request");
    }
    res.status(201).json({
      message: "User created",
      user: newUser
    })
}


async function getUsers (req,res){
  const users = await userRepository.findAll();
  if(!users){
    return errorResponse(res,400,"Not Found");
  }
  res.status(200).json(users);
}

module.exports = {
  login,
  signUp,
  getUsers
}