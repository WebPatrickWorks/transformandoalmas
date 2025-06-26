let paginaAtual = 'inicio';
let livroSelecionado = null;
let capitulosDisponiveis = {};
let reflexoes = [];
let versiculos = [];
let todosOsVersiculos = [];

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
        mostrarUltimaLeitura();
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
    html = `<h2 style="text-align: center;">Bíblia</h2>`;
    html += `
      <img src="icone-biblia.png" alt="Bíblia aberta" style="width: 280px; display: block; margin: 10px auto;">
      <div class="testamentos">
        <button onclick="listarTestamento('velhoTestamento')">Velho Testamento</button>
        <button onclick="listarTestamento('novoTestamento')">Novo Testamento</button>
      </div>
    `;

    conteudo.innerHTML = html;
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
  } else if (pagina === 'busca') {
    html = `
      <h2>
        <button onclick="abrirAjuda()" class="botao-ajuda" title="Como buscar"><span style="font-size: 15px;">ℹ️</span></button>
        Buscar na Bíblia
      </h2>
      <div class="busca-container">
        <div style="position: relative; width: 100%; margin-bottom: 1rem;">
          <input id="campo-busca" class="busca-input" placeholder="Digite uma palavra ou frase..." />
          <button class="busca-btn-lupa" onclick="buscarVersiculo()">🔍</button>
        </div>

        <!-- Filtro de busca -->
        <div class="filtro-busca">
          <label><input type="checkbox" id="buscarEmVersiculo" checked /> Em versículos</label>
          <label><input type="checkbox" id="buscarEmReflexao" checked /> Em reflexões</label>
        </div>

        <!-- Mensagem de busca -->
        <div id="mensagem-busca" style="margin-top: 1rem; font-style: italic; color: #666;">Digite algo e clique na lupa.</div>

        <!-- Resultados -->
        <div id="resultados-busca"></div>
      </div>
    `;
    conteudo.innerHTML = html;
  }

  conteudo.innerHTML = html || '';
  aplicarModoEscuroDinamico();
}

