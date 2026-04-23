const express = require('express');
const axios = require('axios');
const app = express();

// Função para mapear extensões para MIME Types
const getMimeType = (file) => {
    const ext = file.split('.').pop().toLowerCase();
    const map = {
        'html': 'text/html', 'css': 'text/css', 'js': 'application/javascript',
        'json': 'application/json', 'png': 'image/png', 'jpg': 'image/jpeg',
        'svg': 'image/svg+xml', 'txt': 'text/plain'
    };
    return map[ext] || 'text/plain';
};

app.get('/:user/:repo/*', async (req, res) => {
    const { user, repo } = req.params;
    const filePath = req.params[0] || 'index.html'; // Pega todo o resto da URL

    const url = `https://raw.githubusercontent.com/${user}/${repo}/main/${filePath}`;

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        
        res.setHeader('Content-Type', getMimeType(filePath));
        res.send(response.data);
    } catch (error) {
        res.status(404).send('Arquivo não encontrado no repositório.');
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Gateway rodando em http://localhost:${PORT}`));
