# Zilion Forces - Console de Comunicação 3i/ATLAS

## Visão Geral

Este projeto é uma aplicação web interativa que simula o terminal de comunicação da Inteligência Artificial 3I/ATLAS, a bordo da nave (disfarçada de cometa) de mesmo nome. A aplicação consiste em um frontend que emula um terminal de linha de comando e um backend em Node.js que se conecta à API do Google Gemini para dar vida e personalidade ao ATLAS.

---

## Estrutura do Projeto

Este projeto é otimizado para a plataforma Vercel e segue uma estrutura de diretórios específica:

- `/public`: Contém todos os assets estáticos do frontend (HTML, CSS, JS, imagens).
- `/api`: Contém as funções serverless da Vercel. Cada arquivo nesta pasta se torna um endpoint de API.

---

## Setup e Desenvolvimento Local

Para executar o projeto em seu ambiente local, replicando a arquitetura da Vercel, siga os passos abaixo.

**1. Instalar Dependências:**

Certifique-se de ter o Node.js instalado. Em seguida, execute o comando abaixo na raiz do projeto para instalar os pacotes necessários.

```bash
npm install
```

**2. Configurar Variáveis de Ambiente:**

Crie um arquivo chamado `.env` na raiz do projeto. Este arquivo guardará sua chave da API do Google. Adicione a seguinte linha a ele:

```
GOOGLE_API_KEY=SUA_CHAVE_SECRETA_AQUI
```

*Lembre-se: O arquivo `.env` nunca deve ser enviado para o repositório do Git.*

**3. Iniciar o Servidor de Desenvolvimento Vercel:**

Para simular o ambiente da Vercel localmente, usaremos a CLI da Vercel.

Primeiro, instale a CLI globalmente (só precisa fazer isso uma vez):
```bash
npm install -g vercel
```

Depois, inicie o servidor de desenvolvimento:
```bash
vercel dev
```

O terminal mostrará o endereço local para acessar o site (geralmente `http://localhost:3000`). Este comando irá servir os arquivos da pasta `public` e também ativar os endpoints da pasta `api`.


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
