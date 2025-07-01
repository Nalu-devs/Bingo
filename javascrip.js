function GerarVetor(numeroInicial, numeroFinal) {
    var vetor = []
    for (var i = numeroInicial; i <= numeroFinal; i++) {
        vetor.push(i)
    }
    return vetor
}

function MarcarCartela(td) {
    if (td.style.backgroundColor != 'tomato') {
        td.style.backgroundColor = 'tomato'
        td.style.color = "white"
    } else {
        td.style.backgroundColor = ''
        td.style.color = 'black'
    }
}

function MisturarArray(array) {
    var aleatorio
    var cont = array.length
    var auxiliar
    while (cont != 0) {
        aleatorio = NumeroAleatorio(1, array.length)
        cont--
        auxiliar = array[cont]
        array[cont] = array[aleatorio]
        array[aleatorio] = auxiliar
    }
    return array
}

var sorteio = []
for (var i = 1; i <= 75; i++) {
    sorteio.push(i)
}
sorteio = MisturarArray(sorteio)

function NumeroAleatorio(numeroMinimo, numeroMaximo) {
    var retorno = Math.floor(Math.random() * numeroMaximo)
    if (retorno > 0 && retorno >= numeroMinimo && retorno <= numeroMaximo) {
        return retorno
    } else {
        return NumeroAleatorio(numeroMinimo, numeroMaximo)
    }
}

function NumeroSorteio() {
    if (sorteio.length == 0) { // Adiciona uma verificação para quando os números acabarem
        document.getElementById("display").innerHTML = "<h1>Todos os números foram sorteados!</h1>"
        return NumeroSorteio()
    }
    var numerosorteado = sorteio.shift() // Pega o primeiro e remove do array embaralhado
    // Faz o número que foi sorteado aparecer na tela
    document.getElementById("display").innerHTML = "<h1>Número sorteado: " + numerosorteado + "</h1>"
    // Pega o elemento TD correspondente ao número sorteado na tabela grande
    var numeroTabela = document.getElementById(numerosorteado)

    if (numeroTabela) {
        numeroTabela.style.background = "tomato"
    }


    // //Tentei marcar na cartela com base no codigo do fernando mas n deu certo
    // var numeroMarcadoCartela = document.getElementById(numerosorteado)
    // if (numeroMarcadoCartela != null) {
    //   numeroMarcadoCartela.style.backgroundColor = "rgba(255,0,0,0.5)"
    // }
}



function GerarCartela() {
    vetorB = MisturarArray(GerarVetor(1, 15))
    vetorI = MisturarArray(GerarVetor(16, 30))
    vetorN = MisturarArray(GerarVetor(31, 45))
    vetorG = MisturarArray(GerarVetor(46, 60))
    vetorO = MisturarArray(GerarVetor(61, 75))

    for (var i = 0; i < 5; i++) {
        var td = document.getElementById("b" + (i + 1))
        td.innerText = vetorB[i]

        td = document.getElementById("i" + (i + 1))
        td.innerText = vetorI[i]

        td = document.getElementById("n" + (i + 1))
        td.innerText = vetorN[i]

        td = document.getElementById("g" + (i + 1))
        td.innerText = vetorG[i]

        td = document.getElementById("o" + (i + 1))
        td.innerText = vetorO[i]
    }
}