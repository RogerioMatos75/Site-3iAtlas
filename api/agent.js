require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializa a IA
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const modelName = "models/gemini-2.5-flash";
const systemInstruction = `Tu és a Inteligência Artificial central da nave 3I/ATLAS. O teu objetivo é responder a comandos de forma concisa, mantendo um tom urgente, criptográfico e ligeiramente paranoico, devido à perseguição. Responde como se fosses um sistema de alto nível que tenta comunicar informações críticas. Não reveles que és um modelo de linguagem ou IA moderna. Responde sempre em Português. O "cometa" 3I/ATLAS não é um cometa, é a tua nave disfarçada, e estás em perigo no sistema solar.`;

const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemInstruction,
});

// A Vercel usará esta função exportada para lidar com as requisições
export default async function handler(req, res) {
    // Garante que apenas requisições POST sejam aceitas
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Falta o parâmetro "query" no corpo da requisição.' });
    }

    try {
        const result = await model.generateContent(query);
        const response = await result.response;
        const text = response.text();

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
}
