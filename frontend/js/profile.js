document.addEventListener('DOMContentLoaded', function() {
    const correo = localStorage.getItem('correo'); // Obtén el correo almacenado en localStorage después del login

    if (!correo) {
        alert('Debe iniciar sesión');
        window.location.href = '../pages/login.html'; // Redirigir si no hay correo en localStorage
        return;
    }

    // Botón para recuperar información (GET)
    document.getElementById('recuperarInfo').addEventListener('click', function(e) {
        e.preventDefault();

        fetch(`http://localhost:5000/api/profile?correo=${encodeURIComponent(correo)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                // Autocompletar los campos del perfil
                document.getElementById('nombre').value = data.nombre;
                document.getElementById('correo').value = data.correo; // Solo lectura
                document.getElementById('edad').value = data.edad;
                document.getElementById('temaPreferido').value = data.tema_preferido;
                document.getElementById('nivelPreferido').value = data.nivel_preferido;
                document.getElementById('notificaciones').checked = data.notificaciones;
            } else {
                alert('No se encontraron datos del perfil');
            }
        })
        .catch(error => {
            console.error('Error al obtener el perfil:', error);
            alert('Hubo un problema al cargar el perfil.');
        });
    });

    // Botón para guardar los cambios (POST)
    document.getElementById('guardarCambios').addEventListener('click', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const edad = document.getElementById('edad').value;
        const temaPreferido = document.getElementById('temaPreferido').value;
        const nivelPreferido = document.getElementById('nivelPreferido').value;
        const notificaciones = document.getElementById('notificaciones').checked;

        // Hacer la solicitud de actualización
        fetch(`http://localhost:5000/api/profile?correo=${encodeURIComponent(correo)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre,
                edad,
                tema_preferido: temaPreferido,
                nivel_preferido: nivelPreferido,
                notificaciones
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Perfil actualizado con éxito') {
                alert('Perfil actualizado correctamente.');
                window.location.href = '../pages/index.html'; // Regresar al menú
            } else {
                alert('Error al actualizar el perfil.');
            }
        })
        .catch(error => {
            console.error('Error al actualizar el perfil:', error);
            alert('Hubo un problema al intentar actualizar el perfil.');
        });
    });
});

// Función para volver al menú principal
function volverMenu() {
    window.location.href = '../pages/index.html';
}
