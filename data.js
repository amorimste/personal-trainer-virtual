/*
 * data.js — Base de dados de exercícios do Personal Trainer Virtual
 * Cada exercício contém: grupo muscular, nível, equipamento necessário,
 * termo de busca para vídeo (YouTube), restrições de saúde e dicas de execução.
 *
 * Os vídeos usam o embed de busca do YouTube (listType=search), que sempre
 * retorna vídeos reais e atualizados para o termo pesquisado, evitando links
 * quebrados de vídeos específicos que podem ser removidos com o tempo.
 */

// Rótulos amigáveis para grupos musculares (usados na interface)
const GRUPOS_LABEL = {
  pernas: 'Pernas',
  gluteos: 'Glúteos',
  posterior: 'Posterior de Coxa',
  panturrilha: 'Panturrilha',
  peito: 'Peito',
  costas: 'Costas',
  ombro: 'Ombro',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  abdomen: 'Abdômen',
  cardio: 'Cardio',
  mobilidade: 'Mobilidade/Alongamento'
};

// Rótulos das restrições de saúde marcáveis no formulário
const RESTRICOES_LABEL = {
  joelho: 'Dor ou lesão no joelho',
  ombro: 'Dor ou lesão no ombro',
  lombar: 'Dor lombar / problemas na coluna',
  hipertensao: 'Hipertensão',
  cardiaco: 'Problema cardíaco',
  gestante: 'Gestante',
  nenhuma: 'Nenhuma restrição'
};

// Frases motivacionais exibidas aleatoriamente no resultado
const FRASES_MOTIVACIONAIS = [
  'A disciplina é a ponte entre metas e conquistas.',
  'Seu único limite é você mesmo(a). Vamos treinar!',
  'Cada repetição te deixa mais perto do seu objetivo.',
  'Não conte os dias, faça os dias contarem.',
  'O corpo alcança o que a mente acredita.',
  'Suar hoje é orgulho amanhã.',
  'Grandes resultados exigem grande dedicação.',
  'Você não precisa ser extremo, só consistente.',
  'Foco no processo, o resultado é consequência.',
  'A dor de hoje é a força de amanhã.',
  'Comece onde você está, use o que você tem, faça o que você pode.',
  'Treinar é um presente que você dá para o seu futuro.'
];

/*
 * Estrutura de cada exercício:
 * id            – identificador único
 * nome          – nome exibido
 * grupo         – grupo muscular (chave de GRUPOS_LABEL)
 * tipo          – 'forca' | 'cardio' | 'mobilidade'
 * nivel         – níveis para os quais o exercício é indicado
 * equipamento   – locais/equipamentos compatíveis: 'casa-sem', 'casa-com', 'academia'
 * impacto       – 'baixo' | 'alto' (relevante para joelho/coluna/gestantes)
 * query         – termo de busca usado no embed de vídeo do YouTube
 * seriesBase    – número de séries de referência
 * repsBase      – repetições de referência (texto)
 * descansoBase  – descanso de referência em segundos
 * duracaoBase   – duração em minutos (apenas para cardio/mobilidade)
 * dica          – observação/dica de execução
 * restricoes    – condições de saúde para as quais o exercício NÃO é recomendado
 */
