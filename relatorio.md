<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 7 créditos restantes para usar o sistema de feedback AI.

# Feedback para fonteBean:

Nota final: **60.9/100**

Olá, fonteBean! 👋✨

Primeiramente, parabéns pelo esforço e pela entrega da sua API! 🎉 Você conseguiu implementar várias funcionalidades importantes, e isso é um grande passo rumo a uma aplicação segura e profissional. Vamos juntos analisar os pontos fortes e onde ainda podemos melhorar para alcançar a nota máxima! 🚀

---

## 🎉 Pontos Positivos e Conquistas Bônus

- Você implementou corretamente o cadastro de usuários com hash de senha usando bcrypt, e o login que gera um JWT válido. Isso é fundamental e você acertou!  
- O logout e a exclusão de usuários estão funcionando bem.  
- As rotas de agentes e casos estão estruturadas, e você aplicou o middleware de autenticação para proteger as rotas, o que é excelente para segurança.  
- Os testes bônus que passaram mostram que você fez um bom trabalho na filtragem de casos por status e agente, o que demonstra domínio na manipulação dos dados.  
- A organização do seu projeto está muito boa, seguindo a arquitetura MVC, com pastas claras para controllers, repositories, rotas e middlewares.  

Parabéns por essas conquistas! 👏

---

## 🚩 Análise dos Testes que Falharam e Pontos para Melhorar

Você teve vários testes falhando relacionados a validações no cadastro de usuários e proteção das rotas. Vamos destrinchar esses erros para entender o que está acontecendo.

---

### 1. Falhas nas Validações do Cadastro de Usuários (Testes USERS com erro 400)

**Erro:** Recebe erro 400 ao tentar criar usuário com campos vazios, nulos, senha sem requisitos (comprimento, números, letras maiúsculas, caracteres especiais), e também quando o email já está em uso.

**Causa raiz no seu código:**  
No seu `authController.js`, você está usando o Zod para validar o corpo da requisição:

```js
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
```

Você faz a validação com:

```js
const userData = userSchema.parse(req.body);
```

**Por que os testes falham?**  
O método `.parse()` do Zod lança uma exceção se a validação falha, mas no seu código você não está tratando essa exceção. Isso faz com que o servidor retorne um erro 500 (erro não tratado) em vez de um 400 com a mensagem adequada.

**Como corrigir?**  
Você precisa capturar o erro de validação e retornar um erro 400 com a mensagem correspondente. Por exemplo:

```js
async function signUp (req,res){
  try {
    const userData = userSchema.parse(req.body);
    // resto do código...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(res, 400, error.errors.map(e => e.message).join(", "));
    }
    return errorResponse(res, 500, "Erro interno no servidor");
  }
}
```

Assim, o cliente receberá um erro 400 com mensagens claras do que está errado no input, atendendo aos testes que esperam esse comportamento.

---

### 2. Falha no Retorno do Token JWT no Login

No seu `authController.js`, você retorna o token assim:

```js
res.status(200).json({"access-token": token})
```

**Problema:** Os testes esperam que o token venha na chave `"access_token"` (com underline), conforme especificado no enunciado:

```json
{
  "access_token": "token aqui"
}
```

**Correção:** Altere para:

```js
res.status(200).json({ access_token: token });
```

Isso é crucial para que os testes reconheçam o token e validem a autenticação.

---

### 3. Middleware de Autenticação Não Adiciona `req.user`

Seu middleware `authMiddleware.js` verifica o token, mas não adiciona os dados do usuário autenticado no `req.user`, conforme pedido no desafio:

```js
jwt.verify(token, process.env.JWT_SECRET, (err)=>{
  if(err){
    return errorResponse(res,401,"Token invalido");
  }
  next();
})
```

**Por que isso é importante?**  
Muitos endpoints seguros precisam saber quem é o usuário logado para aplicar regras de autorização ou retornar dados personalizados.

**Como corrigir?**  
Altere para:

```js
jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  if (err) {
    return errorResponse(res, 401, "Token inválido");
  }
  req.user = user; // adiciona os dados do usuário no request
  next();
});
```

---

### 4. Rotas Protegidas Não Estão Aplicando Middleware de Autenticação

No seu `server.js`, você tem:

```js
app.use(authRoutes);
app.use(agentesRoutes);
app.use(casosRoutes);
```

Mas não há aplicação explícita do middleware `authMiddleware` nas rotas de `/agentes` e `/casos`. Isso pode estar permitindo acesso sem autenticação, causando falha nos testes que esperam **401 Unauthorized** ao acessar essas rotas sem token.

**Como corrigir?**  
Você pode aplicar o middleware globalmente para essas rotas assim:

