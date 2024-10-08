const express = require('express');
const path = require('path');
const app = express();
const port = 6002;

// Rota de exemplo
app.use(express.static(path.join(__dirname, 'build')));
 // Catch-all route to serve the index.html file 
app.get('/*', function (req, res) {
res.sendFile(path.join(__dirname, 'build', 'index.html')); 
}); 

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});