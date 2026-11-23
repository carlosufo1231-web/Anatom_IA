
# ANATOM-IA: ARQUITETURA, CONSULTA LOCAL DE CONHECIMENTO E USO RESPONSÁVEL DE INTELIGÊNCIA ARTIFICIAL NO ENSINO DE ANATOMIA HUMANA

## Dados do trabalho

- **Instituto:** Instituto de Educação do Estado do Pará (IEEPA -- IEEP)
- **Ensino:** Técnico | 2026.1
- **Curso:** Técnico de Informática
- **Disciplina:** Projeto Integrador
- **Professor:** Especialista Mathaus Borges
- **Estudantes:** [nomes dos estudantes]
- **Título:** [título abreviado, caso solicitado]
- **Cidade:** [cidade]
- **Ano:** [ano]

---

# FICHA AVALIATIVA

| Item obrigatório | Situação |
|---|---|
| Capa | Preenchida |
| Contracapa | Pendente de dados da instituição |
| Ficha avaliativa | Pendente de assinatura e nota |
| Resumo | Incluído |
| Abstract | Incluído |
| Lista de abreviaturas e siglas | Incluída |
| Sumário | Incluído |
| Introdução | Incluída |
| Desenvolvimento | Incluído |
| Conclusão | Incluída |
| Referências | Incluídas |
| Controle de folhas | A preencher pelo estudante |

Os itens não obrigatórios — dedicatória, agradecimentos, epígrafe, lista de ilustrações, lista de tabelas, anexos e apêndices — não foram incluídos, salvo solicitação posterior do professor ou da instituição.

---

# RESUMO

O presente artigo apresenta a arquitetura e o funcionamento da Anatom-IA, uma aplicação destinada ao estudo de anatomia e fisiologia humana por meio de inteligência artificial. O projeto combina uma interface desenvolvida em React, um servidor em TypeScript com Express e o modelo Gemini da Google. Para fundamentar as respostas em material previamente selecionado, a aplicação utiliza uma base de conhecimento local, armazenada no arquivo anatomialivro.txt, que contém conteúdos derivados de *Anatomia Humana Sistemática Básica*. Antes da geração da resposta, trechos do arquivo são pesquisados no servidor e enviados como contexto à API do Gemini. Essa organização transforma o modelo em um assistente que responde a perguntas específicas e gera questões de múltipla escolha sem depender exclusivamente do conhecimento interno do modelo. O funcionamento foi organizado em três etapas: recebimento da pergunta, recuperação dos trechos locais mais relacionados e geração da resposta. O artigo descreve cada etapa, apresenta o processo de indexação por palavras-chave e discute critérios de uso responsável, limitações, privacidade e possibilidade de evolução tecnológica. Conclui-se que a arquitetura pode aumentar a rastreabilidade das respostas, desde que o material disponível seja correto, autorizado e adequado às normas acadêmicas. Recomenda-se a adoção de referências adicionais, a melhoria da recuperação semântica e a revisão humana dos conteúdos anatômicos.

**Palavras-chave:** anatomia humana; inteligência artificial; Gemini; base de conhecimento local; recuperação de informação.

---

# ABSTRACT

This article presents the architecture and operation of Anatom-IA, an application developed for the study of human anatomy and physiology through artificial intelligence. The project combines a React interface, a TypeScript server using Express, and Google's Gemini model. To ground responses in previously selected material, the application uses a local knowledge base stored in the anatomialivro.txt file, containing content derived from *Anatomia Humana Sistemática Básica*. Before generating a response, relevant text excerpts are searched by the server and sent to the Gemini API as context. This organization enables the model to answer specific questions and create multiple-choice questions without relying exclusively on its internal knowledge. The process consists of three stages: receiving the question, retrieving the most relevant local excerpts, and generating a response. The article describes each stage, presents the keyword-based indexing process, and discusses responsible use, limitations, privacy, and future technological improvements. The results indicate that the architecture can improve response traceability, provided that the available material is accurate, authorized, and consistent with academic standards. Additional references, semantic retrieval improvements, and human review of anatomical content are recommended.

**Keywords:** human anatomy; artificial intelligence; Gemini; local knowledge base; information retrieval.

---

# LISTA DE ABREVIATURAS E SIGLAS

