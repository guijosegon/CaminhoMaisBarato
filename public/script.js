document.getElementById('caminho-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const origem = document.getElementById('origem').value;
    const destino = document.getElementById('destino').value;
    const precoCombustivel = parseFloat(document.getElementById('preco-combustivel').value.replace(',', '.'));
    const autonomia = parseFloat(document.getElementById('autonomia').value.replace(',', '.'));

    const response = await fetch('/caminho-mais-barato', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ origem, destino, precoCombustivel, autonomia }),
    });

    const resultado = await response.json();

    if (!resultado.caminho.length || resultado.custo === 0) {
        document.getElementById('resultado').innerHTML = `<p>Rota inexistente</p>`;
    } else {
        document.getElementById('resultado').innerHTML = `
            <p>Caminho: ${resultado.caminho.join(' -> ')}</p>
            <p>Custo Total: R$${resultado.custo.toFixed(2)}</p>
        `;
    }
});