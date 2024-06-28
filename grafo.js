const fs = require('fs');

// Função para ler o arquivo capitais.json
function lerDados() {
    const dados = fs.readFileSync('capitais.json', 'utf8');
    return JSON.parse(dados);
}

const capitais = lerDados();

class Grafo {
    constructor() {
        this.vertices = new Map();
    }

    adicionarVertice(vertice, toll) {
        if (!this.vertices.has(vertice)) {
            this.vertices.set(vertice, { toll, adjacentes: [] });
        }
    }

    adicionarAresta(origem, destino, distancia) {
        if (this.vertices.has(origem) && this.vertices.has(destino)) {
            const adjacentesOrigem = this.vertices.get(origem).adjacentes;
            const adjacentesDestino = this.vertices.get(destino).adjacentes;
            if (!adjacentesOrigem.some(adj => adj.destino === destino)) {
                adjacentesOrigem.push({ destino, distancia });
            }
            if (!adjacentesDestino.some(adj => adj.destino === origem)) {
                adjacentesDestino.push({ destino: origem, distancia });
            }
        }
    }

    mostrarGrafo() {
        for (let [vertice, { toll, adjacentes }] of this.vertices) {
            console.log(`${vertice} (Toll: ${toll}) ->`, adjacentes);
        }
    }
}

// Função para fazer o seed dos dados no grafo
function seedGrafo(capitais) {
    const grafo = new Grafo();

    for (let item of capitais) {
        for (let capital in item) {
            const { toll, neighbors } = item[capital];
            grafo.adicionarVertice(capital, toll);
            for (let vizinho in neighbors) {
                grafo.adicionarVertice(vizinho, capitais.find(c => c[vizinho])?.[vizinho].toll || 0);
                grafo.adicionarAresta(capital, vizinho, neighbors[vizinho]);
            }
        }
    }

    return grafo;
}

const grafo = seedGrafo(capitais);
grafo.mostrarGrafo();

module.exports = { seedGrafo };