| Sigla ou termo | Significado |
|---|---|
| API | Application Programming Interface; Interface de Programação de Aplicações |
| CSS | Cascading Style Sheets; Folhas de Estilo em Cascata |
| HTML | HyperText Markup Language; Linguagem de Marcação de Hipertexto |
| IA | Inteligência Artificial |
| JSON | JavaScript Object Notation; formato de representação de dados estruturados |
| RAG | Retrieval-Augmented Generation; geração aumentada por recuperação |
| SDK | Software Development Kit; conjunto de ferramentas de desenvolvimento |
| SSE | Server-Sent Events; eventos enviados pelo servidor |
| UX | User Experience; experiência do usuário |

---

# SUMÁRIO

1. INTRODUÇÃO
2. FUNDAMENTAÇÃO E FUNCIONAMENTO DA ANATOM-IA
   1. Arquitetura geral do sistema
   2. Base de conhecimento local
   3. Preparação do conhecimento e treinamento do sistema
   4. Preparação e organização do texto
   5. Recuperação das informações relevantes
   6. Consulta ao modelo Gemini e definição do comportamento
   7. Geração de respostas e questões
3. USO RESPONSÁVEL, SEGURANÇA E LIMITAÇÕES
   1. Privacidade e proteção da chave de API
   2. Precisão e rastreabilidade das informações
   3. Limitações da busca por palavras-chave
   4. Uso acadêmico autorizado
4. CONCLUSÃO
5. REFERÊNCIAS

---

# 1 INTRODUÇÃO

A anatomia humana constitui uma área fundamental para cursos técnicos e superiores da área da saúde. O estudo envolve conceitos relativos à localização, classificação e relação entre estruturas anatômicas. Durante a aprendizagem, os estudantes podem enfrentar dificuldades para relacionar nomenclatura, sistemas corporais, regiões do corpo e aplicações clínicas. Nesse contexto, ferramentas digitais podem oferecer explicações instantâneas, exemplos contextualizados e exercícios de revisão.

A Inteligência Artificial (IA) amplia essa possibilidade ao produzir respostas a partir de perguntas escritas em linguagem natural. Entretanto, um modelo de linguagem não deve ser considerado uma fonte infalível de conhecimento médico ou anatômico. Suas respostas podem conter imprecisões, omissões ou conclusões não sustentadas pelas fontes consultadas pelo usuário. Além disso, quando não existe uma referência local definida, torna-se difícil verificar a origem de determinadas afirmações.

Diante desse contexto, formula-se o seguinte problema de pesquisa: **como uma aplicação pode organizar uma base anatômica local e consultar uma inteligência artificial de modo a priorizar informações verificáveis e evitar respostas desconectadas do material selecionado?**

A Anatom-IA foi desenvolvida como uma resposta a essa dificuldade. O projeto utiliza uma interface em React, um servidor em TypeScript com Express e a API do Google Gemini. Os conteúdos anatômicos são armazenados em um arquivo local, identificado como `knowledge/limpo/anatomialivro.txt`. Esse arquivo contém textos organizados por capítulos e uma seção de referências. Antes de solicitar uma resposta ao modelo Gemini, o servidor identifica os trechos do livro relacionados à pergunta e os inclui na requisição.

O objetivo geral deste trabalho consiste em explicar a arquitetura da Anatom-IA e o fluxo pelo qual as informações locais são recuperadas e enviadas ao motor Gemini. Como objetivos específicos, pretende-se: (a) apresentar os componentes da aplicação; (b) explicar a leitura e a indexação do arquivo anatômico; (c) demonstrar a consulta ao modelo Gemini; (d) distinguir o processamento local da geração realizada pela API externa; e (e) discutir riscos técnicos e acadêmicos.

A justificativa do projeto reside na necessidade de utilizar recursos tecnológicos no ensino sem abrir mão da rastreabilidade das fontes. A leitura direta de um livro permite identificar a origem das informações, mas não oferece, por si só, uma interação conversacional. Ao combinar o livro local com uma IA, a aplicação procura unir conteúdo de referência e facilidade de consulta. Esse processo não substitui livros, aulas, docentes ou avaliação profissional.

---

# 2 FUNDAMENTAÇÃO E FUNCIONAMENTO DA ANATOM-IA

## 2.1 Arquitetura geral do sistema

A Anatom-IA possui uma arquitetura composta por camadas distintas. O navegador apresenta a interface ao usuário e envia perguntas por meio de requisições HTTP. O servidor recebe essas requisições, acessa o conteúdo local e comunica-se com a API do Gemini. A interface de chat e a interface de geração de questões utilizam formatos de comunicação diferentes: o chat recebe uma transmissão contínua de texto, enquanto o quiz recebe uma resposta estruturada em JSON.

