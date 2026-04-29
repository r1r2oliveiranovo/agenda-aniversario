document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tabela-aniversariantes')) {
        carregarPessoas();
    }
});

async function carregarPessoas() {
    try {
        const response = await fetch('/api/pessoas');
        const pessoas = await response.json();
        const tabela = document.getElementById('tabela-aniversariantes');
        
        tabela.innerHTML = pessoas.map(p => `
            <tr>
                <td>${p.nome}</td>
                <td>${p.cpf}</td>
                <td>${new Date(p.nascimento).toLocaleDateString('pt-BR')}</td>
                <td>${p.telefone}</td>
                <td><span class="badge">${p.pessoa_tipo_id}</span></td>
                <td><button onclick="excluir(${p.id})"><i class="fas fa-trash"></i></button></td>
            </tr>
        `).join('');
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}