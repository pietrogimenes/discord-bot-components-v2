# Contribuindo

Obrigado por querer ajudar! Este guia explica como rodar o projeto e quais convenções seguir.

## Preparando o ambiente

```bash
npm install
cp .env.example .env   # preencha o BOT_TOKEN (use um bot de teste)
npm run dev
```

Use um servidor de testes e preencha `GUILD_ID` para os comandos aparecerem na hora.

## Antes de abrir um pull request

```bash
npm run check   # verifica os tipos
npm run build   # confirma que compila
```

O GitHub Actions roda os mesmos comandos em cada pull request.

## Convenções

O projeto usa a [Constatic Base](https://constatic-docs.vercel.app/docs/discord/start) ([documentação completa para IAs](https://constatic-docs.vercel.app/en/llms-full.txt)). Resumo do que importa:

**Estrutura**

- Comandos ficam em `src/discord/commands/`, eventos em `src/discord/events/` e responders em `src/discord/responders/`. Tudo ali é carregado automaticamente. Use `createCommand`, `createEvent` e `createResponder` de `#base`.
- Imports por alias: `#base`, `#env`, `#functions` e `#menus`. Use `.js` nos imports relativos.
- Cores vêm do global `constants.colors` (`constants.json`).

**Components V2**

- **Respostas usam Components V2.** Não use `content` ou `embeds`. A exceção é a enquete nativa (`/poll`), que não pode ser combinada com V2.
- Use `v2()` e `notice()` de `#functions`. Telas maiores ficam em `src/menus/`, em funções `xxxMenu<R>()`.
- Em `editReply` e `update`, passe `ephemeral = false`: o flag `Ephemeral` só vale na resposta inicial.

**Comandos e responders**

- Nomes de comandos em inglês minúsculo; textos para o usuário em português (pt-BR).
- `customId` de componentes e modais começa com `/` e pode ter parâmetros: `/roles/toggle/:roleId`.
- Comandos com subcomandos são modulares: uma pasta com `command.ts` (`export default createCommand(...)`) e um arquivo por subcomando com `command.subcommand({...})`. Veja `commands/moderation/warn/`.
- Subcomandos herdam a permissão do comando principal. Se um precisar de permissão diferente (como `/ticket panel`), valide dentro do `run`.
- Modal aberto por **comando** usa `ResponderType.Modal`; aberto por **botão** usa `ResponderType.ModalComponent`.
- Use `await` nas promises dentro de `run`, para o `onError` capturar as falhas.
- Comandos de moderação e de cargos validam a hierarquia (`checkTarget`, `checkRole`) antes de agir.

**Variáveis de ambiente e intents**

- Recursos opcionais são ligados por variável de ambiente opcional: adicione em `src/env.ts`, `.env.example` e na tabela do README (português e inglês). O bot precisa continuar funcionando só com o `BOT_TOKEN`.
- Só peça intents privilegiadas quando a variável do recurso estiver definida (veja `src/index.ts`) e documente no README.

## Pull requests

- Mantenha o PR focado em uma mudança.
- Descreva o que mudou e como testou. Se mexeu em comandos, diga quais testou no Discord.
- Atualize o README quando adicionar comandos ou variáveis.

## Issues

Use os modelos de issue. Para falhas de segurança, **não abra issue pública**: veja o [SECURITY.md](SECURITY.md).
