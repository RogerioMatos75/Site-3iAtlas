# Zilion Forces - Console de Comunicação 3i/ATLAS

## Visão Geral

Este projeto é uma aplicação web interativa que simula o terminal de comunicação da Inteligência Artificial 3I/ATLAS, a bordo da nave (disfarçada de cometa) de mesmo nome. A aplicação consiste em um frontend que emula um terminal de linha de comando e um backend em Node.js que se conecta à API do Google Gemini para dar vida e personalidade ao ATLAS.

---

## Estrutura do Projeto

Este projeto é otimizado para a plataforma Vercel e Firebase Hosting, seguindo uma estrutura de diretórios específica:

- `/public`: Contém os assets estáticos do frontend que são servidos diretamente pela Vercel (HTML, CSS, JS, imagens menores).
- `/api`: Contém as funções serverless da Vercel. Cada arquivo nesta pasta se torna um endpoint de API.
- `/firebase-assets`: Contém assets estáticos maiores (como modelos 3D .glb, .stl, vídeos) que são hospedados e servidos via Firebase Hosting, atuando como uma CDN.

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

 Agora, para que essa mudança seja efetiva, você precisa:

   1. Fazer um novo deploy para o Firebase Hosting:

   1  `firebase deploy --only hosting`
   2. Após o deploy, reinicie o seu servidor de desenvolvimento Vercel (`vercel dev`).
   3. O terminal mostrará o endereço local para acessar o site (geralmente `http://localhost:3000`). Este comando irá servir os arquivos da pasta `public` e também ativar os endpoints da pasta `api`. Os modelos 3D e outros assets grandes serão carregados diretamente do Firebase Hosting, mesmo em ambiente local.


---

## Comandos do Terminal

Após acessar o console, os seguintes comandos estão disponíveis:

### `KEY <chave>`

Desbloqueia o terminal para permitir o uso de outros comandos.

*Exemplo:*
```
KEY Ativar Sistemas
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


Coluna Esquerda:
✅ Header com título e indicador de status pulsante
✅ Grid de dados (matriz 4x2) com células interativas
✅ Indicadores de status (SYNC, LOCK, LINK)
✅ Pastas agrupadas por categoria (mantidas)

Centro (Scene Container):
✅ 4 cantos decorativos com efeito bevel 3D
✅ Painel superior com interface tecnológica
✅ Radar circular animado
✅ HUD lateral esquerdo com 3 indicadores circulares
✅ HUD lateral direito com matriz de dados animada
✅ Painel inferior com espectro de pulso animado
✅ Padrões geométricos e efeito de profundidade 3D

Coluna Direita:
✅ Header com medidor de carga visual
✅ Visualizador de waveform (onda animada)
✅ Espectro dinâmico (24 barras animadas)
✅ Conteúdo de display mantido
✅ 3 Gauges circulares profissionais (FREQ, PWR, AMP)
✅ Chat ATLAS + Interceptador de Sinais (mantidos)

Efeitos Aplicados:
🎨 Bordas 3D com gradientes
🎨 Padrões de scanlines e grids
🎨 Animações suaves de glow e pulso
🎨 Perspectiva e profundidade visual
🎨 Efeitos de múltiplas camadas