/*
 * script.js — Lógica do Personal Trainer Virtual
 * Controla o wizard de anamnese, o algoritmo de geração de treino,
 * a tela de resultado e a persistência em localStorage.
 */

// ===================== CHAVES DE LOCALSTORAGE =====================
const CHAVE_TEMA = 'ptv_tema';
const CHAVE_RESPOSTAS = 'ptv_respostas';
const CHAVE_TREINO = 'ptv_treino';
const CHAVE_PROGRESSO = 'ptv_progresso';
const CHAVE_PESOS = 'ptv_pesos';

// ===================== ESTADO DO WIZARD =====================
const TOTAL_PASSOS = 11;
let passoAtual = 1;

// ===================== ELEMENTOS =====================
const telaBoasVindas = document.getElementById('tela-boasvindas');
const telaQuestionario = document.getElementById('tela-questionario');
const telaLoading = document.getElementById('tela-loading');
const telaResultado = document.getElementById('tela-resultado');

const form = document.getElementById('form-anamnese');
const btnAvancar = document.getElementById('btn-avancar');
const btnVoltar = document.getElementById('btn-voltar');
const btnFinalizar = document.getElementById('btn-finalizar');

// ===================================================================
// UTILITÁRIOS
// ===================================================================

function mostrarTela(tela) {
  document.querySelectorAll('.tela').forEach(t => t.classList.remove('tela-ativa'));
  tela.classList.add('tela-ativa');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function lerJSON(chave, padrao) {
  try {
    const valor = localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : padrao;
  } catch (e) {
    return padrao;
  }
}

function salvarJSON(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

// ===================================================================
// TEMA (dark mode padrão / light mode opcional)
// ===================================================================

function aplicarTema(tema) {
  if (tema === 'claro') {
    document.documentElement.setAttribute('data-tema', 'claro');
  } else {
    document.documentElement.removeAttribute('data-tema');
  }
  const icone = tema === 'claro' ? 'fa-sun' : 'fa-moon';
  document.querySelectorAll('#btn-tema i, #btn-tema-2 i').forEach(i => {
    i.className = `fa-solid ${icone}`;
  });
}

function alternarTema() {
  const atual = localStorage.getItem(CHAVE_TEMA) === 'claro' ? 'claro' : 'escuro';
  const novo = atual === 'claro' ? 'escuro' : 'claro';
  localStorage.setItem(CHAVE_TEMA, novo);
  aplicarTema(novo);
}

document.getElementById('btn-tema').addEventListener('click', alternarTema);
document.getElementById('btn-tema-2').addEventListener('click', alternarTema);
aplicarTema(localStorage.getItem(CHAVE_TEMA) === 'claro' ? 'claro' : 'escuro');

// ===================================================================
// WIZARD — NAVEGAÇÃO ENTRE PASSOS
// ===================================================================

function atualizarProgresso() {
  const percentual = Math.round((passoAtual / TOTAL_PASSOS) * 100);
  document.getElementById('progresso-texto').textContent = `Etapa ${passoAtual} de ${TOTAL_PASSOS}`;
  document.getElementById('progresso-percentual').textContent = `${percentual}%`;
  document.getElementById('progresso-fill').style.width = `${percentual}%`;
}

function irParaPasso(numero) {
  document.querySelectorAll('.passo').forEach(p => p.classList.remove('passo-ativo'));
  const passo = document.querySelector(`.passo[data-passo="${numero}"]`);
  passo.classList.add('passo-ativo');
  passoAtual = numero;
  atualizarProgresso();

  btnVoltar.style.visibility = passoAtual === 1 ? 'hidden' : 'visible';
  if (passoAtual === TOTAL_PASSOS) {
    btnAvancar.classList.add('btn-oculto');
    btnFinalizar.classList.remove('btn-oculto');
  } else {
    btnAvancar.classList.remove('btn-oculto');
    btnFinalizar.classList.add('btn-oculto');
  }
}

// Valida o passo atual antes de avançar
function validarPasso(numero) {
  switch (numero) {
    case 1:
      return document.getElementById('campo-nome').value.trim().length > 0;
    case 2:
      return form.querySelectorAll('input[name="objetivo"]:checked').length > 0;
    case 3:
      return document.getElementById('campo-peso').value && document.getElementById('campo-altura').value;
    case 4:
      return document.getElementById('campo-idade').value && !!form.querySelector('input[name="sexo"]:checked');
    case 5:
      return !!form.querySelector('input[name="nivel"]:checked');
    case 6:
      return !!form.querySelector('input[name="frequencia"]:checked');
    case 7:
      return !!form.querySelector('input[name="local"]:checked');
    case 8:
      return !!form.querySelector('input[name="tempo"]:checked');
    case 9:
      return form.querySelectorAll('input[name="restricoes"]:checked').length > 0;
    case 10:
      return !!form.querySelector('input[name="atividadeAtual"]:checked');
    default:
      return true;
  }
}

btnAvancar.addEventListener('click', () => {
  if (!validarPasso(passoAtual)) {
    alert('Por favor, responda essa pergunta antes de continuar.');
    return;
  }
  if (passoAtual < TOTAL_PASSOS) irParaPasso(passoAtual + 1);
});

btnVoltar.addEventListener('click', () => {
  if (passoAtual > 1) irParaPasso(passoAtual - 1);
});

// Regra: "Nenhuma restrição" é mutuamente exclusiva com as demais opções
document.querySelectorAll('input[name="restricoes"]').forEach(chk => {
  chk.addEventListener('change', () => {
    const nenhuma = document.getElementById('check-nenhuma');
    if (chk.value === 'nenhuma' && chk.checked) {
      document.querySelectorAll('input[name="restricoes"]').forEach(c => {
        if (c.value !== 'nenhuma') c.checked = false;
      });
    } else if (chk.value !== 'nenhuma' && chk.checked) {
      nenhuma.checked = false;
    }
  });
});

document.getElementById('btn-iniciar').addEventListener('click', () => {
  mostrarTela(telaQuestionario);
  irParaPasso(1);
});

// ===================================================================
// SUBMISSÃO DO FORMULÁRIO → GERAÇÃO DO TREINO
// ===================================================================

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  if (!validarPasso(TOTAL_PASSOS)) return;

  const respostas = coletarRespostas();
  salvarJSON(CHAVE_RESPOSTAS, respostas);

  mostrarTela(telaLoading);
  animarLoading();

  setTimeout(() => {
    const treino = gerarTreino(respostas);
    salvarJSON(CHAVE_TREINO, treino);
    salvarJSON(CHAVE_PROGRESSO, {}); // zera progresso ao gerar um treino novo
    salvarJSON(CHAVE_PESOS, [{ data: new Date().toISOString(), peso: respostas.peso }]); // reinicia histórico de peso
    renderizarResultado(treino, respostas);
    mostrarTela(telaResultado);
  }, 2200);
});

