const express = require('express');
const axios = require('axios');
const app = express();

// Middleware para transformar a URL
app.get('*', async (req, res) => {
    // Exemplo de URL: /ghost/ndj-lib/index.html
    const pathParts = req.path.split('/').filter(Boolean);
    const [user, repo, ...filePath] = pathParts;
    const file = filePath.join('/') || 'index.html';

    const githubApi = `https://api.github.com/repos/${user}/${repo}/contents/${file}`;

    try {
        const response = await axios.get(githubApi, {
            headers: { 'Accept': 'application/vnd.github.v3.raw' }
        });

        // Detecta o tipo de arquivo para o navegador renderizar certo
        const ext = file.split('.').pop();
        const mimeTypes = { 'html': 'text/html', 'css': 'text/css', 'js': 'application/javascript' };
        
        res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain');
        res.send(response.data);
    } catch (err) {
        res.status(404).send('Repositório ou arquivo não encontrado.');
    }
});

app.listen(3000, () => console.log('Render rodando na porta 3000'));