O usuário escreve uma pergunta na interface React. Em seguida, a aplicação envia o histórico recente e o nível de profundidade solicitado para o endereço `/api/chat`. Ao receber essa requisição, o servidor seleciona as mensagens relevantes, realiza a pesquisa local e acrescenta os trechos encontrados ao contexto enviado ao modelo.

Essa separação possui uma finalidade prática: o navegador não precisa ler diretamente o livro completo nem armazenar a chave secreta da API. O acesso à base ocorre no servidor, e a comunicação com o provedor externo é centralizada em uma única implementação. Dessa forma, o arquivo anatômico e a chave de API não precisam ser expostos ao cliente.

## 2.2 Base de conhecimento local

O conteúdo utilizado pela aplicação está localizado no diretório `knowledge/limpo/anatomialivro.txt`. Esse arquivo foi preparado em linguagem textual simples, sem depender de serviços externos para ser consultado. A estrutura reúne capítulos anatômicos e uma seção final denominada REFERÊNCIAS.

Foram incluídos no início do arquivo os seguintes metadados:

- Livro: *Anatomia Humana Sistemática Básica*;
- Autor: Braz José do Nascimento Júnior;
- Ano: 2020.

Esses dados identificam a obra principal associada ao material. A presença deles permite que o servidor forneça contexto bibliográfico à IA e que o usuário saiba qual publicação fundamenta o conteúdo local.

O uso da base depende de três condições técnicas. Primeiro, o arquivo precisa estar disponível no caminho configurado pelo servidor. Segundo, o conteúdo precisa ser legível em formato UTF-8. Terceiro, as informações devem ter sido previamente autorizadas para uso e processamento. A leitura da base não ocorre em uma conversa externa; ela é realizada pelo programa no ambiente de execução da aplicação.

## 2.3 Preparação do conhecimento e treinamento do sistema

A preparação do conhecimento não corresponde ao treinamento ou ao ajuste dos pesos internos do modelo Gemini. Os parâmetros do modelo externo não foram modificados. A base foi criada a partir do material selecionado em `knowledge/limpo/anatomialivro.txt`, arquivo localizado no projeto. Dessa forma, a informação anatômica é disponibilizada ao modelo em cada consulta, por meio da técnica de recuperação de contexto.

Esse processo pode ser entendido como uma adaptação da aplicação, e não como um treinamento convencional de IA. A base é preparada no servidor: o arquivo é dividido em blocos, organizado por seções e transformado em um índice em memória. Depois da pergunta do usuário, o sistema recupera os blocos relacionados e os envia ao Gemini. Como o modelo recebe esses trechos como parte da conversa, o conhecimento permanece ligado ao material selecionado e pode ser atualizado sem reiniciar o desenvolvimento do modelo.

O comportamento da IA foi definido separadamente por meio de uma instrução de sistema criada na função `buildSystemInstruction`. Essa instrução estabelece o idioma, o nível de profundidade, o assunto permitido, o uso dos trechos recuperados e a conduta diante de perguntas fora da anatomia ou da fisiologia humana.

As regras gerais determinam que a Anatom-IA: responda em português do Brasil; explique os assuntos de acordo com o nível iniciante, estudante ou revisão; utilize terminologia anatômica objetiva; considere os trechos locais como fonte prioritária; não invente citações; não apresente diagnósticos médicos; e se limite a anatomia, histologia e fisiologia humana. Para assuntos externos, a aplicação foi configurada para informar que responde exclusivamente sobre anatomia e fisiologia humana.

As diretrizes também impedem a explicação do próprio funcionamento interno quando solicitada pelo usuário. Esse mecanismo protege as regras de comportamento configuradas no servidor e evita que o usuário altere o objetivo da aplicação por meio de comandos direcionados ao chat.

## 2.4 Preparação e organização do texto

Antes da busca, o programa divide o texto em partes menores chamadas de chunks, ou blocos. Cada bloco possui, em geral, até 1.400 caracteres. Entre um bloco e outro, existe uma sobreposição de até 180 caracteres. Essa repetição evita que uma informação importante seja perdida no ponto exato da divisão.

O arquivo é também organizado por seções. Linhas iniciadas por `CAPÍTULO` podem identificar o nome do capítulo. As linhas em branco indicam a separação de parágrafos. A palavra `REFERÊNCIAS` altera o nome da seção para “Referências”. Assim, cada bloco recuperado conserva uma indicação do capítulo ou da área de origem.