function animarLoading() {
  const mensagens = [
    'Analisando suas respostas...',
    'Calculando seu IMC...',
    'Selecionando os melhores exercícios...',
    'Ajustando séries e repetições...',
    'Montando sua ficha de treino...'
  ];
  const subtextoEl = document.getElementById('loading-subtexto');
  let i = 0;
  const intervalo = setInterval(() => {
    subtextoEl.textContent = mensagens[i % mensagens.length];
    i++;
  }, 420);
  setTimeout(() => clearInterval(intervalo), 2200);
}

function coletarRespostas() {
  const restricoesMarcadas = Array.from(form.querySelectorAll('input[name="restricoes"]:checked')).map(c => c.value);
  const outraRestricao = document.getElementById('campo-outra-restricao').value.trim();

  const peso = parseFloat(document.getElementById('campo-peso').value);
  const altura = parseFloat(document.getElementById('campo-altura').value);

  return {
    nome: document.getElementById('campo-nome').value.trim(),
    objetivos: Array.from(form.querySelectorAll('input[name="objetivo"]:checked')).map(c => c.value),
    peso, altura,
    idade: parseInt(document.getElementById('campo-idade').value, 10),
    sexo: form.querySelector('input[name="sexo"]:checked').value,
    nivel: form.querySelector('input[name="nivel"]:checked').value,
    frequencia: parseInt(form.querySelector('input[name="frequencia"]:checked').value, 10),
    local: form.querySelector('input[name="local"]:checked').value,
    tempo: parseInt(form.querySelector('input[name="tempo"]:checked').value, 10),
    restricoes: restricoesMarcadas,
    outraRestricao,
    atividadeAtual: form.querySelector('input[name="atividadeAtual"]:checked').value,
    foco: (form.querySelector('input[name="foco"]:checked') || {}).value || ''
  };
}

// ===================================================================
// CÁLCULO DE IMC
// ===================================================================

function calcularIMC(peso, alturaCm) {
  const alturaM = alturaCm / 100;
  const imc = peso / (alturaM * alturaM);
  let classificacao;
  if (imc < 18.5) classificacao = 'Abaixo do peso';
  else if (imc < 25) classificacao = 'Peso normal';
  else if (imc < 30) classificacao = 'Sobrepeso';
  else if (imc < 35) classificacao = 'Obesidade grau I';
  else if (imc < 40) classificacao = 'Obesidade grau II';
  else classificacao = 'Obesidade grau III';
  return { valor: imc.toFixed(1), classificacao };
}

