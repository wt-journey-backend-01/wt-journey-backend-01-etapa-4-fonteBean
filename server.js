const express = require('express');

const app = express();
const PORT = 3000;



const usersRoutes = require('./routes/usersRoutes.js'); 
app.use(usersRoutes);

app.use(express.json());
app.use(express.urlencoded({extended: true}))




app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`);
});