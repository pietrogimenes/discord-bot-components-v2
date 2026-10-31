**🇧🇷 Português** · [🇺🇸 English](README.en.md)

# Bot de Discord com Components V2

![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-green)
![Node.js 20.12+](https://img.shields.io/badge/node-%E2%89%A5%2020.12-339933)
![discord.js 14](https://img.shields.io/badge/discord.js-14-5865F2)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
[![Hospedar na HyzeCloud](https://img.shields.io/badge/hospedar%20na-HyzeCloud-6366f1)](https://hyzecloud.com/pt-br/signup)

Bot de Discord **gratuito e open source**, pronto para usar: você configura o `.env`, executa e ele já liga.
Foi feito para servir de base de estudo em tutoriais e também de bot de verdade para o seu servidor.

> ### ☁️ Deixe o bot online 24h, grátis por 7 dias
> Hospede na **[HyzeCloud](https://hyzecloud.com/pt-br/signup)**: **7 dias de teste grátis, sem cartão de crédito**. Você importa este repositório pelo GitHub, cadastra o token e pronto, sem deixar o PC ligado.
> [**Testar 7 dias grátis →**](https://hyzecloud.com/pt-br/signup) · [Passo a passo](#hospedagem-deixe-o-bot-online-24h)

**Navegação:** [Começando](#começando) · [Hospedagem](#hospedagem-deixe-o-bot-online-24h) · [Variáveis](#variáveis-de-ambiente) · [Comandos](#comandos) · [Contribuindo](#contribuindo)

Feito com TypeScript, [discord.js](https://discord.js.org) 14 e a [Constatic Base](https://constatic-docs.vercel.app/docs/discord/start) (gerada pela Constatic CLI do [@rinckodev](https://github.com/rinckodev)).

## Destaques

- **Components V2** em todas as respostas: containers, sections, galerias de mídia, separadores e botões dentro do layout.
- **Recursos recentes do Discord:** modais com radio group e checkbox, AutoMod nativo, enquetes nativas e menus de contexto.
- **Moderação completa:** ban, kick, timeout, advertências, limpeza de mensagens, modo lento, trancar canais e AutoMod.
- **Comunidade:** tickets por modal, painel de cargos com botões, autorole, boas-vindas, sugestões e anúncios.
- **Logs:** moderação e eventos (mensagens apagadas e editadas, entrada e saída de membros).
- **Zero configuração além do token:** cada recurso opcional é ligado por uma variável de ambiente. O bot só pede as intents privilegiadas de que precisa.
- **Sem banco de dados:** funciona com arquivos locais, e é fácil trocar por MongoDB ou Firestore (presets da Constatic CLI).
- **Pronto para hospedar:** deploy pelo GitHub na [HyzeCloud](#hospedagem-deixe-o-bot-online-24h), com 7 dias grátis para testar.

## Começando

Requisitos: [Node.js](https://nodejs.org) 20.12 ou superior.

**1. Baixe o projeto e instale as dependências**

```bash
git clone https://github.com/pietrogimenes/discord-bot-components-v2.git
cd discord-bot-components-v2
npm install
```

**2. Crie o arquivo `.env`**

```bash
cp .env.example .env
```

No Windows (PowerShell), use `copy .env.example .env`.

**3. Crie o bot e preencha o token**

1. Acesse o [Discord Developer Portal](https://discord.com/developers/applications) e crie uma aplicação.
2. Em **Bot**, clique em **Reset Token** e cole o token em `BOT_TOKEN` no `.env`.
3. Em **OAuth2 > URL Generator**, marque os escopos `bot` e `applications.commands`, escolha as permissões abaixo e use o link gerado para convidar o bot.

Permissões recomendadas: Ver canais, Enviar mensagens, Enviar enquetes, Adicionar reações, Gerenciar mensagens, Gerenciar canais, Gerenciar cargos, Gerenciar servidor (AutoMod), Expulsar membros, Banir membros e Moderar membros.

**4. Execute**

```bash
npm run dev
```

> Para testar mais rápido, coloque o ID do seu servidor em `GUILD_ID`: os comandos aparecem na hora.
> O cargo do bot precisa ficar **acima** dos cargos que ele vai gerenciar (autorole, painel de cargos e moderação).

Funcionou? Agora é só [deixar o bot online 24h](#hospedagem-deixe-o-bot-online-24h): na HyzeCloud você testa **7 dias de graça**.

## Hospedagem: deixe o bot online 24h

Rodando no seu PC, o bot cai quando você fecha o terminal ou desliga o computador. Para deixá-lo online o tempo todo, hospede-o.

### Opção recomendada: HyzeCloud (7 dias grátis)

A [HyzeCloud](https://hyzecloud.com/pt-br/bot-discord) é uma hospedagem para bots, APIs e sites. Este projeto já vem pronto para ela.

**Por que usar:**

- **7 dias de teste grátis, sem cartão de crédito.** Ao se cadastrar você já pode hospedar o bot.
- **Online 24h**, sem depender do seu computador.
- **Deploy pelo GitHub:** com o deploy automático ligado, cada `git push` publica a versão nova.
- **Reinício automático** se o bot cair, e **logs em tempo real** no painel.
- **Suporte e documentação em português**, com pagamento em reais via Pix.

Depois do teste, os planos começam em R$ 5,99 por mês (Starter) e a memória é dividida entre os seus apps. Confira os valores atuais na [página de planos](https://hyzecloud.com/pt-br/pricing).

[**Testar 7 dias grátis na HyzeCloud →**](https://hyzecloud.com/pt-br/signup)

**Passo a passo:**

**1. Coloque o projeto no seu GitHub**
Faça um fork deste repositório (botão **Fork**) ou envie o seu próprio código para um repositório seu.

**2. Crie sua conta**
Acesse [hyzecloud.com/pt-br/signup](https://hyzecloud.com/pt-br/signup) e clique em **Testar 7 dias grátis**.

**3. Crie o app**
No [dashboard](https://hyzecloud.com/pt-br/dashboard), clique em **Novo projeto** e escolha **Importar do GitHub**. Conecte sua conta, escolha o repositório e a branch `main`.

**4. Confira a configuração**

| Campo | Valor |
| --- | --- |
| Memória | `256 MB` (mínimo) ou `512 MB` se o bot estiver em muitos servidores |
| Acesso público | Desligado (bot não atende HTTP) |
| Comando de start | **Personalizado**: `npm run start:host` |
| Reinício automático | Ligado |
| Deploy automático | Ligado (cada push publica uma versão nova) |

O comando `npm run start:host` compila o TypeScript e liga o bot. É necessário porque o Node da HyzeCloud não executa TypeScript direto.

**5. Cadastre as variáveis de ambiente**
Em **Variáveis de ambiente**, adicione `BOT_TOKEN` com o token do bot, e as opcionais que quiser (`GUILD_ID`, `MOD_LOG_CHANNEL_ID` etc., veja a [tabela abaixo](#variáveis-de-ambiente)). Se preferir, use **Importar .env**.
O arquivo `.env` **não** vai para o GitHub e não é necessário na hospedagem.

**6. Faça o deploy e confira os logs**
Clique em **Fazer deploy**. Depois abra **Observabilidade > Console** e procure a linha `application is ready!`: o bot está online.

> **Importante**
> - Desligue o bot no seu PC antes de hospedar. Com o mesmo token em dois lugares, o bot responde duas vezes a cada comando.
> - Se aparecer `Used disallowed intents`, ative a intent no Developer Portal (veja [Intents privilegiadas](#intents-privilegiadas)).
> - Se aparecer `TokenInvalid`, confira se a variável se chama exatamente `BOT_TOKEN` e sem aspas nem espaços. Reinicie o app depois de mudar uma variável.
> - As advertências ficam no arquivo `data/warns.json`, e um novo deploy pode apagá-lo. Para um servidor grande, migre para um banco de dados.

Guias oficiais da HyzeCloud: [bot de Discord online 24 horas](https://docs.hyzecloud.app/pt/guides/discord-bot-24h), [erros comuns ao hospedar](https://docs.hyzecloud.app/pt/guides/discord-bot-erros-comuns) e [deploy pelo GitHub](https://docs.hyzecloud.app/pt/guides/deploy-from-github). Dúvidas? Entre no [Discord da HyzeCloud](https://discord.gg/SMrU4jdyd).

### Outras opções

Em qualquer servidor ou VPS com Node.js 20.12 ou superior:

```bash
npm install
npm run build
npm start        # lê as variáveis do arquivo .env
```

Em hospedagens que não usam arquivo `.env`, defina as variáveis no painel e rode `npm run start:host`.

A Constatic também tem guias de [PM2](https://constatic-docs.vercel.app/docs/discord/hosting/pm2), [Docker](https://constatic-docs.vercel.app/docs/discord/hosting/docker) e [Discloud](https://constatic-docs.vercel.app/docs/discord/hosting/discloud).

## Variáveis de ambiente

Só o `BOT_TOKEN` é obrigatório. Cada variável opcional liga uma funcionalidade.

| Variável | Descrição |
| --- | --- |
| `BOT_TOKEN` | Token do bot (obrigatória) |
| `GUILD_ID` | Registra os comandos instantaneamente neste servidor |
| `MOD_LOG_CHANNEL_ID` | Log de moderação, alertas do AutoMod e tickets fechados |
| `EVENT_LOG_CHANNEL_ID` | Log de eventos: mensagens apagadas e editadas, entrada e saída de membros |
| `LOG_MESSAGE_CONTENT` | `true` mostra o texto das mensagens nos logs (exige a *Message Content Intent*) |
| `WELCOME_CHANNEL_ID` | Canal das mensagens de boas-vindas |
| `AUTOROLE_ROLE_ID` | Cargo entregue a todo membro novo |
| `SUGGESTIONS_CHANNEL_ID` | Canal das sugestões do `/suggest` (padrão: o canal onde foi usado) |
| `TICKETS_CATEGORY_ID` | Categoria onde os tickets são criados |
| `TICKETS_STAFF_ROLE_ID` | Cargo da equipe que enxerga e fecha tickets (recomendado) |
| `WEBHOOK_LOGS_URL` | Webhook que recebe os logs de erro |

Para pegar um ID no Discord, ative o **Modo desenvolvedor** (Configurações > Avançado), clique com o botão direito no canal, cargo ou servidor e escolha **Copiar ID**.

### Intents privilegiadas

O bot só pede as intents que precisa. Sem nenhuma variável opcional, funciona só com o token.

| Intent | Quando é pedida | Onde ativar |
| --- | --- | --- |
| Server Members | `WELCOME_CHANNEL_ID`, `AUTOROLE_ROLE_ID` ou `EVENT_LOG_CHANNEL_ID` | Developer Portal > Bot > Privileged Gateway Intents |
| Message Content | `EVENT_LOG_CHANNEL_ID` com `LOG_MESSAGE_CONTENT=true` | Developer Portal > Bot > Privileged Gateway Intents |

## Comandos

**Geral**

| Comando | Descrição |
| --- | --- |
| `/help` | Central de ajuda com menu de categorias |
| `/ping` | Latência da API e do WebSocket |
| `/avatar` | Avatar de um usuário, com links de download |
| `/userinfo` | Informações de um usuário (também no menu de contexto **User info**) |
| `/serverinfo` | Informações do servidor |
| `/botinfo` | Estatísticas do bot |
| `/poll` | Enquete nativa do Discord |
| `/suggest` | Modal de sugestão com categoria e envio anônimo |

**Moderação** (cada comando exige a permissão correspondente do Discord)

| Comando | Descrição |
| --- | --- |
| `/ban`, `/unban` | Banir e desbanir (o `/unban` busca na lista de banidos) |
| `/kick` | Expulsar |
| `/timeout`, `/untimeout` | Silenciar por tempo (`30s`, `10m`, `2h`, `1d`, `1w`, máximo 28 dias) |
| `/warn add\|list\|remove\|clear` | Sistema de advertências |
| `/purge` | Apagar mensagens em massa, com filtro por usuário |
| `/slowmode` | Modo lento do canal |
| `/lock`, `/unlock` | Trancar e liberar um canal |
| `/automod spam\|mentions\|words\|presets\|status` | Liga e desliga regras do AutoMod nativo (as regras continuam valendo com o bot offline) |

**Servidor**

| Comando | Descrição |
| --- | --- |
| `/role add\|remove` | Dá ou tira um cargo de um membro |
| `/rolepanel` | Painel com botões para os membros escolherem cargos (até 5 por painel) |
| `/ticket panel` | Envia o painel de suporte. O membro abre um ticket por um modal e o bot cria um canal privado |
| `/ticket close` | Fecha o ticket (também há um botão dentro do ticket) |
| `/announce` | Envia um anúncio em Components V2 |

Os comandos de moderação checam a hierarquia de cargos, avisam o usuário por DM quando possível e registram a ação no canal `MOD_LOG_CHANNEL_ID`.
O painel de cargos não aceita cargos com permissões administrativas.

## Dados

- As advertências ficam em `data/warns.json` (ignorado pelo git). Para bots maiores, troque `src/functions/warns.ts` por um banco de dados.
- Os tickets não usam banco: o dono fica salvo no tópico do canal.

## Scripts

| Script | O que faz |
| --- | --- |
| `npm run dev` | Executa em desenvolvimento |
| `npm run watch` | Executa e reinicia ao salvar |
| `npm run check` | Verifica os tipos |
| `npm run build` | Compila para `build/` |
| `npm start` | Executa o bot compilado (lê o `.env`) |
| `npm run start:host` | Compila e executa, sem precisar de `.env`. Use em hospedagens que definem as variáveis no painel |

## Estrutura

```
src/
├─ discord/
│  ├─ commands/   # public, moderation, server e context
│  ├─ events/     # presença, boas-vindas, autorole e logs
│  └─ responders/ # botões, selects e modais (tickets)
├─ menus/         # funções que montam as telas em Components V2
├─ functions/     # utilitários: moderação, AutoMod, cargos, tickets, advertências
├─ env.ts         # validação das variáveis de ambiente
└─ index.ts       # entrada do bot e intents
```

## Criando um comando

Crie um arquivo em `src/discord/commands/` (tudo ali é carregado automaticamente):

```ts
import { createCommand } from "#base";
import { notice } from "#functions";
import { ApplicationCommandType } from "discord.js";

createCommand({
    name: "hello",
    description: "Diz olá 👋",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        await interaction.reply(notice("success", `Olá, ${interaction.user}!`));
    }
});
```

Veja o [CONTRIBUTING.md](CONTRIBUTING.md) para as convenções do projeto (Components V2, subcomandos modulares, responders).

## Problemas comuns

**Os comandos não aparecem no servidor**
Confirme que convidou o bot com o escopo `applications.commands`. Comandos globais podem demorar para aparecer; com `GUILD_ID` preenchido eles surgem na hora. Reinicie o app do Discord (Ctrl + R) se ainda não aparecerem.

**`Used disallowed intents`**
Uma variável opcional exige uma intent privilegiada que não está ativa. Ative em *Developer Portal > Bot > Privileged Gateway Intents* ou apague a variável. Veja a tabela de intents acima.

**O bot não consegue moderar um membro ou dar um cargo**
O cargo do bot precisa estar **acima** do cargo ou do membro alvo na lista de cargos do servidor, e ele precisa da permissão correspondente.

**"Algo deu errado" ao enviar um modal**
Confira o tipo do responder: modal aberto por **comando** usa `ResponderType.Modal`; modal aberto por **botão** usa `ResponderType.ModalComponent`.

**Ticket não é criado**
O bot precisa da permissão **Gerenciar canais**. Se usar `TICKETS_CATEGORY_ID`, confira se o ID é de uma categoria.

## Contribuindo

Contribuições são bem-vindas! Leia o [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir uma issue ou um pull request.
Para reportar uma falha de segurança, veja o [SECURITY.md](SECURITY.md).

## Licença

Distribuído sob a licença [MIT](LICENSE).

## Créditos

- Base do projeto gerada pela [Constatic CLI](https://github.com/rinckodev/constatic) de [@rinckodev](https://github.com/rinckodev).
- Helpers de Components V2 do [@magicyan/discord](https://www.npmjs.com/package/@magicyan/discord).
- Hospedagem de exemplo: [HyzeCloud](https://hyzecloud.com).
