let paginaAtual = 'inicio';
let livroSelecionado = null;
let capitulosDisponiveis = {};
let reflexoes = [];
let versiculos = [];

// Carregar página inicial automaticamente
window.addEventListener('DOMContentLoaded', function () {
  carregarPagina('inicio');
});


// Função para carregar página principal
function carregarPagina(pagina) {
  paginaAtual = pagina || 'inicio';
  livroSelecionado = null;
  const conteudo = document.getElementById("conteudo");
  let html = '';

  if (pagina === 'inicio') {
    fetch('inicio.html')
      .then(res => res.text())
      .then(html => {
        document.getElementById("conteudo").innerHTML = html;
        aplicarModoEscuroDinamico();
      })
      .catch(err => {
        console.error('Erro ao carregar início:', err);
        document.getElementById("conteudo").innerHTML = '<p>Erro ao carregar página inicial.</p>';
      });
  } else if (pagina === 'reflexoes') {
    fetch('reflexoes.html')
      .then(res => {
        if (!res.ok) throw new Error("Página não encontrada.");
        return res.text();
      })
      .then(htmlContent => {
        document.getElementById("conteudo").innerHTML = htmlContent;

        // Reaplica modo escuro aos novos elementos, se estiver ativo
        if (document.body.classList.contains('dark-mode')) {
          document.querySelectorAll('.card').forEach(el => el.classList.add('dark-mode'));
        }
      })
      .catch(err => {
        console.error(err);
        document.getElementById("conteudo").innerHTML = `<p>Erro ao carregar a página de Reflexões.</p>`;
      });
  } else if (pagina === 'testemunho') {
    fetch('testemunho.html')
      .then(res => {
        if (!res.ok) throw new Error("Página não encontrada.");
        return res.text();
      })
      .then(htmlContent => {
        document.getElementById("conteudo").innerHTML = htmlContent;

        // Reaplica modo escuro aos novos elementos, se estiver ativo
        if (document.body.classList.contains('dark-mode')) {
          document.querySelectorAll('.card').forEach(el => el.classList.add('dark-mode'));
        }
      })
      .catch(err => {
        console.error(err);
        document.getElementById("conteudo").innerHTML = `<p>Erro ao carregar a página de testemunho.</p>`;
      });
  } else if (pagina === 'biblia') {
    html = `<h2>Livros da Bíblia</h2>`;

    fetch('indice-capitulos.json')
      .then(res => res.json())
      .then(data => {
        capitulosDisponiveis = data;

        // Mapeamento de ícones por livro
        const iconesLivros = {
          'atos': 'livros/icone-atos.png',
          'exodo': 'livros/icone-exodo.png',
          'joao': 'livros/icone-joao.png',
          'mateus': 'livros/icone-mateus.png',
          'marcos': 'livros/icone-marcos.png',
          'lucas': 'livros/icone-lucas.png',
          'romanos': 'livros/icone-romanos.png',
          '1corintios': 'livros/icone-1corintios.png',
          'default': 'livros/icone-biblia.png'
        };

        // Mapeamento de descrições por livro
        const descricoesLivros = {
          'lucas': 'Um evangelho que revela com sensibilidade e compaixão o amor de Jesus pelos marginalizados, feridos e esquecidos. Aqui, vemos um Cristo que cura, restaura, acolhe e oferece salvação a todos, sem distinção. Suas páginas transbordam misericórdia, mostrando que o Filho do Homem veio buscar e salvar o que se havia perdido, tocando corações com uma mensagem de esperança, perdão e redenção.',
          'joao': 'Um evangelho que revela, de forma íntima e profunda, a divindade e o amor incondicional de Jesus Cristo. Suas palavras tocam diretamente a alma, mostrando que Ele é o Verbo de Deus, a Luz que dissipa as trevas e a Fonte da vida eterna. Cada capítulo nos convida a conhecer um Deus que se fez carne, habitou entre nós, e nos chama a crer para que, através da fé, encontremos a verdadeira esperança, consolo e salvação.',
          'mateus': 'Um evangelho que apresenta Jesus como o Messias prometido, cumpridor das profecias, Rei e Salvador de toda a humanidade. Suas palavras revelam um Cristo que ensina com autoridade, conduzindo seus discípulos no caminho da verdade, da justiça e do amor. Em cada ensinamento, há um chamado ao arrependimento, à transformação de vida e à construção de um Reino onde prevalecem a misericórdia, a fé e a esperança.',
          'marcos': 'Um evangelho que revela Jesus em ação, com poder, autoridade e compaixão. Suas páginas nos conduzem a testemunhar um Cristo que cura, liberta, restaura e enfrenta o mal com amor e entrega. De forma direta e intensa, Marcos nos mostra que o Filho de Deus não veio para ser servido, mas para servir e dar a sua vida em resgate por muitos, trazendo uma mensagem viva de esperança, salvação e transformação.',
          'atos': 'Um relato poderoso que revela a continuidade da missão de Jesus através dos apóstolos, conduzidos e fortalecidos pelo Espírito Santo. Suas páginas transbordam fé, coragem e transformação, mostrando como o evangelho rompe barreiras, alcança nações e toca corações. É a história viva de uma igreja que nasce, cresce e se espalha, levando esperança, amor e salvação a todos os povos, cumprindo o chamado de Deus para a humanidade.',
          'romanos': 'Uma carta que revela, de forma majestosa e transformadora, a profundidade da graça, da justiça e do amor de Deus. Suas palavras nos conduzem a compreender que todos carecem da glória de Deus, mas que, pela fé em Jesus Cristo, somos justificados, perdoados e reconciliados. Romanos é um chamado à verdadeira transformação da mente e do coração, revelando que a salvação não é mérito humano, mas um presente divino que restaura, liberta e conduz à vida eterna.',
          '1corintios': 'Uma carta que toca profundamente o coração, revelando os desafios e as fragilidades humanas diante da fé. Suas palavras são um chamado à unidade, ao amor e à pureza espiritual, mostrando que, acima de todo conhecimento e dons, o amor é o caminho mais excelente. Aqui, aprendemos que a verdadeira igreja é edificada na humildade, no serviço e na renúncia, sendo guiada pela graça e pela presença viva de Cristo no meio de seu povo.'
          // Adicione conforme os livros que você tem no índice
        };

        for (const livro in data) {
          const livroFormatado1 = capitalizeFirstLetter(livro);
          const livroFormatado = corrigirNomeLivro(livroFormatado1);
          const icone = iconesLivros[livro] || iconesLivros['default'];
          const descricao = descricoesLivros[livro] || 'Livro bíblico';

          html += `
            <div class="card-livro">
              <button class="botao-livro" onclick="toggleCapitulos('${livro}', this)">
                <img src="${icone}" alt="${livroFormatado}" class="icone-livro" />
                <div class="nome-e-descricao">
                  <div class="nome-livro">${livroFormatado}</div>
                  <div class="descricao-livro">${descricao}</div>
                </div>
              </button>
              <div class="lista-capitulos" id="capitulos-${livro}">
          `;

          data[livro].forEach(num => {
            html += `<button onclick="carregarCapitulo('${livro}', ${num})">Capítulo ${num}</button>`;
          });

          html += `</div></div>`;
        }

        conteudo.innerHTML = html;
        aplicarModoEscuroDinamico();
      })
      .catch(err => {
        console.error('Erro ao carregar índice:', err);
        conteudo.innerHTML = `<p>Erro ao carregar lista de livros.</p>`;
      });

      if (document.body.classList.contains('dark-mode')) {
        document.querySelectorAll('.card-livro button.botao-livro').forEach(el => {
          el.classList.add('dark-mode');
        });
      }

  } else if (pagina === 'terco') {
    fetch('terco.html')
      .then(res => res.text())
      .then(htmlContent => {
        document.getElementById("conteudo").innerHTML = htmlContent;
        aplicarModoEscuroDinamico();
      })
      .catch(err => {
        console.error('Erro ao carregar terço:', err);
        document.getElementById("conteudo").innerHTML = '<p>Erro ao carregar o Terço Virtual.</p>';
      });
  }

  conteudo.innerHTML = html || '';
  aplicarModoEscuroDinamico();
}

