# CRM Waves Plus + CBS — V2.1 Cadastro de Vendedores

Esta versão mantém o layout atual e acrescenta:

- tela real de cadastro de vendedor;
- validação de senha;
- gravação na aba `Vendedores`;
- login individual;
- cada vendedor visualiza apenas os leads cadastrados com seu e-mail;
- o administrador `admin@wavesplus.com` visualiza todos os leads.

## Arquivos do GitHub

Todo o projeto Next.js continua na raiz deste pacote.

## Atualização obrigatória do Google Apps Script

O arquivo:

`apps-script/Codigo.gs`

contém a API completa atualizada.

No projeto novo do Google Apps Script:

1. Abra `Código.gs`.
2. Apague o código atual.
3. Cole todo o conteúdo de `apps-script/Codigo.gs`.
4. Salve.
5. Vá em **Implantar → Gerenciar implantações**.
6. Clique no lápis.
7. Selecione **Nova versão**.
8. Clique em **Implantar**.

O link `/exec` permanece o mesmo.

## Publicação no GitHub

1. Extraia o ZIP.
2. Envie para o repositório os arquivos:
   - `app`
   - `public`
   - `package.json`
   - `.gitignore`
   - `README.md`
3. A pasta `apps-script` não precisa ir para o Vercel; ela serve para copiar o código da API.
4. Faça o commit e aguarde o Vercel ficar `Ready`.

## Regra de acesso

- Vendedor comum: recebe apenas linhas da aba `Leads` cujo campo `Vendedor` seja igual ao e-mail dele.
- Administrador: recebe todos os leads.
