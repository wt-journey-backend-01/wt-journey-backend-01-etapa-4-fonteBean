<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 8 créditos restantes para usar o sistema de feedback AI.

# Feedback para fonteBean:

Nota final: **55.9/100**

Olá, fonteBean! 👋🚀

Primeiramente, parabéns pelo esforço e dedicação em avançar até essa etapa tão importante: segurança e autenticação! 🎉 Você já tem uma base sólida, com endpoints funcionando, integração com banco e até alguns testes bônus passando — isso é ótimo e mostra que você está no caminho certo!

---

## 🎯 O que você já mandou muito bem

- **Endpoints de usuários** (registro, login, logout e exclusão) estão funcionando e passando vários testes essenciais, incluindo criação correta e login com JWT válido.
- **Agentes e casos** estão bem implementados, com CRUD funcionando e validações razoáveis.
- Você já implementou filtragens básicas e alguns filtros avançados (como status e agente) que passaram nos testes bônus. Isso mostra que seu domínio sobre manipulação de dados está bom!
- Uso correto do Knex para queries, migrations criadas, seeds populando tabelas, e estrutura geral do projeto está quase lá.

---

## 🚨 Pontos importantes que precisam de atenção para destravar sua nota

### 1. Estrutura de Diretórios e Arquivos

Aqui temos um ponto crítico: a estrutura de pastas e arquivos **não está seguindo o padrão exigido** pelo desafio, e isso impacta diretamente na execução dos testes e na organização do seu projeto.

- Você tem um arquivo `usersRoutes.js` e `usersRepository.js`, mas o desafio pede que o nome seja **`authRoutes.js`** e **`usuariosRepository.js`**.  
- O arquivo `authRoutes.js` e `usuariosRepository.js` **não estão presentes** no seu repositório, o que causa falha nos testes relacionados aos usuários.
- O arquivo `INSTRUCTIONS.md` não está presente, e ele é obrigatório para documentar o fluxo de autenticação e uso do JWT.
- No seu `server.js`, você importa `usersRoutes.js` ao invés de `authRoutes.js` (que deveria existir).

**Por que isso é tão importante?**  
A estrutura correta é a base para que o sistema funcione como esperado, que os testes encontrem os arquivos e que a aplicação seja escalável e de fácil manutenção. Além disso, a organização correta ajuda a evitar problemas de importação e execução.

**Exemplo do que está errado no seu `server.js`:**

```js
const usersRoutes = require('./routes/usersRoutes.js'); // deveria ser authRoutes.js
app.use(usersRoutes);
```

**O correto seria:**

```js
const authRoutes = require('./routes/authRoutes.js');
app.use(authRoutes);
```

**Recomendo fortemente que você assista a este vídeo para entender a arquitetura MVC e organização de projetos Node.js:**  
https://www.youtube.com/watch?v=bGN_xNc4A1k&t=3s

---

### 2. Validação de Dados no Registro de Usuários

Os testes falharam ao tentar criar usuários com dados inválidos, especialmente para:

- Nome vazio ou nulo
- Email vazio ou nulo
- Senha vazia, curta, sem números, sem caractere especial, sem letra maiúscula, sem letras
- Campos extras ou faltantes

Analisando seu `authController.js`, percebi que a validação está muito superficial:

```js
if(!name || !email || !password){
  return next(errorResponse(res,401,"Bad Request"))
}
```

Aqui você só checa se os campos existem, mas não valida o formato ou regras específicas da senha, nem se o nome ou email estão vazios (string vazia é truthy). Também não há verificação para caracteres especiais, números, letras maiúsculas/minúsculas.

**Por que isso é importante?**  
Garantir a qualidade dos dados é fundamental para segurança e integridade do sistema. Além disso, os testes esperam respostas 400 para esses casos, e você está retornando 401, que é código para "não autorizado", não para erro de validação.

**Como melhorar?**  
Use uma biblioteca de validação (como `zod` que você já tem instalada) para criar um schema que valide os campos com as regras exigidas. Por exemplo, para senha:

- Mínimo 8 caracteres
- Pelo menos uma letra minúscula
- Pelo menos uma letra maiúscula
- Pelo menos um número
- Pelo menos um caractere especial

Exemplo de validação com regex:

```js
const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
if (!senhaRegex.test(password)) {
  return errorResponse(res, 400, "Senha não atende aos requisitos de segurança");
}
```

Além disso, verifique se o nome e email não são strings vazias:

```js
if (typeof name !== 'string' || name.trim() === '') {
  return errorResponse(res, 400, "Nome é obrigatório e não pode ser vazio");
}
```

Para o email, use um regex simples ou uma lib para validar formato.

---

### 3. Uso incorreto das variáveis de ambiente no JWT e bcrypt

No seu `authController.js`, notei que você está usando a variável de ambiente errada para o segredo do JWT:

```js
const token = jwt.sign({id: user.id, name:user.name, email:user.email}, process.env.JWT_PASSWORD,{
  expiresIn: "1d"
});
```

O correto, conforme o enunciado, é usar `process.env.JWT_SECRET`.

Além disso, no middleware de autenticação:

