let jogadorAtual = 'X';
let casas = ['', '', '', '', '', '', '', '', ''];
let jogoAtivo = true;
let modo = 'pvp';
let dificuldade = 'facil';
let placarX = 0;
let placarO = 0;
let placarY = 0;
let countdownInterval = null;
let countdownTempo = 10;
let historicoJogadas = [];
let historicoCasas = [];
let statTotal = 0;
let statEmpates = 0;

function MudarModo() {
    modo = document.getElementById('modoJogo').value;
    if (modo === 'pvp3') {
        jogadorAtual = 'X';
        document.getElementById('display').innerHTML = '<h1>Vez do jogador: X</h1>';
    }
    dificuldade = document.getElementById('dificuldade').value;
    ReiniciarJogo();
}

function MudarDificuldade() {
    dificuldade = document.getElementById('dificuldade').value;
    ReiniciarJogo();
}

function Minimax(t, p, e) {
    let r = VerificarVitoriaTabuleiro(t);
    if (r === 'O') return 10 - p;
    if (r === 'X') return p - 10;
    if (r === 'empate') return 0;
    
    if (e) {
        let m = -1000;
        for (let i = 0; i < 9; i++) {
            if (t[i] === '') {
                t[i] = 'O';
                m = Math.max(m, Minimax(t, p + 1, false));
                t[i] = '';
            }
        }
        return m;
    } else {
        let m = 1000;
        for (let i = 0; i < 9; i++) {
            if (t[i] === '') {
                t[i] = 'X';
                m = Math.min(m, Minimax(t, p + 1, true));
                t[i] = '';
            }
        }
        return m;
    }
}

function MelhorJogada() {
    let mv = -1000;
    let mj = -1;
    for (let i = 0; i < 9; i++) {
        if (casas[i] === '') {
            casas[i] = 'O';
            let v = Minimax(casas, 0, false);
            casas[i] = '';
            if (v > mv) {
                mv = v;
                mj = i;
            }
        }
    }
    return mj;
}

function JogadaIA() {
    if (!jogoAtivo) return;
    
    let cv = [];
    for (let i = 0; i < 9; i++) {
        if (casas[i] === '') cv.push(i);
    }
    if (cv.length === 0) return;
    
    let idx;
    if (dificuldade === 'dificil') {
        idx = MelhorJogada();
    } else if (dificuldade === 'medio') {
        idx = Math.random() < 0.5 ? MelhorJogada() : cv[Math.floor(Math.random() * cv.length)];
    } else {
        idx = cv[Math.floor(Math.random() * cv.length)];
    }
    
    let c = document.getElementById('c' + idx);
    casas[idx] = 'O';
    c.innerText = 'O';
    c.classList.add('pop');
    
    let v = VerificarVitoria();
    if (v) {
        document.getElementById('display').innerHTML = '<h1 class="vencedor">Computador venceu!</h1>';
        v.forEach(i => document.getElementById('c' + i).classList.add('vencedor'));
        placarO++;
        statTotal++;
        document.getElementById('placarO').innerText = placarO;
        atualizarEstatisticas();
        jogoAtivo = false;
        IniciarCountdown();
        return;
    }
    
    if (casas.indexOf('') === -1) {
        document.getElementById('display').innerHTML = '<h1>Empate!</h1>';
        statTotal++;
        statEmpates++;
        atualizarEstatisticas();
        jogoAtivo = false;
        IniciarCountdown();
        return;
    }
    
    jogadorAtual = 'X';
    document.getElementById('display').innerHTML = '<h1>Vez do jogador: X</h1>';
}

function VerificarVitoriaTabuleiro(t) {
    let c = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < c.length; i++) {
        let a = c[i][0], b = c[i][1], d = c[i][2];
        if (t[a] !== '' && t[a] === t[b] && t[b] === t[d]) return t[a];
    }
    if (t.indexOf('') === -1) return 'empate';
    return null;
}