// Função para listar capítulos de um livro
function listarCapitulos(livro) {
  livroSelecionado = livro;
  const conteudo = document.getElementById("conteudo");

  const capitulos = capitulosDisponiveis[livro] || [];

  let html = `<h2>Capítulos de ${capitalizeFirstLetter(livro)}</h2>`;
  html += `<ul class="biblia-lista">`;

  capitulos.forEach(num => {
    html += `<li><button onclick="carregarCapitulo('${livro}', ${num})">${capitalizeFirstLetter(livro)} ${num}</button></li>`;
  });

  html += `</ul>`;
  conteudo.innerHTML = html;
}

// Função para carregar versículos de um capítulo
function carregarCapitulo(livro, numero) {
  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = `<p>Carregando ${capitalizeFirstLetter(livro)} Capítulo ${numero}...</p>`;

  fetch(`capitulos/${livro}${numero}.json`)
    .then(res => {
      if (!res.ok) throw new Error("Arquivo não encontrado.");
      return res.json();
    })
    .then(data => {
      let html = `<h2>${data.livro} (capítulo ${data.capitulo})</h2>`;
      data.versiculos.forEach(v => {
        const temReflexao = v.reflexao ? `
          <button onclick="mostrarReflexao(this)" class="botao-reflexao">
            <span class="icone-reflexao">+</span> Mostrar Reflexão
          </button>
          <div class="reflexao-oculta">
            <p class="texto-reflexao">${v.reflexao}</p>
          </div>
          <button onclick="copiarVersiculo(event, '${livro}', '${data.capitulo}', '${v.numero}', \`${v.texto}\`, \`${v.reflexao || ''}\`)" class="botao-copiar">
            📋 Copiar Versículo
          </button>
        ` : '';

        html += `
          <div class="card" onclick="mostrarOverlay('${data.livro}', '${data.capitulo}', '${v.numero}')">
            <h3>${v.numero}</h3>
            <p>"${v.texto}"</p>
            ${temReflexao}
          </div>
        `;
      });

      // Após montar todo o HTML dos versículos
      const livroCorrigido = corrigirNomeLivro(livro);
      html += `
        <div class="card">
          <p><em>Fim do capítulo ${numero} de ${livroCorrigido}</em></p>
      `;

      // Verifica se há próximo capítulo
      const indiceAtual = capitulosDisponiveis[livro].indexOf(parseInt(numero));
      const proximoIndice = indiceAtual + 1;

      if (capitulosDisponiveis[livro][proximoIndice]) {
        html += `
          <button onclick="carregarProximoCapitulo('${livro}', ${parseInt(numero)})" class="botao-proximo">
            ⬆️ Próximo Capítulo
          </button>
        `;
      } else {
        html += `
          <p>Este é o último capítulo disponível.</p>
          <button onclick="carregarPagina('biblia')" class="botao-reiniciar">
            Voltar aos livros
          </button>
        `;
      }

      html += `</div>`;

   
      // Inserir conteúdo
      conteudo.innerHTML = html;

      // Reaplicar modo escuro aos novos elementos
      if (document.body.classList.contains('dark-mode')) {
        const novosCards = conteudo.querySelectorAll('.card');
        const botoesReflexao = conteudo.querySelectorAll('.botao-reflexao');
        const reflexoes = conteudo.querySelectorAll('.reflexao-oculta');

        novosCards.forEach(el => el.classList.add('dark-mode'));
        botoesReflexao.forEach(el => el.classList.add('dark-mode'));
        reflexoes.forEach(el => el.classList.add('dark-mode'));
      }
    })
    .catch(err => {
      console.error(err);
      conteudo.innerHTML = `<p>Erro ao carregar o capítulo ${numero} de ${capitalizeFirstLetter(livro)}.</p>`;
    });
}

