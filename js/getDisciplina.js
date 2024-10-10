const API_URL = 'https://back-end-pi-web.onrender.com/api/disciplinas/disciplinas';
const API_TURMAS = 'https://back-end-pi-web.onrender.com/api/turmas';
const API_PROFESSORES = 'https://back-end-pi-web.onrender.com/api/users/professores';

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
});

document.addEventListener('DOMContentLoaded', function() {
    carregarProfessores();
    carregarTurmas();
    carregarDisciplinas();
});

// Função para carregar os professores
function carregarProfessores() {
    const token = localStorage.getItem('token');
    fetch(API_PROFESSORES, {
        headers: {
            'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
        }
    })
        .then(response => response.json())
        .then(professores => {
            const professorSelect = document.getElementById('professor');
            professores.forEach(professor => {
                const option = document.createElement('option');
                option.value = professor._id;
                option.textContent = professor.nome;
                professorSelect.appendChild(option);
            });
        })
        .catch(err => console.error('Erro ao buscar professores:', err));
}

// Função para carregar as turmas
function carregarTurmas() {
    const token = localStorage.getItem('token');
    fetch(API_TURMAS, {
        headers: {
            'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
        }
    })
        .then(response => response.json())
        .then(turmas => {
            const turmaSelect = document.getElementById('turma');
            turmaSelect.innerHTML = ''; // Limpa o select antes de adicionar novos itens
            turmas.forEach(turma => {
                const option = document.createElement('option');
                option.value = turma._id;
                option.textContent = turma.nome;
                turmaSelect.appendChild(option);
            });
        })
        .catch(err => console.error('Erro ao buscar turmas:', err));
}

// Função para carregar as disciplinas e preencher a tabela
function carregarDisciplinas() {
    const token = localStorage.getItem('token');
    fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
        }
    })
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('table-container');
            container.innerHTML = ''; // Limpa a tabela antes de adicionar novos itens

            const table = document.createElement('table');
            table.setAttribute('border', '1');

            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const headers = ['Nome', 'Professor', 'Turma', 'Atualizar', 'Deletar'];

            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            data.forEach(disciplina => {
                const row = document.createElement('tr');

                const nomeCell = document.createElement('td');
                nomeCell.textContent = disciplina.nome;
                row.appendChild(nomeCell);

                const professorCell = document.createElement('td');
                professorCell.textContent = disciplina.professor.nome || 'Professor não encontrado';
                row.appendChild(professorCell);

                const turmaCell = document.createElement('td');
                turmaCell.textContent = disciplina.turma.nome || 'Turma não encontrada';
                row.appendChild(turmaCell);

                const atualizarCell = document.createElement('td');
                const atualizarLink = document.createElement('a');
                atualizarLink.textContent = 'Atualizar';
                atualizarLink.href = `#`;
                atualizarLink.setAttribute('class', 'btn-link');
                atualizarCell.appendChild(atualizarLink);
                row.appendChild(atualizarCell);

                    const deletarCell = document.createElement('td');
                    const deletarLink = document.createElement('a');
deletarLink.textContent = 'Deletar';
deletarLink.setAttribute('class', 'delete');

// Função para deletar a disciplina e atualizar a turma
deletarLink.addEventListener('click', function(event) {
    event.preventDefault();
    if (confirm(`Você tem certeza que deseja deletar a disciplina ${disciplina.nome}?`)) {
        deletarDisciplinaEDaTurma(disciplina._id, disciplina.turma._id, row); // Chama a função de deletar e atualizar
    }
});

                    deletarCell.appendChild(deletarLink);
                    row.appendChild(deletarCell);

                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            container.appendChild(table);
        })
        .catch(err => console.error('Erro ao buscar disciplinas:', err));
}

