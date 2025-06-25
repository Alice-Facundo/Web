let alunosData = [];
let nextId = 1;

async function loadInitialData() {
    try {
        const response = await fetch('aluno.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        alunosData = await response.json();
        const maxId = alunosData.reduce((max, aluno) => Math.max(max, aluno.id), 0);
        nextId = maxId + 1;
    } catch (e) {
        alunosData = [];
    }
}

const alunoService = {
    async listarAlunos() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([...alunosData]);
            }, 300);
        });
    },

    async criarAluno(aluno) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!aluno.nome || !aluno.curso || aluno.ira === undefined) {
                    reject({ message: "Dados incompletos para criar aluno." });
                    return;
                }
                const novoAluno = { id: nextId++, ...aluno };
                alunosData.push(novoAluno);
                resolve(novoAluno);
            }, 300);
        });
    },

    async editarAluno(id, dadosAtualizados) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = alunosData.findIndex(a => a.id === id);
                if (index !== -1) {
                    alunosData[index] = { ...alunosData[index], ...dadosAtualizados, id: id };
                    resolve(alunosData[index]);
                } else {
                    reject({ message: `Aluno com ID ${id} não encontrado.` });
                }
            }, 300);
        });
    },

    async apagarAluno(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const initialLength = alunosData.length;
                alunosData = alunosData.filter(a => a.id !== id);
                if (alunosData.length < initialLength) {
                    resolve({ message: `Aluno com ID ${id} apagado com sucesso.` });
                } else {
                    reject({ message: `Aluno com ID ${id} não encontrado.` });
                }
            }, 300);
        });
    },

    async buscarAlunoPorId(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const aluno = alunosData.find(a => a.id === id);
                if (aluno) {
                    resolve({ ...aluno });
                } else {
                    reject({ message: `Aluno com ID ${id} não encontrado.` });
                }
            }, 300);
        });
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    await loadInitialData();
    listarAlunosNoFrontend();
    setupAlunoForm();

    document.getElementById('btnNovoAluno').addEventListener('click', () => showForm());
    document.getElementById('btnCancelarForm').addEventListener('click', () => hideForm());
});

async function listarAlunosNoFrontend() {
    const tabelaCorpo = document.getElementById('tabelaAlunosCorpo');
    if (!tabelaCorpo) return;

    tabelaCorpo.innerHTML = '<tr><td colspan="5">Carregando alunos...</td></tr>';

    try {
        const alunos = await alunoService.listarAlunos();
        tabelaCorpo.innerHTML = '';

        if (alunos.length === 0) {
            tabelaCorpo.innerHTML = '<tr><td colspan="5">Nenhum aluno cadastrado.</td></tr>';
            return;
        }

        alunos.forEach(aluno => {
            const row = tabelaCorpo.insertRow();
            row.insertCell(0).textContent = aluno.id;
            row.insertCell(1).textContent = aluno.nome;
            row.insertCell(2).textContent = aluno.curso;
            row.insertCell(3).textContent = aluno.ira;
            const acoesCell = row.insertCell(4);

            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.classList.add('btn-editar');
            btnEditar.onclick = () => editarAlunoFrontend(aluno.id);
            acoesCell.appendChild(btnEditar);

            const btnApagar = document.createElement('button');
            btnApagar.textContent = 'Apagar';
            btnApagar.classList.add('btn-apagar');
            btnApagar.onclick = () => apagarAlunoFrontend(aluno.id);
            acoesCell.appendChild(btnApagar);
        });
    } catch (error) {
        tabelaCorpo.innerHTML = `<tr><td colspan="5">Erro ao carregar dados: ${error.message || error}</td></tr>`;
    }
}

async function apagarAlunoFrontend(id) {
    if (confirm(`Tem certeza que deseja apagar o aluno com ID ${id}?`)) {
        try {
            await alunoService.apagarAluno(id);
            alert('Aluno apagado com sucesso!');
            listarAlunosNoFrontend();
            hideForm();
        } catch (error) {
            alert(`Erro ao apagar aluno: ${error.message || error}`);
        }
    }
}

async function editarAlunoFrontend(id) {
    const formTitle = document.getElementById('formTitle');
    const saveButton = document.getElementById('saveButton');
    const alunoIdInput = document.getElementById('alunoId');
    const nomeInput = document.getElementById('nome');
    const cursoInput = document.getElementById('curso');
    const iraInput = document.getElementById('ira');

    formTitle.textContent = 'Editar Aluno';
    saveButton.textContent = 'Salvar Alterações';
    alunoIdInput.value = id;

    try {
        const aluno = await alunoService.buscarAlunoPorId(id);
        nomeInput.value = aluno.nome;
        cursoInput.value = aluno.curso;
        iraInput.value = aluno.ira;
        showForm();
    } catch (error) {
        alert(`Erro ao carregar aluno para edição: ${error.message || error}`);
    }
}

function setupAlunoForm() {
    const form = document.getElementById('alunoForm');
    const alunoIdInput = document.getElementById('alunoId');
    const nomeInput = document.getElementById('nome');
    const cursoInput = document.getElementById('curso');
    const iraInput = document.getElementById('ira');
    const formTitle = document.getElementById('formTitle');
    const saveButton = document.getElementById('saveButton');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const alunoData = {
            nome: nomeInput.value,
            curso: cursoInput.value,
            ira: parseFloat(iraInput.value)
        };

        try {
            if (alunoIdInput.value) {
                await alunoService.editarAluno(parseInt(alunoIdInput.value), alunoData);
                alert('Aluno atualizado com sucesso!');
            } else {
                await alunoService.criarAluno(alunoData);
                alert('Aluno cadastrado com sucesso!');
            }
            listarAlunosNoFrontend();
            hideForm();
        } catch (error) {
            alert(`Erro ao salvar aluno: ${error.message || error}`);
        }
    });
}

function showForm() {
    document.getElementById('formContainer').classList.add('active');
    document.getElementById('formTitle').textContent = 'Cadastrar Novo Aluno';
    document.getElementById('saveButton').textContent = 'Cadastrar';
    document.getElementById('alunoId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('curso').value = '';
    document.getElementById('ira').value = '';
}

function hideForm() {
    document.getElementById('formContainer').classList.remove('active');
    document.getElementById('alunoForm').reset();
}