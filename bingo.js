var numerosSorteados = [];
var numerosCartela = [];
var jogoIniciado = false;

function gerarCartela() {
    var cartela = document.getElementById('cartela');
    while (cartela.rows.length > 1) {
        cartela.deleteRow(1);
    }

    numerosCartela = [];
    var numerosPorColuna = [
        gerarNumerosUnicos(1, 15),
        gerarNumerosUnicos(16, 30),
        gerarNumerosUnicos(31, 45),
        gerarNumerosUnicos(46, 60),
        gerarNumerosUnicos(61, 75)
    ];

    for (var i = 0; i < 5; i++) {
        var row = cartela.insertRow();
        for (var j = 0; j < 5; j++) {
            var cell = row.insertCell();
            if (i === 2 && j === 2) {
                cell.innerHTML = '★';
                cell.classList.add('marcado');
                cell.dataset.numero = 'livre';
            } else {
                var numero = numerosPorColuna[j][i];
                cell.innerHTML = numero;
                cell.dataset.numero = numero;
                cell.onclick = function() { marcarNumero(this); };
            }
        }
    }

    numerosSorteados = [];
    jogoIniciado = true;
    document.getElementById('display').innerHTML = '<h1>Cartela gerada! Clique em "Sortear Número"</h1>';
    document.getElementById('numerosSorteados').innerHTML = '';
}

function gerarNumerosUnicos(min, max) {
    var numeros = [];
    while (numeros.length < 5) {
        var num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (numeros.indexOf(num) === -1) {
            numeros.push(num);
        }
    }
    return numeros.sort(function(a, b) { return a - b; });
}

function sortearNumero() {
    if (!jogoIniciado) {
        document.getElementById('display').innerHTML = '<h1>Primeiro gere uma cartela!</h1>';
        return;
    }

    var disponiveis = [];
    for (var i = 1; i <= 75; i++) {
        if (numerosSorteados.indexOf(i) === -1) {
            disponiveis.push(i);
        }
    }

    if (disponiveis.length === 0) {
        document.getElementById('display').innerHTML = '<h1>Todos os números foram sorteados!</h1>';
        return;
    }

    var numeroSorteado = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    numerosSorteados.push(numeroSorteado);

    var container = document.getElementById('numerosSorteados');
    var bola = document.createElement('div');
    bola.className = 'bola-sorteada pop';
    bola.innerText = numeroSorteado;
    container.appendChild(bola);

    var colunas = ['B', 'I', 'N', 'G', 'O'];
    var letra = '';
    if (numeroSorteado >= 1 && numeroSorteado <= 15) letra = 'B';
    else if (numeroSorteado >= 16 && numeroSorteado <= 30) letra = 'I';
    else if (numeroSorteado >= 31 && numeroSorteado <= 45) letra = 'N';
    else if (numeroSorteado >= 46 && numeroSorteado <= 60) letra = 'G';
    else letra = 'O';

    document.getElementById('display').innerHTML = '<h1>' + letra + ' - ' + numeroSorteado + '</h1>';

    var celulas = document.querySelectorAll('.cartela-bingo td');
    celulas.forEach(function(celula) {
        if (parseInt(celula.dataset.numero) === numeroSorteado) {
            celula.classList.add('marcado');
        }
    });

    verificarVitoria();
}

function marcarNumero(celula) {
    if (celula.classList.contains('marcado')) {
        celula.classList.remove('marcado');
    } else {
        celula.classList.add('marcado');
    }
    verificarVitoria();
}

function verificarVitoria() {
    var cartela = document.getElementById('cartela');
    var vitorias = [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]
    ];

    for (var i = 0; i < vitorias.length; i++) {
        var ganhou = vitorias[i].every(function(indice) {
            var row = Math.floor((indice + 5) / 5);
            var col = (indice + 5) % 5;
            var cell = cartela.rows[row] ? cartela.rows[row].cells[col] : null;
            return cell && cell.classList.contains('marcado');
        });

        if (ganhou) {
            document.getElementById('display').innerHTML = '<h1 class="vencedor">BINGO! Você ganhou!</h1>';
            return;
        }
    }
}

function resetarJogo() {
    numerosSorteados = [];
    numerosCartela = [];
    jogoIniciado = false;
    document.getElementById('display').innerHTML = '<h1>Clique em "Gerar Cartela" para começar</h1>';
    document.getElementById('numerosSorteados').innerHTML = '';
    var cartela = document.getElementById('cartela');
    while (cartela.rows.length > 1) {
        cartela.deleteRow(1);
    }
}