```js
jwt.verify(token.process.env.JWT_SECRET, (err)=>{
  if(err){
    return errorResponse(res,400,"Token invalido");
  }
})
```

Aqui você está tentando acessar `token.process.env.JWT_SECRET`, que não faz sentido — o correto é:

```js
jwt.verify(token, process.env.JWT_SECRET, (err)=>{
  if(err){
    return errorResponse(res,401,"Token inválido");
  } else {
    next();
  }
});
```

Note que o `next()` deve ser chamado dentro do callback, para garantir que a verificação tenha sido concluída.

**Por que isso é crítico?**  
Se o segredo do JWT estiver incorreto ou mal referenciado, a verificação dos tokens falhará, e o middleware não protegerá as rotas como esperado. Isso explica os erros 401 que você recebeu ao tentar acessar rotas protegidas sem token válido.

**Recomendo este vídeo excelente, feito pelos meus criadores, que explica JWT e bcrypt na prática:**  
https://www.youtube.com/watch?v=L04Ln97AwoY

---

### 4. Resposta dos Endpoints e Mensagens de Erro

- No login, você retorna apenas `"Login OK"` em vez de um JSON com o token:

```js
res.status(200).json("Login OK")
```

O teste espera:

```json
{
  "access_token": "token aqui"
}
```

Você deve retornar o token no formato correto:

```js
res.status(200).json({ access_token: token });
```

- Nos erros, você usa `next(errorResponse(...))`, mas seu `errorResponse` já envia a resposta, então usar `next()` pode causar problemas ou mensagens duplicadas.

---

### 5. Falta de implementação de alguns endpoints obrigatórios

- O endpoint `DELETE /users/:id` (exclusão de usuário) não foi encontrado no seu código.
- O endpoint `POST /auth/logout` também não está implementado.
- O endpoint `/usuarios/me` (bônus) não está implementado.

Esses endpoints são importantes para cumprir o escopo do desafio.

---

### 6. Testes bônus que falharam

Você passou alguns bônus legais, como filtragem por status e agente, mas falhou em outros:

- Busca de agente responsável por caso
- Busca de casos por palavras-chave
- Ordenação por data de incorporação
- Mensagens de erro customizadas para argumentos inválidos
- Endpoint `/usuarios/me`

Essas falhas indicam que algumas funcionalidades extras ainda precisam ser implementadas ou corrigidas.

---

## 📋 Resumo dos principais pontos para focar:

- Corrigir a **estrutura de diretórios e nomes de arquivos** para seguir exatamente o padrão exigido (usar `authRoutes.js`, `usuariosRepository.js`, etc).
- Implementar validação completa e correta dos dados no registro de usuários, principalmente para senha, nome e email, retornando erros 400 adequados.
- Corrigir o uso das variáveis de ambiente para o segredo JWT (`JWT_SECRET`) tanto no `authController` quanto no `authMiddleware`.
- Ajustar o middleware para chamar `next()` somente após a verificação do token ser concluída, e ajustar os códigos de status e mensagens de erro.
- Ajustar a resposta do login para retornar o token JWT no formato correto `{ access_token: "token" }`.
- Implementar os endpoints faltantes (`DELETE /users/:id`, `POST /auth/logout`, `/usuarios/me`).
- Criar o arquivo `INSTRUCTIONS.md` com a documentação exigida.
- Revisar e implementar os bônus que faltaram para melhorar sua nota.

---

## Algumas dicas extras para você:

- Use o `zod` para validação de dados, ele vai facilitar muito e evitar erros manuais.
- Sempre teste suas rotas com o Postman ou Insomnia para garantir que os retornos estão no formato esperado.
- Leia a documentação do `jsonwebtoken` para entender melhor como assinar e verificar tokens.
- Cuide da segurança: nunca exponha seu segredo JWT no código, sempre use `.env` e `process.env`.
- Para organizar melhor o projeto, siga o padrão MVC e mantenha os arquivos nos lugares certos.

---

## Recursos recomendados para você:

- **Arquitetura MVC em Node.js (organização de pastas):**  
https://www.youtube.com/watch?v=bGN_xNc4A1k&t=3s

- **JWT e autenticação com Node.js:**  
https://www.youtube.com/watch?v=L04Ln97AwoY

- **Validação de dados com Zod (exemplo prático):**  
https://zod.dev/

- **Configuração de Banco de Dados com Docker e Knex:**  
https://www.youtube.com/watch?v=uEABDBQV-Ek&t=1s  
https://www.youtube.com/watch?v=dXWy_aGCW1E

---

## Últimas palavras

FonteBean, você está muito próximo de entregar uma aplicação segura e profissional! 💪 Não desanime com as falhas, elas são parte do processo de aprendizado. Corrigindo esses pontos, sua nota vai melhorar muito e seu código ficará muito mais robusto e alinhado com o que o mercado espera.

Continue firme, revise com calma cada ponto, e não hesite em usar os recursos que te indiquei. Você está fazendo um ótimo trabalho e logo vai colher os frutos dessa dedicação! 🌟

Se precisar de ajuda para entender algum ponto específico, me chama que a gente destrincha juntos! 😉

Abraços e sucesso! 🚓👮‍♂️✨

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>