// ===================================================================
// ALGORITMO DE GERAÇÃO DO TREINO
// ===================================================================

// IDs de exercícios usados especificamente para aquecimento e alongamento
const IDS_AQUECIMENTO = ['aquecimento-articular', 'polichinelo-leve', 'marcha-estacionaria'];
const IDS_ALONGAMENTO = ['alongamento-pernas', 'alongamento-costas', 'alongamento-ombro'];

// Grupos extras a priorizar quando o usuário escolhe um foco muscular
const FOCO_GRUPOS_EXTRAS = {
  pernas: ['pernas'],
  gluteos: ['gluteos'],
  abdomen: ['abdomen'],
  biceps: ['biceps', 'triceps'],
  costas: ['costas'],
  full: []
};

// Extrai [min, max] de uma faixa de repetições tipo "8-12"
function parseFaixaReps(str) {
  const match = str.match(/(\d+)\s*-\s*(\d+)/);
  return match ? [parseInt(match[1], 10), parseInt(match[2], 10)] : null;
}

// Combina as configurações de um ou mais objetivos selecionados em uma única configuração efetiva
function combinarObjetivos(objetivosSelecionados) {
  const lista = objetivosSelecionados && objetivosSelecionados.length ? objetivosSelecionados : ['saude'];
  const configs = lista.map(o => OBJETIVOS_CONFIG[o]);

  const label = configs.map(c => c.label).join(' + ');
  const texto = configs.map(c => c.texto).join(' ');
  const descansoAjuste = Math.round(configs.reduce((soma, c) => soma + c.descansoAjuste, 0) / configs.length);
  const cardioExtra = configs.some(c => c.cardioExtra);
  const duracaoCardioExtra = Math.max(0, ...configs.map(c => (c.cardioExtra ? c.duracaoCardioExtra : 0)));

  const faixas = configs.map(c => parseFaixaReps(c.repsRange)).filter(Boolean);
  let repsRange;
  if (faixas.length) {
    const minMedio = Math.round(faixas.reduce((s, f) => s + f[0], 0) / faixas.length);
    const maxMedio = Math.round(faixas.reduce((s, f) => s + f[1], 0) / faixas.length);
    repsRange = `${minMedio}-${maxMedio}${lista.includes('reabilitacao') ? ' (controlado)' : ''}`;
  } else {
    repsRange = configs[0].repsRange;
  }

  return { label, repsRange, descansoAjuste, cardioExtra, duracaoCardioExtra, texto };
}

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Filtra exercícios de força compatíveis com equipamento, nível e restrições de saúde
function poolDoGrupo(grupo, respostas) {
  const restricoesUser = respostas.restricoes.filter(r => r !== 'nenhuma');
  return EXERCICIOS.filter(ex =>
    ex.grupo === grupo &&
    ex.tipo === 'forca' &&
    ex.equipamento.includes(respostas.local) &&
    ex.nivel.includes(respostas.nivel) &&
    !ex.restricoes.some(r => restricoesUser.includes(r))
  );
}

function poolCardio(respostas) {
  const restricoesUser = respostas.restricoes.filter(r => r !== 'nenhuma');
  const temRestricaoSensivel = restricoesUser.some(r => ['joelho', 'cardiaco', 'hipertensao', 'gestante', 'lombar'].includes(r));
  return EXERCICIOS.filter(ex =>
    ex.grupo === 'cardio' &&
    ex.equipamento.includes(respostas.local) &&
    ex.nivel.includes(respostas.nivel) &&
    !ex.restricoes.some(r => restricoesUser.includes(r)) &&
    (!temRestricaoSensivel || ex.impacto === 'baixo')
  );
}

function poolMobilidade(ids, respostas) {
  const restricoesUser = respostas.restricoes.filter(r => r !== 'nenhuma');
  return EXERCICIOS.filter(ex => ids.includes(ex.id) && !ex.restricoes.some(r => restricoesUser.includes(r)));
}

// Ajusta séries/reps/descanso de um exercício de força conforme nível e objetivo
function montarExercicioForca(ex, nivel, objConfig) {
  let series = ex.seriesBase;
  if (nivel === 'iniciante') series = Math.max(2, ex.seriesBase - 1);
  if (nivel === 'avancado') series = ex.seriesBase + 1;

  const ehIsometria = /s$/.test(ex.repsBase.split(' ')[0]); // ex: "30-45s"
  const reps = ehIsometria ? ex.repsBase : objConfig.repsRange;
  const descanso = Math.max(15, ex.descansoBase + objConfig.descansoAjuste);

  return {
    id: ex.id, nome: ex.nome, grupo: ex.grupo, tipo: 'forca',
    series, reps, descanso, dica: ex.dica, query: ex.query, videoId: ex.videoId
  };
}

