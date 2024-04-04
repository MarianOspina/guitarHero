/*
Tras tener la visualización, hemos creado un sistema básico, para poder testear los codigos creados en JavaScript, la versión de prueba de dicho juego.

Se inicia con un tamaño de 775px en el div principal para que no quede grande para aparatos como portatiles y tampoco quede pequeño para pantallas mas grandes

*/
function Nota(left) {
  this.left = left
  this.top = 10
  this.height = 70
  this.incremento = 1
  this.timerId = null
  this.html = document.createElement('div')
  this.move = function () {
    this.top += this.incremento
    this.html.style.top = this.top + 'px'
  }
}
/*
Creamos la variable "life" utilizada para vizualizar las vidas del juador.
Creamos la variable "timerWiner" y sera utiliza para saber cuando el jugador gana el juego.
Se crea la funcion "gameOver" que hara que si las vidas del jugador incluyndo la vida 0 se agoten se acabe el juego guiandolo a otra parte.
*/ 
var arrayLeft = []
var arrayUp = []
var arrayDown = []
var arrayRight = []
var timerGame = null
var timerGenerator = null
var timerWinner = null
var life = document.getElementById('life')
var live = parseInt(life.innerText)
var score = document.getElementById('score')
var point = 0
var start = document.getElementById('start')
var comboBox = document.getElementById('combo')
var comboCounter = 0
var music = new Audio("song/acdc.mp3")
var backTittle = document.getElementsByClassName('tittle')
var loser = document.getElementById('windowGameover')
var winner = document.getElementById('windowGamewin')
var maxPoint = document.getElementsByClassName('maxp')
var maxCombo = document.getElementsByClassName('maxc')
var maxC = 0
var leveup = 0


// Definir los sonidos para cada dirección
const soundLeft = new Audio('sounds/sound_izquierda.mp3');
const soundUp = new Audio('sounds/sound_arriba.mp3');
const soundDown = new Audio('sounds/sound_abajo.mp3');
const soundRight = new Audio('sounds/sound_derecha.mp3');



for (let i = 0; i < backTittle.length; i++) {
  backTittle[i].addEventListener('click', function (e) {
    start.parentNode.parentNode.style.display = "block"
    backTittle[i].parentNode.parentNode.style.display = "none"
  })
}

start.addEventListener('click', function (e) {
  start.parentNode.parentNode.style.display = "none"
  console.log(start.parentNode.parentNode)
  startGame(music.duration)
})
/* 
Se agrega la variable "guitarra" y esta es utilizada que las notas recorran un camino.

Se crea La Variable "Notas" y estas seran las que den los puntos y seran dadas aleatoriamente por el juego.
*/
function generator() {
  var position = ['75px', '280px', '485px', '700px']
  var ranPosition = Math.floor(Math.random() * 4)
  var newNota = new Nota(position[ranPosition])
  newNota.html.setAttribute('class', 'notaCSS');
  newNota.html.style.left = newNota.left
  var guitarra = document.getElementById('guitarra')
  guitarra.appendChild(newNota.html)

  if (ranPosition === 0) {
    arrayLeft.push(newNota)
  }
  if (ranPosition === 1) {
    arrayUp.push(newNota)
  }
  if (ranPosition === 2) {
    arrayDown.push(newNota)
  }
  if (ranPosition === 3) {
    arrayRight.push(newNota)
  }

}
/*
Creamos una constante llamada "moveNote" y esta ayudara a mover la nota por medio de la direccion y el camino de la string.
*/
function moveNote() {
  arrayLeft.forEach(function (note) {
    note.move()
  }.bind(this))
  arrayUp.forEach(function (note) {
    note.move()
  }.bind(this))
  arrayDown.forEach(function (note) {
    note.move()
  }.bind(this))
  arrayRight.forEach(function (note) {
    note.move()
  }.bind(this))
}

function removeNote(arr) {
  if (arr.length > 0 && arr[0].top === 728) {
    guitarra.removeChild(arr[0].html)
    arr.shift()
    live--
    life.innerText = live
    gameOver()
  }
}

function checkRemoveNote() {

  removeNote(arrayLeft)
  removeNote(arrayUp)
  removeNote(arrayDown)
  removeNote(arrayRight)

}
/*
Se crea la funcion "cleargame" para que cada vez que se gane o pierda el juego este se limpe.
*/
function gameOver() {
  if (live === -1) {
    clearGame()
    loser.style.display = "block"
  }
}

