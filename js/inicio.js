const API_URL = 'https://back-end-pi-web.onrender.com/api/comunicados/comunicados';
const URL = 'https://back-end-pi-web.onrender.com/api/users';
const URL_TURMAS = 'https://back-end-pi-web.onrender.com/api/turmas/count';

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
});

// Exibir nome do usuário na página inicial
document.addEventListener('DOMContentLoaded', function() {
    const userName = localStorage.getItem('userName'); // Recupera o nome do usuário logado
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (userName) {
        welcomeMessage.textContent = `Bem-vindo!`; // Atualiza o texto do h1
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // Função para buscar o total de professores
    fetch(`${URL}/alunos/count`)
        .then(response => response.json())
        .then(data => {
            const dadosDiv = document.querySelector('.dados-container');
            dadosDiv.innerHTML = `
                                <div class="tudo">
                                <div class="alunos-js">
                                <img src="/Front-End-PI-Web/imgs/Graduation Cap.png" alt="Chapeu de graduação">
                                <p>${data.count}</p>
                                </div>
                                <h3>Estudantes</h3>
                                </div>`
                                ;
            return fetch(`${URL}/professores/count`); // Busca o total de alunos
        })
        .then(response => response.json())
        .then(data => {
            const dadosDiv = document.querySelector('.dados-container');
            dadosDiv.innerHTML += `<div class="tudo">
                                <div class="alunos-js">
                                <img src="/Front-End-PI-Web/imgs/Teacher.png" alt="Chapeu de graduação">
                                <p>${data.count}</p>
                                </div>
                                <h3>Professores</h3>
                                </div>`; // Adiciona o total de alunos
        })
        .catch(err => {
            console.error('Erro ao buscar os totais:', err);
        });
});


// Função para obter os comunicados existentes
async function getComunicados() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar comunicados');
        }

        const comunicados = await response.json();
        displayComunicados(comunicados); // Função para exibir os comunicados
    } catch (error) {
        console.error('Erro ao buscar comunicados:', error);
    }
}

// Função para exibir os comunicados no frontend
function displayComunicados(comunicados) {
    const comunicadosContainer = document.getElementById('comunicadosContainer');

    // Limpar a lista de comunicados antes de exibir
    comunicadosContainer.innerHTML = '';

    // Adicionar o título antes dos comunicados
    const titulo = document.createElement('h2');
    titulo.classList.add('titulo');
    titulo.innerText = 'COMUNICADOS';
    comunicadosContainer.appendChild(titulo);

    // Verifica se há comunicados
    if (comunicados.length === 0) {
        comunicadosContainer.innerHTML += '<p>Não há comunicados no momento.</p>';
        return;
    }

    // Exibir cada comunicado na página
    comunicados.forEach(comunicado => {
        const comunicadoDiv = document.createElement('div');
        comunicadoDiv.classList.add('comunicado-item');

        comunicadoDiv.innerHTML = `
            <h3>Titulo: ${comunicado.titulo}</h3>
            <p>Comunicado: ${comunicado.conteudo}</p>
        `;

        comunicadosContainer.appendChild(comunicadoDiv);

        // Adicionar evento de clique para abrir o modal com o comunicado completo
        comunicadoDiv.addEventListener('click', () => {
            showModal(comunicado.titulo, comunicado.conteudo);
        });
    });
}

function showModal(titulo, conteudo) {
    const modal = document.getElementById('comunicadoModal');
    const modalTitulo = document.getElementById('modalTitulo');
    const modalConteudo = document.getElementById('modalConteudo');

    // Preencher o modal com o título e o conteúdo do comunicado
    modalTitulo.innerText = titulo;
    modalConteudo.innerText = conteudo;

    // Exibir o modal
    modal.style.display = 'block';
}

// Fechar o modal ao clicar no botão de fechar
document.getElementById('closeModal').onclick = function() {
    const modal = document.getElementById('comunicadoModal');
    modal.style.display = 'none';
};

// Fechar o modal ao clicar fora da área de conteúdo
window.onclick = function(event) {
    const modal = document.getElementById('comunicadoModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// Chamar a função getComunicados quando a página carregar
window.onload = function() {
    getComunicados();
};
