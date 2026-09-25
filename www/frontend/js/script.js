// ============================================
// Fogo Baixo — script.js
// Dados ficam em memória (sem localStorage), como convém a um protótipo
// que ainda vai ganhar armazenamento nativo via Capacitor mais adiante.
//
// Aula 08: o app agora também sabe conversar com a nuvem. O array
// RECEITAS abaixo continua existindo como conteúdo padrão (offline),
// e a função testarConexaoSupabase(), lá no fim do arquivo, faz a
// primeira leitura (SELECT) na tabela "receitas" do Supabase e mostra
// o resultado no console e na tela — sem depender de mais nada.
// ============================================

import { supabase, supabaseConfigurado } from './supabaseClient.js';

const ICONS = {
  doces: `<svg viewBox="0 0 24 24" fill="none" stroke="#22261B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M4 10h16l-1.4 9.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8L4 10Z"/><path d="M9 14v3M12 14v3M15 14v3"/></svg>`,
  salgados: `<svg viewBox="0 0 24 24" fill="none" stroke="#22261B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h18"/><path d="M4 11a8 8 0 0 0 16 0"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/><path d="M2 11h1M21 11h1"/></svg>`,
  bebidas: `<svg viewBox="0 0 24 24" fill="none" stroke="#22261B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10l-1.2 15.4A2 2 0 0 1 13.8 20h-3.6a2 2 0 0 1-2-1.6L7 3Z"/><path d="M6 8h12"/></svg>`,
  rapidas: `<svg viewBox="0 0 24 24" fill="none" stroke="#22261B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>`
};

const THEME = {
  doces:    { bg: '#F4D9A6', bar: '#E3A730' },
  salgados: { bg: '#CFDAC4', bar: '#4B6B3C' },
  bebidas:  { bg: '#E9C0B4', bar: '#C1452D' },
  rapidas:  { bg: '#D8D3C6', bar: '#22261B' }
};

