// ==========================================
// 1. CADASTRO DE NOVAS PESSOAS
// ==========================================
document.getElementById('form-cadastro')?.addEventListener('submit', async function(e) {
    e.preventDefault(); 

    // Pega os valores dos campos do formulário
    const nome = this.querySelector('#nome').value;
    const cpf = this.querySelector('#cpf').value;
    const nascimento = this.querySelector('#nascimento').value;
    const telefone = this.querySelector('#telefone').value;
    const pessoa_tipo_id = this.querySelector('#pessoa_tipo_id').value;

    const dados = { nome, cpf, nascimento, telefone, pessoa_tipo_id };

    try {
        const resposta = await fetch('http://localhost:3000/api/pessoas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            alert('🎉 Salvo com sucesso no Banco de Dados Railway!');
            window.location.href = 'dashboard.html';
        } else {
            alert('❌ Erro ao salvar. Verifique se o CPF já existe.');
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('O servidor está desligado! No terminal, digite: node server.js');
    }
});

// ==========================================
// 2. CARREGAR DADOS NA DASHBOARD
// ==========================================
async function carregarDashboard() {
    const tabelaCorpo = document.querySelector('#tabela-aniversariantes');
    
    // Só continua se a tabela existir na página atual (evita erros em outras páginas)
    if (!tabelaCorpo) return; 

    try {
        const resposta = await fetch('http://localhost:3000/api/pessoas');
        const pessoas = await resposta.json();

        // Limpa a tabela antes de preencher para não duplicar
        tabelaCorpo.innerHTML = '';

        pessoas.forEach(pessoa => {
            // Formatar a data para o padrão brasileiro (DD/MM/AAAA)
            const data = new Date(pessoa.nascimento);
            const dataFormatada = data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

            const linha = `
                <tr>
                    <td>${pessoa.nome}</td>
                    <td>${pessoa.cpf}</td>
                    <td>${dataFormatada}</td>
                    <td>${pessoa.telefone || '-'}</td>
                    <td><span class="tag-tipo">${pessoa.pessoa_tipo_id == 1 ? 'Funcionário' : 'Cliente'}</span></td>
                    <td>
                        <button class="btn-edit" title="Editar"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" title="Excluir"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
            tabelaCorpo.innerHTML += linha;
        });
    } catch (error) {
        console.error('Erro ao buscar dados do servidor:', error);
        tabelaCorpo.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Erro ao carregar dados. O servidor node está rodando?</td></tr>';
    }
}

// Inicia a busca de dados assim que o navegador terminar de carregar o HTML
document.addEventListener('DOMContentLoaded', carregarDashboard);