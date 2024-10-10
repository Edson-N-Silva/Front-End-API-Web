// URL do backend
const backendUrl = 'http://localhost:3000/api';

// Função de login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${backendUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            // Armazenar o token e informações do usuário no localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.nome); // Aqui é onde o nome é armazenado
            window.location.href = '/Front-End-PI-Web/inicio.html'; // Redirecionar para a home
        } else {
            document.getElementById('errorMessage').innerText = data.message;
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});


// Função para verificar autenticação na home
window.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.includes('/Front-End-PI-Web/inicio.html')) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/Front-End-PI-Web/index.html'; // Redireciona se não houver token
        }

        // Logout
        document.getElementById('logoutButton').addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('userId'); // Remove o ID do usuário ao fazer logout
            localStorage.removeItem('userType'); // Remove o tipo do usuário ao fazer logout
            localStorage.removeItem('userName'); // Remove o nome do usuário ao fazer logout
            window.location.href = '/Front-End-PI-Web/index.html'; // Redireciona para a página de login
        });
    }
});