function montarExercicioCardioOuMobilidade(ex, duracaoOverride) {
  return {
    id: ex.id, nome: ex.nome, grupo: ex.grupo, tipo: ex.tipo,
    duracao: duracaoOverride || ex.duracaoBase, dica: ex.dica, query: ex.query, videoId: ex.videoId
  };
}

function gerarTreino(respostas) {
  const divisao = DIVISOES_TREINO[respostas.frequencia];
  const objConfig = combinarObjetivos(respostas.objetivos);
  const numExerciciosForca = EXERCICIOS_POR_TEMPO[respostas.tempo];
  const restricoesUser = respostas.restricoes.filter(r => r !== 'nenhuma');

  const dias = divisao.map(diaTemplate => {
    // Monta a lista de grupos do dia, priorizando o foco muscular escolhido
    let gruposDoDia = [...diaTemplate.grupos];
    const extrasFoco = FOCO_GRUPOS_EXTRAS[respostas.foco];
    if (respostas.foco && extrasFoco) {
      extrasFoco.forEach(g => {
        if (gruposDoDia.includes(g)) gruposDoDia.push(g, g); // reforça a chance de escolha
      });
    }

    const usados = new Set();
    const exerciciosForca = [];
    let indiceGrupo = 0;
    let tentativas = 0;
    const maxTentativas = numExerciciosForca * gruposDoDia.length + 20;

    while (exerciciosForca.length < numExerciciosForca && tentativas < maxTentativas) {
      const grupoAtual = gruposDoDia[indiceGrupo % gruposDoDia.length];
      const pool = embaralhar(poolDoGrupo(grupoAtual, respostas)).filter(ex => !usados.has(ex.id));
      if (pool.length > 0) {
        const escolhido = pool[0];
        usados.add(escolhido.id);
        exerciciosForca.push(montarExercicioForca(escolhido, respostas.nivel, objConfig));
      }
      indiceGrupo++;
      tentativas++;
    }

    // Bloco de cardio extra, conforme o objetivo
    let cardioExtra = null;
    if (objConfig.cardioExtra) {
      const poolC = embaralhar(poolCardio(respostas));
      if (poolC.length > 0) {
        cardioExtra = montarExercicioCardioOuMobilidade(poolC[0], objConfig.duracaoCardioExtra);
      }
    }

    // Aquecimento e alongamento
    const poolAquec = embaralhar(poolMobilidade(IDS_AQUECIMENTO, respostas));
    const poolAlong = embaralhar(poolMobilidade(IDS_ALONGAMENTO, respostas));
    const aquecimento = poolAquec[0] ? montarExercicioCardioOuMobilidade(poolAquec[0]) : null;
    const alongamento = poolAlong[0] ? montarExercicioCardioOuMobilidade(poolAlong[0]) : null;

    return {
      nome: diaTemplate.nome,
      aquecimento, alongamento, cardioExtra,
      exercicios: exerciciosForca
    };
  });

  return {
    geradoEm: new Date().toISOString(),
    objetivos: respostas.objetivos,
    frequencia: respostas.frequencia,
    dias
  };
}

// ===================================================================
// RENDERIZAÇÃO DA TELA DE RESULTADO
// ===================================================================

function pesoAtual(respostas) {
  const pesos = lerJSON(CHAVE_PESOS, []);
  return pesos.length ? pesos[pesos.length - 1].peso : respostas.peso;
}

function renderizarResultado(treino, respostas) {
  const pesoUsado = pesoAtual(respostas);
  const imc = calcularIMC(pesoUsado, respostas.altura);
  const objConfig = combinarObjetivos(respostas.objetivos);

  document.getElementById('resumo-nome').textContent = respostas.nome ? `Treino de ${respostas.nome}` : 'Seu Treino';
  document.getElementById('resumo-frase').textContent = FRASES_MOTIVACIONAIS[Math.floor(Math.random() * FRASES_MOTIVACIONAIS.length)];
  document.getElementById('resumo-objetivo').textContent = objConfig.label;
  document.getElementById('resumo-imc').textContent = `${imc.valor} (${imc.classificacao})`;
  document.getElementById('resumo-frequencia').textContent = `${respostas.frequencia}x por semana`;
  document.getElementById('resumo-peso').innerHTML = `${pesoUsado}kg <button id="btn-atualizar-peso" class="btn-link" title="Atualizar peso"><i class="fa-solid fa-pen"></i></button>`;
  document.getElementById('btn-atualizar-peso').addEventListener('click', abrirModalPeso);

  const restricoesReais = respostas.restricoes.filter(r => r !== 'nenhuma');
  const avisoEl = document.getElementById('resumo-restricoes-aviso');
  if (restricoesReais.length > 0 || respostas.outraRestricao) {
    const nomes = restricoesReais.map(r => RESTRICOES_LABEL[r]).join(', ');
    const extra = respostas.outraRestricao ? (nomes ? `, ${respostas.outraRestricao}` : respostas.outraRestricao) : '';
    avisoEl.textContent = `Treino adaptado considerando: ${nomes}${extra}. Exercícios de maior risco para essas condições foram evitados ou substituídos.`;
    avisoEl.classList.add('visivel');
  } else {
    avisoEl.classList.remove('visivel');
  }

  renderizarListaTreinos(treino);
  atualizarContadorConcluidos();
  renderizarCoachIA();
}