function listarTestamento(testamento) {
  const conteudo = document.getElementById("conteudo");
  fetch('indice-capitulos.json')
    .then(res => res.json())
    .then(data => {


      // Mapeamento de ícones por livro
      const iconesLivros = {
        'default': 'livros/icone-biblia.png',
        'salmos': 'livros/icone-salmos.png',
        'proverbios': 'livros/icone-proverbios.png',
        'genesis': 'livros/icone-genesis.png',
        'exodo': 'livros/icone-exodo.png',
        'levitico': 'livros/icone-levitico.png',
        'numeros': 'livros/icone-numeros.png',
        'deuteronomio': 'livros/icone-deuteronomio.png',
        'josue': 'livros/icone-josue.png',
        'juizes': 'livros/icone-juizes.png',
        'rute': 'livros/icone-rute.png',
        '1samuel': 'livros/icone-1samuel.png',
        '2samuel': 'livros/icone-2samuel.png',
        '1reis': 'livros/icone-1reis.png',
        '2reis': 'livros/icone-2reis.png',
        '1cronicas': 'livros/icone-1cronicas.png',

        'joao': 'livros/icone-joao.png',
        'mateus': 'livros/icone-mateus.png',
        'marcos': 'livros/icone-marcos.png',
        'lucas': 'livros/icone-lucas.png',
        'romanos': 'livros/icone-romanos.png',
        'atos': 'livros/icone-atos.png',
        '1corintios': 'livros/icone-1corintios.png',
        '2corintios': 'livros/icone-2corintios.png',
        'galatas': 'livros/icone-galatas.png',
        'efesios': 'livros/icone-efesios.png',
        'filipenses': 'livros/icone-filipenses.png',
        'colossenses': 'livros/icone-colossenses.png',
        '1tessalonicenses': 'livros/icone-1tessalonicenses.png',
        '2tessalonicenses': 'livros/icone-2tessalonicenses.png',
        '1timoteo': 'livros/icone-1timoteo.png',
        '2timoteo': 'livros/icone-2timoteo.png',
        'tito': 'livros/icone-tito.png',
        'filemom': 'livros/icone-filemom.png',
        'hebreus': 'livros/icone-hebreus.png',
        'tiago': 'livros/icone-tiago.png',
        '1pedro': 'livros/icone-1pedro.png',
        '2pedro': 'livros/icone-2pedro.png',
        '1joao': 'livros/icone-joao.png',
        '2joao': 'livros/icone-joao.png',
        '3joao': 'livros/icone-joao.png',
        'judas': 'livros/icone-judas.png',
        'apocalipse': 'livros/icone-apocalipse.png'
      };

      // Mapeamento de descrições por livro
      const descricoesLivros = {
        'salmos': 'Salmos é uma coletânea de 150 poemas e cânticos que expressam orações, louvores, súplicas e ações de graças a Deus. Escrito por diversos autores, entre eles Davi — responsável por grande parte dos salmos —, além de Asafe, os filhos de Corá, Salomão, Moisés e outros. O livro reflete as mais profundas experiências humanas diante de Deus, abordando temas como confiança, arrependimento, justiça, adoração e esperança. É uma fonte de conforto espiritual, fortalecimento da fé e expressão da devoção, sendo até hoje um dos livros mais lidos e orados da Bíblia.',
        'proverbios': 'Provérbios é um livro de sabedoria que reúne ensinamentos práticos para a vida, abordando temas como justiça, prudência, trabalho, família, honestidade e temor a Deus. A maior parte foi escrita por Salomão, conhecido por sua sabedoria, embora também contenha provérbios de outros sábios como Agur e o rei Lemuel. Seus ensinamentos atravessam gerações, orientando sobre como viver de forma íntegra, sensata e alinhada aos princípios divinos, com a convicção de que o temor do Senhor é o princípio da sabedoria.',
        'genesis': 'Gênesis é o primeiro livro da Bíblia e narra os princípios de todas as coisas: a criação do mundo, da humanidade e da aliança de Deus com seu povo. Escrito por Moisés, Gênesis apresenta relatos fundamentais como a criação, o pecado original, o dilúvio, a torre de Babel e as histórias dos patriarcas — Abraão, Isaque, Jacó e José. O livro revela como Deus, soberano e amoroso, conduz a história desde o início, estabelecendo promessas que moldariam toda a trajetória do povo de Israel e da humanidade.',
        'exodo': 'Êxodo é o segundo livro da Bíblia e foi escrito por Moisés. Relata a libertação do povo de Israel da escravidão no Egito, conduzido por Moisés sob a direção de Deus. O livro narra eventos marcantes como as dez pragas, a travessia do Mar Vermelho, a entrega dos Dez Mandamentos no Monte Sinai e a aliança de Deus com o seu povo. Além de revelar o cuidado, a justiça e a fidelidade de Deus, Êxodo estabelece as bases da identidade espiritual, moral e cultural de Israel, destacando a importância da obediência e da adoração ao Deus único.',
        'levitico': 'Levítico é o terceiro livro da Bíblia, escrito por Moisés, e concentra-se nas leis, rituais e orientações dadas por Deus ao povo de Israel, especialmente aos sacerdotes da tribo de Levi. O livro aborda temas como sacrifícios, pureza, festas sagradas, normas alimentares e princípios de santidade. Seu propósito é ensinar que Deus é santo e que o povo, para se relacionar com Ele, também deve viver em santidade, justiça e reverência, refletindo Sua presença em todas as áreas da vida.',
        'numeros': 'Números é o quarto livro da Bíblia, escrito por Moisés, e narra a jornada do povo de Israel pelo deserto rumo à Terra Prometida. O nome se refere aos censos realizados para organizar as tribos. O livro combina registros numéricos, leis, relatos de rebeldias, milagres e experiências que revelam tanto a fidelidade de Deus quanto as falhas humanas. Mostra como a obediência conduz à bênção, enquanto a desobediência gera consequências, reafirmando o cuidado e a direção de Deus ao longo da caminhada do Seu povo.',
        'deuteronomio': 'Deuteronômio é o quinto livro da Bíblia, escrito por Moisés, e reúne os discursos finais dele ao povo de Israel antes da entrada na Terra Prometida. O livro revisita as leis, os mandamentos e a aliança, reforçando a importância da obediência, do amor a Deus e da fidelidade. Nele, Moisés recorda os acontecimentos da caminhada no deserto, exorta o povo à santidade e destaca que a bênção está ligada à obediência e a maldição à desobediência. É um chamado à lembrança, à gratidão e à entrega total a Deus.',
        'josue': 'Josué é o sexto livro da Bíblia e narra a conquista e a divisão da Terra Prometida entre as tribos de Israel, sob a liderança de Josué, sucessor de Moisés. Escrito provavelmente pelo próprio Josué, com registros posteriores de outros escribas, o livro destaca a fidelidade de Deus em cumprir Suas promessas. Relata grandes feitos, como a travessia do rio Jordão, a queda das muralhas de Jericó e a distribuição das terras. Sua mensagem central é que a obediência e a confiança em Deus são fundamentais para alcançar vitórias e viver debaixo de Suas bênçãos.',
        'juizes': 'Juízes é o sétimo livro da Bíblia e retrata o período entre a morte de Josué e o surgimento da monarquia em Israel. De autoria atribuída a Samuel, o livro descreve um ciclo constante de desobediência, opressão, arrependimento e libertação, quando Deus levanta juízes — líderes civis e militares — para salvar o povo. Relata histórias marcantes de Débora, Gideão, Sansão e outros, mostrando como a infidelidade a Deus traz consequências, mas Sua misericórdia se renova sempre que há arrependimento sincero.',
        'rute': 'Rute é um livro curto, mas profundamente inspirador, que narra a história de lealdade, amor e redenção de uma mulher moabita chamada Rute, que escolhe seguir a Deus e acompanhar sua sogra, Noemi, ao retornar para Israel. A autoria é tradicionalmente atribuída ao profeta Samuel. Através de sua fé e fidelidade, Rute se torna parte da linhagem do rei Davi e, consequentemente, de Jesus. O livro revela como Deus age na simplicidade da vida cotidiana, transformando histórias comuns em propósitos eternos.',
        '1samuel': '1 Samuel é o livro que marca a transição do período dos juízes para a monarquia em Israel. De autoria atribuída ao profeta Samuel, com registros complementares de outros escribas, relata o nascimento e ministério de Samuel, o último juiz e primeiro profeta dessa nova fase. O livro narra a escolha e a queda do rei Saul e a ascensão de Davi, homem segundo o coração de Deus. Traz lições sobre obediência, liderança, fé e as consequências da desobediência, revelando que Deus exalta os humildes e rejeita os que endurecem o coração.',
        '2samuel': '2 Samuel dá continuidade à história iniciada em 1 Samuel, relatando o reinado de Davi sobre Israel. De autoria atribuída ao profeta Samuel, com complementos dos profetas Natã e Gade, o livro descreve a consolidação do reino, as vitórias militares, a expansão de Israel e também os erros pessoais de Davi, como o episódio com Bate-Seba. Apesar das falhas, Davi é retratado como um homem segundo o coração de Deus, que se arrepende sinceramente e busca viver segundo a vontade divina. A obra destaca como Deus é fiel em Suas promessas e soberano sobre reis e nações.',
        '1reis': '1 Reis narra a transição do reinado de Davi para o de seu filho Salomão, destacando a construção do Templo em Jerusalém e a glória do reino unificado. Contudo, após a morte de Salomão, o livro relata a divisão do reino em duas partes: Israel ao norte e Judá ao sul. Escrita por autores e escribas proféticos, a obra registra a história dos reis que sucederam Salomão, revelando como a fidelidade ou a infidelidade a Deus impactaram o destino da nação. O livro também apresenta a atuação marcante do profeta Elias, símbolo da voz profética em tempos de idolatria e injustiça.',
        '2reis': '2 Reis dá continuidade ao relato histórico iniciado em 1 Reis, abordando os reinados sucessivos em Israel e Judá até suas quedas — Israel sendo conquistado pela Assíria e Judá pelo Império Babilônico. A autoria é atribuída a escribas proféticos, sob inspiração divina, possivelmente com contribuições do profeta Jeremias. O livro destaca o ministério poderoso do profeta Eliseu, os altos e baixos da liderança dos reis e a contínua advertência de Deus ao povo por meio dos profetas. A narrativa revela como a infidelidade e a idolatria conduzem ao juízo, mas também como a misericórdia divina persiste em chamar à restauração.',
        '1cronicas': '1 Crônicas foi escrito por Esdras, por volta do século V a.C., após o exílio babilônico, com o objetivo de relembrar ao povo de Israel suas origens, identidade e aliança com Deus. O livro começa com extensas genealogias desde Adão até as tribos de Israel, reforçando a importância da linhagem de Davi. Em seguida, foca no reinado de Davi, destacando sua fidelidade, as preparações para a construção do Templo e a centralidade da adoração ao Senhor. Mais do que um relato histórico, é uma reafirmação da esperança e do propósito divino para o povo restaurado.',

        'lucas': 'Um evangelho que revela com sensibilidade e compaixão o amor de Jesus pelos marginalizados, feridos e esquecidos. Aqui, vemos um Cristo que cura, restaura, acolhe e oferece salvação a todos, sem distinção. Suas páginas transbordam misericórdia, mostrando que o Filho do Homem veio buscar e salvar o que se havia perdido, tocando corações com uma mensagem de esperança, perdão e redenção.',
        'joao': 'Um evangelho que revela, de forma íntima e profunda, a divindade e o amor incondicional de Jesus Cristo. Suas palavras tocam diretamente a alma, mostrando que Ele é o Verbo de Deus, a Luz que dissipa as trevas e a Fonte da vida eterna. Cada capítulo nos convida a conhecer um Deus que se fez carne, habitou entre nós, e nos chama a crer para que, através da fé, encontremos a verdadeira esperança, consolo e salvação.',
        'mateus': 'Um evangelho que apresenta Jesus como o Messias prometido, cumpridor das profecias, Rei e Salvador de toda a humanidade. Suas palavras revelam um Cristo que ensina com autoridade, conduzindo seus discípulos no caminho da verdade, da justiça e do amor. Em cada ensinamento, há um chamado ao arrependimento, à transformação de vida e à construção de um Reino onde prevalecem a misericórdia, a fé e a esperança.',
        'marcos': 'Um evangelho que revela Jesus em ação, com poder, autoridade e compaixão. Suas páginas nos conduzem a testemunhar um Cristo que cura, liberta, restaura e enfrenta o mal com amor e entrega. De forma direta e intensa, Marcos nos mostra que o Filho de Deus não veio para ser servido, mas para servir e dar a sua vida em resgate por muitos, trazendo uma mensagem viva de esperança, salvação e transformação.',
        'atos': 'Escrito por Lucas, o mesmo autor do Evangelho segundo Lucas. Ele era médico e companheiro de viagem do apóstolo Paulo. Este livro é um relato inspirador sobre o nascimento e a expansão da igreja cristã. Suas páginas revelam como, guiados pelo Espírito Santo, os apóstolos e discípulos romperam barreiras, enfrentaram perseguições e levaram a mensagem de Jesus a todas as nações. Atos nos mostra que a obra de Deus não se limita a templos ou fronteiras, mas se realiza no coração de quem crê, vive e anuncia o evangelho com fé, coragem e amor.',
        'romanos': 'Uma carta que revela, de forma majestosa e transformadora, a profundidade da graça, da justiça e do amor de Deus. Suas palavras nos conduzem a compreender que todos carecem da glória de Deus, mas que, pela fé em Jesus Cristo, somos justificados, perdoados e reconciliados. Romanos é um chamado à verdadeira transformação da mente e do coração, revelando que a salvação não é mérito humano, mas um presente divino que restaura, liberta e conduz à vida eterna.',
        '1corintios': 'Uma carta que toca profundamente o coração, revelando os desafios e as fragilidades humanas diante da fé. Suas palavras são um chamado à unidade, ao amor e à pureza espiritual, mostrando que, acima de todo conhecimento e dons, o amor é o caminho mais excelente. Aqui, aprendemos que a verdadeira igreja é edificada na humildade, no serviço e na renúncia, sendo guiada pela graça e pela presença viva de Cristo no meio de seu povo.',
        '2corintios': 'Uma carta que transborda humanidade, amor e restauração. Aqui, o apóstolo Paulo revela seu coração ferido, mas cheio de fé, ao enfrentar críticas, perseguições e desafios no ministério. Suas palavras são um testemunho de que, mesmo em meio às fraquezas, dores e tribulações, a graça de Deus é suficiente, e o poder do Senhor se aperfeiçoa na nossa fraqueza. É um chamado à perseverança, à reconciliação e à confiança plena naquele que consola, fortalece e nunca nos abandona.',
        'galatas': 'Escrito pelo apóstolo Paulo, esta carta é um clamor apaixonado pela verdadeira liberdade que há em Cristo. Suas palavras confrontam qualquer tentativa de substituir a graça por regras, tradições ou méritos humanos. Aqui, Paulo defende com firmeza que a salvação vem unicamente pela fé, e não pelas obras da lei, e que, em Cristo, somos libertos do jugo da religiosidade para viver guiados pelo Espírito. É uma mensagem poderosa que nos lembra que fomos chamados à liberdade, à filiação divina e a uma vida marcada pelo amor, pela fé e pela graça.',
        'efesios': 'Escrito pelo apóstolo Paulo, enquanto estava preso em Roma, este é um dos textos mais profundos sobre a identidade e a missão da igreja. Suas palavras revelam que, em Cristo, fomos escolhidos, redimidos e selados pelo Espírito Santo. Efésios nos conduz a entender que somos parte de um corpo, unidos em amor, chamados a viver em santidade, unidade e plenitude. É uma carta que exalta a graça, fortalece a fé e nos lembra que somos obras-primas de Deus, criados para viver em boas obras e refletir sua luz no mundo.',
        'filipenses': 'Escrito pelo apóstolo Paulo enquanto estava preso em Roma, este livro transborda gratidão, amor e alegria, mesmo em meio às adversidades. Suas palavras nos ensinam que a verdadeira alegria não está nas circunstâncias, mas em viver uma vida centrada em Cristo. É uma carta que fortalece a fé, inspira a perseverança e nos lembra que tudo podemos naquele que nos fortalece. Um convite à humildade, ao serviço e à confiança plena no Deus que supre, guarda e conduz.',
        'colossenses': 'Escrito pelo apóstolo Paulo, enquanto estava preso em Roma, este livro exalta a supremacia, a soberania e a suficiência de Cristo sobre todas as coisas. Suas palavras nos conduzem a entender que, em Jesus, habita toda a plenitude de Deus, e que nele encontramos redenção, perdão e vida abundante. É um chamado à maturidade espiritual, à firmeza na fé e a viver uma vida transformada, onde Cristo seja o centro, a razão e o sustento de tudo.',
        '1tessalonicenses': 'Escrito pelo apóstolo Paulo, juntamente com Silvano (Silas) e Timóteo, este livro transborda encorajamento, fé e esperança. Suas palavras fortalecem uma igreja jovem que, mesmo em meio a perseguições, permaneceu firme no amor e na esperança em Cristo. É uma carta que consola, anima e aponta para a bendita esperança da volta de Jesus, lembrando que viver em santidade, amor e vigilância é o caminho para quem aguarda, com fé, o reencontro com o Senhor.',
        '2tessalonicenses': 'Escrito pelo apóstolo Paulo, juntamente com Silvano (Silas) e Timóteo, este livro traz consolo, correção e esperança para uma igreja ansiosa e, por vezes, confusa sobre a volta de Cristo. Suas palavras reafirmam que, embora o sofrimento e as dificuldades sejam reais, Deus é justo e fiel, e no tempo certo trará justiça e redenção. É um chamado à perseverança, à firmeza na fé e à confiança no Senhor, que virá no tempo determinado, trazendo vitória e restauração aos que nele esperam.',
        '1timoteo': 'Escrito pelo apóstolo Paulo a seu amado filho na fé, Timóteo, este livro é um verdadeiro manual de orientação para a liderança cristã e para a vida da igreja. Suas palavras trazem conselhos preciosos sobre conduta, oração, ensino, liderança e santidade. É um chamado para preservar a sã doutrina, viver com integridade e ser exemplo na fé, no amor e na pureza, lembrando que o serviço a Deus deve ser exercido com zelo, responsabilidade e total dependência do Senhor.',
        '2timoteo': 'Escrito pelo apóstolo Paulo, em seus últimos dias de vida, esta carta carrega um tom profundamente pessoal, emocionante e cheio de amor. De uma prisão em Roma, Paulo encoraja seu filho na fé, Timóteo, a permanecer firme, corajoso e fiel ao chamado, mesmo em meio às adversidades. Suas palavras são um legado de fé, coragem e esperança, lembrando que a coroa da justiça aguarda aqueles que combatem o bom combate, guardam a fé e permanecem fiéis até o fim.',
        'tito': 'Escrito pelo apóstolo Paulo a seu fiel colaborador e filho na fé, Tito, este livro é um guia prático para a organização e fortalecimento da igreja. Suas palavras ensinam sobre a importância de líderes comprometidos, vida exemplar, sã doutrina e boas obras. É um chamado à vivência de uma fé que transforma, onde a graça de Deus não apenas salva, mas também educa, molda e conduz a uma vida de retidão, amor e testemunho diante do mundo.',
        'filemom': 'Escrito pelo apóstolo Paulo durante sua prisão em Roma, esta carta curta, porém profundamente rica, é um testemunho vivo da transformação que o evangelho gera nas relações humanas. Paulo escreve a Filemom, um cristão influente e líder de uma igreja que se reunia em sua casa, para interceder em favor de Onésimo, um escravo que havia fugido e, de alguma forma, encontrou Paulo na prisão. Ali, Onésimo foi alcançado pela fé em Cristo e se tornou um irmão na fé. A carta revela o coração pastoral e amoroso de Paulo, que não apenas pede a Filemom que perdoe Onésimo, mas também que o receba não mais como escravo, mas como irmão amado em Cristo, igual perante Deus. É uma mensagem poderosa sobre reconciliação, perdão, restauração e a quebra das barreiras sociais e culturais à luz do amor cristão.',
        'hebreus': 'De autoria incerta, mas tradicionalmente associado a um líder influente da igreja primitiva, este livro é uma declaração majestosa da supremacia de Cristo. Suas palavras revelam que Jesus é o perfeito sumo sacerdote, mediador da nova aliança, aquele que supera a antiga lei, os sacrifícios e o sacerdócio levítico. Hebreus nos conduz a compreender que, por meio de seu sacrifício, Cristo abriu um caminho novo e vivo até Deus, oferecendo redenção completa, esperança firme e uma fé que nos sustenta, mesmo em meio às lutas. É um chamado à perseverança, à confiança plena e à certeza de que, em Cristo, temos tudo o que precisamos.',
        'tiago': 'Escrito por Tiago, irmão de Jesus e líder da igreja em Jerusalém, este livro é um chamado prático e direto à vivência da fé verdadeira. Suas palavras nos lembram que a fé sem obras é morta e que a verdadeira espiritualidade se reflete em atitudes de amor, justiça, domínio próprio e cuidado com o próximo. É um convite a uma vida coerente, onde palavras e ações caminham juntas, onde a fé se traduz em serviço, compaixão e retidão, mostrando que quem anda com Deus reflete sua luz em cada detalhe da vida.',
        '1pedro': 'Escrito pelo apóstolo Pedro, este livro é uma mensagem de encorajamento e esperança para cristãos que enfrentavam perseguições, dores e desafios por causa da fé. Suas palavras fortalecem os corações, lembrando que, mesmo em meio ao sofrimento, somos peregrinos neste mundo, chamados a viver em santidade, amor e firmeza, confiando na promessa de uma herança eterna e incorruptível. É um convite a permanecer firme, com os olhos em Cristo, sabendo que, após as provações, Deus nos restaurará, fortalecerá e nos conduzirá à sua glória.',
        '2pedro': 'Escrito pelo apóstolo Pedro, pouco antes de sua morte, este livro carrega um tom de alerta, amor e firmeza. Suas palavras exortam os cristãos a permanecerem firmes na verdade, crescendo no conhecimento de Deus e resistindo aos falsos mestres que distorcem o evangelho. É um chamado à santidade, à vigilância e à perseverança, lembrando que, embora os dias sejam desafiadores, a promessa da volta de Cristo permanece viva e certa. Pedro nos convida a viver com fé, esperança e expectativa, aguardando os novos céus e a nova terra, onde habita a justiça.',
        '1joao': 'Escrita pelo apóstolo João, discípulo amado de Jesus, já em seus últimos anos de vida, esta carta é uma declaração viva sobre o amor, a verdade e a fé. Suas palavras nos convidam a compreender que Deus é amor, e que viver em comunhão com Ele significa andar na luz, praticar a verdade e amar de forma genuína. É uma exortação clara contra o pecado, contra os falsos ensinamentos e contra uma fé apenas teórica, lembrando que quem permanece em Cristo reflete esse amor em atitudes, palavras e ações. Um chamado poderoso à certeza da salvação, à comunhão com Deus e à prática do amor como prova da verdadeira vida cristã.',
        '2joao': 'Escrita pelo apóstolo João, discípulo amado de Jesus, esta carta, embora breve, carrega uma mensagem profunda sobre a importância de permanecer na verdade e no amor. Dirigida a uma senhora eleita e aos seus filhos — que pode representar uma igreja e seus membros —, João exorta os cristãos a viverem firmes na doutrina de Cristo, cuidando para não serem enganados por falsos mestres. Suas palavras são um chamado à fidelidade, ao amor que se expressa na obediência, e à proteção da fé, lembrando que andar na verdade é essencial para quem deseja permanecer em comunhão com Deus.',
        '3joao': 'Escrita pelo apóstolo João, discípulo amado de Jesus, esta carta, embora curta, reflete de forma poderosa o cuidado com a verdade, a comunhão e o amor no convívio cristão. Endereçada a Gaio, um irmão amado e fiel, João o elogia por sua hospitalidade e amor pelos missionários, ao mesmo tempo em que repreende atitudes de orgulho e divisão dentro da igreja, representadas por Diótrefes, e exalta o bom testemunho de Demétrio. Suas palavras nos ensinam que a verdadeira fé se expressa em amor prático, em apoio à obra de Deus e na busca constante por viver segundo a verdade.',
        'judas': 'Escrita por Judas, irmão de Tiago e meio-irmão de Jesus, esta carta é um forte chamado à vigilância, à defesa da fé e à perseverança no caminho da verdade. Suas palavras, curtas, mas intensas, alertam contra falsos mestres, imoralidade, distorções da graça e apostasia. É um apelo urgente para que os cristãos se mantenham firmes no amor de Deus, fortalecidos na fé e na oração, lembrando que, mesmo em meio ao caos espiritual, Deus é poderoso para guardar, proteger e conduzir seus filhos irrepreensíveis até o dia da glória. Uma carta que ecoa coragem, esperança e fidelidade.',
        'apocalipse': 'Escrito pelo apóstolo João, discípulo amado de Jesus, enquanto estava exilado na ilha de Patmos, este livro é uma poderosa revelação sobre os últimos dias, a vitória final de Cristo e a consumação do plano de Deus. Suas visões, cheias de símbolos e profundos significados, revelam a luta entre o bem e o mal, o juízo sobre a maldade, a perseverança dos fiéis e, sobretudo, a gloriosa esperança da nova Jerusalém, onde não haverá mais dor, nem lágrimas, nem morte. É uma mensagem de alerta, consolo e esperança, que nos lembra que, no fim, Jesus reina soberano, e a vitória pertence aos que permanecem fiéis até o fim.'

        // Adicione conforme os livros que você tem no índice
      };

      capitulosDisponiveis = data[testamento];
      const testamentoData = data[testamento];

      let html = `<h2>${testamento === 'velhoTestamento' ? 'Velho Testamento' : 'Novo Testamento'}</h2>`;
      html += `<div class="grid-testamento">`;

      for (const livro in testamentoData) {
        const livroFormatado1 = capitalizeFirstLetter(livro);
        const livroFormatado = corrigirNomeLivro(livroFormatado1);
        const icone = iconesLivros[livro] || iconesLivros['default'];
        const descricao = descricoesLivros[livro] || 'Livro bíblico';

        html += `
          <div class="book-card" onclick="listarCapitulos('${livro}')">
            <img src="${icone}" alt="${livroFormatado}" class="book-image"/>
            <div class="book-summary">${descricao}</div>
          </div>
        `;

        testamentoData[livro].forEach(num => {
          html += `<button onclick="carregarCapitulo('${livro}', ${num})">Capítulo ${num}</button>`;
        });

        html += `</div></div></div>`;
      }

      conteudo.innerHTML = html;
      aplicarModoEscuroDinamico();
    })
    .catch(err => {
      console.error('Erro ao carregar índice:', err);
      conteudo.innerHTML = `<p>Erro ao carregar lista de livros.</p>`;
    });
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


  //obterLivrosDoTestamento(`${removerAcentos(livro)}`).then(console.log);


  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = `<p>Carregando ${capitalizeFirstLetter(livro)} Capítulo ${numero}...</p>`;
  console.warn(`"${livro}" : livro recebido`);
  console.warn(`"${numero}" : versículo recebido`);

  fetch(`capitulos/${livro}${numero}.json`)
    .then(res => {
      if (!res.ok) throw new Error("Arquivo não encontrado.");
      return res.json();
    })
    .then(data => {
      let html = `<h2>${data.livro} (capítulo ${data.capitulo})</h2>`;

      // Verifica se há último versículo salvo
      const ultimaLeitura = localStorage.getItem('ultimoVersiculo');
      let ultima = null;
      if (ultimaLeitura) {
        try {
          ultima = JSON.parse(ultimaLeitura);
        } catch (err) {
          console.error("Erro ao ler última leitura:", err);
        }
      }

      data.versiculos.forEach(v => {
        // Verifica se é o versículo salvo
        const isUltimoLido = ultima &&
          ultima.livro === data.livro &&
          ultima.capitulo === data.capitulo &&
          ultima.numero === v.numero;
          
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
          <div class="card${isUltimoLido ? ' versiculo-lido' : ''}" onclick="mostrarOverlay('${data.livro}', '${data.capitulo}', '${v.numero}'); marcarComoLido('${data.livro}', '${data.capitulo}', '${v.numero}', this)">
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
    'salmos': 'Salmos',
    'proverbios': 'Provérbios',
    'genesis': 'Gênesis',
    'exodo': 'Êxodo',
    'levitico': 'Levítico',
    'numeros': 'Números',
    'deuteronomio': 'Deuteronômio',
    'josue': 'Josué',
    'juizes': 'Juízes',
    'rute': 'Rute',
    '1samuel': 'Primeiro Samuel',
    '2samuel': 'Segundo Samuel',
    '1reis': 'Primeiro Reis',
    '2reis': 'Segundo Reis',
    '1cronicas': 'Primeiro Crônicas',

    'joao': 'João',
    'mateus': 'Mateus',
    'marcos': 'Marcos',
    'lucas': 'Lucas',
    'atos': 'Atos',
    'romanos': 'Romanos',
    '1corintios': '1a Carta aos Coríntios',
    '2corintios': '2a Carta aos Coríntios',
    'galatas': 'Gálatas',
    'efesios': 'Efésios',
    'filipenses': 'Filipenses',
    'colossenses': 'Colossenses',
    '1tessalonicenses': '1a Carta aos Tessalonicenses',
    '2tessalonicenses': '2a Carta aos Tessalonicenses',
    '1timoteo': '1a Carta a Timóteo',
    '2timoteo': '2a Carta a Timóteo',
    'tito': 'Tito',
    'filemom': 'Filemom',
    'hebreus': 'Hebreus',
    'tiago': 'Tiago',
    '1pedro': '1a Carta de Pedro',
    '2pedro': '2a Carta de Pedro',
    '1joao': '1a Carta de João',
    '2joao': '2a Carta de João',
    '3joao': '3a Carta de João',
    'judas': 'Judas',
    'apocalipse': 'Apocalipse'
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


function carregarTodosOsVersiculos() {
  return new Promise((resolve, reject) => {
    const promises = [];

    fetch('indice-capitulos.json')
      .then(res => res.json())
      .then(data => {
        // Salva toda a estrutura para uso futuro
        capitulosDisponiveis = data;

        // Percorre os testamentos
        for (const testamento in data) {
          const livros = data[testamento];

          for (const livro in livros) {
            const capitulos = livros[livro];

            if (Array.isArray(capitulos)) {
              capitulos.forEach(c => {
                const caminho = `capitulos/${livro}${c}.json`;
                promises.push(
                  fetch(caminho)
                    .then(res => res.json())
                    .then(json => {
                      json.versiculos.forEach(v => {
                        todosOsVersiculos.push({
                          livro: json.livro,
                          capitulo: json.capitulo,
                          numero: v.numero,
                          texto: v.texto,
                          reflexao: v.reflexao || ''
                        });
                      });
                    })
                );
              });
            } else {
              console.warn(`"${livro}" não tem capítulos como array`);
            }
          }
        }

        Promise.all(promises)
          .then(() => {
            console.log("✅ Todos os versículos foram carregados.");
            resolve();
          })
          .catch(err => {
            console.error("🔴 Erro ao carregar capítulos:", err);
            reject(err);
          });
      })
      .catch(err => {
        console.error("❌ Erro ao carregar índice:", err);
        reject(err);
      });
  });
}

function removerAcentos(str) {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // Remove acentos
    .replace(/\s+/g, "") // Remove todos os espaços em branco (incluindo quebras de linha)
    .toLowerCase(); // Converte para minúsculas
}

function buscarVersiculo() {
  const campo = document.getElementById("campo-busca");
  const termo = campo.value.trim();
  const resultadosDiv = document.getElementById("resultados-busca");
  const mensagemDiv = document.getElementById("mensagem-busca");

  if (!termo) {
    mensagemDiv.innerHTML = 'Por favor, digite algo antes de pesquisar.';
    resultadosDiv.innerHTML = '';
    return;
  }

  resultadosDiv.innerHTML = '';
  mensagemDiv.innerHTML = 'Buscando...';

  // Regex para:
  // - "João 1"
  // - "João 1:3-7"
  // - "João 1:3,4,7"
  const regex = /^(\d+\s+\w+|\w+)\s+(\d+)(?:(?:-(\d+))|:(\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*)?)?$/i;
  const match = removerAcentos(termo).match(regex);

  setTimeout(() => {
    if (match) {
      const livroDigitado = removerAcentos(match[1]); // Ex: "joao", "salmo"
      const capitulo = match[2];                    // Ex: "1", "23"
      const versiculosUnico = match[3] ? parseInt(match[3]) : null; // Ex: João 3:5-10
      const versiculosLista = match[4];             // Ex: "5,6,8" ou "5-10,12"

      let versiculosFiltrados = [];

      // Caso 1: João 3 → todos os versículos do capítulo
      if (!versiculosUnico && !versiculosLista) {
        versiculosFiltrados = todosOsVersiculos.filter(v => {
          return removerAcentos(v.livro) === livroDigitado && v.capitulo === capitulo;
        });
      }

      // Caso 2: João 3:5-10 → intervalo de versículos
      else if (versiculosUnico) {
        const inicio = 1;
        const fim = parseInt(versiculosUnico);
        versiculosFiltrados = todosOsVersiculos.filter(v => {
          const livroMatch = removerAcentos(v.livro) === livroDigitado;
          const capituloMatch = v.capitulo === capitulo;

          const numero = parseInt(v.numero);
          return livroMatch && capituloMatch && numero >= inicio && numero <= fim;
        });
      }

      // Caso 3: João 3:5,6,8 → versículos específicos
      else if (versiculosLista) {
        const versiculosStr = versiculosLista.split(',').map(v => {
          if (v.includes('-')) {
            const [inicio, fim] = v.split('-').map(Number);
            return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);
          }
          return [parseInt(v)];
        }).flat();

        versiculosFiltrados = todosOsVersiculos.filter(v => {
          const livroMatch = removerAcentos(v.livro) === livroDigitado;
          const capituloMatch = v.capitulo === capitulo;
          const numero = parseInt(v.numero);
          return livroMatch && capituloMatch && versiculosStr.includes(numero);
        });
      }

      if (versiculosFiltrados.length === 0) {
        mensagemDiv.innerHTML = `Nenhum resultado encontrado para "${termo}".`;
        return;
      }

      mensagemDiv.innerHTML = `Resultado${versiculosFiltrados.length > 1 ? 's' : ''} encontrado${versiculosFiltrados.length > 1 ? 's' : ''}:`;

      if (versiculosUnico) {
        mensagemDiv.innerHTML = `Busca por intervalo: do versículo 1 ao ${versiculosUnico}`;
      } else if (versiculosLista) {
        mensagemDiv.innerHTML = `Busca por versículos específicos: ${versiculosLista}`;
      } else {
        const nomeCorrigido = corrigirNomeLivro(livroDigitado);
        mensagemDiv.innerHTML = `Busca por capítulo inteiro: ${nomeCorrigido} ${capitulo}`;
      }

      let html = '';
      versiculosFiltrados.forEach(r => {
        html += `
          <div class="card">
            <h3>${r.livro} ${r.capitulo}:${r.numero}</h3>
            <p>"${r.texto}"</p>
            ${r.reflexao ? `
              <button onclick="mostrarReflexao(this)" class="botao-reflexao">
                <span class="icone-reflexao">+</span> Mostrar Reflexão
              </button>
              <div class="reflexao-oculta">
                <p class="texto-reflexao">${r.reflexao}</p>
              </div>
            ` : ''}
          </div>
        `;
      });

      resultadosDiv.innerHTML = html;
      aplicarModoEscuroDinamico();
    } else {
      // Busca normal por palavras
      const palavras = removerAcentos(termo).toLowerCase().split(/\s+/).filter(p => p.length > 0);
      const buscarVersiculo = document.getElementById("buscarEmVersiculo").checked;
      const buscarReflexao = document.getElementById("buscarEmReflexao").checked;

      const resultados = todosOsVersiculos.filter(v => {
        let resultado = false;

        if (buscarVersiculo) {
          const textoCompleto = removerAcentos(v.texto);
          const todasAsPalavrasNoTexto = palavras.every(palavra => textoCompleto.includes(palavra));
          if (todasAsPalavrasNoTexto) resultado = true;
        }

        if (buscarReflexao && v.reflexao) {
          const reflexaoCompleta = removerAcentos(v.reflexao);
          const todasAsPalavrasNaReflexao = palavras.every(palavra => reflexaoCompleta.includes(palavra));
          if (todasAsPalavrasNaReflexao) resultado = true;
        }

        return resultado;
      });

      if (resultados.length === 0) {
        mensagemDiv.innerHTML = `Nenhum resultado encontrado para "${termo}".`;
        return;
      }

      mensagemDiv.innerHTML = `<strong>${resultados.length}</strong> resultados encontrados.`;

      let html = '';
      resultados.forEach(r => {
        html += `
          <div class="card">
            <h3>${r.livro} ${r.capitulo}:${r.numero}</h3>
            <p>"${r.texto}"</p>
            ${r.reflexao ? `
              <button onclick="mostrarReflexao(this)" class="botao-reflexao">
                <span class="icone-reflexao">+</span> Mostrar Reflexão
              </button>
              <div class="reflexao-oculta">
                <p class="texto-reflexao">${r.reflexao}</p>
              </div>
            ` : ''}
          </div>
        `;
      });

      resultadosDiv.innerHTML = html;
      aplicarModoEscuroDinamico();

    }
  }, 300);
}

document.getElementById("conteudo").innerHTML = `
  <p>Carregando todos os versículos para busca...</p>
`;

window.addEventListener('DOMContentLoaded', function () {
  checkDarkMode();
  carregarUltimaLeitura(); // Marca o último versículo lido

  // Carrega todos os versículos pra busca funcionar offline
  carregarTodosOsVersiculos()
    .then(() => {
      console.log("Todos os versículos foram carregados para busca.");
    })
    .catch(err => {
      console.error("Erro ao carregar todos os versículos:", err);
    });
});

window.onclick = function(event) {
  const modal = document.getElementById("modalAjuda");
  if (event.target === modal) {
    fecharAjuda();
  }
};

// Abre a modal de ajuda
function abrirAjuda() {
  document.getElementById("modalAjuda").style.display = 'block';
}

// Fecha a modal de ajuda
function fecharAjuda() {
  document.getElementById("modalAjuda").style.display = 'none';
}

// Carrega a última marcação do localStorage
function carregarUltimaLeitura() {
  const ultima = localStorage.getItem('ultimoVersiculo');
  if (!ultima) return;

  try {
    const { livro, capitulo, numero } = JSON.parse(ultima);

    // Remove marcação anterior
    document.querySelectorAll('.versiculo-lido').forEach(el => {
      el.classList.remove('versiculo-lido');
    });

    // Procura e adiciona novamente
    document.querySelectorAll('.card h3').forEach(h3 => {
      const texto = h3.textContent.trim();
      if (texto === `${livro} ${capitulo}:${numero}`) {
        h3.closest('.card')?.classList.add('versiculo-lido');
      }
    });
  } catch (err) {
    console.error("Erro ao carregar marcação:", err);
  }
}



// Função que recebe o nome do livro e retorna os livros e capítulos do respectivo testamento no formato JSON desejado
async function obterLivrosDoTestamento(nomeLivro) {
  try {
    const response = await fetch('indice-capitulos.json');
    const dados = await response.json();

    const { velhoTestamento, novoTestamento } = dados;

    if (velhoTestamento.hasOwnProperty(nomeLivro.toLowerCase())) {
      return velhoTestamento;
    }

    if (novoTestamento.hasOwnProperty(nomeLivro.toLowerCase())) {
      return novoTestamento;
    }

    return {
      erro: 'Livro não encontrado em nenhum dos testamentos.'
    };
  } catch (erro) {
    console.error('Erro ao carregar o arquivo:', erro);
    return { erro: 'Falha ao carregar o arquivo JSON.' };
  }
}
// Exemplo de uso:
// obterLivrosDoTestamento('joao').then(console.log);



// Registra o versículo como última leitura
function marcarComoLido(livro, capitulo, numero) {
  // Remove marcação anterior
  document.querySelectorAll('.versiculo-lido').forEach(el => {
    el.classList.remove('versiculo-lido');
  });

  // Adiciona à DOM
  const cardAtual = event.target.closest('.card');
  if (cardAtual) {
    cardAtual.classList.add('versiculo-lido');

    // Salva no localStorage
    localStorage.setItem('ultimoVersiculo', JSON.stringify({ livro, capitulo, numero }));
  }
}

function mostrarUltimaLeitura() {
  const ultima = localStorage.getItem('ultimoVersiculo');
  if (!ultima) return;

  const { livro, capitulo, numero } = JSON.parse(ultima);

  const conteudo = document.getElementById("conteudo");

  obterLivrosDoTestamento(`${removerAcentos(livro)}`).then(result => {
    capitulosDisponiveis = result;
    console.log('Capítulos disponíveis:', capitulosDisponiveis);
  });

  let html = `
    <div class="card card-destaque" onclick="carregarCapitulo('${removerAcentos(livro)}', ${capitulo})" style="cursor: pointer;">
      <h3>Última leitura:</h3>
      <p><strong>${livro} ${capitulo}:${numero}</strong></p>
    </div>
  `;

  conteudo.innerHTML = html + conteudo.innerHTML;
  aplicarModoEscuroDinamico();
}