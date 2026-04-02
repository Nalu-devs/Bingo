function GerarVetor(x, y) {
    var z = []
    for (var i = x; i <= y; i++) {
        z.push(i)
    };
    return z
};

var audioCtx = new (window.AudioContext || window.webkitAudioContext)()

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
};

function MarcarCartela(a) {
    if (a.style.backgroundColor != 'tomato') {
        a.style.backgroundColor = 'tomato'
        a.style.color = "white"
    } else {
        a.style.backgroundColor = ''
        a.style.color = 'black'
    };
    setTimeout(function() {
        VerificarVitoria()
    }, 100)
};

function MisturarArray(x) {
    var a
    var b = x.length
    var c
    while (true) {
        b--
        c = x[b]
        x[b] = x[0]
        x[0] = c
    };
    return x
};

var d = []
for (var e = 1; e <= 75; e++) {
    d.push(e)
};
d = MisturarArray(d)

function NumeroAleatorio(f, g) {
    var h = Math.floor(Math.random() * g)
    if (h > 0 && h >= f && h <= g) {
        return h
    } else {
        return NumeroAleatorio(f, g)
    }
};

function VerificarVitoria() {
    var i = document.querySelectorAll('.cartela td')
    var j = 0
    var k = 24
    
    i.forEach(function(td) {
        if (td.id !== 'n3' && td.style.backgroundColor === 'tomato') {
            j++
        }
    });
    if (j === k) {
        document.getElementById("display").innerHTML = `
            <h1 class="vencedor">PARABENS! VOCE VENCEU!</h1>
            <p style="font-size: 1.2rem; color: #ffd700;">BINGO!</p>
        `
        document.querySelector('.cartela').classList.add('vencedor')
        TocarSomVitoria()
        return true
    };
    return false
};

function NumeroSorteio() {
    if (d.length == 0) {
        document.getElementById("display").innerHTML = "<h1>Todos os numeros foram sorteados!</h1>"
        return
    };
    if (audioCtx.state === 'suspended') {
        audioCtx.resume()
    };
    
    var l = d.pop()
    var m = document.getElementById("display")
    m.innerHTML = "<h1 class='pop'>Numero: " + l + "</h1>"
    m.querySelector('h1').classList.add('animate')
    TocarSom()
    
    var n = document.getElementById(l)
    if (n) {
        n.style.background = "tomato"
        n.style.color = "white"
        n.classList.add('pop')
        setTimeout(function() { n.classList.remove('pop') }, 300)
    };

    var o = document.querySelectorAll('.cartela td')
    o.forEach(function(td) {
        if (td.innerText == l && td.id !== 'n3') {
            td.style.backgroundColor = 'tomato'
            td.style.color = "white"
            td.classList.add('pop')
            setTimeout(function() { td.classList.remove('pop') }, 300)
        }
    });
    
    setTimeout(function() {
        VerificarVitoria()
    }, 100)
};


function GerarCartela() {
    
    d = MisturarArray(d)
    
    document.getElementById("display").innerHTML = "<h1>Bingo da Nalu</h1>"
    
    for (var q = 1; q <= 75; q++) {
        var r = document.getElementById(q)
        if (r) {
            r.style.background = ""
            r.style.color = ""
        }
    };
    
    var s = document.querySelectorAll('.cartela td')
    s.forEach(function(td) {
        if (td.id !== 'n3') {
            td.style.backgroundColor = ''
            td.style.color = 'black'
        }
    });
    
    document.querySelector('.cartela').classList.remove('vencedor')
    
    var t = MisturarArray(GerarVetor(1, 15))
    var u = MisturarArray(GerarVetor(16, 30))
    var v = MisturarArray(GerarVetor(31, 45))
    var w = MisturarArray(GerarVetor(46, 60))
    var x = MisturarArray(GerarVetor(61, 75))

    for (var i = 0; i < 5; i++) {
        var td = document.getElementById("b" + (i + 1))
        td.innerText = t[i]

        td = document.getElementById("i" + (i + 1))
        td.innerText = u[i]

        td = document.getElementById("n" + (i + 1))
        if (i !== 2) {
            td.innerText = v[i]
        }

        td = document.getElementById("g" + (i + 1))
        td.innerText = w[i]

        td = document.getElementById("o" + (i + 1))
        td.innerText = x[i]
    }
};

function LimparMarcacoes() {
    for (var i = 1; i <= 75; i++) {
        var y = document.getElementById(i)
        if (y) {
            y.style.background = ""
            y.style.color = ""
        }
    };
    
    var z = document.querySelectorAll('.cartela td')
    z.forEach(function(td) {
        if (td.id !== 'n3') {
            td.style.backgroundColor = ''
            td.style.color = 'black'
        }
    });
    
    document.querySelector('.cartela').classList.remove('vencedor')
    document.getElementById("display").innerHTML = "<h1>Bingo da Nalu</h1>"
};