// Função auxiliar: Capitaliza primeira letra
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function toggleCapitulos(livro, botao) {
  const lista = document.getElementById(`capitulos-${livro}`);
  const isOpen = lista.style.display === 'flex';

  // Fecha todos os outros menus abertos
  document.querySelectorAll('.lista-capitulos').forEach(el => {
    el.style.display = 'none';
  });

  // Abre o atual, se estava fechado
  if (!isOpen) {
    lista.style.display = 'flex';
  }
}

function mostrarReflexao(botao) {
  event.stopPropagation(); // Impede propagação para o card

  const icone = botao.querySelector('.icone-reflexao');
  const container = botao.nextElementSibling;

  if (!container || !container.classList.contains('reflexao-oculta')) {
    console.error("Container da reflexão não encontrado!");
    return;
  }

  const estaAberta = icone.textContent.trim() === '–';

  // Fecha outras reflexões abertas
  document.querySelectorAll('.reflexao-oculta').forEach(el => {
    el.classList.remove('mostrar');
    const outrosIcones = el.previousElementSibling?.querySelector('.icone-reflexao');
    if (outrosIcones) outrosIcones.textContent = '+';
  });

  // Abre/reflete a atual
  if (!estaAberta) {
    icone.textContent = '–';
    container.classList.add('mostrar');
  } else {
    icone.textContent = '+';
    container.classList.remove('mostrar');
  }
}