function renderizarListaTreinos(treino) {
  const container = document.getElementById('lista-treinos');
  container.innerHTML = '';
  const progresso = lerJSON(CHAVE_PROGRESSO, {});

  treino.dias.forEach((dia, diaIdx) => {
    const card = document.createElement('div');
    card.className = 'dia-card';

    const totalExercicios = dia.exercicios.length;
    const concluidosDoDia = dia.exercicios.filter((_, exIdx) => progresso[`${diaIdx}_${exIdx}`]).length;

    card.innerHTML = `
      <div class="dia-cabecalho">
        <div class="dia-titulo-wrap">
          <span class="dia-titulo">${dia.nome}</span>
          <span class="dia-subtitulo">${totalExercicios} exercícios · aquecimento e alongamento inclusos</span>
        </div>
        <div style="display:flex; align-items:center; gap:14px;">
          <span class="dia-progresso-mini">${concluidosDoDia}/${totalExercicios}</span>
          <i class="fa-solid fa-chevron-down"></i>
        </div>
      </div>
      <div class="dia-corpo">
        <div class="dia-corpo-inner">
          ${dia.aquecimento ? `<div class="bloco-extra bloco-extra-clicavel" data-bloco="aquecimento"><strong>Aquecimento (${dia.aquecimento.duracao} min):</strong> ${dia.aquecimento.nome} — ${dia.aquecimento.dica} <span class="exercicio-play"><i class="fa-solid fa-circle-play"></i> ver vídeo</span></div>` : ''}
          <div class="exercicios-do-dia"></div>
          ${dia.cardioExtra ? `<div class="bloco-extra bloco-extra-clicavel" data-bloco="cardioExtra"><strong>Cardio extra (${dia.cardioExtra.duracao} min):</strong> ${dia.cardioExtra.nome} — ${dia.cardioExtra.dica} <span class="exercicio-play"><i class="fa-solid fa-circle-play"></i> ver vídeo</span></div>` : ''}
          ${dia.alongamento ? `<div class="bloco-extra bloco-extra-clicavel" data-bloco="alongamento"><strong>Alongamento final (${dia.alongamento.duracao} min):</strong> ${dia.alongamento.nome} — ${dia.alongamento.dica} <span class="exercicio-play"><i class="fa-solid fa-circle-play"></i> ver vídeo</span></div>` : ''}
        </div>
      </div>
    `;

    const listaExercicios = card.querySelector('.exercicios-do-dia');
    dia.exercicios.forEach((ex, exIdx) => {
      const chave = `${diaIdx}_${exIdx}`;
      const concluido = !!progresso[chave];

      const item = document.createElement('div');
      item.className = 'exercicio-item';
      item.innerHTML = `
        <input type="checkbox" class="exercicio-check" ${concluido ? 'checked' : ''} />
        <div class="exercicio-info">
          <div class="exercicio-nome-linha">
            <span class="exercicio-nome ${concluido ? 'concluido' : ''}">${ex.nome}</span>
            <span class="exercicio-play"><i class="fa-solid fa-circle-play"></i> ver vídeo</span>
          </div>
          <div class="exercicio-meta">
            <span>${ex.series}x ${ex.reps}</span>
            <span>Descanso: ${ex.descanso}s</span>
            <span>${GRUPOS_LABEL[ex.grupo]}</span>
          </div>
          <div class="exercicio-dica"><i class="fa-solid fa-lightbulb"></i> ${ex.dica}</div>
        </div>
        <button class="btn-trocar" title="Trocar por outro exercício"><i class="fa-solid fa-shuffle"></i></button>
      `;

      const checkbox = item.querySelector('.exercicio-check');
      checkbox.addEventListener('change', () => {
        const prog = lerJSON(CHAVE_PROGRESSO, {});
        prog[chave] = checkbox.checked;
        salvarJSON(CHAVE_PROGRESSO, prog);
        item.querySelector('.exercicio-nome').classList.toggle('concluido', checkbox.checked);
        atualizarContadoresLocais();
        atualizarContadorConcluidos();
        renderizarCoachIA();
      });

      const nomeLinha = item.querySelector('.exercicio-nome-linha');
      nomeLinha.addEventListener('click', () => abrirModalVideo(ex));

      item.querySelector('.btn-trocar').addEventListener('click', (e) => {
        e.stopPropagation();
        trocarExercicio(diaIdx, exIdx);
      });

      listaExercicios.appendChild(item);
    });

    card.querySelectorAll('.bloco-extra-clicavel').forEach(bloco => {
      const chaveBloco = bloco.dataset.bloco; // 'aquecimento' | 'cardioExtra' | 'alongamento'
      bloco.addEventListener('click', () => abrirModalVideo(dia[chaveBloco]));
    });

    const cabecalho = card.querySelector('.dia-cabecalho');
    cabecalho.addEventListener('click', () => card.classList.toggle('expandido'));

    container.appendChild(card);
  });
}

