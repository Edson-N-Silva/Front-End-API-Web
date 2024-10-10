const API_URL = 'https://back-end-pi-web.onrender.com/api/turmas';
const DELETE_URL = 'https://back-end-pi-web.onrender.com/api/turmas';

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
});

document.addEventListener('DOMContentLoaded', function() {
    // Função para buscar os dados do backend
    const token = localStorage.getItem('token');
    fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
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
        
        const headers = ['Nome', 'Ano','Série', 'Alunos', 'Atualizar', 'Deletar'];

        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Criando o corpo da tabela
        const tbody = document.createElement('tbody');
        data.forEach(turma => {
            const row = document.createElement('tr');
            
            // Células para cada campo
            const nomeCell = document.createElement('td');
            nomeCell.textContent = turma.nome;
            row.appendChild(nomeCell);

            const anoCell = document.createElement('td');
            anoCell.textContent = turma.ano;
            row.appendChild(anoCell);

            const serieCell = document.createElement('td');
            serieCell.textContent = turma.serie;
            row.appendChild(serieCell);

            const alunosCell = document.createElement('td');
            const alunosLink = document.createElement('a');
            alunosLink.textContent = 'Ver Alunos';
     
            alunosLink.setAttribute('class', 'btn-link');
            // Dentro do loop que cria as linhas da tabela para cada turma
            alunosLink.addEventListener('click', function(event) {
                event.preventDefault();
                abrirModalAlunosDaTurma(turma._id);
            });

            const atualizarCell = document.createElement('td');
            const atualizarLink = document.createElement('a');
            atualizarLink.textContent = 'Atualizar';
     
            atualizarLink.href = `#`;
            atualizarLink.setAttribute('class', 'btn-link');

            const deletarCell = document.createElement('td');
            const deletarLink = document.createElement('a');
            deletarLink.textContent = 'Deletar';
            
            deletarLink.setAttribute('class', 'delete');

            // Função para deletar a turma
            deletarLink.addEventListener('click', function(event) {
                event.preventDefault();
                if (confirm(`Você tem certeza que deseja deletar a Turma ${turma.nome}?`)) {
                    deletarTurma(turma._id, row); // Chama a função de deletar
                }
            });

            atualizarLink.addEventListener('click', function(event) {
                event.preventDefault();
                abrirModalAtualizar(turma);
            });

            // Adicionar o link dentro da célula
            alunosCell.appendChild(alunosLink);
            row.appendChild(alunosCell);

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

// Função para deletar turma
async function deletarTurma(turmaId, tableRow) {
    if (!turmaId) {
        console.error('ID da Turma não fornecido.');
        alert('ID da Turma não fornecido.');
        return;
    }

    const deleteUrl = `${DELETE_URL}/${turmaId}`;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
            }
        });

        if (response.ok) {
            alert('Turma deletada com sucesso.');
            tableRow.remove();
        } else {
            const errorData = await response.json();
            alert(`Erro ao deletar: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro ao deletar turma:', error);
        const errorMessage = error.message || 'Erro desconhecido.';
        alert(`Erro ao conectar com o servidor: ${errorMessage}`);
    }
}

// Função para deletar professor
async function deletarTurma(turmaId, tableRow) {
    if (!turmaId) {
        console.error('ID da Turma não fornecido.');
        alert('ID da Turma não fornecido.');
        return;
    }

    const deleteUrl = `${DELETE_URL}/${turmaId}`;

    try {
        const response = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
            }
        });

        if (response.ok) {
            alert('Turma deletada com sucesso.');
            tableRow.remove();
        } else {
            const errorData = await response.json();
            alert(`Erro ao deletar: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro ao deletar professor:', error);
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
    
    const token = localStorage.getItem('token');
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
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

function abrirModalDisciplinas(disciplinas) {
    const disciplinasModal = document.getElementById('disciplinasModal');
    const disciplinasList = document.getElementById('disciplinasList');

    // Limpa a lista de disciplinas
    disciplinasList.innerHTML = '';

    // Preenche a lista com as disciplinas
    disciplinas.forEach(disciplina => {
        const li = document.createElement('li');
        li.textContent = disciplina.nome; // Supondo que cada disciplina tem um campo 'nome'
        disciplinasList.appendChild(li);
    });

    // Exibe o modal
    disciplinasModal.style.display = 'block';
}

// Evento para fechar o modal ao clicar no "x"
const closeDisciplinasModal = document.getElementById('closeDisciplinasModal');
closeDisciplinasModal.addEventListener('click', function() {
    document.getElementById('disciplinasModal').style.display = 'none';
});

// Fechar modal clicando fora da área de conteúdo
window.addEventListener('click', function(event) {
    const disciplinasModal = document.getElementById('disciplinasModal');
    if (event.target === disciplinasModal) {
        disciplinasModal.style.display = 'none';
    }
});

const API_ALUNOS_URL = 'https://back-end-pi-web.onrender.com/api/users/alunos'; // Endpoint para buscar alunos

// Selecionar os elementos do modal de adicionar alunos
const modalAdicionarAlunos = document.getElementById('modalAdicionarAlunos');
const closeModalAdicionarAlunosButton = document.getElementById('closeModalAdicionarAlunos');
const alunosList = document.getElementById('alunosList');
const confirmarAdicionarAlunosButton = document.getElementById('confirmarAdicionarAlunos');
let selectedAlunos = [];

const API_TURMAS_URL = 'https://back-end-pi-web.onrender.com/api/turmas';

// Função para buscar turmas do backend e preencher o select
async function buscarTurmas() {
    try {
    const token = localStorage.getItem('token');
    const response = await fetch(API_TURMAS_URL, {
        headers: {
            'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
        }
    });
        const turmas = await response.json();

        const turmaSelect = document.getElementById('turmaSelect');
        turmaSelect.innerHTML = ''; // Limpa as opções anteriores

        turmas.forEach(turma => {
            const option = document.createElement('option');
            option.value = turma._id; // ID da turma
            option.textContent = `${turma.nome}`; // Texto exibido no select
            turmaSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao buscar turmas:', error);
}
}


// Função para abrir o modal de adicionar alunos
function abrirModalAdicionarAlunos() {
    modalAdicionarAlunos.style.display = 'block';
    buscarTurmas(); // Chama a função para buscar turmas
    buscarAlunos(); // Chama a função para buscar alunos
}


// Função para abrir o modal de adicionar alunos
async function abrirModalAlunosDaTurma(turmaId) {
    turmaIdAtual = turmaId; // Armazena o ID da turma atual

    // Limpa a lista de alunos
    alunosList.innerHTML = '';

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_ALUNOS_URL}?turma=${turmaId}`, {
        headers: {
            'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
        }
    });

    if (!response.ok) {
        console.error('Erro ao buscar alunos:', response.statusText);
        return;
    }
    
    const alunos = await response.json();

    alunos.forEach(aluno => {
        const li = document.createElement('li');
        li.textContent = aluno.nome; // Supondo que cada aluno tem um campo 'nome'
        li.onclick = function() {
            this.classList.toggle('selected');
            const alunoId = aluno._id;

            // Adiciona ou remove o aluno da lista de selecionados
            if (selectedAlunos.includes(alunoId)) {
                selectedAlunos = selectedAlunos.filter(id => id !== alunoId);
            } else {
                selectedAlunos.push(alunoId);
            }
        };
        alunosList.appendChild(li);
    });

    modalAdicionarAlunos.style.display = 'block'; // Mostra o modal
}

// Evento para abrir o modal quando clicar no link "Adicionar Aluno"
document.querySelector('.bottom a:nth-child(3)').addEventListener('click', function(event) {
    event.preventDefault();
    abrirModalAdicionarAlunos();
});

// Fechar modal
closeModalAdicionarAlunosButton.addEventListener('click', function() {
    modalAdicionarAlunos.style.display = 'none';
});


// Seleção dos elementos
const alunosDaTurmaModal = document.getElementById('alunosDaTurmaModal');
const alunosDaTurmaTableBody = document.querySelector('#alunosDaTurmaTable tbody');
const closeAlunosDaTurmaModalButton = document.getElementById('closeAlunosDaTurmaModal');

// Evento para fechar o modal
closeAlunosDaTurmaModalButton.addEventListener('click', () => {
    alunosDaTurmaModal.style.display = 'none';
});

function abrirModalAlunosDaTurma(turmaId) {
    const token = localStorage.getItem('token');
    fetch(`https://back-end-pi-web.onrender.com/api/turmas/${turmaId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json' ,
            'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
          
        },
    })
        .then(response => response.json())
        .then(turma => {
            alunosDaTurmaTableBody.innerHTML = ''; // Limpa a tabela

            turma.aluno.forEach(aluno => {
                const row = document.createElement('tr');

                // Checkbox para seleção
                const checkboxCell = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.setAttribute('data-id', aluno._id); // Armazena o ID do aluno no checkbox
                checkboxCell.appendChild(checkbox);
                row.appendChild(checkboxCell);

                const nomeCell = document.createElement('td');
                nomeCell.textContent = aluno.nome;
                row.appendChild(nomeCell);

                alunosDaTurmaTableBody.appendChild(row);
            });

            // Adiciona o botão de deletar selecionados
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Deletar Selecionados';
            deleteButton.addEventListener('click', () => {
                const selectedAlunos = [...alunosDaTurmaTableBody.querySelectorAll('input[type="checkbox"]:checked')]
                    .map(checkbox => checkbox.getAttribute('data-id'));
                deletarAlunoDaTurma(turmaId, selectedAlunos);
            });
            alunosDaTurmaTableBody.appendChild(deleteButton);

            alunosDaTurmaModal.style.display = 'block';
        })
        .catch(error => console.error('Erro ao buscar alunos da turma:', error));
}

async function deletarAlunoDaTurma(turmaId, alunosIds) {
    if (alunosIds.length === 0) {
        alert('Por favor, selecione pelo menos um aluno para remover.');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://back-end-pi-web.onrender.com/api/turmas/delete/${turmaId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json' ,
                'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
              
            },
            body: JSON.stringify({ alunosIds }) // Envia a lista de IDs dos alunos a serem deletados
        });

        if (response.ok) {
            alert('Aluno(s) removido(s) com sucesso da turma.');
            abrirModalAlunosDaTurma(turmaId); // Atualiza o modal após a remoção
        } else {
            const errorData = await response.json();
            alert(`Erro ao deletar aluno(s): ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro ao deletar alunos:', error);
        alert('Erro ao conectar com o servidor.');
    }
}

// Referências ao modal de atualização e seus elementos
const atualizarModal = document.getElementById('atualizarModal');
const closeModalButton1 = document.getElementById('closeModal-prof');
const formModal1 = document.getElementById('formModal-prof');

// Função para abrir o modal e preencher os dados do aluno
function abrirModalAtualizar(turma) {
    // Preenche os campos do modal com os dados do aluno
    document.getElementById('nome-turma').value = turma.nome;
    document.getElementById('ano').value = turma.ano;
    document.getElementById('serie').value = turma.ano;

    // Exibe o modal
    atualizarModal.style.display = 'block';

    // Manipula o envio do formulário de atualização
    formModal1.onsubmit = async (e) => {
        e.preventDefault();

        // Valida todos os campos antes de enviar
        if (mainPasswordValidade() && comparePassword()) {
            const nomeAtualizado = document.getElementById('nome-turma').value;
            const anoAtualizado = document.getElementById('ano').value;
            const serieAtualizada = document.getElementById('serie').value;

            const updateUrl = `${DELETE_URL}/${turma._id}`;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(updateUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ 
                        nome: nomeAtualizado, 
                        email: anoAtualizado, 
                        senha: serieAtualizada 
                    }),
                });

                if (response.ok) {
                    alert('Turma atualizada com sucesso.');
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