async function atualizarTurmaComDisciplina(turmaId, disciplinaId) {
    const token = localStorage.getItem('token');
    const responsePut = await fetch(`${API_TURMAS}/${turmaId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({ disciplinas: disciplinaId }),
    });

    if (responsePut.ok) {
        console.log('Turma atualizada com sucesso.');
    } else {
        const errorData = await responsePut.json();
        console.error('Erro ao atualizar a turma:', errorData.message);
    }
}

async function deletarDisciplinaEDaTurma(disciplinaId, turmaId, tableRow) {
    if (!disciplinaId || !turmaId) {
        console.error('ID da disciplina ou ID da turma não fornecido.');
        alert('Erro: ID da disciplina ou da turma não foi fornecido.');
        return;
    }

    try {
        // Primeira etapa: Deletar a disciplina
        const token = localStorage.getItem('token');
        const deleteResponse = await fetch(`${API_URL}/${disciplinaId}`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
             }
        });

        if (deleteResponse.ok) {
            alert('Disciplina deletada com sucesso.');

            // Segunda etapa: Atualizar a turma removendo a disciplina
            const token = localStorage.getItem('token');
            const updateTurmaResponse = await fetch(`${API_TURMAS}/${turmaId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                 },
                body: JSON.stringify({
                    $pull: { disciplinas: disciplinaId }, // Remove a disciplina do array
                }),
            });

            if (updateTurmaResponse.ok) {
                alert('Disciplina removida da turma com sucesso.');
                tableRow.remove(); // Remove a linha da tabela no frontend
            } else {
                const errorData = await updateTurmaResponse.json();
                alert(`Erro ao atualizar a turma: ${errorData.message}`);
            }
        } else {
            const errorData = await deleteResponse.json();
            alert(`Erro ao deletar a disciplina: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro ao deletar disciplina e atualizar turma:', error);
        alert('Erro ao conectar com o servidor.');
    }
}
    

// Função para deletar disciplina
async function deletarDisciplina(disciplinaId, tableRow) {
    if (!disciplinaId) {
        console.error('ID da disciplina não fornecido.');
        alert('ID da disciplina não fornecido.');
        return;
    }

    const deleteUrl = `${API_URL}/${disciplinaId}`;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(deleteUrl, { 
            method: 'DELETE',
            headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
         } });

        if (response.ok) {
            alert('Disciplina deletada com sucesso.');
            tableRow.remove();
            carregarTurmas(); // Recarrega as turmas após deletar
        } else {
            const errorData = await response.json();
            alert(`Erro ao deletar: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro ao deletar disciplina:', error);
        alert(`Erro ao conectar com o servidor: ${error.message}`);
    }
}


// Selecionar os elementos do modal
const modal = document.getElementById('comunicadoModal');
const closeModalButton = document.getElementById('closeModal');
const formModal = document.getElementById('formModal');
const successPopup = document.getElementById('successPopup');
const closePopupButton = document.getElementById('closePopup');

// Botão "Nova Turma" para abrir o modal
const novaTurmaButton = document.querySelector('.bottom a:nth-child(1)');

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
    const professor = document.getElementById('professor').value;
    const turma = document.getElementById('turma').value;
    
    // Dentro do evento de submit do formulário
const token = localStorage.getItem('token');
const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ nome, professor, turma }),
});

const disciplina = await response.json();

if (response.ok) {
    document.getElementById("successPopup").style.display = "block";

    // Atualiza a turma com a nova disciplina
    await atualizarTurmaComDisciplina(turma, disciplina); // Passa o objeto disciplina
} else {
        alert('Erro ao criar disciplina: ' + disciplina.message);
    }


    // Limpa os campos do formulário
    document.getElementById('nome').value = '';
    document.getElementById('professor').value = '';
    document.getElementById('turma').value = '';
});

// Fechar o popup de sucesso
document.getElementById("closePopup").onclick = function() {
    document.getElementById("successPopup").style.display = "none";
};

window.onclick = function(event) {
    if (event.target == document.getElementById("successPopup")) {
        document.getElementById("successPopup").style.display = "none";
    }
};

async function atualizarTurmaComDisciplina(turmaId, disciplina) {
    const token = localStorage.getItem('token');
    const responsePut = await fetch(`${API_TURMAS}/${turmaId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({
            disciplinas: {
                id: disciplina._id,
                nome: disciplina.nome,
                professor: disciplina.professor,
                // Adicione outros campos da disciplina que você deseja armazenar
            }
        }),
    });

    if (responsePut.ok) {
        console.log('Turma atualizada com sucesso.');
    } else {
        const errorData = await responsePut.json();
        console.error('Erro ao atualizar a turma:', errorData.message);
    }
}