// Atualiza os contadores "x/y" de cada card de dia sem re-renderizar tudo
function atualizarContadoresLocais() {
  const progresso = lerJSON(CHAVE_PROGRESSO, {});
  document.querySelectorAll('.dia-card').forEach((card, diaIdx) => {
    const itens = card.querySelectorAll('.exercicio-item');
    const total = itens.length;
    let concluidos = 0;
    for (let exIdx = 0; exIdx < total; exIdx++) {
      if (progresso[`${diaIdx}_${exIdx}`]) concluidos++;
    }
    card.querySelector('.dia-progresso-mini').textContent = `${concluidos}/${total}`;
  });
}

function atualizarContadorConcluidos() {
  const progresso = lerJSON(CHAVE_PROGRESSO, {});
  const total = Object.values(progresso).filter(Boolean).length;
  document.getElementById('resumo-concluidos').textContent = total;
}

// Troca um exercício por outra opção válida do mesmo grupo muscular, respeitando
// equipamento, nível e restrições de saúde do usuário, sem repetir outro já usado no dia.
function trocarExercicio(diaIdx, exIdx) {
  const treino = lerJSON(CHAVE_TREINO, null);
  const respostas = lerJSON(CHAVE_RESPOSTAS, null);
  if (!treino || !respostas) return;

  const dia = treino.dias[diaIdx];
  const exAtual = dia.exercicios[exIdx];
  const idsUsadosNoDia = new Set(dia.exercicios.map(e => e.id));
  const alternativas = embaralhar(poolDoGrupo(exAtual.grupo, respostas)).filter(ex => !idsUsadosNoDia.has(ex.id));

  if (alternativas.length === 0) {
    alert('Não encontramos outra opção disponível para esse grupo muscular com seu equipamento e restrições atuais.');
    return;
  }

  const objConfig = combinarObjetivos(respostas.objetivos);
  dia.exercicios[exIdx] = montarExercicioForca(alternativas[0], respostas.nivel, objConfig);
  salvarJSON(CHAVE_TREINO, treino);

  const progresso = lerJSON(CHAVE_PROGRESSO, {});
  delete progresso[`${diaIdx}_${exIdx}`];
  salvarJSON(CHAVE_PROGRESSO, progresso);

  const expandidos = Array.from(document.querySelectorAll('.dia-card')).map(c => c.classList.contains('expandido'));
  renderizarListaTreinos(treino);
  document.querySelectorAll('.dia-card').forEach((c, i) => { if (expandidos[i]) c.classList.add('expandido'); });
  atualizarContadorConcluidos();
  renderizarCoachIA();
}

// ===================================================================
// MODAL DE VÍDEO — usa a API oficial do YouTube (IFrame Player API) para
// detectar quando o dono do vídeo restringiu a exibição incorporada e,
// nesse caso, mostrar um link direto para assistir no YouTube.
// ===================================================================

const modal = document.getElementById('modal-video');
const modalTitulo = document.getElementById('modal-titulo');
const modalDica = document.getElementById('modal-dica');
const modalErro = document.getElementById('modal-video-erro');
const modalLinkYoutube = document.getElementById('modal-link-youtube');

let ytApiPronta = false;
let ytPlayer = null;
let videoIdPendente = null;

(function carregarYouTubeAPI() {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
})();

window.onYouTubeIframeAPIReady = function () {
  ytApiPronta = true;
  if (videoIdPendente) {
    criarPlayer(videoIdPendente);
    videoIdPendente = null;
  }
};

