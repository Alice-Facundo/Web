// Função que retorna uma Promise que resolve ou rejeita após 4 segundos
function obterProdutosComDelay() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const numero = Math.floor(Math.random() * 100);
      console.log("Número gerado:", numero);

      if (numero % 2 === 0) {
        const produtos = [
          { id: 1, nome: "Notebook", tipo: "Eletrônico", preco: 4500 },
          { id: 2, nome: "Mouse", tipo: "Periférico", preco: 120 },
          { id: 3, nome: "Teclado", tipo: "Periférico", preco: 200 },
          { id: 4, nome: "Monitor", tipo: "Eletrônico", preco: 900 },
          { id: 5, nome: "Celular", tipo: "Eletrônico", preco: 3200 },
          { id: 6, nome: "Cadeira", tipo: "Móvel", preco: 800 },
          { id: 7, nome: "Mesa", tipo: "Móvel", preco: 1500 },
          { id: 8, nome: "HD Externo", tipo: "Acessório", preco: 400 },
          { id: 9, nome: "SSD", tipo: "Acessório", preco: 600 },
          { id: 10, nome: "Webcam", tipo: "Periférico", preco: 250 }
        ];
        resolve(produtos);
      } else {
        reject({ res: "ERROR", msg: "Erro no sistema" });
      }
    }, 4000); // 4 segundos de delay
  });
}

// Função principal que consome a Promise usando async/await
async function carregarProdutos() {
  try {
    const produtos = await obterProdutosComDelay();
    criarTabela(produtos);
  } catch (erro) {
    document.getElementById("erro-container").innerText = erro.msg;
  }
}

// Função que monta a tabela HTML com os produtos
function criarTabela(produtos) {
  const container = document.getElementById("tabela-container");

  // Cálculos
  const precos = produtos.map(p => p.preco);
  const media = precos.reduce((a, b) => a + b, 0) / precos.length;
  const maxPreco = Math.max(...precos);
  const minPreco = Math.min(...precos);

  let tabela = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Tipo</th>
          <th>Preço</th>
        </tr>
      </thead>
      <tbody>
  `;

  produtos.forEach(produto => {
    let classes = "";

    if (produto.preco > media) classes += " acima-media";
    if (produto.preco === maxPreco) classes += " mais-caro";
    if (produto.preco === minPreco) classes += " mais-barato";

    tabela += `
      <tr class="${classes.trim()}">
        <td>${produto.id}</td>
        <td>${produto.nome}</td>
        <td>${produto.tipo}</td>
        <td>R$ ${produto.preco.toFixed(2)}</td>
      </tr>
    `;
  });

  tabela += "</tbody></table>";

  // Adiciona a tabela ao HTML
  container.innerHTML = tabela;
}

carregarProdutos();
