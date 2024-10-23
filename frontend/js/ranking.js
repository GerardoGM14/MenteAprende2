document.addEventListener('DOMContentLoaded', function() {
    cargarRanking();
});

function cargarRanking() {
    // Realiza la solicitud GET para obtener los puntajes desde el servidor
    fetch('http://localhost:5000/api/ranking', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.length > 0) {
            mostrarRanking(data);
        } else {
            alert('No se encontraron datos del ranking.');
        }
    })
    .catch(error => {
        console.error('Error al cargar el ranking:', error);
        alert('Hubo un problema al cargar el ranking.');
    });
}

function mostrarRanking(rankingData) {
    const rankingBody = document.getElementById('rankingBody');
    rankingBody.innerHTML = ''; // Limpiar el contenido anterior

    // Crear las filas del ranking
    rankingData.forEach((jugador, index) => {
        const fila = document.createElement('tr');
        
        // Columna del puesto
        const puestoCelda = document.createElement('td');
        if (index === 0) {
            puestoCelda.innerHTML = '🥇 1er';
        } else if (index === 1) {
            puestoCelda.innerHTML = '🥈 2do';
        } else if (index === 2) {
            puestoCelda.innerHTML = '🥉 3ro';
        } else {
            puestoCelda.innerText = `${index + 1}º`;
        }

        // Columna del nombre del jugador
        const nombreCelda = document.createElement('td');
        nombreCelda.innerText = jugador.nombre;

        // Columna del puntaje
        const puntajeCelda = document.createElement('td');
        puntajeCelda.innerText = jugador.puntaje_total;

        // Agregar las celdas a la fila
        fila.appendChild(puestoCelda);
        fila.appendChild(nombreCelda);
        fila.appendChild(puntajeCelda);

        // Agregar la fila al cuerpo de la tabla
        rankingBody.appendChild(fila);
    });
}

function volverAlMenu() {
    window.location.href = '../pages/index.html';
}
