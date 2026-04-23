const express = require('express');
const axios = require('axios');
const app = express();

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
    const filePath = req.params[0] || 'index.html';

    const url = `https://raw.githubusercontent.com/${user}/${repo}/main/${filePath}`;

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        
        res.setHeader('Content-Type', getMimeType(filePath));
        res.send(response.data);
    } catch (error) {
        res.status(404).send('Arquivo não encontrado.');
    }
});

// A mudança crucial para rodar no Render/Cloud:
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Gateway rodando na porta ${PORT}`));