// Fecha reflexões ao clicar fora delas
document.addEventListener('click', function(event) {
  const dentroDeCard = event.target.closest('.card');

  // Se clicou fora de qualquer card
  if (!dentroDeCard) {
    // Fecha todas as reflexões abertas
    document.querySelectorAll('.reflexao-oculta').forEach(el => {
      el.classList.remove('mostrar');
    });

    // Atualiza todos os ícones para "+"
    document.querySelectorAll('.icone-reflexao').forEach(icon => {
      icon.textContent = '+';
    });
  }
});


// Verifica preferência salva
function checkDarkMode() {
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) enableDarkMode();
  else disableDarkMode();

  // Atualiza os dois botões na inicialização
  const btnMobile = document.getElementById("darkModeBtnMobile");
  const btnDesktop = document.getElementById("darkModeBtnDesktop");

  if (btnMobile) btnMobile.textContent = isDark ? '🌙' : '☀️';
  if (btnDesktop) btnDesktop.textContent = isDark ? '🌙' : '☀️';
}

// Ativa modo escuro
function enableDarkMode() {
  document.body.classList.add('dark-mode');
  document.querySelector('.navbar').classList.add('dark-mode');
  document.querySelectorAll('.card, .botao-reflexao, .reflexao-oculta').forEach(el => {
    el.classList.add('dark-mode');
  });
  document.getElementById('darkModeBtn').innerText = '🌙';

  document.querySelectorAll('.card-livro button.botao-livro').forEach(el => {
  el.classList.add('dark-mode');
});
}

// Desativa modo escuro
function disableDarkMode() {
  document.body.classList.remove('dark-mode');
  document.querySelector('.navbar').classList.remove('dark-mode');
  document.querySelectorAll('.card, .botao-reflexao, .reflexao-oculta').forEach(el => {
    el.classList.remove('dark-mode');
  });
  document.getElementById('darkModeBtn').innerText = '☀️';

  document.querySelectorAll('.card-livro button.botao-livro').forEach(el => {
  el.classList.remove('dark-mode');
});
}

// Alterna entre os modos
function toggleDarkMode() {
  const isDark = document.body.classList.contains('dark-mode');
  if (isDark) {
    disableDarkMode();
    localStorage.setItem('darkMode', 'false');
  } else {
    enableDarkMode();
    localStorage.setItem('darkMode', 'true');
  }

  // Sincroniza os dois botões
  const btnMobile = document.getElementById("darkModeBtnMobile");
  const btnDesktop = document.getElementById("darkModeBtnDesktop");

  if (btnMobile) btnMobile.textContent = isDark ? '☀️' : '🌙';
  if (btnDesktop) btnDesktop.textContent = isDark ? '☀️' : '🌙';
}

