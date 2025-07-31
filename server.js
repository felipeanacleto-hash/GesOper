const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// Middleware para servir arquivos estáticos
app.use(express.static('.'));

// Rota principal - redireciona para o painel de admin
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// Rota para o painel de administração
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Rota para o site público
app.get('/site', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rotas para as páginas do site
app.get('/site/*', (req, res) => {
  const filePath = req.path.replace('/site', '');
  res.sendFile(path.join(__dirname, filePath));
});

// API endpoints para o painel de admin (futuras implementações)
app.use(express.json());

// Endpoint para salvar configurações
app.post('/api/save-config', (req, res) => {
  // Aqui você implementaria a lógica para salvar as configurações
  console.log('Salvando configurações:', req.body);
  res.json({ success: true, message: 'Configurações salvas com sucesso!' });
});

// Endpoint para carregar configurações
app.get('/api/load-config', (req, res) => {
  // Aqui você implementaria a lógica para carregar as configurações
  res.json({ 
    success: true, 
    data: {
      siteName: 'GesOper',
      primaryColor: '#003973',
      modules: ['operacional', 'financeiro', 'beneficios']
    }
  });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Painel de Admin: http://localhost:${PORT}/admin`);
  console.log(`🌐 Site Público: http://localhost:${PORT}/site`);
});

module.exports = app;