function recriarContainerPlayer() {
  const antigo = document.getElementById('modal-player');
  const novo = document.createElement('div');
  novo.id = 'modal-player';
  antigo.replaceWith(novo);
  return novo;
}

function criarPlayer(videoId) {
  recriarContainerPlayer();
  if (ytPlayer) {
    try { ytPlayer.destroy(); } catch (e) { /* já destruído */ }
    ytPlayer = null;
  }
  if (!ytApiPronta || !window.YT || !window.YT.Player) {
    videoIdPendente = videoId;
    return;
  }
  ytPlayer = new YT.Player('modal-player', {
    videoId,
    playerVars: { rel: 0, modestbranding: 1 },
    events: { onError: mostrarErroVideo }
  });
}

function mostrarErroVideo() {
  document.getElementById('modal-player').style.display = 'none';
  modalErro.classList.add('visivel');
}

function abrirModalVideo(ex) {
  modalTitulo.textContent = ex.nome;
  modalDica.textContent = ex.dica;
  modalErro.classList.remove('visivel');
  modalLinkYoutube.href = ex.videoId
    ? `https://www.youtube.com/watch?v=${ex.videoId}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.query)}`;

  if (ex.videoId) {
    const container = recriarContainerPlayer();
    container.style.display = 'block';
    criarPlayer(ex.videoId);
  } else {
    mostrarErroVideo();
  }
  modal.classList.add('visivel');
}

function fecharModalVideo() {
  modal.classList.remove('visivel');
  if (ytPlayer) {
    try { ytPlayer.destroy(); } catch (e) { /* já destruído */ }
    ytPlayer = null;
  }
}

