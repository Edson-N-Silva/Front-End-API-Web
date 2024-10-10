const API_URL = 'https://back-end-pi-web.onrender.com/api/disciplinas/disciplinas';
const API_TURMAS_ALUNOS = 'https://back-end-pi-web.onrender.com/api/turmas/alunos';
const API_CONCEITOS = 'https://back-end-pi-web.onrender.com/api/conceitos/conceitos';


document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
});

document.addEventListener('DOMContentLoaded', function() {
    const userType = localStorage.getItem('userType'); // Obtém o tipo do usuário
    carregarDisciplinas(userType); // Passa o tipo do usuário para a função de carregar disciplinas
});

document.addEventListener('DOMContentLoaded', function() {
    carregarDisciplinas();
});

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
            const headers = ['Disciplina', 'Professor', 'Turma', 'Visualizar'];

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

                const visualizarCell = document.createElement('td');
                const visualizarLink = document.createElement('a');
                visualizarLink.textContent = 'Visualizar';
                visualizarLink.href = '#';
                visualizarLink.setAttribute('class', 'btn-link');
                visualizarLink.addEventListener('click', function() {
                    abrirModal(disciplina.turma._id, disciplina._id); // Passa o ID da turma e da disciplina
                });
                visualizarCell.appendChild(visualizarLink);
                row.appendChild(visualizarCell);

                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            container.appendChild(table);
        })
        .catch(err => console.error('Erro ao buscar disciplinas:', err));
}

