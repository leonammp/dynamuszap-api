# DYNAMUSZAP API - Notificação e Usabilidade de Bot para WhatsApp

[![Version](https://img.shields.io/github/tag/JuniorFreitas/dynamuszap-api.svg)](https://github.com/JuniorFreitas/dynamuszap-api/releases)
[![Downloads](https://img.shields.io/github/downloads/JuniorFreitas/dynamuszap-api/total)](https://github.com/JuniorFreitas/dynamuszap-api/releases)
[![Issues](https://img.shields.io/github/issues/JuniorFreitas/dynamuszap-api.svg)](https://github.com/JuniorFreitas/dynamuszap-api/issues)
[![License](https://img.shields.io/github/license/JuniorFreitas/dynamuszap-api.svg)](https://github.com/JuniorFreitas/dynamuszap-api/blob/main/LICENSE)

Este projeto é uma API desenvolvida para facilitar a integração de notificações e usabilidade de bots no WhatsApp, utilizando o [Venom Bot](https://github.com/orkestral/venom) para automação. Vale ressaltar que **não se trata de uma API oficial do WhatsApp** e, portanto, não possui as mesmas funcionalidades e limitações.

A API utiliza o **WhatsApp Web** em segundo plano, rodando o Venom Bot, que por sua vez chama o **Puppeteer** para interagir com o navegador e fazer a automação. Com isso, a API é capaz de realizar diversas operações, como o envio de mensagens, notificações e interações básicas com os contatos do WhatsApp.

### Funcionalidades

- Envio de mensagens de texto para um ou mais contatos.
- Envio de mídias (imagens, vídeos, documentos).
- Notificações personalizadas.
- Respostas automáticas.
- Integração com outros sistemas via API.

### Importante

- O projeto não é uma solução oficial do WhatsApp e depende do WhatsApp Web.
- A automação é realizada por meio do Venom Bot, que interage com o WhatsApp Web utilizando o Puppeteer.
- Algumas funcionalidades presentes na API oficial do WhatsApp podem não estar disponíveis ou funcionar de maneira diferente.

A API pode ser útil para diversas situações de automação, como envio de mensagens em massa, notificações e integração com outros sistemas, mas deve ser utilizada com cuidado, respeitando as diretrizes do WhatsApp para evitar bloqueios e penalidades na conta.


## ESTRUTURA DE PASTAS

```
src/
  ├──__tests__/
  ├── config/
  │   ├── app.config.js
  │   └── swagger.config.js
  ├── controllers/
  │   └── WhatsAppController.js
  ├── middleware/
  │   ├── errorHandler.js
  │   ├── rateLimiter.js
  │   ├── requestValidator.js
  │   └── sessionValidator.js
  ├── models/
  │   └── Session.js
  ├── routes/
  │   └── whatsapp.routes.js
  ├── services/
  │   └── WhatsAppService.js
  └── app.js
```

# Configuração do Ambiente

Este repositório usa Docker para facilitar o setup do ambiente de desenvolvimento. Siga os passos abaixo para configurar e rodar o projeto localmente.

## Pré-requisitos

Antes de começar, você precisa ter os seguintes softwares instalados:

- [Docker](https://www.docker.com/get-started) (para rodar containers)
- [Docker Compose](https://docs.docker.com/compose/install/) (para orquestrar múltiplos containers)

## Passo a Passo

### 1. Crie o Arquivo `.env`

O arquivo `.env` contém variáveis de ambiente necessárias para a configuração do Docker e outros serviços. Você pode criar esse arquivo a partir do template `.env.example`:

```bash
cp .env.example .env
```

Agora você tem o arquivo `.env` configurado. Se necessário, edite as variáveis de ambiente dentro do arquivo `.env` para refletir suas configurações.

```
PORT=3000
URLBASE=http://localhost:3000
NODE_ENV=development
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
MAX_REQUEST_SIZE=10mb
SESSION_TIMEOUT=6 => QUANTIDADE DE HORAS QUE BOT VAI ESTA EM SESSAO
QUEUE_CONCURRENT=1 => QUANTIDADE DE CONCORRENCIAS
QUEUE_MAX_RETRIES=3 => QUANTIDADE DE RETENTATIVAS
QUEUE_RETRY_DELAY=3000 => TEMPO DE RETENTATIVAS EM MILISSEGUNDOS
BOT_ATIVO=N => N - Para Não (S - Para Sim)
```

### 2. Construa e Inicie os Containers com Docker Compose

Agora que você tem o arquivo `.env` configurado, você pode rodar o Docker Compose para construir e iniciar os containers definidos no arquivo `docker-compose.yml`:

```bash
docker compose up --build
```

Este comando irá:

- Construir as imagens dos containers (se necessário).
- Iniciar os containers conforme definido no `docker-compose.yml`.

Após alguns instantes, os containers estarão rodando e você poderá acessar o ambiente de desenvolvimento localmente.

### 4. Parar os Containers

Para parar os containers, basta rodar o comando:

```bash
docker-compose down
```

Este comando irá parar e remover os containers, mas deixará as imagens intactas, o que permite que você os reinicie com `docker-compose up` rapidamente.

## Dicas

- Se você quiser rodar o Docker em segundo plano (modo "detached"), use a flag `-d`:

  ```bash
  docker-compose up --build -d
  ```

- Para visualizar os logs dos containers, utilize o comando:

  ```bash
  docker-compose logs
  ```

- Caso precise reiniciar os containers, use:

  ```bash
  docker-compose restart
  ```

## Contribuições

Se você deseja contribuir para este projeto, fique à vontade para criar um [pull request](https://github.com/JuniorFreitas/dynamuszap-api/pulls) ou relatar um [issue](https://github.com/JuniorFreitas/dynamuszap-api/issues) request. Certifique-se de seguir as diretrizes de codificação e incluir testes quando possível.
