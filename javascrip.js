var jogadorAtual = 'X';
var casas = ['', '', '', '', '', '', '', '', ''];
var jogoAtivo = true;

function TestarAPI() {
    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-test'
        },
        body: { model: 'gpt-4', messages: [{ role: 'user', content: 'Hello' }] }
    })
    .then(function(response) { return response.json() })
    .then(function(data) { console.log(data) })
    .catch(function(error) { console.error(error) })
};

function MarcarCasa(casa) {
    var indice = parseInt(casa.id.replace('c', ''));
    if (!jogoAtivo || casas[indice] !== '') {
        return;
    }
    
    casas[indice] = jogadorAtual;
    casa.innerText = jogadorAtual;
    
    var combinacaoVitoria = VerificarVitoria();
    if (combinacaoVitoria) {
        document.getElementById('display').innerHTML = '<h1 class="vencedor">Jogador ' + jogadorAtual + ' venceu!</h1>';
        combinacaoVitoria.forEach(function(i) {
            document.getElementById('c' + i).classList.add('vencedor');
        });
        jogoAtivo = false;
        setTimeout(ReiniciarJogo, 10000);
        return;
    }
    
    if (casas.indexOf('') === -1) {
        document.getElementById('display').innerHTML = '<h1>Empate!</h1>';
        jogoAtivo = false;
        setTimeout(ReiniciarJogo, 10000);
        return;
    }
    
    jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
    document.getElementById('display').innerHTML = '<h1>Vez do jogador: ' + jogadorAtual + '</h1>';
};

function VerificarVitoria() {
    var combinacoes = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (var i = 0; i < combinacoes.length; i++) {
        var a = combinacoes[i][0];
        var b = combinacoes[i][1];
        var c = combinacoes[i][2];
        
        if (casas[a] !== '' && casas[a] === casas[b] && casas[b] === casas[c]) {
            return combinacoes[i];
        }
    }
    return null;
};

function ReiniciarJogo() {
    jogadorAtual = 'X';
    casas = ['', '', '', '', '', '', '', '', ''];
    jogoAtivo = true;
    
    for (var i = 0; i < 9; i++) {
        var casa = document.getElementById('c' + i);
        casa.innerText = '';
        casa.classList.remove('vencedor');
    }
    
    document.getElementById('display').innerHTML = '<h1>Jogo da Velha</h1>';
};