const RECEITAS = [
  {
    id: 'brigadeiro',
    nome: 'Brigadeiro Gourmet',
    imagemUrl: 'https://i.pinimg.com/736x/f5/d5/3d/f5d53d6da9b6d6b33757d256ceb6510a.jpg', // URL da imagem do produto
    categoria: 'doces',
    tempo: '20 min',
    porcoes: '20 unid.',
    dificuldade: 1,
    resumo: 'O clássico de festa, na versão com casquinha crocante e recheio macio.',
    ingredientes: [
      ['1 lata', 'leite condensado'],
      ['1 col. sopa', 'manteiga sem sal'],
      ['3 col. sopa', 'chocolate em pó 50%'],
      ['1 pitada', 'sal'],
      ['q.b.', 'granulado para enrolar']
    ],
    passos: [
      'Misture o leite condensado, a manteiga, o chocolate e o sal numa panela em fogo baixo.',
      'Mexa sem parar até a mistura desgrudar do fundo da panela, por cerca de 8 a 10 minutos.',
      'Transfira para um prato untado e deixe esfriar por 1 hora.',
      'Unte as mãos, enrole bolinhas e passe no granulado.'
    ]
  },
  {
    id: 'bolo-cenoura',
    nome: 'Bolo de Cenoura com Cobertura',
    imagemUrl: 'https://i.pinimg.com/1200x/b1/98/21/b19821d828b4379f40947e87722a7dae.jpg', // URL da imagem do produto
    categoria: 'doces',
    tempo: '50 min',
    porcoes: '10 fatias',
    dificuldade: 2,
    resumo: 'Massa fofa de cenoura com uma cobertura de chocolate brilhante por cima.',
    ingredientes: [
      ['3 unid.', 'cenouras médias'],
      ['4 unid.', 'ovos'],
      ['1 xícara', 'óleo'],
      ['2 xícaras', 'açúcar'],
      ['2 e ½ xícaras', 'farinha de trigo'],
      ['1 col. sopa', 'fermento em pó'],
      ['1 xícara', 'chocolate em pó (cobertura)'],
      ['1 xícara', 'açúcar (cobertura)'],
      ['1 col. sopa', 'manteiga (cobertura)']
    ],
    passos: [
      'Bata no liquidificador as cenouras, os ovos e o óleo até ficar homogêneo.',
      'Junte o açúcar e a farinha e bata mais um pouco. Misture o fermento por último, à mão.',
      'Asse em forma untada a 180°C por cerca de 35 minutos.',
      'Para a cobertura, leve todos os ingredientes ao fogo baixo até engrossar e despeje sobre o bolo já frio.'
    ]
  },
  {
    id: 'pao-de-queijo',
    nome: 'Pão de Queijo Mineiro',
    imagemUrl: 'https://i.pinimg.com/736x/de/54/75/de5475b096964328db561be7903050f2.jpg', // URL da imagem do produto
    categoria: 'salgados',
    tempo: '40 min',
    porcoes: '24 unid.',
    dificuldade: 2,
    resumo: 'Casquinha fina, miolo elástico — o pão de queijo do jeito que se espera.',
    ingredientes: [
      ['500 g', 'polvilho azedo'],
      ['1 xícara', 'leite'],
      ['½ xícara', 'óleo'],
      ['2 unid.', 'ovos'],
      ['300 g', 'queijo meia-cura ralado'],
      ['1 col. chá', 'sal']
    ],
    passos: [
      'Ferva o leite com o óleo e o sal e escalde o polvilho aos poucos, mexendo bem.',
      'Deixe amornar e adicione os ovos, um a um, sovando até incorporar.',
      'Misture o queijo ralado até formar uma massa homogênea e levemente pegajosa.',
      'Enrole bolinhas e asse a 180°C por 25 a 30 minutos, até dourar por fora.'
    ]
  },
  {
    id: 'moqueca',
    nome: 'Moqueca de Peixe',
    imagemUrl: 'https://i.pinimg.com/736x/8f/e8/29/8fe82942b7ba3f87e6d3f1ecec4c2c59.jpg', // URL da imagem do produto
    categoria: 'salgados',
    tempo: '45 min',
    porcoes: '4 pessoas',
    dificuldade: 3,
    resumo: 'Peixe cozido lentamente em leite de coco, dendê e pimentões coloridos.',
    ingredientes: [
      ['800 g', 'filé de peixe branco'],
      ['1 xícara', 'leite de coco'],
      ['2 col. sopa', 'azeite de dendê'],
      ['1 unid.', 'pimentão vermelho em tiras'],
      ['1 unid.', 'pimentão amarelo em tiras'],
      ['2 unid.', 'tomates em rodelas'],
      ['1 unid.', 'cebola em rodelas'],
      ['q.b.', 'coentro e limão']
    ],
    passos: [
      'Tempere o peixe com sal, alho e limão e deixe descansar 20 minutos.',
      'Em uma panela larga, monte camadas alternadas de cebola, tomate, pimentão e peixe.',
      'Regue com o leite de coco e o dendê e cozinhe em fogo médio-baixo, com a panela tampada, por 20 minutos sem mexer demais.',
      'Finalize com coentro fresco picado e sirva com arroz branco.'
    ]
  },
  {
    id: 'coxinha',
    nome: 'Coxinha de Frango',
    imagemUrl: 'https://i.pinimg.com/736x/3e/80/25/3e8025eaeacaa77fabe7166a0698c79d.jpg', // URL da imagem do produto
    categoria: 'salgados',
    tempo: '1h 10min',
    porcoes: '18 unid.',
    dificuldade: 3,
    resumo: 'Massa lisinha em formato de gota, recheada e frita até dourar.',
    ingredientes: [
      ['500 ml', 'caldo de galinha'],
      ['2 xícaras', 'farinha de trigo'],
      ['1 col. sopa', 'manteiga'],
      ['300 g', 'frango cozido e desfiado'],
      ['1 unid.', 'cebola picada (refogado)'],
      ['q.b.', 'farinha de rosca para empanar'],
      ['2 unid.', 'ovos batidos para empanar']
    ],
    passos: [
      'Refogue a cebola e misture ao frango desfiado, temperando a gosto — esse é o recheio.',
      'Leve o caldo e a manteiga ao fogo; quando ferver, adicione a farinha de uma vez e mexa até desgrudar da panela.',
      'Ainda morna, sove a massa e modele porções recheadas em formato de gota.',
      'Passe no ovo e na farinha de rosca e frite em óleo quente até dourar por igual.'
    ]
  },
  {
    id: 'suco-verde',
    nome: 'Suco Verde Detox',
    imagemUrl: 'https://i.pinimg.com/1200x/0d/1e/f2/0d1ef27ff15f56cb0f8cc5cfceb07e77.jpg', // URL da imagem do produto
    categoria: 'bebidas',
    tempo: '10 min',
    porcoes: '2 copos',
    dificuldade: 1,
    resumo: 'Couve, gengibre e maçã batidos rápido, sem coar, direto pro copo.',
    ingredientes: [
      ['2 folhas', 'couve'],
      ['1 unid.', 'maçã verde'],
      ['1 fatia', 'gengibre'],
      ['1 unid.', 'limão espremido'],
      ['400 ml', 'água gelada']
    ],
    passos: [
      'Bata todos os ingredientes no liquidificador por cerca de 1 minuto.',
      'Sirva imediatamente, sem coar, para manter as fibras.'
    ]
  },
  {
    id: 'caipirinha-morango',
    nome: 'Caipirinha de Morango',
    imagemUrl: 'https://i.pinimg.com/736x/59/16/4b/59164b684ea48c09368e3194ee01efc1.jpg', // URL da imagem do produto
    categoria: 'bebidas',
    tempo: '10 min',
    porcoes: '1 copo',
    dificuldade: 1,
    resumo: 'A caipirinha clássica ganhando doçura e cor com morangos frescos.',
    ingredientes: [
      ['5 unid.', 'morangos'],
      ['1 col. sopa', 'açúcar'],
      ['50 ml', 'cachaça'],
      ['q.b.', 'gelo']
    ],
    passos: [
      'Amasse os morangos com o açúcar diretamente no copo.',
      'Adicione a cachaça e o gelo e mexa bem antes de servir.'
    ]
  },
  {
    id: 'salada-tropical',
    nome: 'Salada Tropical Rápida',
    imagemUrl: 'https://i.pinimg.com/736x/6e/fb/31/6efb31f09d183e2945400ca6165c8138.jpg', // URL da imagem do produto
    categoria: 'rapidas',
    tempo: '15 min',
    porcoes: '2 pessoas',
    dificuldade: 1,
    resumo: 'Folhas verdes, manga e castanhas — pronta no tempo de lavar a louça.',
    ingredientes: [
      ['2 xícaras', 'folhas verdes variadas'],
      ['1 unid.', 'manga em cubos'],
      ['⅓ xícara', 'castanhas picadas'],
      ['2 col. sopa', 'azeite'],
      ['1 unid.', 'limão espremido'],
      ['q.b.', 'sal e pimenta']
    ],
    passos: [
      'Monte as folhas em uma tigela larga e distribua a manga e as castanhas por cima.',
      'Regue com azeite e limão, tempere com sal e pimenta e sirva na hora.'
    ]
  },
  {
    id: 'pudim-leite',
    nome: 'Pudim de Leite Condensado',
    imagemUrl: 'https://i.pinimg.com/1200x/cd/e2/2f/cde22f87de022714c90ec943884f06bf.jpg', // Cole aqui a URL da imagem do produto
    categoria: 'doces',
    tempo: '1h 20min',
    porcoes: '10 fatias',
    dificuldade: 2,
    resumo: 'Pudim cremoso, com textura lisa e uma calda dourada que derrete na boca.',
    ingredientes: [['1 lata', 'leite condensado'], ['2 medidas', 'leite integral'], ['3 unid.', 'ovos'], ['1 xícara', 'açúcar para a calda']],
    passos: ['Derreta o açúcar na forma até formar uma calda dourada e espalhe pelas laterais.', 'Bata o leite condensado, o leite e os ovos até ficar uniforme.', 'Despeje na forma, cubra com papel-alumínio e asse em banho-maria a 180°C por cerca de 1 hora.', 'Espere esfriar, leve à geladeira e desenforme antes de servir.']
  },
  {
    id: 'brownie-chocolate',
    nome: 'Brownie de Chocolate',
    imagemUrl: 'https://i.pinimg.com/736x/0d/13/ff/0d13ff1f53f7a75ca71ca21e31f89e4f.jpg', // Cole aqui a URL da imagem do produto
    categoria: 'doces',
    tempo: '35 min',
    porcoes: '12 pedaços',
    dificuldade: 1,
    resumo: 'Quadradinhos intensos de chocolate, com casquinha fina e centro úmido.',
    ingredientes: [['200 g', 'chocolate meio amargo'], ['150 g', 'manteiga'], ['3 unid.', 'ovos'], ['1 xícara', 'açúcar'], ['¾ xícara', 'farinha de trigo'], ['q.b.', 'castanhas picadas']],
    passos: ['Derreta o chocolate com a manteiga em banho-maria ou no micro-ondas.', 'Misture os ovos e o açúcar, depois incorpore o chocolate derretido.', 'Junte a farinha e as castanhas sem bater demais.', 'Asse em forma forrada a 180°C por 25 minutos e corte depois de frio.']
  },
  {
    id: 'lasanha-bolonhesa',
    nome: 'Lasanha à Bolonhesa',
    imagemUrl: 'https://i.pinimg.com/736x/e6/11/51/e6115131be1020442a89648927a2c497.jpg', // Cole aqui a URL da imagem do produto
    categoria: 'salgados',
    tempo: '1h 10min',
    porcoes: '6 pessoas',
    dificuldade: 3,
    resumo: 'Camadas generosas de massa, molho de carne e queijo gratinado até borbulhar.',
    ingredientes: [['500 g', 'carne moída'], ['500 ml', 'molho de tomate'], ['300 g', 'massa para lasanha'], ['300 g', 'muçarela fatiada'], ['150 g', 'presunto fatiado'], ['q.b.', 'cebola, alho e sal']],
    passos: ['Refogue a carne com cebola e alho e cozinhe com o molho de tomate por 15 minutos.', 'Monte camadas de molho, massa, presunto e queijo em um refratário.', 'Repita as camadas e finalize com bastante muçarela.', 'Cubra com papel-alumínio e asse a 200°C por 30 minutos; retire o papel e gratine.']
  },
  {
    id: 'pastel-feira',
    nome: 'Pastel Crocante de Feira',
    imagemUrl: 'https://i.pinimg.com/1200x/6f/55/88/6f558830405e1095aec2b7630d5a2076.jpg', // Cole aqui a URL da imagem do produto
    categoria: 'salgados',
    tempo: '40 min',
    porcoes: '12 unid.',
    dificuldade: 2,
    resumo: 'Massa sequinha e crocante, recheada com queijo e carne bem temperada.',
    ingredientes: [['12 discos', 'massa de pastel'], ['300 g', 'carne moída refogada'], ['200 g', 'muçarela'], ['q.b.', 'tomate e cheiro-verde'], ['q.b.', 'óleo para fritar']],
    passos: ['Distribua o recheio no centro dos discos, sem exagerar na quantidade.', 'Dobre a massa e pressione as bordas com um garfo para fechar.', 'Aqueça o óleo e frite os pastéis até ficarem dourados.', 'Escorra em papel-toalha e sirva ainda quentes.']
  },
  {
    id: 'vitamina-banana',
    nome: 'Vitamina de Banana',
    imagemUrl: 'https://i.pinimg.com/1200x/e7/b9/ba/e7b9bab4908904dd1be045dd1338d77c.jpg', // Cole aqui a URL da imagem do produto
    categoria: 'bebidas',
    tempo: '5 min',
    porcoes: '2 copos',
    dificuldade: 1,
    resumo: 'Bebida cremosa e nutritiva, perfeita para começar o dia com energia.',
    ingredientes: [['2 unid.', 'bananas maduras'], ['400 ml', 'leite gelado'], ['2 col. sopa', 'aveia'], ['q.b.', 'canela e mel']],
    passos: ['Coloque todos os ingredientes no liquidificador.', 'Bata por 1 minuto, até a vitamina ficar bem cremosa.', 'Prove, ajuste o mel e sirva imediatamente com canela.']
  },
  {
    id: 'limonada-suica',
    nome: 'Limonada Suíça',
    imagemUrl: 'https://i.pinimg.com/1200x/06/32/ad/0632ad476dadc711a68a1fce564486d3.jpg', // Cole aqui a URL da imagem do produto
    categoria: 'bebidas',
    tempo: '8 min',
    porcoes: '4 copos',
    dificuldade: 1,
    resumo: 'Limonada refrescante batida com casca e leite condensado na medida certa.',
    ingredientes: [['4 unid.', 'limões'], ['1 litro', 'água gelada'], ['½ lata', 'leite condensado'], ['q.b.', 'gelo']],
    passos: ['Lave os limões, corte em quatro e retire a parte branca central.', 'Bata rapidamente com a água e coe para não amargar.', 'Volte o líquido ao liquidificador com o leite condensado e o gelo.', 'Bata por alguns segundos e sirva na hora.']
  },
  {
    id: 'omelete-queijo',
    nome: 'Omelete de Queijo e Ervas',
    imagemUrl: 'https://i.pinimg.com/736x/fc/db/dd/fcdbddbc569a35483b780af60621c43e.jpg', // Cole aqui a URL da imagem do produto
    categoria: 'rapidas',
    tempo: '10 min',
    porcoes: '1 pessoa',
    dificuldade: 1,
    resumo: 'Ovos macios por dentro, queijo derretido e ervas frescas em poucos minutos.',
    ingredientes: [['2 unid.', 'ovos'], ['2 col. sopa', 'muçarela ralada'], ['1 col. sopa', 'leite'], ['q.b.', 'salsinha, sal e pimenta'], ['1 fio', 'azeite']],
    passos: ['Bata os ovos com o leite, o sal, a pimenta e a salsinha.', 'Aqueça uma frigideira antiaderente com um fio de azeite.', 'Despeje os ovos e espalhe o queijo quando começarem a firmar.', 'Dobre a omelete ao meio e sirva imediatamente.']
  },
  {
    id: 'tapioca-frango',
    nome: 'Tapioca de Frango Cremoso',
    imagemUrl: 'https://i.pinimg.com/736x/d0/46/e1/d046e190d23d3a834121cf0161444ca9.jpg', // Cole aqui a URL da imagem do produto
    categoria: 'rapidas',
    tempo: '15 min',
    porcoes: '2 unid.',
    dificuldade: 1,
    resumo: 'Tapioca douradinha recheada com frango temperado e creme de requeijão.',
    ingredientes: [['1 xícara', 'goma de tapioca'], ['1 xícara', 'frango desfiado'], ['2 col. sopa', 'requeijão'], ['q.b.', 'tomate, cebola e cheiro-verde']],
    passos: ['Misture o frango com o requeijão, o tomate e o cheiro-verde.', 'Espalhe metade da goma em uma frigideira quente e nivele com uma colher.', 'Quando a massa firmar, vire, recheie e dobre ao meio.', 'Aqueça por mais 1 minuto e repita com o restante da goma.']
  },
  {
    id: 'mousse-maracuja',
    nome: 'Mousse de Maracujá',
    imagemUrl: 'https://i.pinimg.com/736x/ad/8e/59/ad8e590cbe5d40c4e7adc7e003b0d8ea.jpg', // URL da imagem do produto
    categoria: 'doces',
    tempo: '15 min',
    porcoes: '6 taças',
    dificuldade: 1,
    resumo: 'Sobremesa aerada, cremosa e azedinha, finalizada com uma calda brilhante de maracujá.',
    ingredientes: [['1 lata', 'leite condensado'], ['1 caixa', 'creme de leite'], ['1 xícara', 'suco concentrado de maracujá'], ['½ xícara', 'polpa para a calda']],
    passos: ['Bata o leite condensado, o creme de leite e o suco no liquidificador.', 'Distribua em taças e leve à geladeira por pelo menos 3 horas.', 'Cozinhe a polpa com uma colher de açúcar por alguns minutos.', 'Espere a calda esfriar e coloque sobre a mousse antes de servir.']
  },
  {
    id: 'arroz-doce',
    nome: 'Arroz-Doce Cremoso',
    imagemUrl: 'https://i.pinimg.com/1200x/06/ce/ab/06ceabfb20f66f848fd6072d14b02adc.jpg', // URL da imagem do produto
    categoria: 'doces',
    tempo: '40 min',
    porcoes: '8 porções',
    dificuldade: 1,
    resumo: 'Arroz macio cozido no leite, perfumado com canela e servido bem cremoso.',
    ingredientes: [['1 xícara', 'arroz branco'], ['2 xícaras', 'água'], ['1 litro', 'leite'], ['1 lata', 'leite condensado'], ['q.b.', 'canela em pau e em pó']],
    passos: ['Cozinhe o arroz na água com a canela em pau até os grãos ficarem macios.', 'Adicione o leite e cozinhe em fogo baixo, mexendo de vez em quando.', 'Junte o leite condensado e cozinhe até engrossar.', 'Sirva morno ou gelado com canela em pó.']
  },
  {
    id: 'escondidinho-carne',
    nome: 'Escondidinho de Carne-Seca',
    imagemUrl: 'https://i.pinimg.com/736x/a5/de/21/a5de21f532165ba62d8900cc42bdae83.jpg', // URL da imagem do produto
    categoria: 'salgados',
    tempo: '1h',
    porcoes: '6 pessoas',
    dificuldade: 3,
    resumo: 'Purê de mandioca aveludado cobrindo um recheio bem temperado de carne-seca.',
    ingredientes: [['1 kg', 'mandioca cozida'], ['500 g', 'carne-seca dessalgada'], ['2 col. sopa', 'manteiga'], ['200 ml', 'creme de leite'], ['200 g', 'queijo coalho ralado'], ['q.b.', 'cebola e cheiro-verde']],
    passos: ['Amasse a mandioca ainda quente e misture com manteiga, creme de leite e sal.', 'Refogue a carne-seca desfiada com cebola e cheiro-verde.', 'Coloque metade do purê em um refratário, espalhe a carne e cubra com o restante.', 'Finalize com queijo e gratine a 200°C até dourar.']
  },
  {
    id: 'risoto-cogumelos',
    nome: 'Risoto de Cogumelos',
    imagemUrl: 'https://i.pinimg.com/1200x/c8/59/d8/c859d8441979fbf0bb33603e42ff6abe.jpg', // URL da imagem do produto
    categoria: 'salgados',
    tempo: '35 min',
    porcoes: '4 pessoas',
    dificuldade: 3,
    resumo: 'Arroz arbóreo cremoso, com cogumelos dourados e um toque delicado de parmesão.',
    ingredientes: [['1½ xícara', 'arroz arbóreo'], ['300 g', 'cogumelos fatiados'], ['1 litro', 'caldo de legumes quente'], ['½ xícara', 'vinho branco seco'], ['50 g', 'parmesão ralado'], ['2 col. sopa', 'manteiga']],
    passos: ['Doure os cogumelos em uma panela e reserve.', 'Refogue o arroz, acrescente o vinho e mexa até evaporar.', 'Adicione o caldo aos poucos, mexendo sempre, até o arroz ficar al dente.', 'Misture os cogumelos, a manteiga e o parmesão; sirva imediatamente.']
  },
  {
    id: 'chocolate-quente',
    nome: 'Chocolate Quente Cremoso',
    imagemUrl: 'https://i.pinimg.com/736x/96/3e/92/963e92989cb335f9c42635f27ba0e1d4.jpg', // URL da imagem do produto
    categoria: 'bebidas',
    tempo: '15 min',
    porcoes: '2 canecas',
    dificuldade: 1,
    resumo: 'Bebida encorpada de chocolate para aquecer os dias frios com muito sabor.',
    ingredientes: [['500 ml', 'leite integral'], ['4 col. sopa', 'chocolate em pó'], ['2 col. sopa', 'açúcar'], ['1 col. sopa', 'amido de milho'], ['100 g', 'chocolate meio amargo']],
    passos: ['Dissolva o amido, o chocolate em pó e o açúcar em um pouco do leite frio.', 'Junte o restante do leite e leve ao fogo baixo, mexendo sempre.', 'Acrescente o chocolate picado e mexa até derreter e engrossar.', 'Sirva quente em canecas.']
  },
  {
    id: 'smoothie-morango',
    nome: 'Smoothie de Morango',
    imagemUrl: 'https://i.pinimg.com/1200x/d0/46/6d/d0466d8813dd68fbee80f4c8ffe51745.jpg', // URL da imagem do produto
    categoria: 'bebidas',
    tempo: '5 min',
    porcoes: '2 copos',
    dificuldade: 1,
    resumo: 'Morangos gelados batidos com iogurte para uma bebida fresca e naturalmente cremosa.',
    ingredientes: [['2 xícaras', 'morangos congelados'], ['1 pote', 'iogurte natural'], ['½ xícara', 'leite gelado'], ['1 col. sopa', 'mel']],
    passos: ['Lave e retire as folhas dos morangos antes de congelar.', 'Bata todos os ingredientes até ficar liso e cremoso.', 'Ajuste o mel conforme o sabor dos morangos.', 'Sirva imediatamente para manter a textura gelada.']
  },
  {
    id: 'sanduiche-natural',
    nome: 'Sanduíche Natural de Frango',
    imagemUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85', // URL da imagem do produto
    categoria: 'rapidas',
    tempo: '15 min',
    porcoes: '4 unid.',
    dificuldade: 1,
    resumo: 'Lanche leve e prático com frango cremoso, cenoura crocante e folhas frescas.',
    ingredientes: [['8 fatias', 'pão integral'], ['2 xícaras', 'frango desfiado'], ['3 col. sopa', 'maionese ou iogurte'], ['1 unid.', 'cenoura ralada'], ['q.b.', 'alface e sal']],
    passos: ['Misture o frango, a maionese, a cenoura e o sal.', 'Espalhe o recheio em quatro fatias de pão.', 'Adicione as folhas e feche os sanduíches.', 'Corte ao meio e sirva ou embrulhe para levar.']
  },
  {
    id: 'macarrao-alho-oleo',
    nome: 'Macarrão Alho e Óleo',
    imagemUrl: 'https://i.pinimg.com/736x/33/b5/83/33b5832bbb34015e4759d8b67aa4fea9.jpg', // URL da imagem do produto
    categoria: 'rapidas',
    tempo: '20 min',
    porcoes: '2 pessoas',
    dificuldade: 1,
    resumo: 'Massa soltinha envolvida por alho dourado, azeite e cheiro-verde.',
    ingredientes: [['250 g', 'espaguete'], ['5 dentes', 'alho fatiado'], ['½ xícara', 'azeite'], ['q.b.', 'salsinha, sal e pimenta'], ['1 concha', 'água do cozimento']],
    passos: ['Cozinhe o macarrão em água salgada até ficar al dente e reserve uma concha da água.', 'Doure o alho no azeite em fogo baixo, sem deixar queimar.', 'Junte o macarrão e a água reservada, misturando até envolver tudo.', 'Finalize com salsinha e pimenta e sirva quente.']
  },
  {
    id: 'panqueca-banana',
    nome: 'Panqueca de Banana',
    imagemUrl: 'https://i.pinimg.com/736x/2f/2f/2c/2f2f2c0f5fed348aae287952049d08a3.jpg', // URL da imagem do produto
    categoria: 'rapidas',
    tempo: '15 min',
    porcoes: '6 unid.',
    dificuldade: 1,
    resumo: 'Panquecas fofinhas de banana, rápidas de preparar e perfeitas para o café da manhã.',
    ingredientes: [['1 unid.', 'banana madura'], ['1 unid.', 'ovo'], ['½ xícara', 'aveia em flocos'], ['1 col. chá', 'fermento'], ['1 pitada', 'canela']],
    passos: ['Amasse a banana e misture com o ovo, a aveia, o fermento e a canela.', 'Aqueça uma frigideira antiaderente levemente untada.', 'Coloque pequenas porções da massa e doure dos dois lados.', 'Sirva com frutas, mel ou iogurte.']
  }
];