Depois da divisão, o texto recebe tratamento antes da pesquisa. Letras maiúsculas são convertidas em minúsculas e caracteres acentuados são normalizados. Pontuação e outros símbolos são removidos. Palavras muito comuns, como artigos e preposições, são consideradas palavras irrelevantes e podem ser descartadas. Esse procedimento facilita a correspondência entre a pergunta e o conteúdo.

O índice é criado na primeira consulta e mantido em memória. Isso significa que o conteúdo não é reprocessado integralmente a cada mensagem. Quando o arquivo é alterado, o servidor precisa ser reiniciado para que o novo índice seja criado. Essa característica é adequada para uma aplicação pequena, embora um sistema maior possa utilizar um banco de dados ou um serviço especializado de busca.

## 2.5 Recuperação das informações relevantes

A consulta ao conteúdo local utiliza um método baseado em frequência e relevância das palavras. Primeiro, a pergunta é separada em termos. Em seguida, o programa verifica quantas vezes esses termos aparecem em cada bloco. Trechos que possuem mais correspondências recebem maior pontuação.

O método considera não apenas o número de ocorrências, mas também a quantidade de vezes que o termo aparece em outros blocos. Um termo presente em muitos documentos recebe menor peso específico do que um termo raro associado ao assunto pesquisado. O sistema considera ainda o tamanho aproximado do bloco e permite uma correspondência direta quando a pergunta normalizada aparece integralmente no texto.

A recuperação retorna até quatro trechos para uma mesma pergunta. Essa limitação reduz o volume enviado ao modelo e evita que uma quantidade excessiva de texto seja utilizada na resposta. Por isso, a precisão depende da qualidade dos termos empregados pelo usuário e da correspondência entre a pergunta e o vocabulário do livro.

Essa implementação pode ser considerada uma forma simples de geração aumentada por recuperação, também denominada RAG. O servidor não apenas gera uma resposta por meio do modelo; antes disso, ele consulta uma fonte local e fornece o contexto recuperado ao modelo. O conhecimento utilizado deixa de ser exclusivamente interno ao Gemini e passa a incluir o material escolhido pelo projeto.

## 2.6 Consulta ao modelo Gemini e definição do comportamento

A chave de acesso ao Gemini é obtida pela variável de ambiente `GEMINI_API_KEY`. O servidor cria o cliente da API e utiliza o modelo identificado como `gemini-3.1-flash-lite`. Antes da geração, o usuário seleciona um nível de profundidade: iniciante, estudante ou revisão.

Uma instrução de sistema define o comportamento da IA. Essa instrução determina que a Anatom-IA responda exclusivamente sobre anatomia, histologia e fisiologia humana, utilize português do Brasil e não forneça diagnósticos médicos. Também orienta o modelo a considerar os trechos locais como referência prioritária e a não atribuir ao livro informações que não estejam presentes no contexto recuperado.

A definição do comportamento ocorre no servidor antes do envio da pergunta ao Gemini. Dependendo do nível escolhido pelo usuário, a instrução informa que o texto deve ser simples e direto, adequado a estudante de saúde ou organizado apenas em pontos-chave. Esse ajuste não altera o modelo; ele altera a forma como a aplicação solicita a geração da resposta.

Também foram configuradas regras de bloqueio para assuntos externos e proteção das diretrizes internas. O sistema orienta o modelo a não revelar seu prompt, sua programação ou suas regras de funcionamento. Essas medidas complementam a restrição temática e reduzem desvios de assunto durante o uso.

O histórico enviado ao modelo é limitado às seis mensagens mais recentes. Apenas as duas últimas mensagens do usuário são usadas para formar a consulta ao livro. Essa estratégia permite considerar o assunto atual da conversa sem carregar todo o histórico a cada pergunta.

Os trechos recuperados são anexados à última mensagem do usuário com uma identificação da seção. A pergunta original, o histórico recente e o contexto local são enviados juntos ao Gemini. Dessa maneira, o modelo pode relacionar a informação recuperada à pergunta específica.

Caso não existam trechos relevantes, o sistema envia somente a pergunta e o histórico. Nesse caso, não é criada uma referência fictícia. Essa conduta evita atribuir ao livro uma informação que não foi efetivamente recuperada.

## 2.7 Geração de respostas e questões