function inputAction(arr) {
  if (arr.length != 0) {
    arr.forEach(function (note) {
      if (note.top > 582 && note.top + note.height < 712) {
        guitarra.removeChild(note.html)
        arr.shift()
        point += 10
        score.innerText = point
        comboCounter++
        comboBox.innerText = comboCounter
        if (maxC < comboCounter) {
          maxC = comboCounter
          for (let i = 0; i < maxCombo.length; i++) {
            maxCombo[i].innerText = maxC
          }
        }

      } else if (arr[0] && note.top < 582) {
        live--
        life.innerText = live
        comboCounter = 0
        comboBox.innerText = comboCounter
        gameOver()
      }
    }.bind(this))
  } else {
    live--
    life.innerText = live
    comboCounter = 0
    comboBox.innerText = comboCounter
    gameOver()
  }
}

function checkNote(pressed) {
  switch (pressed) {
    case 'ArrowLeft':
      inputAction(arrayLeft)
      break;
    case 'ArrowUp':
      inputAction(arrayUp)
      break;
    case 'ArrowDown':
      inputAction(arrayDown)
      break;
    case 'ArrowRight':
      inputAction(arrayRight)
      break;
  }
}

/*
Creamos la variable "timeup" que sera utilizada como un reutilizable "setInterval".
*/
let isPaused = false; // Variable para rastrear si el juego está pausado o no

// Agregar un evento de escucha para la barra espaciadora
window.addEventListener("keydown", function (e) {
  if (e.code === 'Space') { // Verificar si se presionó la barra espaciadora
    if (isPaused) {
      resumeGame(); // Si el juego está pausado, reanudarlo
    } else {
      pauseGame(); // Si el juego no está pausado, pausarlo
    }
  }
});

// Función para pausar el juego
function pauseGame() {
  // Detener todos los temporizadores
  clearInterval(timerGame);
  clearInterval(timerGenerator);
  clearTimeout(timerWinner);
  
  // Pausa la reproducción de música
  music.pause();

  isPaused = true; // Actualiza el estado de la pausa
}

// Función para reanudar el juego
function resumeGame() {
  // Reanuda los temporizadores
  timerGenerator = setInterval(generator, 2000);
  timerGame = setInterval(function () {
    moveNote();
    checkRemoveNote();
  }, 10);
  timerWinner = setTimeout(function () {
    clearGame();
    winner.style.display = "block";
  }, music.duration * 1000);
  
  // Reanuda la reproducción de música
  music.play();

  isPaused = false; // Actualiza el estado de la pausa
}

function startGame(songTimer) {
  maxC = 0
  for (let i = 0; i < maxCombo.length; i++) {
    maxCombo[i].innerText = 0
    maxPoint[i].innerText = 0
  }
  music.volume = 0.1;
  music.play();
  timerGenerator = setInterval(generator, 2000)
  timerGame = setInterval(function () {
    moveNote()
    checkRemoveNote()
  }, 10)
  timerWinner = setTimeout(function () {
    clearGame()
    winner.style.display = "block"
  }, songTimer * 1000)
}