document.getElementById('modal-fechar').addEventListener('click', fecharModalVideo);
modal.addEventListener('click', (e) => { if (e.target === modal) fecharModalVideo(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharModalVideo(); });

// ===================================================================
// ATUALIZAÇÃO DE PESO
// ===================================================================

const modalPeso = document.getElementById('modal-peso');
const inputNovoPeso = document.getElementById('input-novo-peso');

function abrirModalPeso() {
  const respostas = lerJSON(CHAVE_RESPOSTAS, {});
  inputNovoPeso.value = pesoAtual(respostas);
  renderizarHistoricoPeso();
  modalPeso.classList.add('visivel');
}

function fecharModalPeso() {
  modalPeso.classList.remove('visivel');
}

function renderizarHistoricoPeso() {
  const pesos = lerJSON(CHAVE_PESOS, []);
  const container = document.getElementById('historico-peso');
  container.innerHTML = pesos.slice().reverse().map(registro => {
    const data = new Date(registro.data).toLocaleDateString('pt-BR');
    return `<div class="historico-peso-item"><span>${data}</span><span>${registro.peso}kg</span></div>`;
  }).join('');
}

document.getElementById('modal-peso-fechar').addEventListener('click', fecharModalPeso);
modalPeso.addEventListener('click', (e) => { if (e.target === modalPeso) fecharModalPeso(); });

document.getElementById('btn-salvar-peso').addEventListener('click', () => {
  const novoPeso = parseFloat(inputNovoPeso.value);
  if (!novoPeso || novoPeso < 30 || novoPeso > 300) {
    alert('Digite um peso válido (entre 30 e 300 kg).');
    return;
  }
  const pesos = lerJSON(CHAVE_PESOS, []);
  pesos.push({ data: new Date().toISOString(), peso: novoPeso });
  salvarJSON(CHAVE_PESOS, pesos);

  const respostas = lerJSON(CHAVE_RESPOSTAS, {});
  const imc = calcularIMC(novoPeso, respostas.altura);
  document.getElementById('resumo-imc').textContent = `${imc.valor} (${imc.classificacao})`;
  document.getElementById('resumo-peso').innerHTML = `${novoPeso}kg <button id="btn-atualizar-peso" class="btn-link" title="Atualizar peso"><i class="fa-solid fa-pen"></i></button>`;
  document.getElementById('btn-atualizar-peso').addEventListener('click', abrirModalPeso);

  renderizarHistoricoPeso();
  renderizarCoachIA();
});

// ===================================================================
// COACH VIRTUAL (IA local — roda 100% no navegador, sem enviar dados)
// ===================================================================

function gerarInsightsIA() {
  const respostas = lerJSON(CHAVE_RESPOSTAS, null);
  const treino = lerJSON(CHAVE_TREINO, null);
  const progresso = lerJSON(CHAVE_PROGRESSO, {});
  const pesos = lerJSON(CHAVE_PESOS, []);
  if (!respostas || !treino) return [];

  const dicas = [];
  const totalExercicios = treino.dias.reduce((soma, d) => soma + d.exercicios.length, 0);
  const concluidos = Object.values(progresso).filter(Boolean).length;
  const percentual = totalExercicios ? Math.round((concluidos / totalExercicios) * 100) : 0;

  if (percentual === 0) {
    dicas.push('Você ainda não marcou nenhum exercício como concluído nesta semana. Que tal começar agora pelo primeiro treino?');
  } else if (percentual < 40) {
    dicas.push(`Você concluiu ${percentual}% do treino da semana. Ainda dá tempo de recuperar o ritmo!`);
  } else if (percentual < 80) {
    dicas.push(`Você já concluiu ${percentual}% do treino da semana. Continue assim!`);
  } else {
    dicas.push(`Excelente! Você já concluiu ${percentual}% do treino da semana. 💪`);
  }

  const objetivos = respostas.objetivos || [];
  if (pesos.length >= 2) {
    const primeiro = pesos[0].peso;
    const ultimo = pesos[pesos.length - 1].peso;
    const delta = +(ultimo - primeiro).toFixed(1);
    if (delta !== 0) {
      const direcao = delta > 0 ? 'ganhou' : 'perdeu';
      dicas.push(`Desde que começou o acompanhamento, você ${direcao} ${Math.abs(delta)}kg.`);
      if (objetivos.includes('emagrecimento') && delta > 0) {
        dicas.push('Seu peso subiu desde o início, e seu objetivo inclui emagrecimento. Revise a alimentação e a consistência dos treinos.');
      }
      if (objetivos.includes('hipertrofia') && delta < 0) {
        dicas.push('Seu peso caiu desde o início, e seu objetivo inclui hipertrofia. Considere aumentar a ingestão calórica e proteica.');
      }
    } else {
      dicas.push('Seu peso está estável desde o início do acompanhamento.');
    }
  } else {
    dicas.push('Registre seu peso periodicamente (clique no lápis ao lado do peso atual) para receber acompanhamento de evolução.');
  }

  const pesoUsado = pesoAtual(respostas);
  const imc = calcularIMC(pesoUsado, respostas.altura);
  if (imc.classificacao !== 'Peso normal') {
    dicas.push(`Seu IMC atual (${imc.valor}) está na faixa "${imc.classificacao}" — apenas uma referência geral. Converse com um profissional para uma avaliação completa.`);
  }

  return dicas;
}

function renderizarCoachIA() {
  const lista = document.getElementById('coach-lista');
  const dicas = gerarInsightsIA();
  lista.innerHTML = dicas.map(dica => `<li>${dica}</li>`).join('');
}

// ===================================================================
// AÇÕES DA TELA DE RESULTADO
// ===================================================================

document.getElementById('btn-novo-treino').addEventListener('click', () => {
  if (!confirm('Isso vai apagar o treino atual e abrir um novo questionário. Deseja continuar?')) return;
  localStorage.removeItem(CHAVE_TREINO);
  localStorage.removeItem(CHAVE_PROGRESSO);
  localStorage.removeItem(CHAVE_PESOS);
  form.reset();
  mostrarTela(telaQuestionario);
  irParaPasso(1);
});

document.getElementById('btn-imprimir').addEventListener('click', () => {
  document.querySelectorAll('.dia-card').forEach(card => card.classList.add('expandido'));
  window.print();
});

document.getElementById('btn-whatsapp').addEventListener('click', () => {
  const respostas = lerJSON(CHAVE_RESPOSTAS, {});
  const treino = lerJSON(CHAVE_TREINO, null);
  if (!treino) return;
  let texto = `Confira meu treino personalizado, gerado pelo Personal Trainer Virtual! 💪\n\n`;
  texto += `Aluno(a): ${respostas.nome}\nObjetivo: ${combinarObjetivos(respostas.objetivos).label}\n\n`;
  treino.dias.forEach(dia => {
    texto += `📌 ${dia.nome}\n`;
    dia.exercicios.forEach(ex => { texto += `- ${ex.nome}: ${ex.series}x ${ex.reps}\n`; });
    texto += `\n`;
  });
  const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank', 'noopener');
});

// ===================================================================
// INICIALIZAÇÃO — restaura treino salvo, se existir
// ===================================================================

(function iniciar() {
  const treinoSalvo = lerJSON(CHAVE_TREINO, null);
  const respostasSalvas = lerJSON(CHAVE_RESPOSTAS, null);
  if (treinoSalvo && respostasSalvas) {
    renderizarResultado(treinoSalvo, respostasSalvas);
    mostrarTela(telaResultado);
  } else {
    mostrarTela(telaBoasVindas);
  }
})();