// Executa na inicialização
checkDarkMode();

function aplicarModoEscuroDinamico() {
  if (document.body.classList.contains('dark-mode')) {
    document.querySelectorAll('.card, .botao-reflexao, .reflexao-oculta, .card-livro').forEach(el => {
      el.classList.add('dark-mode');
    });
    document.querySelector('.navbar')?.classList.add('dark-mode');
  } else {
    document.querySelectorAll('.card, .botao-reflexao, .reflexao-oculta, .card-livro').forEach(el => {
      el.classList.remove('dark-mode');
    });
    document.querySelector('.navbar')?.classList.remove('dark-mode');
  }
}

// Abre/fecha o menu mobile
function toggleMenu() {
  const menu = document.getElementById("menuMobile");
  menu.classList.toggle("aberto");
}

// Fecha o menu após selecionar uma página
function fecharMenu() {
  const menu = document.getElementById("menuMobile");
  menu.classList.remove("aberto");
}

// Fecha o menu ao clicar fora.
document.addEventListener('click', function(event) {
  const menu = document.getElementById("menuMobile");
  const botaoMenu = document.querySelector('.hamburger');

  if (!event.target.closest('.navbar') && !event.target.closest('.menu-mobile')) {
    menu.classList.remove("aberto");
  }
});


// Dados das orações do terço
const oracoesTerco = [
  {
    texto: "Creio em Deus Pai, todo-poderoso, criador do Céu e da Terra e em Jesus Cristo, seu único Filho, Nosso Senhor; que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria, padeceu sob Pôncio pilatos, foi crucificado, morto e sepultado; desceu a mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus, está sentado a Direita de Deus Pai todo-poderoso, donde há de vir julgar os vivos e os mortos. Creio no Espírito Santo, na santa Igreja Católica, na comunhão dos santos, na remissão dos pecados, na ressurreição da carne, na Vida eterna. Amém!",
    imagem: "imagens/2credo.png"
  },
  {
    texto: "Pai Nosso que estais no céu, santificado seja o vosso nome, vem a nós o vosso reino, seja feita a vossa vontade assim na terra como no céu. O pão nosso de cada dia nos daí hoje, perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido, não nos deixei cair em tentação mas livrai-nos do mal. Amém.",
    imagem: "imagens/3pai.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/4ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/5ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/6ave.png"
  },
  {
    texto: "Glória ao Pai, ao Filho e ao Espírito Santo, como era no princípio, agora e sempre. Amém.\n\nÓ meu Jesus, perdoai-nos, livrai-nos do fogo do inferno; levai as almas para o Céu, principalmente as que mais precisarem da Vossa misericórdia.",
    imagem: "imagens/7gloria.png"
  },
  {
    texto: "Pai Nosso que estais no céu, santificado seja o vosso nome, vem a nós o vosso reino, seja feita a vossa vontade assim na terra como no céu. O pão nosso de cada dia nos daí hoje, perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido, não nos deixei cair em tentação mas livrai-nos do mal. Amém.",
    imagem: "imagens/8pai.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/9ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/10ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/11ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/12ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/13ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/14ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/15ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/16ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/17ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/18ave.png"
  },
  {
    texto: "Glória ao Pai, ao Filho e ao Espírito Santo, como era no princípio, agora e sempre. Amém.\n\nÓ meu Jesus, perdoai-nos, livrai-nos do fogo do inferno; levai as almas para o Céu, principalmente as que mais precisarem da Vossa misericórdia.",
    imagem: "imagens/19gloria.png"
  },
  {
    texto: "Pai Nosso que estais no céu, santificado seja o vosso nome, vem a nós o vosso reino, seja feita a vossa vontade assim na terra como no céu. O pão nosso de cada dia nos daí hoje, perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido, não nos deixei cair em tentação mas livrai-nos do mal. Amém.",
    imagem: "imagens/20pai.png"
  },

  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/21ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/22ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/23ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/24ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/25ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/26ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/27ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/28ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/29ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/30ave.png"
  },
  {
    texto: "Glória ao Pai, ao Filho e ao Espírito Santo, como era no princípio, agora e sempre. Amém.\n\nÓ meu Jesus, perdoai-nos, livrai-nos do fogo do inferno; levai as almas para o Céu, principalmente as que mais precisarem da Vossa misericórdia.",
    imagem: "imagens/31gloria.png"
  },
  {
    texto: "Pai Nosso que estais no céu, santificado seja o vosso nome, vem a nós o vosso reino, seja feita a vossa vontade assim na terra como no céu. O pão nosso de cada dia nos daí hoje, perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido, não nos deixei cair em tentação mas livrai-nos do mal. Amém.",
    imagem: "imagens/32pai.png"
  },

  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/33ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/34ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/35ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/36ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/37ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/38ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/39ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/40ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/41ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/42ave.png"
  },
  {
    texto: "Glória ao Pai, ao Filho e ao Espírito Santo, como era no princípio, agora e sempre. Amém.\n\nÓ meu Jesus, perdoai-nos, livrai-nos do fogo do inferno; levai as almas para o Céu, principalmente as que mais precisarem da Vossa misericórdia.",
    imagem: "imagens/43gloria.png"
  },
  {
    texto: "Pai Nosso que estais no céu, santificado seja o vosso nome, vem a nós o vosso reino, seja feita a vossa vontade assim na terra como no céu. O pão nosso de cada dia nos daí hoje, perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido, não nos deixei cair em tentação mas livrai-nos do mal. Amém.",
    imagem: "imagens/44pai.png"
  },

  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/45ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/46ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/47ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/48ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/49ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/50ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/51ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/52ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/53ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/54ave.png"
  },
  {
    texto: "Glória ao Pai, ao Filho e ao Espírito Santo, como era no princípio, agora e sempre. Amém.\n\nÓ meu Jesus, perdoai-nos, livrai-nos do fogo do inferno; levai as almas para o Céu, principalmente as que mais precisarem da Vossa misericórdia.",
    imagem: "imagens/55gloria.png"
  },
  {
    texto: "Pai Nosso que estais no céu, santificado seja o vosso nome, vem a nós o vosso reino, seja feita a vossa vontade assim na terra como no céu. O pão nosso de cada dia nos daí hoje, perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido, não nos deixei cair em tentação mas livrai-nos do mal. Amém.",
    imagem: "imagens/56pai.png"
  },
  
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/57ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/58ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/59ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/60ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/61ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/62ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/63ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/64ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/65ave.png"
  },
  {
    texto: "Ave Maria. Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, bendito é o fruto em Vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora da nossa morte.",
    imagem: "imagens/66ave.png"
  },
  {
    texto: "Glória ao Pai, ao Filho e ao Espírito Santo, como era no princípio, agora e sempre. Amém.\n\nÓ meu Jesus, perdoai-nos, livrai-nos do fogo do inferno; levai as almas para o Céu, principalmente as que mais precisarem da Vossa misericórdia.",
    imagem: "imagens/67gloria.png"
  },
  {
    texto: "Salve, Rainha, mãe de misericórdia, vida, doçura, esperança nossa, salve! A Vós bradamos, os degredados filhos de Eva. A Vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses Vossos olhos misericordiosos a nós volvei. E, depois deste desterro, nos mostrai Jesus, bendito fruto do Vosso ventre. Ó clemente, ó piedosa, ó doce Virgem Maria. Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém.",
    imagem: "imagens/68salve.png"
  },
];

