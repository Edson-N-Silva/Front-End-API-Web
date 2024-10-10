const API_URL = 'https://back-end-pi-web.onrender.com/api/users/alunos';
const DELETE_URL = 'https://back-end-pi-web.onrender.com/api/users/users';
const TURMA_URL = 'https://back-end-pi-web.onrender.com/api/turmas';

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/Front-End-PI-Web/index.html';
});

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token'); // Pegar o token do localStorage

    if (!token) {
        alert('Você não está autenticado. Faça login primeiro.');
        window.location.href = '/index.html'; // Redirecionar para a página de login
        return;
    }

    // Função para buscar os dados do backend
    fetch(API_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Adicionar o token ao cabeçalho
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na autorização. Verifique se você está autenticado.');
        }
        return response.json();
    })
    .then(data => {
        const container = document.getElementById('table-container');

        // Criação da tabela
        const table = document.createElement('table');
        table.setAttribute('border', '1'); // Bordas simples

        // Criando o cabeçalho da tabela
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const headers = ['Nome', 'Email', 'Turma', 'Atualizar', 'Deletar'];

        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Criando o corpo da tabela
        const tbody = document.createElement('tbody');
        data.forEach(aluno => {
            const row = document.createElement('tr');
            
            // Células para cada campo
            const nomeCell = document.createElement('td');
            nomeCell.textContent = aluno.nome;
            row.appendChild(nomeCell);

            const emailCell = document.createElement('td');
            emailCell.textContent = aluno.email;
            row.appendChild(emailCell);

            //quando for adicionada a turma ao professor, arrumar isso
            const turmasCell = document.createElement('td');
            turmasCell.textContent = aluno.turma ? aluno.turma.nome : 'Sem Turma';
            row.appendChild(turmasCell);

            const atualizarCell = document.createElement('td');
            const atualizarLink = document.createElement('a');
            atualizarLink.textContent = 'Atualizar';
            atualizarLink.href = `#`;
            atualizarLink.setAttribute('class', 'btn-link');
            atualizarLink.addEventListener('click', (e) => {
                e.preventDefault();
                abrirModalAtualizar(aluno); // Abre o modal para atualização
            });
            atualizarCell.appendChild(atualizarLink);
            row.appendChild(atualizarCell);

            const deletarCell = document.createElement('td');
            const deletarLink = document.createElement('a');
            deletarLink.textContent = 'Deletar';
            deletarLink.setAttribute('class', 'delete');

            // Função para deletar o professor
            deletarLink.addEventListener('click', function(event) {
                event.preventDefault();
                if (confirm(`Você tem certeza que deseja deletar o aluno ${aluno.nome}?`)) {
                    deletarAluno(aluno._id, row); // Chama a função de deletar
                }
            });

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
        alert('Erro ao buscar dados: ' + err.message);
    });
});

// Função para adicionar um aluno (POST)
async function adicionarAluno(alunoData) {
    const token = localStorage.getItem('token'); // Pegar o token do localStorage

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Adicionar o token ao cabeçalho
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(alunoData)
        });

        if (response.ok) {
            alert('Aluno adicionado com sucesso.');
            location.reload();
        } else {
            const errorData = await response.json();
            alert(`Erro ao adicionar aluno: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro ao adicionar aluno:', error);
        alert('Erro ao conectar com o servidor.');
    }
}

// Função para deletar aluno (DELETE)
async function deletarAluno(alunoId, tableRow) {
    const token = localStorage.getItem('token'); // Pegar o token do localStorage

    if (!alunoId) {
        console.error('ID do aluno não fornecido.');
        alert('ID do aluno não fornecido.');
        return;
    }

    const deleteUrl = `${DELETE_URL}/${alunoId}`;

    try {
        const response = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Adicionar o token ao cabeçalho
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Aluno deletado com sucesso.');
            tableRow.remove();
        } else {
            const errorData = await response.json();
            alert(`Erro ao deletar: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro ao deletar aluno:', error);
        const errorMessage = error.message || 'Erro desconhecido.';
        alert(`Erro ao conectar com o servidor: ${errorMessage}`);
    }
}

// Referências ao modal de atualização e seus elementos
const atualizarModal = document.getElementById('atualizarModal');
const closeModalButton1 = document.getElementById('closeModal-aluno');
const formModal1 = document.getElementById('formModal-aluno');

// Função para abrir o modal de atualização e preencher os dados do aluno
function abrirModalAtualizar(aluno) {
    const token = localStorage.getItem('token'); // Pegar o token do localStorage

    if (!token) {
        alert('Você não está autenticado. Faça login primeiro.');
        window.location.href = '/Front-End-PI-Web/index.html'; // Redirecionar para a página de login
        return;
    }

    // Preenche os campos do modal com os dados do aluno
    document.getElementById('nome-aluno').value = aluno.nome;
    document.getElementById('email-aluno').value = aluno.email;
    document.getElementById('password').value = '';
    document.getElementById('confirm-password').value = '';

    // Exibe o modal
    atualizarModal.style.display = 'block';

    // Manipula o envio do formulário de atualização (PUT)
    formModal1.onsubmit = async (e) => {
        e.preventDefault();

        // Valida todos os campos antes de enviar
        if (mainPasswordValidade() && comparePassword()) {
            const nomeAtualizado = document.getElementById('nome-aluno').value;
            const emailAtualizado = document.getElementById('email-aluno').value;
            const senhaAtualizada = document.getElementById('password').value;

            const updateUrl = `${DELETE_URL}/${aluno._id}`;

            try {
                const response = await fetch(updateUrl, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Adicionar o token ao cabeçalho
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        nome: nomeAtualizado, 
                        email: emailAtualizado, 
                        senha: senhaAtualizada 
                    }),
                });

                if (response.ok) {
                    alert('Aluno atualizado com sucesso.');
                    atualizarModal.style.display = 'none';
                    location.reload(); // Atualiza a página
                } else {
                    const errorData = await response.json();
                    alert(`Erro ao atualizar: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Erro ao atualizar aluno:', error);
                alert('Erro ao conectar com o servidor.');
            }
        }
    };
}

// Selecionar os elementos do modal
const modal = document.getElementById('comunicadoModal');
const closeModalButton = document.getElementById('closeModal');
const formModal = document.getElementById('formModal');
const successPopup = document.getElementById('successPopup');
const closePopupButton = document.getElementById('closePopup');

closeModalButton.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Fechar modal clicando fora da área de conteúdo
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Botão "Nova Turma" para abrir o modal
const novaTurmaButton = document.querySelector('.bottom a:nth-child(2)');

// Função para abrir o modal
novaTurmaButton.addEventListener('click', function(event) {
    event.preventDefault();
    modal.style.display = 'block';
});

document.getElementById('formModal').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const ano = document.getElementById('ano').value;
    const serie = document.getElementById('serie').value;
    
    const token = localStorage.getItem('token');
    const response = await fetch(TURMA_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nome, ano, serie })
    });

    const user = await response.json();

    document.getElementById('nome').value = '';
    document.getElementById('ano').value = '';
    document.getElementById('serie').value = '';

    if(response.ok){
        document.getElementById("successPopup").style.display = "block";
    }
});



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

// Validação de senha principal
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

// Comparar senhas
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

