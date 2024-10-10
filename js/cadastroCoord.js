const API_URL = 'https://back-end-pi-web.onrender.com/api/users/users/coord';

document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tipo = document.getElementById('tipo').value;
    
    // Pegar o token do localStorage
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Você não está autenticado. Faça login primeiro.');
        return;  // Interrompe o envio do formulário
    }

    // Enviar requisição com o token no cabeçalho
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Adicionar o token ao cabeçalho
        },
        body: JSON.stringify({ nome, email, password, tipo })
    });

    const user = await response.json();

    // Limpar os campos do formulário
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirm-password').value = '';
    document.getElementById('tipo').value = '';

    if (response.ok) {
        document.getElementById("successPopup").style.display = "block";
    } else {
        alert(`Erro: ${user.message}`);
    }
});

// Fechar o popup de sucesso
document.getElementById("closePopup").onclick = function() {
    document.getElementById("successPopup").style.display = "none";
};

// Fechar o popup ao clicar fora da área de conteúdo
window.onclick = function(event) {
    if (event.target == document.getElementById("successPopup")) {
        document.getElementById("successPopup").style.display = "none";
    }
};
