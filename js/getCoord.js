const API_URL = 'https://back-end-pi-web.onrender.com/api/users/coordenadores';
const DELETE_URL = 'https://back-end-pi-web.onrender.com/api/users/users';
const TURMA_URL = 'https://back-end-pi-web.onrender.com/api/turmas';

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
});

// Função para obter o token
function getToken() {
    return localStorage.getItem('token');
}

document.addEventListener('DOMContentLoaded', function() {
    // Função para buscar os dados do backend
    fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${getToken()}`  // Adicionar o token ao cabeçalho
        }
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('table-container');

        // Criação da tabela
        const table = document.createElement('table');
        table.setAttribute('border', '1'); // Bordas simples

        // Criando o cabeçalho da tabela
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const headers = ['Nome', 'Email', 'Atualizar', 'Deletar'];

        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Criando o corpo da tabela
        const tbody = document.createElement('tbody');
        data.forEach(coordenador => {
            const row = document.createElement('tr');
            
            // Células para cada campo
            const nomeCell = document.createElement('td');
            nomeCell.textContent = coordenador.nome;
            row.appendChild(nomeCell);

            const emailCell = document.createElement('td');
            emailCell.textContent = coordenador.email;
            row.appendChild(emailCell);

            const atualizarCell = document.createElement('td');
            const atualizarLink = document.createElement('a');
            atualizarLink.textContent = 'Atualizar';
            atualizarLink.href = `#`;
            atualizarLink.setAttribute('class', 'btn-link');

            const deletarCell = document.createElement('td');
            const deletarLink = document.createElement('a');
            deletarLink.textContent = 'Deletar';
            deletarLink.setAttribute('class', 'delete');

            // Função para deletar o coordenador
            deletarLink.addEventListener('click', function(event) {
                event.preventDefault();
                if (confirm(`Você tem certeza que deseja deletar o coordenador ${coordenador.nome}?`)) {
                    deletarProfessor(coordenador._id, row); // Chama a função de deletar
                }
            });

            atualizarLink.addEventListener('click', function(event) {
                event.preventDefault();
                abrirModalAtualizar(coordenador);
            });

            // Adicionar o link dentro da célula
            atualizarCell.appendChild(atualizarLink);
            row.appendChild(atualizarCell);
            
            // Adicionar o link dentro da célula
            deletarCell.appendChild(deletarLink);
            row.appendChild(deletarCell);

            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        // Adicionar a tabela ao container
        container.appendChild(table);
    })
    .catch(err => {
        console.error('Erro ao buscar dados:', err);
    });
});

// Função para deletar coordenador
async function deletarProfessor(coordenadorId, tableRow) {
    if (!coordenadorId) {
        console.error('ID do coordenador não fornecido.');
        alert('ID do coordenador não fornecido.');
        return;
    }

    const deleteUrl = `${DELETE_URL}/${coordenadorId}`;

    try {
        const response = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`  // Adicionar o token ao cabeçalho
            }
        });

        if (response.ok) {
            alert('Coordenador deletado com sucesso.');
            tableRow.remove();
        } else {
            const errorData = await response.json();
            alert(`Erro ao deletar: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro ao deletar coordenador:', error);
        const errorMessage = error.message || 'Erro desconhecido.';
        alert(`Erro ao conectar com o servidor: ${errorMessage}`);
    }
}

// Selecionar os elementos do modal
const modal = document.getElementById('comunicadoModal');
const closeModalButton = document.getElementById('closeModal');
const formModal = document.getElementById('formModal');
const successPopup = document.getElementById('successPopup');
const closePopupButton = document.getElementById('closePopup');

// Botão "Nova Turma" para abrir o modal
const novaTurmaButton = document.querySelector('.bottom a:nth-child(2)');

// Função para abrir o modal
novaTurmaButton.addEventListener('click', function(event) {
    event.preventDefault();
    modal.style.display = 'block';
});

// Função para fechar o modal
closeModalButton.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Fechar modal clicando fora da área de conteúdo
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

document.getElementById('formModal').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const ano = document.getElementById('ano').value;
    const serie = document.getElementById('serie').value;

    const response = await fetch(TURMA_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`  // Adicionar o token ao cabeçalho
        },
        body: JSON.stringify({ nome, ano, serie })
    });

    const user = await response.json();

    document.getElementById('nome').value = '';
    document.getElementById('ano').value = '';
    document.getElementById('serie').value = '';

    if (response.ok) {
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

// Fechar popup de sucesso manualmente
closePopupButton.addEventListener('click', function() {
    successPopup.style.display = 'none';
});

// Referências ao modal de atualização e seus elementos
const atualizarModal = document.getElementById('atualizarModal');
const closeModalButton1 = document.getElementById('closeModal-prof');
const formModal1 = document.getElementById('formModal-prof');

// Função para abrir o modal e preencher os dados do coordenador
function abrirModalAtualizar(coordenador) {
    // Preenche os campos do modal com os dados do coordenador
    document.getElementById('nome-prof').value = coordenador.nome;
    document.getElementById('email-prof').value = coordenador.email;
    document.getElementById('password').value = '';
    document.getElementById('confirm-password').value = '';

    // Exibe o modal
    atualizarModal.style.display = 'block';

    // Manipula o envio do formulário de atualização
    formModal1.onsubmit = async (e) => {
        e.preventDefault();

        // Valida todos os campos antes de enviar
        if (mainPasswordValidade() && comparePassword()) {
            const nomeAtualizado = document.getElementById('nome-prof').value;
            const emailAtualizado = document.getElementById('email-prof').value;
            const senhaAtualizada = document.getElementById('password').value;

            const updateUrl = `${DELETE_URL}/${coordenador._id}`;

            try {
                const response = await fetch(updateUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`  // Adicionar o token ao cabeçalho
                    },
                    body: JSON.stringify({ 
                        nome: nomeAtualizado, 
                        email: emailAtualizado, 
                        senha: senhaAtualizada 
                    }),
                });

                if (response.ok) {
                    alert('Coordenador atualizado com sucesso.');
                    atualizarModal.style.display = 'none';
                    location.reload(); // Atualiza a página
                } else {
                    const errorData = await response.json();
                    alert(`Erro ao atualizar: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Erro ao atualizar coordenador:', error);
                alert('Erro ao conectar com o servidor.');
            }
        }
    };
}

// Fechar o modal ao clicar no botão de fechar
closeModalButton1.addEventListener('click', function() {
    atualizarModal.style.display = 'none';
});

// Fechar o modal ao clicar fora do conteúdo
window.addEventListener('click', function(event) {
    if (event.target === atualizarModal) {
        atualizarModal.style.display = 'none';
    }
});

function mainPasswordValidade() {
    const password = document.getElementById('password');
    const span = password.nextElementSibling;

    if (password.value.length < 8) {
        span.style.display = 'block';
        return false;
    } else {
        span.style.display = 'none';
        return true;
    }
}

function comparePassword() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const span = confirmPassword.nextElementSibling;

    if (password.value !== confirmPassword.value) {
        span.style.display = 'block';
        return false;
    } else {
        span.style.display = 'none';
        return true;
    }
}
