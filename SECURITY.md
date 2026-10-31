# Política de segurança

## Reportando uma vulnerabilidade

Se você encontrou uma falha de segurança, **não abra uma issue pública**.
Use a aba **Security > Report a vulnerability** do repositório no GitHub (relatório privado) ou entre em contato com o mantenedor diretamente.

Inclua, se possível:

- o que acontece e qual o impacto;
- passos para reproduzir;
- a versão do projeto e do Node.js.

## Cuidados ao usar o bot

- **Nunca publique o `.env` nem o token do bot.** O `.env` já está no `.gitignore`. Se o token vazar, gere um novo em *Developer Portal > Bot > Reset Token*.
- Dê ao bot apenas as permissões de que ele precisa.
- Mantenha as dependências atualizadas (`npm audit` e `npm update`).