const state = {
  categoria: 'todas',
  busca: '',
  favoritos: new Set()
};

const grid = document.getElementById('grid');
const vazio = document.getElementById('vazio');
const contador = document.getElementById('contador');

function difficultyDots(n) {
  return `<span class="diff-dots" title="Dificuldade">${[1,2,3].map(i => `<span class="${i <= n ? 'on' : ''}"></span>`).join('')}</span>`;
}

function imagemReceitaHTML(r) {
  if (r.imagemUrl.trim()) {
    return `<img class="recipe-image" src="${r.imagemUrl}" alt="${r.nome}" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false" />`;
  }
  return '';
}

function cardHTML(r) {
  const theme = THEME[r.categoria];
  const isFav = state.favoritos.has(r.id);
  return `
    <article class="recipe-card" data-id="${r.id}" tabindex="0" role="button" aria-label="Ver receita de ${r.nome}">
      <div class="accent-bar" style="background:${theme.bar}"></div>
      <div class="swatch" style="background:${theme.bg}">
        ${imagemReceitaHTML(r)}
        <span class="image-placeholder" ${r.imagemUrl.trim() ? 'hidden' : ''}>${ICONS[r.categoria]}</span>
        <span class="stamp">${r.tempo}</span>
      </div>
      <div class="body">
        <h3 class="font-display text-lg font-semibold leading-snug">${r.nome}</h3>
        <p class="text-sm text-charcoal/60 mt-1.5 leading-snug">${r.resumo}</p>
        <div class="mt-3 flex items-center justify-between text-xs text-charcoal/50">
          ${difficultyDots(r.dificuldade)}
          <span class="font-stamp">${r.porcoes}</span>
        </div>
      </div>
      <button class="fav-btn ${isFav ? 'is-fav' : ''}" data-fav="${r.id}" aria-label="Favoritar ${r.nome}">
        <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.2C.5 8.4 2.4 5 6 5c2 0 3.4 1 4 2.2C10.6 6 12 5 14 5c3.6 0 5.5 3.4 4 6.8C19.5 16.4 12 21 12 21Z" stroke-width="1.8" stroke-linejoin="round"/></svg>
      </button>
    </article>
  `;
}