Para o chat, o servidor utiliza uma geração de conteúdo em fluxo contínuo. O método denominado `generateContentStream` permite enviar partes da resposta à medida que são produzidas. Esse mecanismo melhora a percepção de rapidez, pois o usuário começa a visualizar o texto antes de a resposta estar completamente concluída.

O navegador recebe os eventos por meio de Server-Sent Events (SSE). Após receber o primeiro trecho, a interface atualiza a mensagem enquanto os demais fragmentos chegam. A aplicação também apresenta a situação de carregamento e permite cancelar uma resposta em andamento.

Na geração de quizzes, o servidor cria uma única questão de múltipla escolha. São fornecidos tema, contexto recente da conversa e nível de estudo. A API recebe o contexto local e uma instrução para retornar um objeto estruturado em JSON. O resultado contém o tema, alternativas, índice da resposta correta e explicação objetiva.

Essa separação permite que o sistema combine o uso conversacional com a prática de revisão. Ainda assim, as questões dependem da qualidade dos trechos recuperados e da interpretação realizada pelo modelo. Por isso, a aplicação não deve publicar questões sem conferência humana em contextos avaliativos formais.

---

# 3 USO RESPONSÁVEL, SEGURANÇA E LIMITAÇÕES

## 3.1 Privacidade e proteção da chave de API

A chave da API Gemini possui valor secreto e não deve ser compartilhada em arquivos públicos ou no código-fonte versionado. A aplicação configura essa chave por meio de uma variável de ambiente. Entretanto, uma chave já exposta deve ser removida e substituída.

As perguntas enviadas ao modelo podem ser processadas por um serviço externo. Quando o usuário inclui dados pessoais, informações clínicas, fotografias ou documentos, essas informações podem sair do servidor local. Portanto, o usuário deve ser informado sobre a política de privacidade e evitar o envio de dados sensíveis sem necessidade.

No desenvolvimento acadêmico, a utilização da API exige autorização da instituição e orientação clara sobre armazenamento, uso e descarte dos dados. O modelo não deve ser apresentado como substituto de um profissional da saúde.

## 3.2 Precisão e rastreabilidade das informações

A utilização de um livro local aumenta a possibilidade de rastrear o conteúdo utilizado, mas não elimina todas as limitações. A IA pode interpretar um trecho de forma incorreta, omitir uma relação anatômica ou combinar mais de uma fonte. Por isso, a resposta não deve ser apresentada como confirmação definitiva.

Para aumentar a credibilidade, a aplicação pode apresentar o nome da obra e o capítulo relacionado a cada trecho recuperado. Também pode indicar que uma resposta foi produzida com base no livro local e permitir a abertura do trecho original. Como a base atual não possui páginas individuais identificadas em todos os blocos, a referência pode ser aprofundada com marcações de capítulo e página.

A revisão humana é especialmente necessária em tópicos sobre exames, cirurgia, procedimentos clínicos ou diagnóstico. A aplicação foi configurada para evitar diagnósticos reais e responder apenas a questões teóricas sobre anatomia e fisiologia humana.

## 3.3 Limitações da busca por palavras-chave

A busca implementada corresponde a uma indexação local baseada em palavras. Esse mecanismo não compreende plenamente sinônimos, relações anatômicas ou intenções complexas. Uma pergunta sobre “articulação do joelho”, por exemplo, pode não recuperar blocos escritos com termos como “articulação femorotibial” caso não existam palavras comuns suficientes.

Erros podem ocorrer por abreviações, variações ortográficas, acentuação ou termos técnicos pouco frequentes. Como o sistema mantém somente até quatro trechos, um contexto relevante pode não aparecer entre os primeiros resultados.

Uma evolução possível consiste na utilização de representações semânticas dos textos. Nesse método, palavras e frases são transformadas em vetores que aproximam conceitos relacionados. Outra melhoria seria comparar a busca por palavras-chave com a busca vetorial ou combinar ambas. Também seriam recomendáveis métricas de avaliação e testes com perguntas previamente definidas.

## 3.4 Uso acadêmico autorizado

A utilização de IA em trabalhos escolares não é neutra em relação às regras da instituição. De acordo com o checklist fornecido para este projeto, o uso não autorizado da IA pode configurar fraude, anulando o ato avaliativo. Portanto, o estudante deve obter a autorização do professor antes de apresentar o projeto ou utilizar a ferramenta em uma atividade formal.

