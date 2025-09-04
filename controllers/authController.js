const usuariosRepository = require('../repositories/usuariosRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function login(req, res, next) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: "Email e senha são obrigatórios"
            });
        }

        const usuario = await usuariosRepository.findByEmail(email);

        if (!usuario) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: "Senha inválida" });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET || "chave_secreta",
            { expiresIn: "1h" }
        );
      return res.status(200).json({ access_token: token });
      } catch (error) {
          next(error);
      }
}

function validarSenha(senha) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(senha);
}

async function create(req, res, next) {
  try {
    const { nome, email, senha, ...extras } = req.body;
    const errors = [];

    if (Object.keys(extras).length > 0) {
      errors.push({ field: "extras", message: "Campos extras não permitidos" });
    }
    if (!nome || typeof nome !== 'string' || nome.trim() === '') {
      errors.push({ field: "nome", message: "Nome é obrigatório" });
    }
    if (!email || typeof email !== 'string' || email.trim() === '') {
      errors.push({ field: "email", message: "Email é obrigatório" });
    }
    if (!senha) {
      errors.push({ field: "senha", message: "Senha é obrigatória" });
    } else if (!validarSenha(senha)) {
      errors.push({ field: "senha", message: "Senha deve ter no mínimo 8 caracteres, incluir letra maiúscula, minúscula, número e caractere especial" });
    }

    if (errors.length > 0) {
      return res.status(400).json({ status: 400, message: "Parâmetros inválidos", errors });
    }

    const usuarioExistente = await usuariosRepository.findByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ status: 400, message: "Email já está em uso" });
    }

    const senhaHasheada = await bcrypt.hash(senha, 10);
    const novoUsuario = await usuariosRepository.create({ nome, email, senha: senhaHasheada });

    const { senha: _, ...usuarioSemSenha } = novoUsuario;

    return res.status(201).json(usuarioSemSenha);

  } catch (error) {
    next(error);
  }
}
async function logout(req, res){

  res.status(204).send();
}

async function heshSenha(senha) {
  const tentativas = 10;
  if (!senha) {
  errors.push({ field: "senha", message: "Senha é obrigatória" });
} else if (!validarSenha(senha)) {
  errors.push({ field: "senha", message: "Senha deve ter no mínimo 8 caracteres, incluir letra maiúscula, minúscula, número e caractere especial" });
}
  return await bcrypt.hash(senha, tentativas);
}

async function veryToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET || "chave_secreta");
}

async function findAll() {
  return await usuariosRepository.findAll();
}

async function findById(id) {
  if(!id){

  }
  return await usuariosRepository.findById(id);
}

async function findByEmail(email) {
  return await usuariosRepository.findByEmail(email);
}

async function me(req, res) {
  const usuario = await usuariosRepository.findById(req.user.id);
  if (!usuario) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }
  res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
}

module.exports = { 
    login,
    create,
    logout,
    heshSenha,
    veryToken,
    findAll,
    findById,
    findByEmail,
    me,
 };