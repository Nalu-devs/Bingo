function GerarVetor(x, y) {
    console.log('[DEBUG] Gerando vetor de', x, 'até', y)
    var z = []
    for (var i = x; i <= y; i++) {
        z.push(i)
    }
    console.log('[DEBUG] Vetor gerado:', z)
    return z
}
function MarcarCartela(x) {
    console.log('[DEBUG] MarcarCartela chamada. Elemento ID:', x.id, 'Texto:', x.innerText)
    if (x.style.backgroundColor != 'tomato') {
        console.log('[DEBUG] Marcando célula')
        x.style.backgroundColor = 'tomato'
        x.style.color = "white"
    } else {
        console.log('[DEBUG] Desmarcando célula')
        x.style.backgroundColor = ''
        x.style.color = 'black'
    }
    
    setTimeout(function() {
        VerificarVitoria()
    }, 100)
}

function MisturarArray(x) {
    console.log('[DEBUG] Misturando array de tamanho:', x.length)
    var y
    var z = x.length
    var w
    while (z != 0) {
        y = NumeroAleatorio(1, x.length)
        z--
        w = x[z]
        x[z] = x[y]
        x[y] = w
    }
    console.log('[DEBUG] Array misturada:', x)
    return x
}

var sorteio = []
for (var i = 1; i <= 75; i++) {
    sorteio.push(i)
}
console.log('[DEBUG] Sorteio inicial gerado. Tamanho:', sorteio.length)
sorteio = MisturarArray(sorteio)

function NumeroAleatorio(x, y) {
    console.log('[DEBUG] Gerando número aleatório entre', x, 'e', y)
    var z = Math.floor(Math.random() * y)
    if (z > 0 && z >= x && z <= y) {
        console.log('[DEBUG] Número retornado:', z)
        return z
    } else {
        return NumeroAleatorio(x, y)
    }
}

function VerificarVitoria() {
    console.log('[DEBUG] Verificando vitória...')
    var x = document.querySelectorAll('.cartela td')
    var y = 0
    var z = 24
    
    x.forEach(function(td) {
        if (td.id !== 'n3' && td.style.backgroundColor === 'tomato') {
            console.log('[DEBUG] Célula marcada:', td.id, td.innerText)
            y++
        }
    })
    console.log('[DEBUG] Marcadas:', y, '/ Total necessário:', z)
    console.log("Passou")
    if (y === z) {
        console.log('[DEBUG] VITÓRIA! Todas as células marcadas!')
        document.getElementById("display").innerHTML = `
            <h1 class="vencedor">🎉 PARABÉNS! VOCÊ VENCEU! 🎉</h1>
            <p style="font-size: 1.2rem; background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 700;">BINGO! Cartela completa!</p>
            <p style="font-size: 1rem; color: #28a745; margin-top: 10px;">✨ Jogo incrível! ✨</p>
        `
        
        document.querySelector('.cartela').classList.add('vencedor')
        
        return true
    }
    return false
}

function NumeroSorteio() {
    console.log('[DEBUG] Sortear número chamado. Números restantes:', sorteio.length)
    if (sorteio.length == 0) {
        console.log('[DEBUG] Todos os números foram sorteados!')
        document.getElementById("display").innerHTML = "<h1>Todos os números foram sorteados!</h1>"
        return
    }
    var x = sorteio.shift()
    console.log('[DEBUG] Número sorteado:', x)
    document.getElementById("display").innerHTML = "<h1>Número sorteado: " + x + "</h1>"
    var y = document.getElementById(x)

    if (y) {
        console.log('[DEBUG] Encontrou número na tabela grande:', x)
        y.style.background = "tomato"
    } else {
        console.log('[DEBUG] Número NÃO encontrado na tabela grande:', x)
    }

    var z = document.querySelectorAll('.cartela td')
    var w = false
    z.forEach(function(td) {
        if (td.innerText == x && td.id !== 'n3') {
            console.log('[DEBUG] Marcando número na cartela. ID:', td.id, 'Número:', td.innerText)
            td.style.backgroundColor = 'tomato'
            td.style.color = "white"
            w = true
        }
    })
    if (!w) {
        console.log('[DEBUG] Número não encontrado na cartela:', x)
    }
    
    setTimeout(function() {
        VerificarVitoria()
    }, 100)
}