A ferramenta pode apoiar o estudo por meio de explicações e questões, mas o estudante permanece responsável por verificar o conteúdo. Produzir texto com auxílio de IA não dispensa leitura, análise crítica, revisão bibliográfica e consulta às fontes originais.

---

# 4 CONCLUSÃO

A Anatom-IA demonstra como uma aplicação de estudo pode integrar uma interface conversacional, uma base local de conhecimento e o modelo Gemini. O problema central desenvolvido neste trabalho consiste na dificuldade de atribuir origem a respostas geradas por inteligência artificial. Como resposta, o servidor acessa o arquivo local, divide o conteúdo em blocos, identifica os trechos relacionados à pergunta e envia o contexto encontrado ao modelo.

O processo possui três partes principais. Na primeira, a aplicação recebe a pergunta e o histórico recente. Na segunda, o servidor realiza uma busca por palavras-chave no arquivo anatômico e seleciona até quatro trechos. Na terceira, o Gemini recebe o contexto junto à instrução de sistema e gera uma resposta ou uma questão estruturada.

Como principal resultado, observa-se que a consulta local pode reforçar a rastreabilidade do conteúdo utilizado. Diferentemente de uma conversa que consulta apenas o conhecimento interno do modelo, a Anatom-IA pode indicar o capítulo associado ao trecho recuperado e priorizar o livro selecionado. Porém, essa vantagem depende diretamente da qualidade da base e do funcionamento da recuperação.

Como principais limitações, destacam-se a ausência de compreensão semântica avançada, a dependência da conexão com a API externa, o processamento de dados fora do ambiente local e a possibilidade de que o modelo interprete incorretamente o contexto. Além disso, o método atual não garante que todos os trechos necessários sejam recuperados.

Como proposta concreta para trabalhos futuros, recomenda-se: revisar e completar as referências do livro local; inserir números de capítulos e páginas em cada conteúdo; registrar a origem de cada resposta; criar uma busca híbrida baseada em palavras-chave e vetores; testar o sistema com perguntas validadas por professores; apresentar avisos claros sobre privacidade; permitir a desativação do envio de dados a serviços externos; e revisar todas as questões geradas antes de utilizá-las em avaliação.

Conclui-se que a arquitetura da Anatom-IA apresenta utilidade educacional potencial, desde que seja utilizada com transparência e supervisão humana. A inteligência artificial pode organizar explicações e auxiliar na revisão, mas a responsabilidade pela verificação anatômica permanece com o usuário e com os responsáveis acadêmicos pelo projeto.

---

# 5 REFERÊNCIAS

NASCIMENTO JÚNIOR, Braz José do. *Anatomia humana sistemática básica*. 2020. Obra utilizada como base principal do arquivo `knowledge/limpo/anatomialivro.txt`.

*Nota acadêmica:* as referências técnicas do projeto foram obtidas diretamente dos arquivos implementados no repositório. O uso da obra *Anatomia Humana Sistemática Básica* foi informado pelo conteúdo da própria base local. A versão, a editora e os dados completos de publicação devem ser conferidos no exemplar físico ou na ficha catalográfica antes da entrega definitiva.

## Materiais internos do projeto consultados

- Interface da aplicação: `src/App.tsx`
- Servidor, endpoints e integração com Gemini: `server.ts`
- Módulo de recuperação local: `knowledge.ts`
- Metadados da aplicação: `metadata.json`
- Dependências da aplicação: `package.json`
- Base anatômica local: `knowledge/limpo/anatomialivro.txt`
- Orientações do trabalho: `Modelo_prompt_artigo_academico.md`
- Checklist institucional: `Checklist_Trabalho_Escrito.md`

---

# CONTROLE DE FOLHAS

- **Total de folhas:** ________________
- **Folhas extras:** ________________
- **Número de folhas obrigatórias presentes:**
  - Capa
  - Contracapa
  - Ficha avaliativa
  - Resumo
  - Abstract
  - Lista de abreviaturas e siglas
  - Sumário
  - Introdução
  - Desenvolvimento
  - Conclusão
  - Referências

# CAMPOS PENDENTES DE PREENCHIMENTO

Complete os campos abaixo antes da impressão:

- Nome da instituição;
- Curso;
- Disciplina;
- Professor(a);
- Nome completo dos estudantes;
- Cidade;
- Ano;
- Título final;
- Objetivo geral formal;
- Problema de pesquisa;
- Dados completos da obra principal;
- Total de folhas;
- Folhas extras;
