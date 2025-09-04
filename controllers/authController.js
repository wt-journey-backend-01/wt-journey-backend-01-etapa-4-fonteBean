const userRepository = require('../repositories/usuariosRepository.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {z} = require('zod');
const userSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  senha: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[a-z]/, "Senha deve conter letra minúscula")
    .regex(/[A-Z]/, "Senha deve conter letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter número")
    .regex(/[^a-zA-Z0-9]/, "Senha deve conter caractere especial"),
}).strict();


async function login (req,res){
    const {email,senha} = req.body;
    const user = await userRepository.findUserByEmail(email);
    if(!user){
      return res.status(404).json({message:"Not found"});
    }
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if(!isPasswordValid){
      return res.status(401).json({message:"Password incorrect"});
    }
    const token = jwt.sign({id: user.id, nome:user.nome, email:user.email}, process.env.JWT_SECRET || "secret" 
      ,{
      expiresIn: "1d"
    });
    res.status(200).json({"access_token": token})
}
async function getMe(req, res) {
  const userId = req.user.id;
  const user = await userRepository.findUserById(userId);
  if (!user) {
    return res.status(404).json({message:"Usuário não encontrado"});
  }
  res.status(200).json(user);
}



async function signUp(req, res) {
  try {
    const userData = userSchema.parse(req.body);
    const userExists = await userRepository.findUserByEmail(userData.email);
    if (userExists) {
      return res.status(401).json({message:"User already exists"});
    }
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS || 10));
    const hashedPassword = await bcrypt.hash(userData.senha, salt);
    userData.senha = hashedPassword;
    const newUser = await userRepository.createUser(userData);

    if (!newUser) {
      return res.status(401).json({message: "Bad Request"});
    }
    const userResponse = {...newUser};
    delete userResponse.senha;
    res.status(201).json(userResponse);
   
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(401).json({message:"Erro"});
    }
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}


async function getUsers (req,res){
  const users = await userRepository.findAll();
  if(!users){
    return res.status(400).json({message:"Not Found"});
  }
  res.status(200).json(users);
}

async function deleteUser(req, res) {
  const userId = req.params.id;
  const success = await userRepository.deleteUser(userId);
  if (!success) {
    return res.status(404).json({message:"Usuário não encontrado"});
  }
  res.status(204).send();
}
async function logout(req, res) {
  res.status(204).send();
}



module.exports = {
  login,
  signUp,
  deleteUser,
  getMe,
  logout,
  getUsers
}