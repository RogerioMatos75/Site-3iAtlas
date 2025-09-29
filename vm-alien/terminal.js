document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const inputField = document.getElementById('command-input');
    const promptSpan = document.getElementById('prompt');
    const BLOCKED_PROMPT = "3I-ATLAS:\\>";
    const UNLOCKED_PROMPT = "3I-ATLAS_COMMS:\\$"; 
    
    let is_unlocked = false;
    let zelus_protocol_active = true;
    let databank_unlocked = false;

    // --- BASE DE DADOS: PERSONAGENS E MODELOS 3D ---
    const CHARACTERS = {
        'TENENTE TASER': {
            model: 'taser_profile.glb', // Nome do teu ficheiro 3D
            ficha: [
                "NOME DE CÓDIGO: Taser",
                "PATENTE: Tenente (Comms/Intel)",
                "STATUS: Desaparecido (Última Posição: Fragmento SWAN)",
                "ESPECIALIDADE: Infiltrado de Sinais.",
                "NOTA: Suspeito de ter iniciado a transmissão 3I/Atlas."
            ]
        },
        'ACLA NÚCLEO': {
            model: 'acla_core.glb', 
            ficha: [
                "NOME: ACLA (Artificial Communications Logic Agent)",
                "STATUS: Essencial para a navegação.",
                "OBJETIVO: Manter a coerência dos dados 3I."
            ]
        }
    };
    
    // --- [MANIFESTOS e outras variáveis de estado e funções de simulação/output são mantidas] ---
    // (A função printToOutput, simulateReset, printAlienMessage, etc. devem ser mantidas do último código completo)

    // ... (Código do printToOutput, simulateReset, printAlienMessage, etc. mantido) ...

    // Função para criar e exibir o perfil 3D e Ficha Técnica
    function showCharacterProfile(charName, data) {
        // 1. Cria o Contentor Principal
        const profileDiv = document.createElement('div');
        profileDiv.classList.add('profile-view');
        
        // 2. Cria o Visualizador 3D
        const modelViewer = document.createElement('model-viewer');
        modelViewer.setAttribute('src', data.model);
        modelViewer.setAttribute('alt', `Perfil 3D de ${charName}`);
        modelViewer.setAttribute('auto-rotate', ''); // Rotação 360º
        modelViewer.setAttribute('camera-controls', ''); // Permite ao utilizador interagir
        modelViewer.setAttribute('ar', ''); // Realidade Aumentada (opcional)
        modelViewer.setAttribute('style', 'width: 400px; height: 300px; border: 1px solid #00ff00; margin: 10px; float: left;');

        // 3. Cria a Ficha Técnica
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('ficha-tecnica');
        infoDiv.setAttribute('style', 'float: left; margin: 10px; padding: 10px; border: 1px dashed #008000;');
        
        infoDiv.innerHTML = `<h3>[ARQUIVO: ${charName}]</h3>`;
        data.ficha.forEach(line => {
            infoDiv.innerHTML += `<div>> ${line}</div>`;
        });
        
        // 4. Adiciona ao Output e Limpa o Float
        profileDiv.appendChild(modelViewer);
        profileDiv.appendChild(infoDiv);
        output.appendChild(profileDiv);
        
        // Linha para limpar o float e garantir que o input volta para baixo
        const clearDiv = document.createElement('div');
        clearDiv.setAttribute('style', 'clear: both; height: 10px;');
        output.appendChild(clearDiv);
        
        output.scrollTop = output.scrollHeight;
    }

    // ... (Código para o comando KEY e comandos iniciais é mantido) ...

    // Função Central de Lógica e "Desbloqueio"
    async function processCommand(command) {
        let response = "";
        
        // ... (Lógica de desbloqueio KEY mantida) ...

        // --- LÓGICA DE SISTEMA DESBLOQUEADO (DEPOIS DO ACESSO) ---
        if (is_unlocked) { 
            // Novos comandos disponíveis
            if (command === 'HELP') {
                const databank_cmd = databank_unlocked ? '[DATABANK <consulta>]' : '[RESET_ATLAS <chave>]';
                // AJUSTE NO HELP para incluir PROFILE
                response = `COMANDOS DISPONÍVEIS: [STATUS_ATLAS], [LS], [CD <diretório>], [READ <nome_ficheiro>], [PROFILE <personagem>], ${databank_cmd}, [LOGOUT].`; 
            } else if (command === 'STATUS_ATLAS') {
                // ... (Lógica STATUS_ATLAS mantida) ...
            } else if (command.startsWith('LS') || command === 'LIST_MANIFESTOS') {
                // ... (Lógica LS mantida) ...
            } else if (command.startsWith('CD')) {
                // ... (Lógica CD mantida) ...
            } else if (command.startsWith('READ')) {
                // ... (Lógica READ mantida) ...
            } else if (command.startsWith('RESET_ATLAS')) {
                // ... (Lógica RESET_ATLAS mantida) ...
            } else if (command.startsWith('DATABANK')) {
                // ... (Lógica DATABANK mantida) ...
            // NOVO COMANDO: PROFILE (Desbloqueio de Personagem)
            } else if (command.startsWith('PROFILE')) {
                const target = command.substring('PROFILE'.length).trim();
                const charKey = Object.keys(CHARACTERS).find(k => k.replace(/[^A-Z]/g, '') === target.replace(/[^A-Z]/g, ''));

                if (charKey) {
                    printToOutput(`ARQUIVO DETETADO: ${charKey}. CARREGANDO MODELO 3D...`, 'alien-text', false, true);
                    showCharacterProfile(charKey, CHARACTERS[charKey]);
                    response = "VISUALIZAÇÃO COMPLETA: USE ARRASTAR E SOLTAR PARA INTERAGIR COM O MODELO.";
                } else {
                    response = `ERRO: Perfil '${target}' não encontrado ou inacessível. Tente 'LIST_MANIFESTOS' para pistas.`;
                }
            } else if (command === 'LOGOUT') {
                is_unlocked = false;
                promptSpan.textContent = BLOCKED_PROMPT;
                response = "SESSÃO ENCERRADA. PROTOCOLOS DE SEGURANÇA ATIVADOS.";
            } else {
                response = `ERRO: Comando '${command}' não reconhecido pelo Atlas COMMS.`;
            }
        }
        
        // Adicionar a resposta ao terminal (apenas se for uma resposta rápida)
        if (response) {
            printToOutput(response);
        }
    }
});