function render() {
  const termo = state.busca.trim().toLowerCase();

  const filtradas = RECEITAS.filter(r => {
    const bateCategoria = state.categoria === 'todas' || r.categoria === state.categoria;
    if (!bateCategoria) return false;
    if (!termo) return true;
    const nomeBate = r.nome.toLowerCase().includes(termo);
    const ingredienteBate = r.ingredientes.some(([, nome]) => nome.toLowerCase().includes(termo));
    return nomeBate || ingredienteBate;
  });

  grid.innerHTML = filtradas.map(cardHTML).join('');
  vazio.classList.toggle('hidden', filtradas.length > 0);

  const rotulo = state.categoria === 'todas' ? 'no caderno' : `em “${document.querySelector('.cat-pill.is-active').textContent.trim()}”`;
  contador.textContent = `${filtradas.length} receita${filtradas.length === 1 ? '' : 's'} ${rotulo}`;
}

// ---------- filtros ----------
document.getElementById('categorias').addEventListener('click', (e) => {
  const btn = e.target.closest('.cat-pill');
  if (!btn) return;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('is-active'));
  btn.classList.add('is-active');
  state.categoria = btn.dataset.cat;
  render();
});

document.getElementById('busca').addEventListener('input', (e) => {
  state.busca = e.target.value;
  render();
});