function MarcarCasa(casa) {
    if (!jogoAtivo) return;
    let idx = parseInt(casa.id.replace('c', ''));
    if (casas[idx] !== '') return;
    
    if (modo === 'pve' && jogadorAtual === 'O') return;
    
    historicoJogadas.push({ indice: idx, jogador: jogadorAtual });
    historicoCasas.push({ casas: casas.slice(), jogadorAtual: jogadorAtual });
    
    casas[idx] = jogadorAtual;
    casa.innerText = jogadorAtual;
    casa.classList.add('pop');
    
    let v = VerificarVitoria();
    if (v) {
        document.getElementById('display').innerHTML = '<h1 class="vencedor">Jogador ' + jogadorAtual + ' venceu!</h1>';
        v.forEach(i => document.getElementById('c' + i).classList.add('vencedor'));
        statTotal++;
        
        if (jogadorAtual === 'X') {
            placarX++;
            document.getElementById('placarX').innerText = placarX;
        } else if (jogadorAtual === 'O') {
            placarO++;
            document.getElementById('placarO').innerText = placarO;
        } else {
            placarY++;
        }
        
        atualizarEstatisticas();
        jogoAtivo = false;
        IniciarCountdown();
        return;
    }
    
    if (casas.indexOf('') === -1) {
        document.getElementById('display').innerHTML = '<h1>Empate!</h1>';
        statTotal++;
        statEmpates++;
        atualizarEstatisticas();
        jogoAtivo = false;
        IniciarCountdown();
        return;
    }
    
    if (modo === 'pve') {
        jogadorAtual = 'O';
        document.getElementById('display').innerHTML = '<h1>Vez do computador...</h1>';
        setTimeout(JogadaIA, 500);
    } else if (modo === 'pvp3') {
        if (jogadorAtual === 'X') jogadorAtual = 'O';
        else if (jogadorAtual === 'O') jogadorAtual = 'Y';
        else jogadorAtual = 'X';
        document.getElementById('display').innerHTML = '<h1>Vez do jogador: ' + jogadorAtual + '</h1>';
    } else {
        jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
        document.getElementById('display').innerHTML = '<h1>Vez do jogador: ' + jogadorAtual + '</h1>';
    }
}

function VerificarVitoria() {
    let c = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < c.length; i++) {
        let a = c[i][0], b = c[i][1], d = c[i][2];
        if (casas[a] !== '' && casas[a] === casas[b] && casas[b] === casas[d]) return c[i];
    }
    return null;
}

function IniciarCountdown() {
    countdownTempo = 10;
    if (countdownInterval) clearInterval(countdownInterval);
    
    let d = document.getElementById('display');
    let t = d.innerHTML;
    
    countdownInterval = setInterval(function() {
        countdownTempo--;
        if (countdownTempo > 0) {
            d.innerHTML = t + '<p class="countdown">Reiniciando em ' + countdownTempo + 's...</p>';
        } else {
            clearInterval(countdownInterval);
            ReiniciarJogo();
        }
    }, 1000);
    
    d.innerHTML = t + '<p class="countdown">Reiniciando em ' + countdownTempo + 's...</p>';
}

function ReiniciarJogo() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    
    jogadorAtual = 'X';
    casas = ['', '', '', '', '', '', '', '', ''];
    jogoAtivo = true;
    
    for (let i = 0; i < 9; i++) {
        let c = document.getElementById('c' + i);
        c.innerText = '';
        c.classList.remove('vencedor', 'pop');
    }
    
    if (modo === 'pve') {
        document.getElementById('display').innerHTML = '<h1>Jogo da Velha</h1><p>Sua vez!</p>';
    } else {
        document.getElementById('display').innerHTML = '<h1>Jogo da Velha</h1>';
    }
    
    historicoJogadas = [];
    historicoCasas = [];
    atualizarEstatisticas();
}

function Undo() {
    if (historicoJogadas.length === 0) {
        document.getElementById('display').innerHTML = '<h1>Nenhuma jogada para desfazer!</h1>';
        setTimeout(() => {
            if (modo === 'pve') {
                document.getElementById('display').innerHTML = '<h1>Jogo da Velha</h1><p>Sua vez!</p>';
            } else {
                document.getElementById('display').innerHTML = '<h1>Jogo da Velha</h1>';
            }
        }, 1000);
        return;
    }
    
    let uc = historicoCasas.pop();
    historicoJogadas.pop();
    casas = uc.casas.slice();
    jogadorAtual = 'X';
    jogoAtivo = true;
    
    for (let i = 0; i < 9; i++) {
        let c = document.getElementById('c' + i);
        c.innerText = casas[i];
        c.classList.remove('vencedor', 'pop');
    }
    
    if (modo === 'pve') {
        document.getElementById('display').innerHTML = '<h1>Jogo da Velha</h1><p>Sua vez!</p>';
    } else {
        document.getElementById('display').innerHTML = '<h1>Vez do jogador: X</h1>';
    }
}

function ZerarPlacar() {
    placarX = 0;
    placarO = 0;
    placarY = 0;
    statTotal = 0;
    statEmpates = 0;
    document.getElementById('placarX').innerText = 0;
    document.getElementById('placarO').innerText = 0;
    atualizarEstatisticas();
}

function atualizarEstatisticas() {
    document.getElementById('statTotal').innerText = statTotal;
    document.getElementById('statVitoriasX').innerText = placarX;
    document.getElementById('statVitoriasO').innerText = placarO;
    document.getElementById('statEmpates').innerText = statEmpates;
}