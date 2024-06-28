const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { seedGrafo } = require('./grafo');
const dijkstra = require('./dijkstra');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const capitais = JSON.parse(fs.readFileSync('capitais.json', 'utf8'));
const grafo = seedGrafo(capitais);

app.post('/caminho-mais-barato', (req, res) => {
    const { origem, destino, precoCombustivel, autonomia } = req.body;

    const resultado = dijkstra(grafo, origem, destino, precoCombustivel, autonomia);

    res.json(resultado);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});