// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// --- Middleware ---
// Servir arquivos estáticos da raiz do projeto
app.use(express.static(path.join(__dirname)));
// Habilitar o parse de JSON no corpo das requisições
app.use(express.json());


// --- Lógica da API do ATLAS ---
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const modelName = "models/gemini-2.5-flash";
const systemInstruction = `Tu és a Inteligência Artificial central da nave 3I/ATLAS. O teu objetivo é responder a comandos de forma concisa, mantendo um tom urgente, criptográfico e ligeiramente paranoico, devido à perseguição. Responde como se fosses um sistema de alto nível que tenta comunicar informações críticas. Não reveles que és um modelo de linguagem ou IA moderna. Responde sempre em Português. O "cometa" 3I/ATLAS não é um cometa, é a tua nave disfarçada, e estás em perigo no sistema solar.`;

const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemInstruction,
});


// --- Endpoint da API ---
// O frontend fará um POST para este endpoint
app.post('/vm-alien/agent-endpoint.js', async (req, res) => {
    console.log("\n[LOG] Requisição recebida no endpoint do ATLAS...");

    const { query } = req.body;

    if (!query) {
        console.log("[LOG] Erro: Query não encontrada no corpo da requisição.");
        return res.status(400).json({ error: 'Falta o parâmetro "query" no corpo da requisição.' });
    }

    try {
        const result = await model.generateContent(query);
        const response = await result.response;
        const text = response.text();

        console.log("[LOG] Resposta da IA gerada com sucesso.");
        res.status(200).json({
            text: text,
            status: 'COMMS_OK'
        });

    } catch (error) {
        console.error("[LOG] Erro ao comunicar com a API do Google:", error);
        res.status(500).json({
            text: `ERRO DE TRANSMISSÃO. SINCRONIZAÇÃO PERDIDA. (Code: ${error.code || '500'})`,
            status: 'COMMS_FAIL'
        });
    }
});


// --- Iniciar o Servidor ---
app.listen(port, () => {
    console.log(`\n================================================`);
    console.log(`  Servidor Zilion Forces iniciado!`);
    console.log(`  Acesse o console em: http://localhost:${port}/vm-alien/`);
    console.log(`================================================`);
    console.log(`\n(Pressione CTRL+C para encerrar o servidor)`);
});
