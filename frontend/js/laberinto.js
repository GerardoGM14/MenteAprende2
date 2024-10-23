const canvas = document.getElementById('laberintoCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

let nivel = 1;
let tiempo = 0;
let puntaje = 0;
let jugador = { x: 0, y: 0 };
let laberinto, salida;
const blockSize = 20;

// Laberintos predefinidos por nivel (0 = camino, 1 = pared)
const laberintos = {
    1: [
        [0, 0, 1, 1, 1, 1, 1],
        [1, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0]
    ],
    2: [
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
        [1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0],
        [1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0],
        [1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
    ],
    3: [
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
    ]
};


function dibujarLaberinto() {
    const blockSize = canvas.width / laberinto.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < laberinto.length; y++) {
        for (let x = 0; x < laberinto[y].length; x++) {
            if (laberinto[y][x] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
            }
        }
    }

    // Dibujar al jugador
    ctx.fillStyle = 'blue';
    ctx.fillRect(jugador.x * blockSize, jugador.y * blockSize, blockSize, blockSize);

    // Dibujar la salida
    ctx.fillStyle = 'green';
    ctx.fillRect(salida.x * blockSize, salida.y * blockSize, blockSize, blockSize);
}

// Mover al jugador y actualizar el puntaje
function moverJugador(dir) {
    let nuevoX = jugador.x;
    let nuevoY = jugador.y;

    if (dir === 'arriba') nuevoY--;
    else if (dir === 'abajo') nuevoY++;
    else if (dir === 'izquierda') nuevoX--;
    else if (dir === 'derecha') nuevoX++;

    if (nuevoX >= 0 && nuevoX < laberinto[0].length && nuevoY >= 0 && nuevoY < laberinto.length) {
        if (laberinto[nuevoY][nuevoX] === 0) {
            // El jugador se mueve a una celda vacía
            jugador.x = nuevoX;
            jugador.y = nuevoY;
            puntaje += 5; // Sumar puntaje por moverse a una celda vacía
            animarMovimiento();
        } else {
            // El jugador choca con una pared
            puntaje -= 3; // Penalización por chocar
            animarColision();
        }
        dibujarLaberinto();
        actualizarPuntaje();

        if (jugador.x === salida.x && jugador.y === salida.y) {
            alert('¡Nivel completado!');
            puntaje += calcularPuntaje();
            siguienteNivel();
        }
    }
}

// Animación al moverse
function animarMovimiento() {
    canvas.classList.add('mover');
    setTimeout(() => canvas.classList.remove('mover'), 200);
}

// Animación al chocar
function animarColision() {
    canvas.classList.add('colision');
    setTimeout(() => canvas.classList.remove('colision'), 200);
}

// Actualizar el puntaje en la pantalla
function actualizarPuntaje() {
    document.getElementById('puntaje').innerText = puntaje + ' 🏆';
}

// Calcular puntaje basado en el tiempo
function calcularPuntaje() {
    return 1000 - tiempo * 10;
}

// Avanzar al siguiente nivel
function siguienteNivel() {
    nivel++;
    tiempo = 0;
    jugador = { x: 0, y: 0 };
    if (nivel <= 3) {
        laberinto = laberintos[nivel]; // Cargar el laberinto del siguiente nivel
        salida = { x: laberinto[0].length - 1, y: laberinto.length - 1 };
        dibujarLaberinto();
    } else {
        mostrarResumenFinal();
        guardarPuntajeBD();
    }
}

// Mostrar el resumen del puntaje final
function mostrarResumenFinal() {
    alert(`¡Felicidades! Has completado el juego con un puntaje de ${puntaje} 🏆`);
}

// Iniciar el juego
function iniciarJuego() {
    laberinto = laberintos[nivel]; // Cargar el laberinto del nivel actual
    salida = { x: laberinto[0].length - 1, y: laberinto.length - 1 };
    dibujarLaberinto();
    setInterval(function() {
        tiempo++;
        document.getElementById('tiempo').innerText = `Tiempo: ${tiempo}`;
    }, 1000);
}

// Manejador de teclas
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp') moverJugador('arriba');
    else if (e.key === 'ArrowDown') moverJugador('abajo');
    else if (e.key === 'ArrowLeft') moverJugador('izquierda');
    else if (e.key === 'ArrowRight') moverJugador('derecha');
});

// Guardar puntaje en la BD
function guardarPuntajeBD() {
    const token = localStorage.getItem('token');
    const url = 'http://localhost:5000/api/ranking';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ puntaje })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Puntaje guardado:', data);
    })
    .catch(error => {
        console.error('Error al guardar el puntaje:', error);
    });
}

// Modal de instrucciones
const modal = document.getElementById('modalInstrucciones');
const cerrarModal = document.getElementById('cerrarModal');
const empezarJuegoBtn = document.getElementById('empezarJuego');

cerrarModal.onclick = function() {
    modal.style.display = 'none';
};

empezarJuegoBtn.onclick = function() {
    modal.style.display = 'none';
    iniciarJuego();
};

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Inicializar el juego al cargar la página
window.onload = function() {
    modal.style.display = 'block';
};

// Función para volver al menú
function volverAlMenu() {
    window.location.href = '../index.html';
}
