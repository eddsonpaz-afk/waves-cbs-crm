# CRM Comercial Waves Plus + CBS — GitHub + Vercel

Projeto reconstruído em Next.js para publicar primeiro no GitHub e depois no Vercel.

## Mantido do mockup aprovado

- identidade azul-marinho premium;
- logos oficiais originais de Waves Plus e CBS;
- login;
- dashboard;
- cards de Leads, Oportunidades, Negociações e Convertidos;
- funil de vendas;
- cadastro de lead;
- lista e filtros;
- detalhes do lead;
- WhatsApp, ligação e atualização de status;
- agenda;
- perfil;
- dashboard administrativo;
- versão responsiva para celular e desktop.

## 1. GitHub

1. Extraia o ZIP.
2. Crie um repositório novo no GitHub.
3. Clique em **Add file → Upload files**.
4. Arraste todo o conteúdo da pasta extraída.
5. Clique em **Commit changes**.

## 2. API do Apps Script

1. Abra o Apps Script ligado à planilha.
2. Faça uma cópia de segurança do código atual.
3. Use o arquivo `apps-script-api/Codigo.gs`.
4. Confirme o ID da planilha.
5. Implante como **App da Web**.
6. Executar como: **você**.
7. Quem pode acessar: **qualquer pessoa**.
8. Copie a URL terminada em `/exec`.

## 3. Vercel

1. Importe o repositório do GitHub.
2. Em **Environment Variables**, crie `CRM_API_URL`.
3. Cole a URL `/exec` do Apps Script.
4. Clique em **Deploy**.

## Login inicial

- E-mail: `admin@wavesplus.com`
- Senha: `admin123`

Enquanto a API não estiver configurada, o aplicativo abre em modo demonstração para validar o layout.
