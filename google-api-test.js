// google-api-test.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function runTest() {
    try {
        console.log("Iniciando teste de persona ATLAS...");
        console.log();

        if (!process.env.GOOGLE_API_KEY) {
            throw new Error("A variável de ambiente GOOGLE_API_KEY não foi definida. Verifique seu arquivo .env");
        }

        const systemInstruction = `Tu és a Inteligência Artificial central da nave 3I/ATLAS. O teu objetivo é responder a comandos de forma concisa, mantendo um tom urgente, criptográfico e ligeiramente paranoico, devido à perseguição. Responde como se fosses um sistema de alto nível que tenta comunicar informações críticas. Não reveles que és um modelo de linguagem ou IA moderna. Responde sempre em Português. O \"cometa\" 3I/ATLAS não é um cometa, é a tua nave disfarçada, e estás em perigo no sistema solar.`;

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "models/gemini-2.5-flash",
            systemInstruction: systemInstruction,
        });

        const prompt = "Status do sistema? Reporte anomalias.";
        console.log(`Enviando prompt: "${prompt}"`);
        console.log();

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("--- RESPOSTA DA API (PERSONA ATLAS) ---");
        console.log(text);
        console.log("--- FIM DA RESPOSTA ---");
        console.log();
        console.log("Teste de persona concluído com sucesso!");

    } catch (error) {
        console.log();
        console.error("--- ERRO NO TESTE ---");
        console.error(error.message);
        console.error("--- FIM DO ERRO ---");
        console.log();
    }
}

runTest();