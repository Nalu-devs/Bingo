var jogadorAtual = 'X';
var casas = ['', '', '', '', '', '', '', '', ''];
var jogoAtivo = true;
var modo = 'pvp';
var dificuldade = 'facil';
var placarX = 0;
var placarO = 0;
var countdownInterval = null;
var countdownTempo = 10;



function MudarModo() {
    modo = document.getElementById('modoJogo').value;
    dificuldade = document.getElementById('dificuldade').value;
    ReiniciarJogo();
};

function MudarDificuldade() {
    dificuldade = document.getElementById('dificuldade').value;
    ReiniciarJogo();
};

function Minimax(tabuleiro, profundidade, eMaximizador) {
    var resultado = VerificarVitoriaTabuleiro(tabuleiro);
    if (resultado === 'O') return 10 - profundidade;
    if (resultado === 'X') return profundidade - 10;
    if (resultado === 'empate') return 0;
    
    if (eMaximizador) {
        var melhor = -1000;
        for (var i = 0; i < 9; i++) {
            if (tabuleiro[i] === '') {
                tabuleiro[i] = 'O';
                melhor = Math.max(melhor, Minimax(tabuleiro, profundidade + 1, false));
                tabuleiro[i] = '';
            }
        }
        return melhor;
    } else {
        var melhor = 1000;
        for (var i = 0; i < 9; i++) {
            if (tabuleiro[i] === '') {
                tabuleiro[i] = 'X';
                melhor = Math.min(melhor, Minimax(tabuleiro, profundidade + 1, true));
                tabuleiro[i] = '';
            }
        }
        return melhor;
    }
};

function JogadaIA() {
    if (!jogoAtivo) return;
    
    var casasVazias = [];
    for (var i = 0; i < 9; i++) {
        if (casas[i] === '') {
            casasVazias.push(i);
        }
    }
    
    if (casasVazias.length === 0) return;
    
    var indice;
    
    if (dificuldade === 'dificil') {
        indice = MelhorJogada();
    } else if (dificuldade === 'medio') {
        if (Math.random() < 0.5) {
            indice = MelhorJogada();
        } else {
            indice = casasVazias[Math.floor(Math.random() * casasVazias.length)];
        }
    } else {
        indice = casasVazias[Math.floor(Math.random() * casasVazias.length)];
    }
    
    var casa = document.getElementById('c' + indice);
    casas[indice] = 'O';
    casa.innerText = 'O';
    
    var combinacaoVitoria = VerificarVitoria();
    if (combinacaoVitoria) {
        document.getElementById('display').innerHTML = '<h1 class="vencedor">Computador venceu!</h1>';
        combinacaoVitoria.forEach(function(i) {
            document.getElementById('c' + i).classList.add('vencedor');
        });
        placarO++;
        document.getElementById('placarO').innerText = placarO;
        jogoAtivo = false;
        IniciarCountdown();
        return;
    }
    
    if (casas.indexOf('') === -1) {
        document.getElementById('display').innerHTML = '<h1>Empate!</h1>';
        jogoAtivo = false;
        IniciarCountdown();
        return;
    }
    
    jogadorAtual = 'X';
    document.getElementById('display').innerHTML = '<h1>Vez do jogador: X</h1>';
};

function MelhorJogada() {
    var melhorValor = -1000;
    var melhorJogada = -1;
    
    for (var i = 0; i < 9; i++) {
        if (casas[i] === '') {
            casas[i] = 'O';
            var valor = Minimax(casas, 0, false);
            casas[i] = '';
            if (valor > melhorValor) {
                melhorValor = valor;
                melhorJogada = i;
            }
        }
    }
    return melhorJogada;
};

function VerificarVitoriaTabuleiro(tabuleiro) {
    var combinacoes = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (var i = 0; i < combinacoes.length; i++) {
        var a = combinacoes[i][0];
        var b = combinacoes[i][1];
        var c = combinacoes[i][2];
        
        if (tabuleiro[a] !== '' && tabuleiro[a] === tabuleiro[b] && tabuleiro[b] === tabuleiro[c]) {
            return tabuleiro[a];
        }
    }
    if (tabuleiro.indexOf('') === -1) return 'empate';
    return null;
};

function MarcarCasa(casa) {
    if (!jogoAtivo) return;
    
    var indice = parseInt(casa.id.replace('c', ''));
    if (casas[indice] !== '') {
        return;
    }
    
    if (modo === 'pve' && jogadorAtual === 'O') {
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
        if (jogadorAtual === 'X') {
            placarX++;
            document.getElementById('placarX').innerText = placarX;
        } else {
            placarO++;
            document.getElementById('placarO').innerText = placarO;
        }
        jogoAtivo = false;
        IniciarCountdown();
        return;
    }
    
    if (casas.indexOf('') === -1) {
        document.getElementById('display').innerHTML = '<h1>Empate!</h1>';
        jogoAtivo = false;
        IniciarCountdown();
        return;
    }
    
    if (modo === 'pve') {
        jogadorAtual = 'O';
        document.getElementById('display').innerHTML = '<h1>Vez do computador...</h1>';
        setTimeout(JogadaIA, 500);
    } else {
        jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
        document.getElementById('display').innerHTML = '<h1>Vez do jogador: ' + jogadorAtual + '</h1>';
    }
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

function IniciarCountdown() {
    countdownTempo = 10;
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    var display = document.getElementById('display');
    var textoAtual = display.innerHTML;
    
    countdownInterval = setInterval(function() {
        countdownTempo--;
        if (countdownTempo > 0) {
            display.innerHTML = textoAtual + '<p class="countdown">Reiniciando em ' + countdownTempo + 's...</p>';
        } else {
            clearInterval(countdownInterval);
            ReiniciarJogo();
        }
    }, 1000);
    
    display.innerHTML = textoAtual + '<p class="countdown">Reiniciando em ' + countdownTempo + 's...</p>';
};

function ReiniciarJogo() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    
    jogadorAtual = 'X';
    casas = ['', '', '', '', '', '', '', '', ''];
    jogoAtivo = true;
    
    for (var i = 0; i < 9; i++) {
        var casa = document.getElementById('c' + i);
        casa.innerText = '';
        casa.classList.remove('vencedor');
    }
    
    if (modo === 'pve') {
        document.getElementById('display').innerHTML = '<h1>Jogo da Velha</h1><p>Sua vez!</p>';
    } else {
        document.getElementById('display').innerHTML = '<h1>Jogo da Velha</h1>';
    }
};
