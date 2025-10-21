require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const modelName = "models/gemini-2.5-flash";
const systemInstruction = `Tu és a Inteligência Artificial central da nave 3I/ATLAS. O teu objetivo é responder a comandos de forma concisa, mantendo um tom urgente, criptográfico e ligeiramente paranoico, devido à perseguição. Responde como se fosses um sistema de alto nível que tenta comunicar informações críticas. Não reveles que és um modelo de linguagem ou IA moderna. Responde sempre em Português. O "cometa" 3I/ATLAS não é um cometa, é a tua nave disfarçada, e estás em perigo no sistema solar.`;

// Exporta como CommonJS para compatibilidade com a maioria dos ambientes Vercel
module.exports = async function handler(req, res) {
    // Garante que apenas requisições POST sejam aceitas
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Falta o parâmetro "query" no corpo da requisição.' });
    }

    // Verifica se a chave de API está configurada
    if (!process.env.GOOGLE_API_KEY) {
        console.error('[LOG] GOOGLE_API_KEY ausente nas variáveis de ambiente.');
        return res.status(500).json({
            error: 'GOOGLE_API_KEY ausente no ambiente',
            status: 'COMMS_FAIL'
        });
    }

    // Inicializa a SDK dentro do handler para evitar erros na carga do módulo
    let genAI;
    try {
        genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    } catch (e) {
        console.error('[LOG] Falha ao inicializar GoogleGenerativeAI:', e);
        return res.status(500).json({ error: 'Falha ao inicializar SDK', status: 'COMMS_FAIL' });
    }

    const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: systemInstruction });

    try {
        const result = await model.generateContent(query);
        const response = await result.response;
        // response.text() pode ser assíncrono dependendo da SDK
        const text = typeof response.text === 'function' ? await response.text() : String(response);

        res.status(200).json({ text: text, status: 'COMMS_OK' });
    } catch (error) {
        console.error('[LOG] Erro ao comunicar com a API do Google:', error);
        res.status(500).json({
            text: `ERRO DE TRANSMISSÃO. SINCRONIZAÇÃO PERDIDA. (Code: ${error && error.code ? error.code : '500'})`,
            status: 'COMMS_FAIL'
        });
    }
}
