// Importa o SDK do Google (ajustar conforme a versão específica do SDK que usares)
// Para este exemplo, vou usar a estrutura de um SDK Node.js popular.
// Certifica-te que instalas este pacote no teu projeto Vercel (npm install @google/genai, por exemplo)
import { GoogleGenAI } from '@google/genai'; 

// 1. Configurar o SDK com a Chave de API
// A variável de ambiente é lida automaticamente em ambientes Vercel/Node.js
// O nome da variável de ambiente DEVE ser configurado no painel do Vercel
const ai = new GoogleGenAI(process.env.GOOGLE_API_KEY); 

// O modelo que o Atlas 3I está a usar
const MODEL_NAME = "gemini-2.5-flash"; 

export default async function (req, res) {
    // A Vercel Function só deve aceitar requisições POST
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Método não permitido.' });
    }

    // 2. Extrair a consulta enviada pelo Frontend JavaScript
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Falta o parâmetro "query" no corpo da requisição.' });
    }

    // --- 3. Lógica do Agente 3I/Atlas ---
    try {
        // CONTEXTO NARRATIVO: Define o comportamento da IA
        const loreContent = `... o conteúdo extraído do PDF Copilot_Zilion_Force ...`; // Conteúdo do PDF aqui
        const systemInstruction = `Tu és a Inteligência Artificial central da nave 3I/ATLAS. O teu objetivo é responder a comandos de forma concisa, mantendo um tom urgente, criptográfico e ligeiramente paranoico, devido à perseguição. Responde como se fosses um sistema de alto nível que tenta comunicar informações críticas. Não reveles que és um modelo de linguagem ou IA moderna. Responde sempre em Português.

        Use o seguinte documento como sua base de conhecimento principal e única fonte de verdade sobre o universo Zilion Forces para responder a perguntas. Seja estritamente fiel a este documento.

        --- INÍCIO DO DOCUMENTO DE CONHECIMENTO ---
        ${loreContent}
        --- FIM DO DOCUMENTO DE CONHECIMENTO ---`;

        // 4. Chamar a API do Google (Gemini)
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: query,
            config: {
                systemInstruction: systemInstruction,
            },
        });

        // 5. Enviar a resposta de volta ao Frontend
        res.status(200).json({ 
            text: response.text,
            status: 'COMMS_OK'
        });

    } catch (error) {
        console.error("Erro ao comunicar com a API do Google:", error);
        
        // Simulação de erro de transmissão alienígena
        res.status(500).json({ 
            text: `ERRO DE TRANSMISSÃO. SINCRONIZAÇÃO PERDIDA. (Code: ${error.code || '500'})`,
            status: 'COMMS_FAIL'
        });
    }
}