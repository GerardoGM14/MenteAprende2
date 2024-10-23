// sopa_letras.js

const niveles = {
    1: { tamaño: 10, palabras: ['PERRO', 'GATO', 'RATON', 'PAJARO', 'PEZ'] },
    2: { tamaño: 12, palabras: ['COMPUTADORA', 'MOUSE', 'TECLADO', 'PANTALLA', 'IMPRESORA'] },
    3: { tamaño: 15, palabras: ['PROGRAMACION', 'JAVASCRIPT', 'HTML', 'CSS', 'ALGORITMO'] }
};

let nivelActual = 1;
let puntaje = 0;
let sopaLetras = [];
let palabrasEncontradas = [];

// Crear el tablero de sopa de letras
function generarTablero() {
    const sopaContainer = document.getElementById('sopaLetras');
    const { tamaño, palabras } = niveles[nivelActual];
    sopaContainer.style.gridTemplateColumns = `repeat(${tamaño}, 40px)`;
    sopaContainer.style.gridTemplateRows = `repeat(${tamaño}, 40px)`;
    sopaLetras = crearSopaLetras(tamaño, palabras);

    // Limpiar tablero anterior
    sopaContainer.innerHTML = '';

    // Crear casillas
    for (let y = 0; y < tamaño; y++) {
        for (let x = 0; x < tamaño; x++) {
            const casilla = document.createElement('div');
            casilla.innerText = sopaLetras[y][x];
            casilla.addEventListener('mousedown', seleccionarLetra);
            casilla.setAttribute('data-x', x);
            casilla.setAttribute('data-y', y);
            sopaContainer.appendChild(casilla);
        }
    }

    // Mostrar palabras
    const listaPalabras = document.getElementById('palabras');
    listaPalabras.innerHTML = '';
    palabras.forEach(palabra => {
        const palabraItem = document.createElement('li');
        palabraItem.innerText = palabra;
        palabraItem.setAttribute('id', `palabra-${palabra}`);
        listaPalabras.appendChild(palabraItem);
    });
}

// Crear la sopa de letras (rellenada aleatoriamente)
function crearSopaLetras(tamaño, palabras) {
    const sopa = Array.from({ length: tamaño }, () => Array(tamaño).fill(null));
    
    // Colocar palabras en la sopa
    palabras.forEach(palabra => {
        let colocado = false;
        while (!colocado) {
            const dir = Math.random() > 0.5 ? 'horizontal' : 'vertical';
            const startX = Math.floor(Math.random() * tamaño);
            const startY = Math.floor(Math.random() * tamaño);

            if (puedeColocarPalabra(sopa, palabra, startX, startY, dir)) {
                colocarPalabra(sopa, palabra, startX, startY, dir);
                colocado = true;
            }
        }
    });

    // Rellenar los espacios vacíos
    for (let y = 0; y < tamaño; y++) {
        for (let x = 0; x < tamaño; x++) {
            if (sopa[y][x] === null) {
                sopa[y][x] = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Letras aleatorias
            }
        }
    }
    return sopa;
}

// Verificar si se puede colocar la palabra
function puedeColocarPalabra(sopa, palabra, startX, startY, dir) {
    if (dir === 'horizontal' && startX + palabra.length > sopa.length) return false;
    if (dir === 'vertical' && startY + palabra.length > sopa.length) return false;

    for (let i = 0; i < palabra.length; i++) {
        const x = dir === 'horizontal' ? startX + i : startX;
        const y = dir === 'vertical' ? startY + i : startY;

        if (sopa[y][x] !== null && sopa[y][x] !== palabra[i]) return false;
    }
    return true;
}

// Colocar palabra en la sopa
function colocarPalabra(sopa, palabra, startX, startY, dir) {
    for (let i = 0; i < palabra.length; i++) {
        const x = dir === 'horizontal' ? startX + i : startX;
        const y = dir === 'vertical' ? startY + i : startY;
        sopa[y][x] = palabra[i];
    }
}

// Seleccionar letras
let seleccion = [];
function seleccionarLetra(e) {
    const casilla = e.target;
    seleccion.push(casilla);

    casilla.classList.add('selected');
    const palabra = seleccion.map(c => c.innerText).join('');
    verificarPalabra(palabra);
}

// Verificar si la palabra es correcta
function verificarPalabra(palabra) {
    if (niveles[nivelActual].palabras.includes(palabra)) {
        palabrasEncontradas.push(palabra);
        seleccion.forEach(c => c.classList.add('found'));
        document.getElementById(`palabra-${palabra}`).classList.add('found');
        puntaje += 10;
        actualizarPuntaje();
        seleccion = [];

        // Verificar si se encontraron todas las palabras
        if (palabrasEncontradas.length === niveles[nivelActual].palabras.length) {
            setTimeout(finalizarNivel, 1000);
        }
    }
}

// Finalizar el nivel y avanzar al siguiente
function finalizarNivel() {
    if (nivelActual < 3) {
        nivelActual++;
        palabrasEncontradas = [];
        generarTablero();
        alert('¡Siguiente nivel!');
    } else {
        alert(`¡Juego completado! Tu puntaje es: ${puntaje} 🏆`);
        guardarPuntajeBD();
    }
}

// Guardar el puntaje en la base de datos
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
        alert('Puntaje guardado en el ranking.');
        volverMenu();
    })
    .catch(error => {
        console.error('Error al guardar el puntaje:', error);
        alert('Hubo un problema al guardar el puntaje.');
    });
}

// Actualizar el puntaje
function actualizarPuntaje() {
    document.getElementById('puntaje').innerText = `🏆 Puntaje: ${puntaje}`;
}

// Volver al menú
function volverMenu() {
    window.location.href = '../index.html';
}

// Iniciar juego
document.getElementById('comenzarJuego').addEventListener('click', () => {
    document.getElementById('instruccionesModal').style.display = 'none';
    generarTablero();
});

// Mostrar instrucciones al cargar
window.onload = function() {
    const modal = document.getElementById('instruccionesModal');
    modal.style.display = 'block';

    document.querySelector('.close').onclick = function() {
        modal.style.display = 'none';
    }
};
