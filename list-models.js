// list-models.js
require('dotenv').config();

async function listModels() {
    try {
        console.log("Buscando modelos disponíveis para sua chave de API...");
        console.log();

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error("A variável de ambiente GOOGLE_API_KEY não foi definida. Verifique seu arquivo .env");
        }

        // Usamos fetch, que é nativo no Node.js moderno, para chamar o endpoint que lista os modelos.
        const url = 'https://generativelanguage.googleapis.com/v1beta/models';

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Falha na chamada da API: ${response.status} ${response.statusText}\n${errorBody}`);
        }

        const data = await response.json();

        console.log("--- MODELOS DISPONÍVEIS (que suportam geração de conteúdo) ---");
        if (data.models && data.models.length > 0) {
            let count = 0;
            data.models.forEach(model => {
                // Filtramos para mostrar apenas modelos que podem gerar conteúdo, que é o que precisamos.
                if (model.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${model.name}`);
                    count++;
                }
            });
            if (count === 0) {
                 console.log("Nenhum modelo com suporte a 'generateContent' foi encontrado.");
            }
        } else {
            console.log("Nenhum modelo encontrado na sua conta.");
        }
        console.log("--- FIM DA LISTA ---");
        console.log("\nCopie um dos nomes de modelo da lista acima (ex: models/gemini-1.5-pro-latest) para usarmos no próximo passo.");

    } catch (error) {
        console.log();
        console.error("--- ERRO AO LISTAR MODELOS ---");
        console.error(error.message);
        console.error("--- FIM DO ERRO ---");
        console.log();
    }
}

listModels();
