// register.js

document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const contraseña = document.getElementById('contraseña').value;
    const edad = parseInt(document.getElementById('edad').value);

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, correo, contraseña, edad })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            window.location.href = 'login.html'; // Redirigir a la página de inicio de sesión
        } else {
            alert(data.message || 'Error al registrar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error en la conexión. Inténtalo nuevamente.');
    }
});