const EXERCICIOS = [
  // ===================== PERNAS =====================
  { id: 'agachamento-livre', nome: 'Agachamento Livre', grupo: 'pernas', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'alto', query: 'agachamento livre execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 60,
    dica: 'Mantenha o peso nos calcanhares e o joelho alinhado com a ponta do pé.', restricoes: ['joelho', 'lombar', 'gestante'] },

  { id: 'agachamento-sumo', nome: 'Agachamento Sumô', grupo: 'pernas', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'agachamento sumo execução correta', seriesBase: 3, repsBase: '12-15', descansoBase: 50,
    dica: 'Pés afastados e apontados para fora, desça controlando o quadril.', restricoes: ['joelho'] },

  { id: 'leg-press-45', nome: 'Leg Press 45°', grupo: 'pernas', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'leg press 45 graus execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 60,
    dica: 'Não trave os joelhos no topo do movimento e controle a descida.', restricoes: [] },

  { id: 'cadeira-extensora', nome: 'Cadeira Extensora', grupo: 'pernas', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'cadeira extensora execução correta', seriesBase: 3, repsBase: '12-15', descansoBase: 45,
    dica: 'Movimento controlado, sem jogar o tronco para trás.', restricoes: [] },

  { id: 'afundo', nome: 'Afundo (Passada)', grupo: 'pernas', tipo: 'forca',
    nivel: ['intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'alto', query: 'afundo passada execução correta', seriesBase: 3, repsBase: '10-12 cada perna', descansoBase: 60,
    dica: 'Desça até o joelho de trás quase tocar o chão, tronco ereto.', restricoes: ['joelho', 'gestante'] },

  { id: 'agachamento-bulgaro', nome: 'Agachamento Búlgaro', grupo: 'pernas', tipo: 'forca',
    nivel: ['avancado'], equipamento: ['casa-com', 'academia'],
    impacto: 'alto', query: 'agachamento búlgaro execução correta', seriesBase: 3, repsBase: '8-10 cada perna', descansoBase: 75,
    dica: 'Apoie o peito do pé de trás em um banco e desça na perna da frente.', restricoes: ['joelho', 'gestante'] },

  { id: 'step-up', nome: 'Step Up (Subida no Banco)', grupo: 'pernas', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'step up subida no banco execução', seriesBase: 3, repsBase: '10-12 cada perna', descansoBase: 50,
    dica: 'Use um banco de altura moderada e evite impulsionar com a perna de trás.', restricoes: ['gestante'] },

  { id: 'cadeira-adutora', nome: 'Cadeira Adutora', grupo: 'pernas', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'cadeira adutora execução correta', seriesBase: 3, repsBase: '15', descansoBase: 40,
    dica: 'Movimento lento, sem bater as placas com força.', restricoes: [] },

  { id: 'cadeira-abdutora', nome: 'Cadeira Abdutora', grupo: 'gluteos', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'cadeira abdutora execução correta', seriesBase: 3, repsBase: '15', descansoBase: 40,
    dica: 'Empurre com a lateral da coxa, mantendo o tronco firme no encosto.', restricoes: [] },

  // ===================== GLÚTEOS / POSTERIOR =====================
  { id: 'elevacao-pelvica', nome: 'Elevação Pélvica (Hip Thrust)', grupo: 'gluteos', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'elevação pélvica hip thrust execução correta', seriesBase: 3, repsBase: '12-15', descansoBase: 60,
    dica: 'Contraia bem o glúteo no topo, sem hiperestender a lombar.', restricoes: [] },

  { id: 'gluteo-4-apoios', nome: 'Glúteo em 4 Apoios (Coice)', grupo: 'gluteos', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com'],
    impacto: 'baixo', query: 'glúteo quatro apoios coice execução', seriesBase: 3, repsBase: '15 cada perna', descansoBase: 40,
    dica: 'Mantenha a lombar neutra, foco na contração do glúteo.', restricoes: [] },

  { id: 'stiff', nome: 'Stiff (Levantamento Romeno)', grupo: 'posterior', tipo: 'forca',
    nivel: ['intermediario', 'avancado'], equipamento: ['casa-com', 'academia'],
    impacto: 'alto', query: 'stiff levantamento romeno execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 60,
    dica: 'Quadril para trás, costas retas, sinta o alongamento no posterior.', restricoes: ['lombar', 'gestante'] },

  { id: 'cadeira-flexora', nome: 'Mesa/Cadeira Flexora', grupo: 'posterior', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'cadeira flexora execução correta', seriesBase: 3, repsBase: '12-15', descansoBase: 45,
    dica: 'Não impulsione com o quadril, controle a fase excêntrica.', restricoes: [] },

  { id: 'elevacao-panturrilha-pe', nome: 'Elevação de Panturrilha em Pé', grupo: 'panturrilha', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'elevação de panturrilha em pé execução', seriesBase: 3, repsBase: '15-20', descansoBase: 30,
    dica: 'Suba na ponta dos pés bem alto e desça controlado.', restricoes: [] },

  { id: 'elevacao-panturrilha-sentado', nome: 'Elevação de Panturrilha Sentado', grupo: 'panturrilha', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'elevação de panturrilha sentado execução', seriesBase: 3, repsBase: '15-20', descansoBase: 30,
    dica: 'Foco na amplitude total do movimento.', restricoes: [] },

  // ===================== PEITO =====================
  { id: 'supino-reto-barra', nome: 'Supino Reto com Barra', grupo: 'peito', tipo: 'forca',
    nivel: ['intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'supino reto barra execução correta', seriesBase: 4, repsBase: '8-10', descansoBase: 75,
    dica: 'Escápulas retraídas, barra desce até o meio do peito.', restricoes: ['ombro'] },

  { id: 'supino-inclinado-halteres', nome: 'Supino Inclinado com Halteres', grupo: 'peito', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-com', 'academia'],
    impacto: 'baixo', query: 'supino inclinado halteres execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 60,
    dica: 'Banco a 30-45°, desça os halteres sem forçar o ombro.', restricoes: ['ombro'] },

  { id: 'crucifixo', nome: 'Crucifixo com Halteres', grupo: 'peito', tipo: 'forca',
    nivel: ['intermediario', 'avancado'], equipamento: ['casa-com', 'academia'],
    impacto: 'baixo', query: 'crucifixo halteres execução correta', seriesBase: 3, repsBase: '12-15', descansoBase: 50,
    dica: 'Cotovelos levemente flexionados durante todo o movimento.', restricoes: ['ombro'] },

  { id: 'flexao-de-braco', nome: 'Flexão de Braço', grupo: 'peito', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'flexão de braço execução correta', seriesBase: 3, repsBase: '10-15', descansoBase: 45,
    dica: 'Corpo alinhado como uma prancha, pode apoiar os joelhos se necessário.', restricoes: ['ombro'] },

  { id: 'cross-over', nome: 'Cross Over (Cabo Peitoral)', grupo: 'peito', tipo: 'forca',
    nivel: ['intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'cross over cabo peitoral execução correta', seriesBase: 3, repsBase: '12-15', descansoBase: 45,
    dica: 'Cruze as mãos à frente do corpo contraindo o peitoral.', restricoes: ['ombro'] },

  // ===================== COSTAS =====================
  { id: 'puxada-frente', nome: 'Puxada Frente (Pulldown)', grupo: 'costas', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'puxada frente pulldown execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 60,
    dica: 'Puxe com as costas, não só com os braços, leve a barra até o peito.', restricoes: ['ombro'] },

  { id: 'remada-baixa', nome: 'Remada Baixa (Cabo)', grupo: 'costas', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'remada baixa cabo execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 60,
    dica: 'Tronco firme, puxe levando os cotovelos para trás.', restricoes: ['lombar'] },

  { id: 'remada-curvada', nome: 'Remada Curvada com Barra', grupo: 'costas', tipo: 'forca',
    nivel: ['avancado'], equipamento: ['academia'],
    impacto: 'alto', query: 'remada curvada barra execução correta', seriesBase: 4, repsBase: '8-10', descansoBase: 75,
    dica: 'Tronco inclinado à frente com coluna neutra, não arredonde as costas.', restricoes: ['lombar', 'gestante'] },

  { id: 'remada-unilateral', nome: 'Remada Unilateral com Halter', grupo: 'costas', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-com', 'academia'],
    impacto: 'baixo', query: 'remada unilateral halter execução correta', seriesBase: 3, repsBase: '10-12 cada lado', descansoBase: 60,
    dica: 'Apoie o joelho e a mão no banco, mantenha a coluna neutra.', restricoes: ['lombar'] },

  { id: 'barra-fixa', nome: 'Barra Fixa (Pull-up)', grupo: 'costas', tipo: 'forca',
    nivel: ['avancado'], equipamento: ['casa-com', 'academia'],
    impacto: 'baixo', query: 'barra fixa pull up execução correta', seriesBase: 3, repsBase: 'até a falha', descansoBase: 90,
    dica: 'Pode usar elástico de auxílio se ainda não tiver força suficiente.', restricoes: ['ombro'] },

  { id: 'superman', nome: 'Superman (Extensão Lombar no Solo)', grupo: 'costas', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'exercício superman lombar execução correta', seriesBase: 3, repsBase: '12-15', descansoBase: 40,
    dica: 'Suba braços e pernas simultaneamente sem forçar o pescoço.', restricoes: ['gestante'] },

  // ===================== OMBRO =====================
  { id: 'desenvolvimento-halteres', nome: 'Desenvolvimento com Halteres', grupo: 'ombro', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-com', 'academia'],
    impacto: 'baixo', query: 'desenvolvimento ombro halteres execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 60,
    dica: 'Não desça demais os cotovelos para preservar o ombro.', restricoes: ['ombro'] },

  { id: 'elevacao-lateral', nome: 'Elevação Lateral', grupo: 'ombro', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-com', 'academia'],
    impacto: 'baixo', query: 'elevação lateral ombro execução correta', seriesBase: 3, repsBase: '12-15', descansoBase: 45,
    dica: 'Eleve até a linha do ombro, cotovelos levemente flexionados.', restricoes: ['ombro'] },

  { id: 'elevacao-frontal', nome: 'Elevação Frontal', grupo: 'ombro', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-com', 'academia'],
    impacto: 'baixo', query: 'elevação frontal ombro execução correta', seriesBase: 3, repsBase: '12-15', descansoBase: 45,
    dica: 'Evite balançar o corpo para gerar impulso.', restricoes: ['ombro'] },

  { id: 'remada-alta', nome: 'Remada Alta', grupo: 'ombro', tipo: 'forca',
    nivel: ['intermediario', 'avancado'], equipamento: ['casa-com', 'academia'],
    impacto: 'baixo', query: 'remada alta ombro execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 50,
    dica: 'Cotovelos devem ficar acima das mãos durante a subida.', restricoes: ['ombro'] },

  { id: 'manguito-rotador', nome: 'Fortalecimento do Manguito Rotador', grupo: 'ombro', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'fortalecimento manguito rotador exercício', seriesBase: 3, repsBase: '15 cada lado', descansoBase: 40,
    dica: 'Movimento leve e controlado, ideal para reabilitação de ombro.', restricoes: [] },

  // ===================== BÍCEPS =====================
  { id: 'rosca-direta-barra', nome: 'Rosca Direta com Barra', grupo: 'biceps', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-com', 'academia'],
    impacto: 'baixo', query: 'rosca direta barra execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 50,
    dica: 'Cotovelos fixos ao lado do corpo, evite balançar.', restricoes: [] },

  { id: 'rosca-alternada', nome: 'Rosca Alternada com Halteres', grupo: 'biceps', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-com', 'academia'],
    impacto: 'baixo', query: 'rosca alternada halteres execução correta', seriesBase: 3, repsBase: '10-12 cada braço', descansoBase: 45,
    dica: 'Gire o punho ao final do movimento para maior contração.', restricoes: [] },

  { id: 'rosca-martelo', nome: 'Rosca Martelo', grupo: 'biceps', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-com', 'academia'],
    impacto: 'baixo', query: 'rosca martelo execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 45,
    dica: 'Pegada neutra, trabalha também o antebraço.', restricoes: [] },

  { id: 'rosca-scott', nome: 'Rosca Scott', grupo: 'biceps', tipo: 'forca',
    nivel: ['intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'rosca scott execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 50,
    dica: 'Apoie bem o braço no banco para isolar o bíceps.', restricoes: [] },

  // ===================== TRÍCEPS =====================
  { id: 'triceps-corda', nome: 'Tríceps Corda (Cabo)', grupo: 'triceps', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'tríceps corda execução correta', seriesBase: 3, repsBase: '12-15', descansoBase: 45,
    dica: 'Cotovelos fixos, abra a corda ao final do movimento.', restricoes: ['ombro'] },

  { id: 'triceps-testa', nome: 'Tríceps Testa', grupo: 'triceps', tipo: 'forca',
    nivel: ['intermediario', 'avancado'], equipamento: ['casa-com', 'academia'],
    impacto: 'baixo', query: 'tríceps testa execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 50,
    dica: 'Desça a barra em direção à testa controlando o peso.', restricoes: ['ombro'] },

  { id: 'triceps-frances', nome: 'Tríceps Francês', grupo: 'triceps', tipo: 'forca',
    nivel: ['intermediario', 'avancado'], equipamento: ['casa-com', 'academia'],
    impacto: 'baixo', query: 'tríceps francês halter execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 50,
    dica: 'Cotovelo apontando para cima, próximo à cabeça.', restricoes: ['ombro'] },

  { id: 'mergulho-banco', nome: 'Mergulho no Banco (Tríceps)', grupo: 'triceps', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'mergulho no banco tríceps execução', seriesBase: 3, repsBase: '10-15', descansoBase: 45,
    dica: 'Mantenha os cotovelos próximos ao corpo, desça sem forçar o ombro.', restricoes: ['ombro'] },

  // ===================== ABDÔMEN =====================
  { id: 'prancha', nome: 'Prancha Abdominal', grupo: 'abdomen', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'prancha abdominal execução correta', seriesBase: 3, repsBase: '30-45s', descansoBase: 30,
    dica: 'Corpo alinhado, sem deixar o quadril cair ou subir.', restricoes: [] },

  { id: 'prancha-lateral', nome: 'Prancha Lateral', grupo: 'abdomen', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'prancha lateral execução correta', seriesBase: 3, repsBase: '20-30s cada lado', descansoBase: 30,
    dica: 'Quadril elevado e alinhado, ombro sobre o cotovelo.', restricoes: [] },

  { id: 'abdominal-supra', nome: 'Abdominal Supra', grupo: 'abdomen', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'abdominal supra execução correta', seriesBase: 3, repsBase: '15-20', descansoBase: 30,
    dica: 'Suba o tronco contraindo o abdômen, sem puxar o pescoço.', restricoes: ['gestante'] },

  { id: 'abdominal-infra', nome: 'Abdominal Infra (Elevação de Pernas)', grupo: 'abdomen', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'abdominal infra elevação de pernas execução', seriesBase: 3, repsBase: '15-20', descansoBase: 30,
    dica: 'Controle a descida das pernas para não forçar a lombar.', restricoes: ['lombar', 'gestante'] },

  { id: 'abdominal-bicicleta', nome: 'Abdominal Bicicleta', grupo: 'abdomen', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'abdominal bicicleta execução correta', seriesBase: 3, repsBase: '20 (10 cada lado)', descansoBase: 30,
    dica: 'Leve o cotovelo em direção ao joelho oposto sem puxar o pescoço.', restricoes: ['gestante'] },

  { id: 'prancha-apoio-joelhos', nome: 'Prancha com Apoio nos Joelhos', grupo: 'abdomen', tipo: 'forca',
    nivel: ['iniciante'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'prancha com apoio nos joelhos execução', seriesBase: 3, repsBase: '20-30s', descansoBase: 30,
    dica: 'Ótima opção de baixa intensidade para lombar sensível ou gestantes.', restricoes: [] },

  // ===================== CARDIO =====================
  { id: 'caminhada-esteira', nome: 'Caminhada na Esteira', grupo: 'cardio', tipo: 'cardio',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia', 'casa-com'],
    impacto: 'baixo', query: 'caminhada esteira treino cardio', duracaoBase: 15, descansoBase: 0,
    dica: 'Mantenha ritmo constante, ajuste inclinação conforme conforto.', restricoes: [] },

  { id: 'corrida-esteira', nome: 'Corrida na Esteira', grupo: 'cardio', tipo: 'cardio',
    nivel: ['intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'alto', query: 'corrida esteira treino cardio', duracaoBase: 15, descansoBase: 0,
    dica: 'Aqueça bem antes e hidrate-se durante o treino.', restricoes: ['joelho', 'cardiaco', 'gestante'] },

  { id: 'bicicleta-ergometrica', nome: 'Bicicleta Ergométrica', grupo: 'cardio', tipo: 'cardio',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia', 'casa-com'],
    impacto: 'baixo', query: 'bicicleta ergométrica treino cardio', duracaoBase: 15, descansoBase: 0,
    dica: 'Regule o banco na altura correta para proteger os joelhos.', restricoes: [] },

  { id: 'polichinelo', nome: 'Polichinelo', grupo: 'cardio', tipo: 'cardio',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'alto', query: 'polichinelo jumping jack execução', duracaoBase: 5, descansoBase: 0,
    dica: 'Ótimo para aquecer e elevar a frequência cardíaca rapidamente.', restricoes: ['joelho', 'cardiaco', 'gestante'] },

  { id: 'pular-corda', nome: 'Pular Corda', grupo: 'cardio', tipo: 'cardio',
    nivel: ['intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'alto', query: 'pular corda treino cardio execução', duracaoBase: 8, descansoBase: 0,
    dica: 'Salte baixo e use o antebraço para girar a corda.', restricoes: ['joelho', 'cardiaco', 'gestante'] },

  { id: 'burpee', nome: 'Burpee', grupo: 'cardio', tipo: 'cardio',
    nivel: ['avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'alto', query: 'burpee execução correta', duracaoBase: 8, descansoBase: 0,
    dica: 'Exercício intenso, mantenha a coluna neutra ao apoiar as mãos no chão.', restricoes: ['joelho', 'lombar', 'ombro', 'cardiaco', 'hipertensao', 'gestante'] },

  { id: 'mountain-climber', nome: 'Mountain Climber', grupo: 'cardio', tipo: 'cardio',
    nivel: ['intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'alto', query: 'mountain climber execução correta', duracaoBase: 6, descansoBase: 0,
    dica: 'Mantenha o quadril estável, como uma prancha em movimento.', restricoes: ['ombro', 'lombar', 'cardiaco', 'gestante'] },

  { id: 'caminhada-livre', nome: 'Caminhada Livre (ao ar livre)', grupo: 'cardio', tipo: 'cardio',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'caminhada ao ar livre treino cardio', duracaoBase: 20, descansoBase: 0,
    dica: 'Opção de baixíssimo impacto, ótima para gestantes e reabilitação.', restricoes: [] },

  // ===================== MOBILIDADE / AQUECIMENTO / ALONGAMENTO =====================
  { id: 'aquecimento-articular', nome: 'Mobilidade Articular (Aquecimento Geral)', grupo: 'mobilidade', tipo: 'mobilidade',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'mobilidade articular aquecimento geral', duracaoBase: 5, descansoBase: 0,
    dica: 'Gire tornozelos, joelhos, quadril, ombros e pescoço suavemente.', restricoes: [] },

  { id: 'polichinelo-leve', nome: 'Polichinelo Leve (Aquecimento)', grupo: 'mobilidade', tipo: 'mobilidade',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'polichinelo leve aquecimento cardiovascular', duracaoBase: 3, descansoBase: 0,
    dica: 'Ritmo leve apenas para elevar a temperatura corporal.', restricoes: ['joelho', 'cardiaco', 'gestante'] },

  { id: 'marcha-estacionaria', nome: 'Marcha Estacionária (Aquecimento)', grupo: 'mobilidade', tipo: 'mobilidade',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'marcha estacionária aquecimento execução', duracaoBase: 5, descansoBase: 0,
    dica: 'Alternativa de baixíssimo impacto para aquecer, ideal para gestantes.', restricoes: [] },

  { id: 'alongamento-pernas', nome: 'Alongamento de Pernas e Posterior', grupo: 'mobilidade', tipo: 'mobilidade',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'alongamento de pernas e posterior de coxa', duracaoBase: 5, descansoBase: 0,
    dica: 'Segure cada posição por 20-30 segundos sem sentir dor.', restricoes: [] },

  { id: 'alongamento-costas', nome: 'Alongamento de Costas e Lombar', grupo: 'mobilidade', tipo: 'mobilidade',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'alongamento de costas e lombar', duracaoBase: 5, descansoBase: 0,
    dica: 'Respire fundo e relaxe a região durante o alongamento.', restricoes: [] },

  { id: 'alongamento-ombro', nome: 'Alongamento de Ombro e Braços', grupo: 'mobilidade', tipo: 'mobilidade',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['casa-sem', 'casa-com', 'academia'],
    impacto: 'baixo', query: 'alongamento de ombro e braços', duracaoBase: 5, descansoBase: 0,
    dica: 'Movimentos suaves, nunca force além do conforto.', restricoes: [] },

  // ===================== MÁQUINAS DE ACADEMIA (variedade além do treino livre) =====================
  { id: 'desenvolvimento-maquina', nome: 'Desenvolvimento de Ombro na Máquina', grupo: 'ombro', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'desenvolvimento de ombro na máquina execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 60,
    dica: 'Mantenha os cotovelos alinhados à frente do tronco e as escápulas fixas no encosto.', restricoes: ['ombro'] },

  { id: 'elevacao-lateral-cabo', nome: 'Elevação Lateral no Cabo', grupo: 'ombro', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'elevação lateral no cabo execução correta', seriesBase: 3, repsBase: '12-15', descansoBase: 45,
    dica: 'Mantenha tensão constante no cabo e evite usar impulso do corpo.', restricoes: ['ombro'] },

  { id: 'crucifixo-invertido-maquina', nome: 'Crucifixo Invertido na Máquina (Peck Deck Invertido)', grupo: 'ombro', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'crucifixo invertido máquina peck deck execução correta', seriesBase: 3, repsBase: '12-15', descansoBase: 50,
    dica: 'Aperte as escápulas ao final do movimento para ativar bem o deltoide posterior.', restricoes: ['ombro'] },

  { id: 'rosca-cabo', nome: 'Rosca Direta no Cabo', grupo: 'biceps', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'rosca direta no cabo execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 45,
    dica: 'Mantenha os cotovelos fixos ao lado do corpo durante todo o movimento.', restricoes: [] },

  { id: 'rosca-martelo-cabo', nome: 'Rosca Martelo na Corda (Cabo)', grupo: 'biceps', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'rosca martelo na corda cabo execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 45,
    dica: 'Pegada neutra na corda, sem deixar o ombro subir durante o movimento.', restricoes: [] },

  { id: 'supino-maquina', nome: 'Supino na Máquina (Chest Press)', grupo: 'peito', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'supino máquina chest press execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 60,
    dica: 'Mantenha as escápulas travadas no encosto e não projete os ombros para frente.', restricoes: ['ombro'] },

  { id: 'peck-deck', nome: 'Peck Deck / Voador (Máquina)', grupo: 'peito', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'peck deck voador máquina execução correta', seriesBase: 3, repsBase: '12-15', descansoBase: 50,
    dica: 'Ajuste o banco para os braços ficarem na altura dos ombros e contraia o peitoral ao final.', restricoes: ['ombro'] },

  { id: 'triceps-maquina', nome: 'Tríceps na Polia com Barra', grupo: 'triceps', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'tríceps pulley barra w execução correta', seriesBase: 3, repsBase: '12-15', descansoBase: 45,
    dica: 'Cotovelos fixos ao lado do corpo, estenda totalmente sem travar com força.', restricoes: ['ombro'] },

  { id: 'agachamento-smith', nome: 'Agachamento no Smith', grupo: 'pernas', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'alto', query: 'agachamento no smith execução correta', seriesBase: 3, repsBase: '10-12', descansoBase: 60,
    dica: 'A barra guiada facilita o equilíbrio, mas mantenha os pés um pouco à frente do corpo.', restricoes: ['joelho'] },

  { id: 'gluteo-maquina', nome: 'Glúteo no Cabo (Cross Over)', grupo: 'gluteos', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'glúteo no cabo cross over execução correta', seriesBase: 3, repsBase: '12-15 cada perna', descansoBase: 45,
    dica: 'Mantenha o tronco levemente inclinado à frente e o core contraído durante a extensão.', restricoes: [] },

  { id: 'abdominal-cabo', nome: 'Abdominal na Polia Alta (Cable Crunch)', grupo: 'abdomen', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'abdominal crunch polia alta execução correta', seriesBase: 3, repsBase: '15-20', descansoBase: 30,
    dica: 'Flexione a coluna levando o queixo em direção ao umbigo, sem puxar com os braços.', restricoes: ['lombar'] },

  { id: 'panturrilha-leg-press', nome: 'Panturrilha no Leg Press', grupo: 'panturrilha', tipo: 'forca',
    nivel: ['iniciante', 'intermediario', 'avancado'], equipamento: ['academia'],
    impacto: 'baixo', query: 'panturrilha no leg press 45 execução correta', seriesBase: 3, repsBase: '15-20', descansoBase: 30,
    dica: 'Empurre com a ponta dos pés, buscando amplitude máxima em cada repetição.', restricoes: [] }
];

/*
 * IDs reais de vídeos do YouTube (formato usado em https://www.youtube.com/embed/ID)
 * demonstrando cada exercício, para exibição no modal de vídeo.
 */
const VIDEO_IDS = {
  'agachamento-livre': '3Y2U3Agkvbs',
  'agachamento-sumo': 'gsSNayxK3YI',
  'leg-press-45': 'waAxlYvtCcI',
  'cadeira-extensora': 'Svq2T3L9oKo',
  'afundo': 'mPtTzNYAHi0',
  'agachamento-bulgaro': 'XZpWTmbcMWY',
  'step-up': 'KofF7-lGWtk',
  'cadeira-adutora': 'iV262ebNu6w',
  'cadeira-abdutora': '50qHGus1TZk',
  'elevacao-pelvica': 'OCMjir2i6uU',
  'gluteo-4-apoios': 'wE2iG00C-ao',
  'stiff': 'jSomWOwLiGE',
  'cadeira-flexora': 'CHsaztLSSrc',
  'elevacao-panturrilha-pe': 'cklp_Xh5V8M',
  'elevacao-panturrilha-sentado': 'XFxpVbABbjo',
  'supino-reto-barra': 'vIGvt-vgrvY',
  'supino-inclinado-halteres': 'G-i3jMIbDmo',
  'crucifixo': 'ZjIKUMtW37c',
  'flexao-de-braco': 'GOj4TMPVuZg',
  'cross-over': 'GdV3LkioCL4',
  'puxada-frente': '5YpVRG94q9c',
  'remada-baixa': '2YebbYuuBJQ',
  'remada-curvada': '_vO2dAnz__c',
  'remada-unilateral': 'K25eTWoEOWU',
  'barra-fixa': '4qRzwQZP1Tc',
  'superman': 'sKIH2binFv0',
  'desenvolvimento-halteres': 'eufDL9MmF8A',
  'elevacao-lateral': 'X5eS54qlVpA',
  'elevacao-frontal': 'Tt8m9zlvNx8',
  'remada-alta': 'QZD6vq22qJg',
  'manguito-rotador': 'WvK6QPf3M4I',
  'rosca-direta-barra': 'Et1wgGMGW8w',
  'rosca-alternada': 'nAqWZprW4yY',
  'rosca-martelo': 'YrZ0qzBi-kk',
  'rosca-scott': 'UivL6TD5VZg',
  'triceps-corda': 'M-DTY40JG9M',
  'triceps-testa': 'VakpIeaaeXA',
  'triceps-frances': 'gB-QMYMlHLs',
  'mergulho-banco': 'jH9RXQjbXqs',
  'prancha': 'thZZtS9gapk',
  'prancha-lateral': 'RTxAFDK1OMw',
  'abdominal-supra': 'hZVIstfFsIc',
  'abdominal-infra': 'IIMzCZXqIeA',
  'abdominal-bicicleta': 'apmprS8H1MY',
  'prancha-apoio-joelhos': 'iFpHYVOhfMU',
  'caminhada-esteira': 'nQdMzvhaSrI',
  'corrida-esteira': '9OCjXQNRXg4',
  'bicicleta-ergometrica': 'DeiIL3Claw8',
  'polichinelo': 'S2uqQ9zHZMc',
  'pular-corda': 'q-EiK-pznsU',
  'burpee': 'CrGAnJEfcmY',
  'mountain-climber': 'DTVVwQs-zoM',
  'caminhada-livre': 'U8cJuCL6pMw',
  'aquecimento-articular': 'VzIi4ANJdy0',
  'polichinelo-leve': '6nScqTShK_4',
  'marcha-estacionaria': 'qHO4yxAdoYY',
  'alongamento-pernas': 'O2qEPsnrxYY',
  'alongamento-costas': 'kpGcBev6DPY',
  'alongamento-ombro': 'aDYhstkP15U',
  'desenvolvimento-maquina': 'Q7K6DI9R-A8',
  'elevacao-lateral-cabo': '9zh-c9JQN9k',
  'crucifixo-invertido-maquina': 'pv1oEtejkrA',
  'rosca-cabo': 'YANQWtVF8nA',
  'rosca-martelo-cabo': '09EnOKIgsx8',
  'supino-maquina': 'KlhflSA6624',
  'peck-deck': 'a5XwjsD3AOI',
  'triceps-maquina': 'UJbJ95IyfhY',
  'agachamento-smith': 'uDBQtlCLQ0Y',
  'gluteo-maquina': 'CCuxb0gSo9w',
  'abdominal-cabo': 'wrCw315SW4c',
  'panturrilha-leg-press': 'F7_8z_7Kwks'
};

// Associa o ID do vídeo a cada exercício da base
EXERCICIOS.forEach(ex => { ex.videoId = VIDEO_IDS[ex.id] || null; });

/*
 * Modelos de divisão semanal de treino (split) por frequência escolhida.
 * Cada dia define um nome e a lista de grupos musculares priorizados.
 */
const DIVISOES_TREINO = {
  2: [
    { nome: 'Treino A - Corpo Todo', grupos: ['pernas', 'peito', 'costas', 'abdomen'] },
    { nome: 'Treino B - Corpo Todo', grupos: ['gluteos', 'ombro', 'biceps', 'triceps', 'abdomen'] }
  ],
  3: [
    { nome: 'Treino A - Superior', grupos: ['peito', 'costas', 'ombro', 'triceps', 'biceps'] },
    { nome: 'Treino B - Inferior', grupos: ['pernas', 'gluteos', 'posterior', 'panturrilha'] },
    { nome: 'Treino C - Corpo Todo + Core', grupos: ['pernas', 'peito', 'costas', 'abdomen'] }
  ],
  4: [
    { nome: 'Treino A - Superior (Peito/Costas)', grupos: ['peito', 'costas', 'triceps', 'biceps'] },
    { nome: 'Treino B - Inferior (Pernas/Glúteos)', grupos: ['pernas', 'gluteos', 'posterior', 'panturrilha'] },
    { nome: 'Treino C - Superior (Ombro/Braços)', grupos: ['ombro', 'biceps', 'triceps', 'abdomen'] },
    { nome: 'Treino D - Inferior + Core', grupos: ['pernas', 'gluteos', 'abdomen', 'panturrilha'] }
  ],
  5: [
    { nome: 'Treino A - Peito e Tríceps', grupos: ['peito', 'triceps'] },
    { nome: 'Treino B - Costas e Bíceps', grupos: ['costas', 'biceps'] },
    { nome: 'Treino C - Pernas e Glúteos', grupos: ['pernas', 'gluteos', 'posterior', 'panturrilha'] },
    { nome: 'Treino D - Ombro e Abdômen', grupos: ['ombro', 'abdomen'] },
    { nome: 'Treino E - Corpo Todo + Cardio', grupos: ['pernas', 'peito', 'costas', 'cardio'] }
  ],
  6: [
    { nome: 'Treino A - Peito e Tríceps', grupos: ['peito', 'triceps'] },
    { nome: 'Treino B - Costas e Bíceps', grupos: ['costas', 'biceps'] },
    { nome: 'Treino C - Pernas', grupos: ['pernas', 'posterior', 'panturrilha'] },
    { nome: 'Treino D - Ombro e Abdômen', grupos: ['ombro', 'abdomen'] },
    { nome: 'Treino E - Glúteos e Posterior', grupos: ['gluteos', 'posterior', 'pernas'] },
    { nome: 'Treino F - Full Body + Cardio', grupos: ['abdomen', 'cardio', 'peito', 'costas'] }
  ]
};

/*
 * Ajustes de treino conforme o objetivo principal escolhido.
 * repsRange/descanso são aplicados aos exercícios de força;
 * cardioExtra indica se deve incluir um bloco extra de cardio ao final.
 */
const OBJETIVOS_CONFIG = {
  emagrecimento: { label: 'Emagrecimento', repsRange: '15-20', descansoAjuste: -20, cardioExtra: true, duracaoCardioExtra: 15,
    texto: 'Priorizamos mais repetições, menos descanso e blocos de cardio para maximizar o gasto calórico.' },
  hipertrofia: { label: 'Hipertrofia (Ganho de Massa)', repsRange: '8-12', descansoAjuste: 15, cardioExtra: false, duracaoCardioExtra: 0,
    texto: 'Priorizamos cargas mais altas, repetições moderadas e descanso maior para estimular o crescimento muscular.' },
  condicionamento: { label: 'Condicionamento Físico Geral', repsRange: '12-15', descansoAjuste: -10, cardioExtra: true, duracaoCardioExtra: 10,
    texto: 'Combinamos força e cardio para melhorar seu condicionamento geral.' },
  definicao: { label: 'Definição Muscular', repsRange: '12-15', descansoAjuste: -15, cardioExtra: true, duracaoCardioExtra: 12,
    texto: 'Mais repetições, descansos curtos e cardio complementar para ajudar na definição.' },
  reabilitacao: { label: 'Reabilitação / Fortalecimento', repsRange: '10-12 (controlado)', descansoAjuste: 20, cardioExtra: false, duracaoCardioExtra: 0,
    texto: 'Movimentos controlados, baixa intensidade e foco total na execução correta e segura.' },
  saude: { label: 'Saúde / Qualidade de Vida', repsRange: '10-15', descansoAjuste: 0, cardioExtra: true, duracaoCardioExtra: 10,
    texto: 'Equilíbrio entre força, mobilidade e cardio para melhorar sua saúde no dia a dia.' }
};

// Número de exercícios principais (força) por dia, conforme tempo disponível por sessão
const EXERCICIOS_POR_TEMPO = { 30: 3, 45: 5, 60: 6, 90: 8 };
