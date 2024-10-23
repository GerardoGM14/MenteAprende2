let startTime;
let elapsedTime = 0;
let cronometroInterval;
let puntaje = 0;
let nivelActual = 1;
let recognition;

// Textos y tiempo por nivel
const niveles = {
    1: {
        texto: 'El sol brilla en el cielo. Los niños juegan en el parque. Es un día perfecto para disfrutar al aire libre.',
        tiempoMax: 60
    },
    2: {
        texto: 'Los animales en la selva viven en armonía. Cada especie tiene su propio papel en el ecosistema.',
        tiempoMax: 50
    },
    3: {
        texto: 'La tecnología ha avanzado rápidamente en los últimos años, transformando la forma en que nos comunicamos.',
        tiempoMax: 40
    },
    4: {
        texto: 'A lo largo de la historia, el ser humano ha mostrado una increíble capacidad de adaptación.',
        tiempoMax: 30
    },
    5: {
        texto: 'El universo es vasto y misterioso. Desde las galaxias distantes hasta los planetas en nuestro propio sistema solar.',
        tiempoMax: 20
    }
};

// Iniciar el cronómetro
function iniciarCronometro() {
    mostrarTextoNivel();
    startTime = Date.now() - elapsedTime;
    cronometroInterval = setInterval(actualizarCronometro, 1000);
    document.getElementById('startButton').disabled = true;
}

// Detener el cronómetro
function detenerCronometro() {
    clearInterval(cronometroInterval);
    document.getElementById('startButton').disabled = false;
    calcularPuntaje();
}

// Actualizar el cronómetro en pantalla
function actualizarCronometro() {
    elapsedTime = Date.now() - startTime;
    const tiempoFormateado = formatearTiempo(elapsedTime);
    document.getElementById('tiempo').innerText = `⏱ Tiempo: ${tiempoFormateado}`;
}

// Formatear el tiempo en formato mm:ss
function formatearTiempo(tiempoEnMilisegundos) {
    const totalSegundos = Math.floor(tiempoEnMilisegundos / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

// Mostrar el texto correspondiente al nivel actual
function mostrarTextoNivel() {
    const textoLectura = document.getElementById('textoLectura');
    textoLectura.innerText = niveles[nivelActual].texto;
}

// Calcular puntaje basado en el tiempo
function calcularPuntaje() {
    const totalSegundos = Math.floor(elapsedTime / 1000);
    const tiempoMaximo = niveles[nivelActual].tiempoMax;

    if (totalSegundos <= tiempoMaximo) {
        puntaje += 100;
    } else if (totalSegundos <= tiempoMaximo + 10) {
        puntaje += 80;
    } else if (totalSegundos <= tiempoMaximo + 20) {
        puntaje += 50;
    } else {
        puntaje += 20;
    }

    document.getElementById('puntaje').innerText = `🏆 Puntaje: ${puntaje}`;

    if (nivelActual < 5) {
        setTimeout(() => {
            alert(`¡Nivel ${nivelActual} completado!`);
            siguienteNivel();
        }, 500);
    } else {
        alert(`¡Juego completado! Puntaje final: ${puntaje} 🏆`);
        guardarPuntajeBD();
    }
}

// Pasar al siguiente nivel
function siguienteNivel() {
    nivelActual++;
    elapsedTime = 0;
    iniciarCronometro();
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
    })
    .catch(error => {
        console.error('Error al guardar el puntaje:', error);
    });
}

// Volver al menú
function volverAlMenu() {
    window.location.href = '../index.html';
}

// Activar reconocimiento de voz
function activarReconocimientoVoz() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('El reconocimiento de voz no es compatible con tu navegador.');
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
        console.log('Reconocimiento de voz activado.');
    };

    recognition.onresult = (event) => {
        const palabraDetectada = event.results[0][0].transcript.trim().toUpperCase();
        document.getElementById('vozDetectada').innerText = `🎤 Palabra Detectada: ${palabraDetectada}`;
        resaltarPalabra(palabraDetectada);
    };

    recognition.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event.error);
    };

    recognition.onend = () => {
        console.log('Reconocimiento de voz finalizado.');
    };

    recognition.start();
}

// Resaltar la palabra dicha en el texto
function resaltarPalabra(palabraDicha) {
    const textoLectura = document.getElementById('textoLectura');
    const palabras = textoLectura.innerText.split(' ');

    const textoModificado = palabras
        .map(palabra => (palabra.toUpperCase() === palabraDicha ? `<span class="highlight">${palabra}</span>` : palabra))
        .join(' ');

    textoLectura.innerHTML = textoModificado;
}
