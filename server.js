const express = require('express');

const app = express();
const PORT = 3000;


app.use(express.urlencoded({extended: true}));
app.use(express.json());

const authMiddleware = require('./middlewares/authMiddleware.js')
const authRoutes = require('./routes/authRoutes.js');
const agentesRoutes = require('./routes/agentesRoutes.js');
const casosRoutes = require('./routes/casosRoutes.js');



app.use(authRoutes);
app.use(agentesRoutes);
app.use(casosRoutes);






app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`);
});