```js
const authMiddleware = require('./middlewares/authMiddleware.js');

app.use('/agentes', authMiddleware, agentesRoutes);
app.use('/casos', authMiddleware, casosRoutes);
```

Ou, se preferir, aplicar dentro dos arquivos de rotas, mas o mais comum e claro é no `server.js`.

---

### 5. Endpoint `/auth/sign` ao invés de `/auth/register`

No enunciado, o endpoint para registro de usuários deve ser:

```
POST /auth/register
```

Mas no seu `authRoutes.js`, você definiu:

```js
router.post('/auth/sign', authController.signUp);
```

**Isso pode causar falha nos testes**, que esperam `/auth/register`.

**Correção:** Altere para:

```js
router.post('/auth/register', authController.signUp);
```

---

### 6. Repositório de Usuários: Uso incorreto do `.returning()` no `findUserByEmail`

No seu `usuariosRepository.js`:

```js
async function findUserByEmail(email) {
  try{
    const [user] = await db('usuarios').where({email:email}).returning("*");
    if(!user){
      return false;
    }
    return user;
  }catch(err){
    return false
  }
}
```

O método `.returning()` é usado em inserts/updates para retornar colunas após a operação, **não em selects**.

**Isso pode estar causando problemas na busca do usuário.**

**Correção:** Remova `.returning("*")` da consulta:

```js
const [user] = await db('usuarios').where({ email: email }).first();
```

Assim, você busca o usuário corretamente.

---

### 7. Falta do Arquivo `INSTRUCTIONS.md`

O enunciado pede que você entregue o arquivo `INSTRUCTIONS.md` com documentação dos endpoints de autenticação, uso do token JWT e fluxo de autenticação.

No seu envio, esse arquivo está ausente.

**Importância:** Documentar é fundamental para que outros desenvolvedores (e avaliadores) entendam como usar sua API.

---

## 💡 Recomendações de Aprendizado

Para cada ponto acima, recomendo fortemente os seguintes vídeos, que vão te ajudar a entender e corrigir os problemas:

- Sobre validação e tratamento de erros com Zod: [https://www.youtube.com/watch?v=bGN_xNc4A1k&t=3s](https://www.youtube.com/watch?v=bGN_xNc4A1k&t=3s) (Refatoração e Boas Práticas)  
- Sobre autenticação JWT e uso correto:  
  - Conceitos básicos de autenticação (feito pelos meus criadores): [https://www.youtube.com/watch?v=Q4LQOfYwujk](https://www.youtube.com/watch?v=Q4LQOfYwujk)  
  - JWT na prática: [https://www.youtube.com/watch?v=keS0JWOypIU](https://www.youtube.com/watch?v=keS0JWOypIU)  
  - Uso combinado de JWT e bcrypt: [https://www.youtube.com/watch?v=L04Ln97AwoY](https://www.youtube.com/watch?v=L04Ln97AwoY)  
- Para entender melhor queries com Knex, especialmente `.where()` e `.returning()`: [https://www.youtube.com/watch?v=GLwHSs7t3Ns&t=4s](https://www.youtube.com/watch?v=GLwHSs7t3Ns&t=4s)  
- Para configurar banco com Docker e Knex, caso precise revisar ambiente: [https://www.youtube.com/watch?v=uEABDBQV-Ek&t=1s](https://www.youtube.com/watch?v=uEABDBQV-Ek&t=1s)

---

## ⚠️ Resumo dos Principais Pontos para Ajustar

- Trate os erros de validação do Zod para enviar respostas 400 com mensagens claras (use try/catch).  
- Corrija o nome da chave do token JWT para `access_token` no login.  
- No middleware de autenticação, adicione os dados do usuário decodificados em `req.user`.  
- Aplique o middleware de autenticação nas rotas `/agentes` e `/casos` para proteger corretamente as rotas e passar nos testes de autorização.  
- Corrija o endpoint de registro para `/auth/register` (não `/auth/sign`).  
- Ajuste a query no `findUserByEmail` para não usar `.returning()` em uma seleção.  
- Adicione o arquivo `INSTRUCTIONS.md` com a documentação solicitada.  

---

## 🌟 Mensagem Final

fonteBean, você está no caminho certo! Seu código mostra que você entendeu os conceitos principais de rotas, controllers, repositórios, hashing de senha e JWT. Com alguns ajustes pontuais nas validações, middleware e rotas, sua API vai ficar muito mais robusta e alinhada com o que o projeto pede.

Continue praticando esses detalhes, pois eles fazem toda a diferença na qualidade e segurança da aplicação. Estou aqui torcendo pelo seu sucesso, e você tem total capacidade para alcançar uma nota alta! 💪🔥

Qualquer dúvida, só chamar que a gente resolve juntos. Vamos nessa! 🚀✨

Abraços do seu Code Buddy 🤖💙

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>