function GerarCartela() {
    console.log('[DEBUG] Gerando nova cartela...')
    sorteio = []
    for (var i = 1; i <= 75; i++) {
        sorteio.push(i)
    }
    sorteio = MisturarArray(sorteio)
    console.log('[DEBUG] Sorteio resetado. Primeiro número:', sorteio[0])
    
    document.getElementById("display").innerHTML = "<h1>Testando se sorteia o numero</h1>"
    
    for (var i = 1; i <= 75; i++) {
        var x = document.getElementById(i)
        if (x) {
            x.style.background = ""
        }
    }
    
    var y = document.querySelectorAll('.cartela td')
    y.forEach(function(td) {
        if (td.id !== 'n3') {
            td.style.backgroundColor = ''
            td.style.color = 'black'
        }
    })
    
    document.querySelector('.cartela').classList.remove('vencedor')
    
    var x = MisturarArray(GerarVetor(1, 15))
    var y = MisturarArray(GerarVetor(16, 30))
    var z = MisturarArray(GerarVetor(31, 45))
    var w = MisturarArray(GerarVetor(46, 60))
    var v = MisturarArray(GerarVetor(61, 75))

    console.log('[DEBUG] Vetores gerados - B:', x, '| I:', y, '| N:', z, '| G:', w, '| O:', v)

    for (var i = 0; i < 5; i++) {
        var td = document.getElementById("b" + (i + 1))
        td.innerText = x[i]
        console.log('[DEBUG] Definindo b' + (i+1) + ' = ' + x[i])

        td = document.getElementById("i" + (i + 1))
        td.innerText = y[i]
        console.log('[DEBUG] Definindo i' + (i+1) + ' = ' + y[i])

        td = document.getElementById("n" + (i + 1))
        if (i !== 2) {
            td.innerText = z[i]
            console.log('[DEBUG] Definindo n' + (i+1) + ' = ' + z[i])
        }

        td = document.getElementById("g" + (i + 1))
        td.innerText = w[i]
        console.log('[DEBUG] Definindo g' + (i+1) + ' = ' + w[i])

        td = document.getElementById("o" + (i + 1))
        td.innerText = v[i]
        console.log('[DEBUG] Definindo o' + (i+1) + ' = ' + v[i])
    }
    console.log('[DEBUG] Cartela gerada com sucesso!')
}
    console.log('[DEBUG] Vetor gerado:', z)
    return z
}

function MarcarCartela(x) {
    console.log('[DEBUG] MarcarCartela chamada. Elemento ID:', x.id, 'Texto:', x.innerText)
    if (x.style.backgroundColor != 'tomato') {
        console.log('[DEBUG] Marcando célula')
        x.style.backgroundColor = 'tomato'
        x.style.color = "white"
    } else {
        console.log('[DEBUG] Desmarcando célula')
        x.style.backgroundColor = ''
        x.style.color = 'black'
    }
    
    // Verificar se venceu após marcar/desmarcar
    setTimeout(function() {
        VerificarVitoria()
    }, 100)
}

function MisturarArray(x) {
    console.log('[DEBUG] Misturando array de tamanho:', x.length)
    var y
    var z = x.length
    var w
    while (z != 0) {
        y = NumeroAleatorio(1, x.length)
        z--
        w = x[z]
        x[z] = x[y]
        x[y] = w
    }
    console.log('[DEBUG] Array misturada:', x)
    return x
}

var sorteio = []
for (var i = 1; i <= 75; i++) {
    sorteio.push(i)
}
console.log('[DEBUG] Sorteio inicial gerado. Tamanho:', sorteio.length)
sorteio = MisturarArray(sorteio)

function NumeroAleatorio(x, y) {
    console.log('[DEBUG] Gerando número aleatório entre', x, 'e', y)
    var z = Math.floor(Math.random() * y)
    if (z > 0 && z >= x && z <= y) {
        console.log('[DEBUG] Número retornado:', z)
        return z
    } else {
        return NumeroAleatorio(x, y)
    }
}

function VerificarVitoria() {
    console.log('[DEBUG] Verificando vitória...')
    var x = document.querySelectorAll('.cartela td')
    var y = 0
    var z = 24 // 25 células - 1 centro (n3)
    
    x.forEach(function(td) {
        if (td.id !== 'n3' && td.style.backgroundColor === 'tomato') {
            console.log('[DEBUG] Célula marcada:', td.id, td.innerText)
            y++
        }
    })
    console.log('[DEBUG] Marcadas:', y, '/ Total necessário:', z)
    console.log("Passou")
    if (y === z) {
        console.log('[DEBUG] VITÓRIA! Todas as células marcadas!')
        document.getElementById("display").innerHTML = `
            <h1 class="vencedor">🎉 PARABÉNS! VOCÊ VENCEU! 🎉</h1>
            <p style="font-size: 1.2rem; background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 700;">BINGO! Cartela completa!</p>
            <p style="font-size: 1rem; color: #28a745; margin-top: 10px;">✨ Jogo incrível! ✨</p>
        `
        
        // Adicionar classe de animação à cartela
        document.querySelector('.cartela').classList.add('vencedor')
        
        return true
    }
    return false
}