// ---------- favoritos + abrir modal ----------
grid.addEventListener('click', (e) => {
  const favBtn = e.target.closest('[data-fav]');
  if (favBtn) {
    const id = favBtn.dataset.fav;
    state.favoritos.has(id) ? state.favoritos.delete(id) : state.favoritos.add(id);
    favBtn.classList.toggle('is-fav');
    return;
  }
  const card = e.target.closest('.recipe-card');
  if (card) abrirReceita(card.dataset.id);
});

grid.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const card = e.target.closest('.recipe-card');
  if (card) abrirReceita(card.dataset.id);
});

// ---------- modal ----------
const modalBackdrop = document.getElementById('modalBackdrop');
const modalContent = document.getElementById('modalContent');

function abrirReceita(id) {
  const r = RECEITAS.find(x => x.id === id);
  if (!r) return;
  const theme = THEME[r.categoria];

  modalContent.innerHTML = `
    ${r.imagemUrl.trim() ? `<img class="modal-recipe-image" src="${r.imagemUrl}" alt="${r.nome}" onerror="this.hidden=true" />` : ''}
    <span class="stamp" style="position:static;display:inline-block;transform:rotate(-2deg);border-color:${theme.bar}">${r.tempo} · ${r.porcoes}</span>
    <h2 class="font-display text-2xl md:text-3xl font-semibold mt-3 leading-tight">${r.nome}</h2>
    <p class="text-sm text-charcoal/60 mt-2">${r.resumo}</p>

    <h3 class="font-stamp text-xs uppercase tracking-wide text-charcoal/40 mt-6 mb-1">Ingredientes</h3>
    <ul class="ingredient-list">
      ${r.ingredientes.map(([qtd, nome]) => `<li><span>${nome}</span><span class="qty">${qtd}</span></li>`).join('')}
    </ul>

    <h3 class="font-stamp text-xs uppercase tracking-wide text-charcoal/40 mt-6 mb-3">Modo de preparo</h3>
    <ol class="step-list">
      ${r.passos.map(p => `<li>${p}</li>`).join('')}
    </ol>
  `;
  modalBackdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function fecharModal() {
  modalBackdrop.classList.add('hidden');
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', fecharModal);
modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) fecharModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharModal(); });

