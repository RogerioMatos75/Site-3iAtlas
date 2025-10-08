# Zilion Forces - Console de Comunicação 3i/ATLAS

## Visão Geral

Este projeto é uma aplicação web interativa que simula o terminal de comunicação da Inteligência Artificial 3I/ATLAS, a bordo da nave (disfarçada de cometa) de mesmo nome. A aplicação consiste em um frontend que emula um terminal de linha de comando e um backend em Node.js que se conecta à API do Google Gemini para dar vida e personalidade ao ATLAS.

---

## Setup e Execução Local

Para executar o projeto em seu ambiente local, siga os passos abaixo.

**1. Instalar Dependências:**

Certifique-se de ter o Node.js instalado. Em seguida, execute o comando abaixo na raiz do projeto para instalar os pacotes necessários (`express`, `dotenv`, etc.).

```bash
npm install
```

**2. Configurar Variáveis de Ambiente:**

Crie um arquivo chamado `.env` na raiz do projeto. Este arquivo guardará sua chave da API do Google. Adicione a seguinte linha a ele:

```
GOOGLE_API_KEY=SUA_CHAVE_SECRETA_AQUI
```

*Lembre-se: O arquivo `.env` nunca deve ser enviado para o repositório do Git.*

**3. Iniciar o Servidor:**

Use o seguinte comando para iniciar o servidor Node.js:

```bash
node server.js
```

O terminal mostrará uma mensagem confirmando que o servidor está ativo na porta 3000.

**4. Acessar o Console:**

Abra seu navegador e acesse o seguinte endereço:

[http://localhost:3000/](http://localhost:3000/)


---

## Comandos do Terminal

Após acessar o console, os seguintes comandos estão disponíveis:

### `KEY <chave>`

Desbloqueia o terminal para permitir o uso de outros comandos.

*Exemplo:*
```
KEY atlas_prime
```

### `HELP`

Lista todos os comandos disponíveis para o operador.

*Exemplo:*
```
HELP
```

### `ATLAS <pergunta>`

Envia uma pergunta ou comando diretamente para o núcleo da IA 3I/ATLAS.

*Exemplo:*
```
ATLAS qual o status da camuflagem?
```

### `PROFILE <caminho_do_personagem>`

Carrega e exibe a ficha técnica e o modelo 3D de um personagem específico. O caminho é relativo à pasta 

PROFILE herois/tenente_taser
PROFILE operadores/nanografeno

*Exemplo:*
```
PROFILE herois/tenente_taser
```

### `LOGOUT`

Encerra a sessão do operador e bloqueia o terminal novamente.

*Exemplo:*
```
LOGOUT
```