function NumeroSorteio() {
    console.log('[DEBUG] Sortear número chamado. Números restantes:', sorteio.length)
    if (sorteio.length == 0) { // Adiciona uma verificação para quando os números acabarem
        console.log('[DEBUG] Todos os números foram sorteados!')
        document.getElementById("display").innerHTML = "<h1>Todos os números foram sorteados!</h1>"
        return
    }
    var x = sorteio.shift() // Pega o primeiro e remove do array embaralhado
    console.log('[DEBUG] Número sorteado:', x)
    // Faz o número que foi sorteado aparecer na tela
    document.getElementById("display").innerHTML = "<h1>Número sorteado: " + x + "</h1>"
    // Pega o elemento TD correspondente ao número sorteado na tabela grande
    var y = document.getElementById(x)

    if (y) {
        console.log('[DEBUG] Encontrou número na tabela grande:', x)
        y.style.background = "tomato"
    } else {
        console.log('[DEBUG] Número NÃO encontrado na tabela grande:', x)
    }

    // Marcar o número na cartela correspondente
    var z = document.querySelectorAll('.cartela td')
    var w = false
    z.forEach(function(td) {
        if (td.innerText == x && td.id !== 'n3') { // Não marca o centro (n3)
            console.log('[DEBUG] Marcando número na cartela. ID:', td.id, 'Número:', td.innerText)
            td.style.backgroundColor = 'tomato'
            td.style.color = "white"
            w = true
        }
    })
    if (!w) {
        console.log('[DEBUG] Número não encontrado na cartela:', x)
    }
    
    // Verificar se venceu após marcar
    setTimeout(function() {
        VerificarVitoria()
    }, 100)
}



function GerarCartela() {
    console.log('[DEBUG] Gerando nova cartela...')
    // Resetar os números sorteados
    sorteio = []
    for (var i = 1; i <= 75; i++) {
        sorteio.push(i)
    }
    sorteio = MisturarArray(sorteio)
    console.log('[DEBUG] Sorteio resetado. Primeiro número:', sorteio[0])
    
    // Limpar o display
    document.getElementById("display").innerHTML = "<h1>Testando se sorteia o numero</h1>"
    
    // Limpar todas as marcações da tabela de números
    for (var i = 1; i <= 75; i++) {
        var x = document.getElementById(i)
        if (x) {
            x.style.background = ""
        }
    }
    
    // Resetar as cores da cartela
    var y = document.querySelectorAll('.cartela td')
    y.forEach(function(td) {
        if (td.id !== 'n3') { // Não limpa o centro (n3 que tem a imagem)
            td.style.backgroundColor = ''
            td.style.color = 'black'
        }
    })
    
    // Remover animação de vitória
    document.querySelector('.cartela').classList.remove('vencedor')
    
    var x = MisturarArray(GerarVetor(1, 15))
    var y = MisturarArray(GerarVetor(16, 30))
    var z = MisturarArray(GerarVetor(31, 45))
    var w = MisturarArray(GerarVetor(46, 60))
    var v = MisturarArray(GerarVetor(61, 75))

    console.log('[DEBUG] Vetores gerados - B:', x, '| I:', y, '| N:', z, '| G:', w, '| O:', v)

    for (var i = 0; i < 5; i++) {
        var td = document.getElementById("b" + (i + 1))
        td.innerText = x[i]
        console.log('[DEBUG] Definindo b' + (i+1) + ' = ' + x[i])

        td = document.getElementById("i" + (i + 1))
        td.innerText = y[i]
        console.log('[DEBUG] Definindo i' + (i+1) + ' = ' + y[i])

        td = document.getElementById("n" + (i + 1))
        if (i !== 2) { // Não altera o centro (n3) que tem o coração
            td.innerText = z[i]
            console.log('[DEBUG] Definindo n' + (i+1) + ' = ' + z[i])
        }

        td = document.getElementById("g" + (i + 1))
        td.innerText = w[i]
        console.log('[DEBUG] Definindo g' + (i+1) + ' = ' + w[i])

        td = document.getElementById("o" + (i + 1))
        td.innerText = v[i]
        console.log('[DEBUG] Definindo o' + (i+1) + ' = ' + v[i])
    }
    console.log('[DEBUG] Cartela gerada com sucesso!')
}