// ---------- menu mobile (rolagem até seções) ----------
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('receitas').scrollIntoView({ behavior: 'smooth' });
});

// ---------- demo da ponte nativa ----------
let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

document.getElementById('btnCamera').addEventListener('click', () => {
  toast('📷 Em um app real, o Capacitor Camera abriria a câmera nativa aqui.');
});

document.getElementById('btnGps').addEventListener('click', () => {
  toast('📍 Em um app real, o Capacitor Geolocation pediria sua posição ao sistema.');
});

// ============================================
// Aula 08 — primeira leitura (SELECT) no Supabase
// ------------------------------------------------------------
// Isso NÃO substitui o array RECEITAS (que continua sendo o conteúdo
// padrão do app, offline). É a primeira ponte real com o banco na
// nuvem: uma consulta simples de leitura, só para provar que o app
// e o Supabase estão conversando.
//
// Pré-requisito no painel do Supabase (SQL Editor), se ainda não existir:
//
//   create table receitas (
//     id bigint generated always as identity primary key,
//     nome text not null,
//     categoria text,
//     tempo text,
//     created_at timestamp with time zone default now()
//   );
//
//   -- Row Level Security: sem isso, a leitura pública é bloqueada.
//   alter table receitas enable row level security;
//   create policy "Leitura publica" on receitas
//     for select using (true);
// ============================================
const statusSupabase = document.getElementById('statusSupabase');

