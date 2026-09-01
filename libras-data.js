/* ==========================================================================
   AcessaMais — libras-data.js
   Feira Tecnológica 2026 — ETEC Guariba

   Camada de dados do sistema de Libras. Cada item representa um trecho de
   conteúdo do site que PODE ter uma versão em Libras associada.

   Campos pensados para uma futura tabela de banco de dados:
   id, title, textOriginal, videoUrl, duration, category, language,
   status ('pending' | 'ready'), updatedAt.

   IMPORTANTE: enquanto videoUrl for null / status for 'pending', o painel
   exibe "Conteúdo em Libras em preparação." — nunca uma tradução inventada.

   Para adicionar um novo conteúdo com vídeo real, basta preencher videoUrl,
   duration e trocar status para 'ready'. Nenhuma outra parte do sistema
   precisa mudar.
   ========================================================================== */

window.LibrasContent = [
  {
    id: 'slogan',
    page: 'global',
    title: 'Slogan do AcessaMais',
    textOriginal: 'Conhecimento para todos, do jeito de cada um.',
    videoUrl: null,
    duration: null,
    category: 'institucional',
    language: 'libras-BR',
    status: 'pending',
    updatedAt: '2026-08-21'
  }
];

/* Termos de referência para a área "Aprenda Libras" (acessibilidade.html).
   Apenas palavra + significado — a representação do sinal em si (vídeo)
   entra depois, validada. Nunca descrevemos o movimento aqui. */
window.LibrasGlossary = [
  { termo: 'Olá',            significado: 'Cumprimento inicial.',                         videoUrl: null },
  { termo: 'Obrigado(a)',    significado: 'Agradecimento.',                                videoUrl: null },
  { termo: 'Acessibilidade', significado: 'Tornar algo utilizável por todas as pessoas.',  videoUrl: null },
  { termo: 'Tecnologia',     significado: 'Ferramentas e conhecimento aplicado.',           videoUrl: null },
  { termo: 'Aprender',       significado: 'Adquirir conhecimento.',                         videoUrl: null },
  { termo: 'Ler',            significado: 'Interpretar um texto.',                          videoUrl: null },
  { termo: 'Ajuda',          significado: 'Apoio ou suporte.',                              videoUrl: null },
  { termo: 'Sim / Não',      significado: 'Respostas afirmativa e negativa.',                videoUrl: null }
];
