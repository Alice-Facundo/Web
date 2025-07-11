// Lista de URLs de imagens (duplique para 16 cartas)
const imagens = [
  "https://www.cartacapital.com.br/wp-content/uploads/2022/08/000_32FZ7YG.jpg",
  "https://assets.brasildefato.com.br/2024/09/image_processing20220427-23666-q6aoo7.jpeg",
  "https://www.cartacapital.com.br/wp-content/uploads/2025/03/54409368261_d52d9bcef5_k-1024x683.jpg",
  "https://www.gov.br/planalto/pt-br/acompanhe-o-planalto/noticias/2021/12/presidente-jair-bolsonaro-faz-pronunciamento-de-ano-novo-e-deseja-um-excelente-2022-a-nacao/51796415803_00c721e0cc_k.jpg/@@images/7c863a3a-ba3a-4dcd-b447-0a21e3b7879c.jpeg",
  "https://pt.org.br/wp-content/uploads/2023/02/lula-entrevista-presidenciaveis-cnn-ricardostuckert-8.jpg",
  "https://f.i.uol.com.br/fotografia/2024/12/21/17347855326766b9fc98812_1734785532_3x2_md.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/9/9e/Foto_oficial_de_Luiz_In%C3%A1cio_Lula_da_Silva_%28ombros%29_denoise.jpg",
  "https://lncimg.lance.com.br/cdn-cgi/image/width=950,quality=75,fit=pad,format=webp/uploads/2025/05/Lula-aspect-ratio-512-320.jpg"
];

const cartas = embaralhar([...imagens, ...imagens]);
const tabuleiro = document.getElementById("tabuleiro");

let cartaVirada1 = null;
let cartaVirada2 = null;
let bloqueio = false;

// Gera o tabuleiro usando innerHTML com imagens
tabuleiro.innerHTML = cartas.map((url, index) => `
  <div class="carta" data-icone="${url}" data-index="${index}">
    <div class="face frente"></div>
    <div class="face verso"><img src="${url}" alt="img"></div>
  </div>
`).join("");

// Eventos de clique
document.querySelectorAll(".carta").forEach(carta => {
  carta.addEventListener("click", () => virarCarta(carta));
});

function virarCarta(carta) {
  if (bloqueio || carta.classList.contains("virada")) return;

  carta.classList.add("virada");

  if (!cartaVirada1) {
    cartaVirada1 = carta;
  } else {
    cartaVirada2 = carta;
    bloqueio = true;

    const icone1 = cartaVirada1.dataset.icone;
    const icone2 = cartaVirada2.dataset.icone;

    if (icone1 === icone2) {
      cartaVirada1 = null;
      cartaVirada2 = null;
      bloqueio = false;
    } else {
      setTimeout(() => {
        cartaVirada1.classList.remove("virada");
        cartaVirada2.classList.remove("virada");
        cartaVirada1 = null;
        cartaVirada2 = null;
        bloqueio = false;
      }, 1000);
    }
  }
}

function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