async function testarConexaoSupabase() {
  if (!supabaseConfigurado) {
    if (statusSupabase) {
      statusSupabase.textContent = '⚙️ Supabase ainda não configurado — preencha o .env.local (veja o console).';
    }
    return;
  }

  if (statusSupabase) statusSupabase.textContent = '⏳ Consultando o Supabase…';

  // A consulta em si: SELECT * FROM receitas LIMIT 5
  const { data, error } = await supabase
    .from('receitas')
    .select('*')
    .limit(5);

  if (error) {
    console.error('[Supabase] Erro ao consultar a tabela "receitas":', error.message);
    if (statusSupabase) {
      statusSupabase.textContent = `⚠️ Supabase respondeu com erro: ${error.message} (confira se a tabela "receitas" existe e se o RLS permite leitura).`;
    }
    return;
  }

  console.log('[Supabase] Registros recebidos da tabela "receitas":', data);
  if (statusSupabase) {
    statusSupabase.textContent = data.length
      ? `✅ Conectado ao Supabase — ${data.length} registro(s) encontrado(s) na tabela "receitas" (veja o console).`
      : '✅ Conectado ao Supabase — a tabela "receitas" existe, mas ainda está vazia.';
  }
}

// ---------- primeira renderização ----------
render();
testarConexaoSupabase();
