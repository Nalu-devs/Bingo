function GerarVetor(x, y) {
    var z = []
    for (var i = x; i <= y; i++) {
        z.push(i)
    }
    return z
}

var audioCtx = new (window.AudioContext || window.webkitAudioContext)()

function TocarSom() {
    var osc = audioCtx.createOscillator()
    var gain = audioCtx.createGain()
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(660, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.25)
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.25)
}

function TocarSomVitoria() {
    var notes = [523, 659, 784, 1047]
    notes.forEach(function(freq, i) {
        setTimeout(function() {
            var osc = audioCtx.createOscillator()
            var gain = audioCtx.createGain()
            osc.connect(gain)
            gain.connect(audioCtx.destination)
            osc.type = 'triangle'
            osc.frequency.value = freq
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5)
            osc.start()
            osc.stop(audioCtx.currentTime + 0.5)
        }, i * 180)
    })
}

function MarcarCartela(x) {
    if (x.style.backgroundColor != 'tomato') {
        x.style.backgroundColor = 'tomato'
        x.style.color = "white"
    } else {
        x.style.backgroundColor = ''
        x.style.color = 'black'
    }
    setTimeout(function() {
        VerificarVitoria()
    }, 100)
}

function MisturarArray(x) {
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
    return x
}

var sorteio = []
for (var i = 1; i <= 75; i++) {
    sorteio.push(i)
}
sorteio = MisturarArray(sorteio)

function NumeroAleatorio(x, y) {
    var z = Math.floor(Math.random() * y)
    if (z > 0 && z >= x && z <= y) {
        return z
    } else {
        return NumeroAleatorio(x, y)
    }
}

function VerificarVitoria() {
    var x = document.querySelectorAll('.cartela td')
    var y = 0
    var z = 24
    
    x.forEach(function(td) {
        if (td.id !== 'n3' && td.style.backgroundColor === 'tomato') {
            y++
        }
    })
    if (y === z) {
        document.getElementById("display").innerHTML = `
            <h1 class="vencedor">PARABENS! VOCE VENCEU!</h1>
            <p style="font-size: 1.2rem; color: #ffd700;">BINGO!</p>
        `
        document.querySelector('.cartela').classList.add('vencedor')
        TocarSomVitoria()
        return true
    }
    return false
}

function NumeroSorteio() {
    if (sorteio.length == 0) {
        document.getElementById("display").innerHTML = "<h1>Todos os numeros foram sorteados!</h1>"
        return
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume()
    }
    
    var x = sorteio.shift()
    var display = document.getElementById("display")
    display.innerHTML = "<h1 class='pop'>Numero: " + x + "</h1>"
    display.querySelector('h1').classList.add('animate')
    TocarSom()
    
    var y = document.getElementById(x)
    if (y) {
        y.style.background = "tomato"
        y.style.color = "white"
        y.classList.add('pop')
        setTimeout(function() { y.classList.remove('pop') }, 300)
    }

    var z = document.querySelectorAll('.cartela td')
    z.forEach(function(td) {
        if (td.innerText == x && td.id !== 'n3') {
            td.style.backgroundColor = 'tomato'
            td.style.color = "white"
            td.classList.add('pop')
            setTimeout(function() { td.classList.remove('pop') }, 300)
        }
    })
    
    setTimeout(function() {
        VerificarVitoria()
    }, 100)
}


function GerarCartela() {
    sorteio = []
    for (var i = 1; i <= 75; i++) {
        sorteio.push(i)
    }
    sorteio = MisturarArray(sorteio)
    
    document.getElementById("display").innerHTML = "<h1>Bingo da Nalu</h1>"
    
    for (var i = 1; i <= 75; i++) {
        var x = document.getElementById(i)
        if (x) {
            x.style.background = ""
            x.style.color = ""
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

    for (var i = 0; i < 5; i++) {
        var td = document.getElementById("b" + (i + 1))
        td.innerText = x[i]

        td = document.getElementById("i" + (i + 1))
        td.innerText = y[i]

        td = document.getElementById("n" + (i + 1))
        if (i !== 2) {
            td.innerText = z[i]
        }

        td = document.getElementById("g" + (i + 1))
        td.innerText = w[i]

        td = document.getElementById("o" + (i + 1))
        td.innerText = v[i]
    }
}

function LimparMarcacoes() {
    for (var i = 1; i <= 75; i++) {
        var x = document.getElementById(i)
        if (x) {
            x.style.background = ""
            x.style.color = ""
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
    document.getElementById("display").innerHTML = "<h1>Bingo da Nalu</h1>"
}