// Função para abrir o modal e carregar os alunos da turma
function abrirModal(turmaId, disciplinaId) {
    const token = localStorage.getItem('token');
    fetch(`${API_TURMAS_ALUNOS}/${turmaId}`, {
        headers: {
            'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
        }
    })
        .then(response => response.json())
        .then(alunos => {
            const alunosList = document.getElementById('alunosList');
            alunosList.innerHTML = ''; // Limpa a lista de alunos

            // Cria a tabela
            const table = document.createElement('table');
            table.setAttribute('border', '1');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Nome do Aluno</th>
                        <th>Conceito 1</th>
                        <th>Conceito 2</th>
                        <th>Conceito 3</th>
                        <th>Recuperação</th>
                        <th>Conceito Final</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            `;

            const tbody = table.querySelector('tbody');

            alunos.forEach(aluno => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${aluno.nome}</td>
                    <td>
                        <select data-aluno-id="${aluno._id}" class="conceito-select">
                            <option value="0">SEM NOTA</option> 
                            <option value="1">Insuficiente</option>
                            <option value="2">Não-Suficiente</option>
                            <option value="3">Bom</option>
                            <option value="4">Ótimo</option>
                            <option value="5">Excelente</option>
                        </select>
                    </td>
                    <td>
                        <select data-aluno-id="${aluno._id}" class="conceito-select">
                            <option value="0">SEM NOTA</option> 
                            <option value="1">Insuficiente</option>
                            <option value="2">Não-Suficiente</option>
                            <option value="3">Bom</option>
                            <option value="4">Ótimo</option>
                            <option value="5">Excelente</option>
                        </select>
                    </td>
                    <td>
                        <select data-aluno-id="${aluno._id}" class="conceito-select">
                            <option value="0">SEM NOTA</option> 
                            <option value="1">Insuficiente</option>
                            <option value="2">Não-Suficiente</option>
                            <option value="3">Bom</option>
                            <option value="4">Ótimo</option>
                            <option value="5">Excelente</option>
                        </select>
                    </td>
                    <td>
                        <select data-aluno-id="${aluno._id}" class="conceito-select">
                            <option value="0">SEM NOTA</option> 
                            <option value="1">Insuficiente</option>
                            <option value="2">Não-Suficiente</option>
                            <option value="3">Bom</option>
                            <option value="4">Ótimo</option>
                            <option value="5">Excelente</option>
                        </select>
                    </td>
                    <td>
                        <select data-aluno-id="${aluno._id}" class="conceito-select conceito-final">
                            <option value="0">SEM NOTA</option> 
                            <option value="1">Insuficiente</option>
                            <option value="2">Não-Suficiente</option>
                            <option value="3">Bom</option>
                            <option value="4">Ótimo</option>
                            <option value="5">Excelente</option>
                        </select>
                    </td>
                `;
                tbody.appendChild(row);

                // Adicionar eventos de mudança para recalcular o conceito final
                const conceitoSelects = row.querySelectorAll('.conceito-select:not(.conceito-final)');
                conceitoSelects.forEach(select => {
                    select.addEventListener('change', () => {
                        calcularConceitoFinal(row); // Recalcula o conceito final quando um select muda
                    });
                });

                // Preencher os selects com os valores dos conceitos salvos, se existirem
                const token = localStorage.getItem('token');
                fetch(`https://back-end-pi-web.onrender.com/api/conceitos/conceitos/aluno/${aluno._id}?disciplina=${disciplinaId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
                    }
                })
                    .then(response => response.json())
                    .then(conceitos => {
                        if (conceitos.length > 0) {
                            const conceitoSalvo = conceitos[0];
                            const selects = row.querySelectorAll(`select[data-aluno-id="${aluno._id}"]`);
                            selects[0].value = conceitoSalvo.conceito1 || 0;
                            selects[1].value = conceitoSalvo.conceito2 || 0;
                            selects[2].value = conceitoSalvo.conceitoParcial || 0;
                            selects[3].value = conceitoSalvo.conceitoRec || 0;
                            selects[4].value = conceitoSalvo.conceitoFinal || 0;
                        }
                    });
            });

            // Adiciona a tabela ao modal
            alunosList.appendChild(table);
            const modal = document.getElementById('disciplinasModal');
            modal.style.display = 'block';

            // Adiciona evento de salvar
            document.getElementById('salvarConceitos').onclick = function() {
                salvarConceitos(alunos, disciplinaId);
            };
        })
        .catch(err => console.error('Erro ao buscar alunos:', err));
}

// Função para calcular o conceito final
function calcularConceitoFinal(row) {
    const conceitoSelects = row.querySelectorAll('.conceito-select:not(.conceito-final)');
    let total = 0;
    let count = 0;

    conceitoSelects.forEach(select => {
        const value = parseInt(select.value, 10);
        if (!isNaN(value)) {
            total += value;
            count++;
        }
    });

    // Calcula a média
    const media = count > 0 ? (total / count).toFixed(2) : 0;

    // Atualiza o select do conceito final
    const conceitoFinalSelect = row.querySelector('.conceito-final');
    conceitoFinalSelect.value = Math.round(media); // Arredonda para o valor mais próximo
}



// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById('disciplinasModal');
    modal.style.display = 'none'; // Esconde o modal
}

// Adiciona o evento de clique ao botão de fechar
document.getElementById('closeDisciplinasModal').addEventListener('click', fecharModal);

// Opcional: fecha o modal quando o usuário clica fora do modal
window.onclick = function(event) {
    const modal = document.getElementById('disciplinasModal');
    if (event.target === modal) {
        fecharModal();
    }
};

// Função para salvar conceitos
function salvarConceitos(alunos, disciplinaId) {
    // Cria um array para armazenar os conceitos a serem salvos
    const conceitos = alunos.map(aluno => {
        const conceitoSelects = document.querySelectorAll(`select[data-aluno-id="${aluno._id}"]`);
        return {
            aluno: aluno._id,
            disciplina: disciplinaId,
            conceito1: parseInt(conceitoSelects[0].value, 10),
            conceito2: parseInt(conceitoSelects[1].value, 10),
            conceitoParcial: parseInt(conceitoSelects[2].value, 10),
            conceitoRec: parseInt(conceitoSelects[3].value, 10),
            conceitoFinal: parseInt(conceitoSelects[4].value, 10),
        };
    });

    // Faz a requisição para salvar os conceitos
    const token = localStorage.getItem('token');
    fetch('https://back-end-pi-web.onrender.com/api/conceitos/conceitos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(conceitos),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao salvar conceitos');
            }
            return response.json();
        })
        .then(conceitosSalvos => {
            // Atualiza os selects com os valores salvos
            conceitosSalvos.forEach(conceitoSalvo => {
                const selects = document.querySelectorAll(`select[data-aluno-id="${conceitoSalvo.aluno}"]`);
                selects[0].value = conceitoSalvo.conceito1 || 0;
                selects[1].value = conceitoSalvo.conceito2 || 0;
                selects[2].value = conceitoSalvo.conceitoParcial || 0;
                selects[3].value = conceitoSalvo.conceitoRec || 0;
                selects[4].value = conceitoSalvo.conceitoFinal || 0;
            });
            alert('Conceitos salvos com sucesso!'); // Exibe uma mensagem de sucesso
        })
        .catch(err => console.error('Erro ao salvar conceitos:', err));
}

// Função para calcular o conceito final
function calcularConceitoFinal(row) {
    const conceitoSelects = row.querySelectorAll('.conceito-select'); // Seleciona todos os selects de conceitos
    let total = 0;
    let count = 0;

    // Considera sempre o Conceito 1 e Conceito 2
    for (let i = 0; i < 2; i++) {
        const value = parseInt(conceitoSelects[i].value, 10);
        if (value > 0) { // Apenas considera valores maiores que 0
            total += value;
            count++;
        }
    }

    // Considera o Conceito 3 se for maior que 0
    const conceito3 = parseInt(conceitoSelects[2].value, 10);
    if (conceito3 > 0) {
        total += conceito3;
        count++;
    }

    // Considera a Recuperação se for maior que 0
    const conceitoRec = parseInt(conceitoSelects[3].value, 10);
    if (conceitoRec > 0) {
        total += conceitoRec;
        count++;
    }

    // Calcula a média
    const media = count > 0 ? (total / count).toFixed(2) : 0;

    // Atualiza o select do conceito final
    const conceitoFinalSelect = row.querySelector('.conceito-final');
    conceitoFinalSelect.value = Math.round(media); // Arredonda para o valor mais próximo
}