function clearGame() {
  arrayLeft.forEach(function (note) {
    guitarra.removeChild(note.html)
  }.bind(this))
  arrayUp.forEach(function (note) {
    guitarra.removeChild(note.html)
  }.bind(this))
  arrayDown.forEach(function (note) {
    guitarra.removeChild(note.html)
  }.bind(this))
  arrayRight.forEach(function (note) {
    guitarra.removeChild(note.html)
  }.bind(this))

  arrayLeft = []
  arrayUp = []
  arrayDown = []
  arrayRight = []

  life.innerText = 5
  for (let i = 0; i < maxPoint.length; i++) {
    maxPoint[i].innerText = point
  }
  point = 0
  score.innerText = 0
  live = parseInt(life.innerHTML)
  comboCounter = 0
  comboBox.innerText = comboCounter

  music.pause();
  music.currentTime = 0

  clearInterval(timerGame)
  clearInterval(timerGenerator)
  clearTimeout(timerWinner)
}
/*

Funcion "activated Arrow" que sera utilizada para detectar si la nota ha difo pulsada dentro del rango de la casilla o si por el contrario fallo.

const arrows = {
  sprites: document.getElementsByClassName("botn"),
  colorAndTransparent(id, color) {
    this.sprites[id].style.backgroundColor = color
    setTimeout(() => {
      this.sprites[id].style.backgroundColor = "transparent"
    }, 200)
  },
  activatedArrow(pressed) {
    switch (pressed) {
      case 'izquierda':
        this.colorAndTransparent(0, 'yellow');
        break;
      case 'Arriba':
        this.colorAndTransparent(1, 'green');
        break;
      case 'Abajo':
        this.colorAndTransparent(2, 'blue');
        break;
      case 'Derecha':
        this.colorAndTransparent(3, 'pink');
        break;
    }
    if (Nota.top > 582 && Nota.top+Nota.height < 712) {
      console.log('DENTRO PERO CUALQUIER TECLA')
    }
  }
}

window.addEventListener("keydown", function (e) {
  if (['Izquierda', 'Arriba', 'Arbajo', 'Derecha'].includes(e.code)) {
    arrows.activatedArrow(e.code);
  }
})

El Codigo se reescribe para poder puesto que no se tenian factores como el presionar las teclas o "keydown" puesto a que faltaba un EventListener el cual pudiera leer
esto por decirlo de alguna forma y hacer que las notas musicales no sigan de largo, tambien se le agrega fondo a cada flcha para saber en que momento se debe presionar 
con el proposito de ser una mejora visual.(el cual detecta cuando se pulsa una de las flechas)

function activatedArrow() {
    if (arrows.pressed === 'Izqui') {
        arrows.sprites[0].style.backgroundColor = "yellow"
        setTimeout(function() {
            arrows.sprites[0].style.backgroundColor = "transparent"
        },200)
    }else if(arrows.pressed === 'Arriba'){
        arrows.sprites[1].style.backgroundColor = "green"
        setTimeout(function() {
            arrows.sprites[1].style.backgroundColor = "transparent"
        },200)
    }else if(arrows.pressed === 'Abajo'){
        arrows.sprites[2].style.backgroundColor = "blue"
        setTimeout(function() {
            arrows.sprites[2].style.backgroundColor = "transparent"
        },200)
    }else if(arrows.pressed === 'Rigth'){
        arrows.sprites[3].style.backgroundColor = "pink"
        setTimeout(function() {
            arrows.sprites[3].style.backgroundColor = "transparent"
        },200)
    }
}

Creamos a "direccion" una variable que como su nombre lo indica nos permite darle damos la dirección al objeto (esta sera una de las mas importantes ya que junto que a la variable 
  guitarra este sera el camino yla direccion que seguiran las notas ).

var guitarra = document.getElementById('guitarra')
var nota = document.createElement('div')
nota.setAttribute('class','notaCSS')
guitarra.appendChild(nota)
console.log(nota)
var notaTop = 10
var direccion = 1

const moveNote = function() {
    if (notaTop == 728) {
        guitarra.removeChild(nota)
    }
    notaTop += 1 * direccion
    nota.style.top = notaTop+'px'
} 

Se cambia el nombre de las variables de español a ingles para una mejor optimizacion y funcionamiento mas exactamente las variables que fueron afectadas son:

Izqui = ArrowLeft
Arriba = ArrowUp
Abajo = ArrowDown
Derecha = ArrowRight

Se coloca antes del nombre de la variable un indicativo de lo que es ya que si no seria tedioso a la hora de buscar una "izquierda" mientras que es mas facil 
identificar que es "ArrowIzqui" o "ArrowLeft"
Tras acabar con la programación mas básica y necesaria, nos hemos puesto a trabajar con el diseño
*/
const arrows = {
  sprites: document.getElementsByClassName("botn"),
  colorAndTransparent(id, color) {
    this.sprites[id].style.backgroundColor = color
    setTimeout(() => {
      this.sprites[id].style.backgroundColor = "transparent"
    }, 200)
  },
  activatedArrow(pressed) {
    switch (pressed) {
      case 'ArrowLeft':
        this.colorAndTransparent(0, 'yellow');
        soundLeft.play(); // Reproducir sonido izquierda
        checkNote(pressed)
        break;
      case 'ArrowUp':
        this.colorAndTransparent(1, 'green');
        soundUp.play(); // Reproducir sonido arriba
        checkNote(pressed)
        break;
      case 'ArrowDown':
        this.colorAndTransparent(2, 'blue');
        soundDown.play(); // Reproducir sonido abajo
        checkNote(pressed)
        break;
      case 'ArrowRight':
        this.colorAndTransparent(3, 'pink');
        soundRight.play(); // Reproducir sonido derecha
        checkNote(pressed)
        break;
    }
  }
}

window.addEventListener("keydown", function (e) {
  if (['ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight'].includes(e.code)) {
    arrows.activatedArrow(e.code);
  }
})


function iniciarJuego() {
  window.location.href= 'index.html';
}
