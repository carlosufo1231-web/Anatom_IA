<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/a0156843-b65c-4e43-81fa-c80118e90241

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Base de conhecimento local

O chat e os quizzes com tema ou conversa recente pesquisam trechos relevantes em
`knowledge/limpo/anatomialivro.txt` e os enviam como contexto à API do Gemini.
A busca local por palavras-chave retorna até quatro trechos. O índice é criado
no primeiro uso e fica em memória; reinicie o servidor depois de alterar o
arquivo. As respostas ainda dependem da API e de conexão à internet, e os trechos
recuperados são enviados ao Gemini. Use somente materiais que você tem
autorização para processar e enviar ao provedor.

## Publicação gratuita no Render

O projeto pode ser publicado gratuitamente no Render como um serviço Web.

1. Crie uma conta em https://render.com.
2. Envie o repositório do projeto para o GitHub.
3. No painel do Render, selecione **New > Blueprint**.
4. Conecte o repositório e selecione o arquivo `render.yaml`.
5. Informe uma nova `GEMINI_API_KEY` na variável de ambiente solicitada.
6. Aguarde a conclusão da compilação e use o endereço público fornecido pelo Render.

Não envie o arquivo `.env` nem a chave real para o GitHub. Depois de publicar,
verifique o funcionamento em `/api/health`. Recursos gratuitos podem entrar em
repouso após períodos sem acesso e levar alguns instantes para iniciar novamente.
