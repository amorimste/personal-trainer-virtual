# Personal Trainer Virtual

Web app estático (HTML, CSS e JavaScript puro, sem frameworks e sem backend) que funciona como um personal trainer virtual: o usuário responde uma anamnese rápida e recebe uma ficha de treino semanal personalizada, com vídeos do YouTube demonstrando cada exercício.

## Funcionalidades

- Questionário multi-etapas (wizard) com barra de progresso: nome, objetivo, peso/altura (com cálculo automático de IMC), idade, sexo, nível de experiência, frequência semanal, local de treino, tempo disponível, restrições de saúde e foco muscular opcional.
- Geração automática de uma divisão de treino semanal (Full Body, ABC, Upper/Lower, PPL, conforme a frequência), filtrando e ajustando exercícios de uma base de dados com ~55 exercícios, considerando objetivo, nível, equipamento disponível e restrições de saúde (ex: dor no joelho evita agachamentos profundos e sugere alternativas de baixo impacto).
- Cada treino inclui aquecimento, exercícios principais (com séries, repetições, descanso e dica de execução), bloco de cardio (quando aplicável ao objetivo) e alongamento final.
- Vídeo demonstrativo de cada exercício em modal, usando embed do YouTube.
- Progresso de exercícios concluídos salvo em `localStorage` (o treino não se perde ao fechar o navegador).
- Exportação/impressão em PDF via impressão do navegador.
- Compartilhamento do treino via WhatsApp.
- Dark mode como padrão, com opção de light mode.
- Totalmente responsivo (mobile first).

## Estrutura de arquivos

- `index.html` — estrutura da página (wizard, loading, resultado, modal de vídeo).
- `style.css` — estilos, temas claro/escuro e responsividade.
- `data.js` — base de dados de exercícios, divisões de treino, configurações de objetivo e frases motivacionais.
- `script.js` — lógica do wizard, algoritmo de geração de treino e renderização do resultado.

## Como rodar localmente

Como é um site 100% estático, basta abrir o `index.html` em um navegador ou servir a pasta com qualquer servidor estático (ex: `npx serve .`).

## Aviso

Este app não substitui acompanhamento profissional. Consulte um médico antes de iniciar qualquer atividade física.