let indiceAtual = 0;

function iniciarTerco() {
  document.getElementById("btnAvancar").style.display = 'inline-block';
  document.getElementById("btnReiniciar").style.display = 'inline-block';
  document.querySelector(".botao-iniciar").style.display = 'none';

  indiceAtual = 0;
  mostrarOracao();
}

function mostrarOracao() {
  const imagem = document.getElementById("imagemTerco");
  const texto = document.getElementById("textoOracao");
  const btnAvancar = document.getElementById("btnAvancar");

  if (oracoesTerco[indiceAtual]) {
    imagem.src = oracoesTerco[indiceAtual].imagem;
    texto.textContent = oracoesTerco[indiceAtual].texto;
    imagem.style.display = 'block';
  }

  // Esconde botão Avançar no último item
  if (indiceAtual >= oracoesTerco.length - 1) {
    btnAvancar.style.display = 'none';
  }
}

function avançarOracao() {
  if (indiceAtual < oracoesTerco.length - 1) {
    indiceAtual++;
    mostrarOracao();
  }
}

function reiniciarTerco() {
  document.getElementById("btnAvancar").style.display = 'none';
  document.getElementById("btnReiniciar").style.display = 'none';
  document.querySelector(".botao-iniciar").style.display = 'inline-block';
  document.getElementById("imagemTerco").style.display = 'none';
  document.getElementById("textoOracao").textContent = 'Clique em "Iniciar Terço" para começar.';
}


