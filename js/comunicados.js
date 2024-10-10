const API_URL = 'https://back-end-pi-web.onrender.com/api/comunicados/comunicados';

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
});

document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = document.getElementById('titulo').value;
    const conteudo = document.getElementById('conteudo').value;
    const token = localStorage.getItem('token');
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, conteudo })
    });

    const user = await response.json();

    document.getElementById('titulo').value = '';
    document.getElementById('conteudo').value = '';

    if(response.ok){
        document.getElementById("successPopup").style.display = "block";
    }
});

document.getElementById("closePopup").onclick = function() {
    document.getElementById("successPopup").style.display = "none";
};

// Fechar o popup ao clicar fora da área de conteúdo
window.onclick = function(event) {
    if (event.target == document.getElementById("successPopup")) {
        document.getElementById("successPopup").style.display = "none";
    }
};

