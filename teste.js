const { MinPriorityQueue } = require('@datastructures-js/priority-queue');

function dijkstra(grafo, inicio, fim, precoCombustivel, autonomia) {
    const distancias = new Map();
    const custos = new Map();
    const visitados = new Set();
    const anterior = new Map();

    const pq = new MinPriorityQueue((item) => item.custo);

    grafo.vertices.forEach((_, vertice) => {
        distancias.set(vertice, Infinity);
        custos.set(vertice, Infinity);
    });

    distancias.set(inicio, 0);
    custos.set(inicio, 0);
    pq.enqueue({ vertice: inicio, custo: 0 });

    while (!pq.isEmpty()) {
        const { vertice: atual, custo: custoAtual } = pq.dequeue();

        if (visitados.has(atual)) continue;
        visitados.add(atual);

        if (atual === fim) break;

        const verticeAtual = grafo.vertices.get(atual);
        if (!verticeAtual || !verticeAtual.adjacentes) continue;

        for (let vizinho of verticeAtual.adjacentes) {
            const { destino, distancia } = vizinho;
            const verticeDestino = grafo.vertices.get(destino);
            if (!verticeDestino) continue;

            const custoCombustivel = (distancia / autonomia) * precoCombustivel;
            const custoPedagio = verticeAtual.toll; // Pedágio no vértice atual exceto início
            const novoCusto = custoAtual + custoCombustivel + custoPedagio;

            if (novoCusto < custos.get(destino)) {
                custos.set(destino, novoCusto);
                distancias.set(destino, distancias.get(atual) + distancia);
                anterior.set(destino, atual);
                pq.enqueue({ vertice: destino, custo: novoCusto });
            }
        }
    }

    const caminho = [];
    let atual = fim;
    while (atual) {
        caminho.unshift(atual);
        atual = anterior.get(atual);
    }

    const custoFinal = custos.get(fim);
    const custoTotal = custoFinal - grafo.vertices.get(inicio).toll; // Remover pedágio da origem e destino

    if (caminho.length === 0 || custoFinal === Infinity) {
        return { caminho: [], custo: 0 };
    }

    return { caminho, custo: custoTotal };
}

module.exports = dijkstra;