function alternarTexto() {
  const texto = document.getElementById("textoOracao");
  if (texto) {
    texto.classList.toggle('show');
  }
}

function ocultarTexto(event) {
  event.stopPropagation();
  const texto = document.getElementById("textoOracao");
  if (texto) {
    texto.classList.remove('show');
  }
}


// Função para copiar texto do versículo + reflexão
function copiarVersiculo(event, livro, capitulo, numero, texto, reflexao) {
  event.stopPropagation();

  // Força capitalização correta
    const livroCorrigido = corrigirNomeLivro(livro);

  const textoParaCopiar = `${livroCorrigido} ${capitulo}:${numero}\n"${texto}"\n\nReflexão:\n${reflexao}`;

  navigator.clipboard.writeText(textoParaCopiar)
    .then(() => {
      alert("Versículo copiado com sucesso!");
    })
    .catch(err => {
      console.error('Erro ao copiar:', err);
      alert("Erro ao copiar o versículo.");
    });
}

function corrigirNomeLivro(nome) {
  const correcoes = {
    'joao': 'João',
    'genesis': 'Gênesis',
    'exodo': 'Êxodo',
    'mateus': 'Mateus',
    'marcos': 'Marcos',
    'lucas': 'Lucas',
    'atos': 'Atos',
    'romanos': 'Romanos',
    '1corintios': '1a Carta aos Coríntios'
  };

  return correcoes[nome.toLowerCase()] || nome;
}


function mostrarOverlay(livro, capitulo, numero) {
  const overlay = document.getElementById("overlayVersiculo");
  if (!overlay) return;

  // Exibir overlay
  overlay.textContent = `${livro} ${capitulo}:${numero}`;
  overlay.classList.add('mostrar');

  // Ocultar após 3 segundos
  setTimeout(() => {
    overlay.classList.remove('mostrar');
  }, 3000); // 3 segundos
}

function carregarProximoCapitulo(livro, numero) {
  // Rola para o topo suavemente
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // Verifica se há próximo capítulo
  const indiceAtual = capitulosDisponiveis[livro].indexOf(numero);
  const proximoIndice = indiceAtual + 1;

  if (capitulosDisponiveis[livro] && capitulosDisponiveis[livro][proximoIndice]) {
    const proximoNumero = capitulosDisponiveis[livro][proximoIndice];
    carregarCapitulo(livro, proximoNumero);
  } else {
    document.getElementById("conteudo").innerHTML = `
      <div class="card">
        <h2>${capitalizeFirstLetter(livro)} ${capitulosDisponiveis[livro][indiceAtual]}</h2>
        <p><em>Este é o último capítulo disponível.</em></p>
        <button onclick="carregarPagina('biblia')" class="botao-reiniciar">Voltar aos livros</button>
      </div>
    `;
  }
}