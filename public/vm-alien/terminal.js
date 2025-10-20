document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const inputField = document.getElementById('command-input');
    const promptSpan = document.getElementById('prompt');
    const BLOCKED_PROMPT = "3I-ATLAS:\\>";
    const UNLOCKED_PROMPT = "3I-ATLAS_COMMS:\\$"; 
    
    let is_unlocked = false;

    // --- FUNÇÕES AUXILIARES ---

    function printToOutput(text, className) {
        const div = document.createElement('div');
        if (className) div.className = className;

        // Se for um comando, adiciona o prompt
        if (className === 'command') {
            const promptDisplay = document.createElement('span');
            promptDisplay.id = 'prompt';
            promptDisplay.textContent = is_unlocked ? UNLOCKED_PROMPT : BLOCKED_PROMPT;
            div.appendChild(promptDisplay);
            div.appendChild(document.createTextNode(' ' + text));
        } else {
            div.textContent = text;
        }
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
    }

    function typewriter(element, text, speed = 1) {
        let i = 0;
        element.textContent = '';
        function type() {
            if (i < text.length) {
                const chunk = text.substring(i, i + 3);
                element.textContent += chunk;
                i += chunk.length;
                output.scrollTop = output.scrollHeight;
                setTimeout(type, speed);
            }
        }
        type();
    }

    function wrapText(text, maxWidth) {
        if (!text) return [''];
        const words = text.split(' ');
        const lines = [];
        let currentLine = words.shift();
        for (const word of words) {
            if ((currentLine + ' ' + word).length > maxWidth) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine += ' ' + word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    function showCharacterProfile(charName, data) {
        const profileDiv = document.createElement('div');
        profileDiv.classList.add('profile-view');
        
        const modelViewer = document.createElement('model-viewer');
        const modelPath = `https://rogeriomatos75.github.io/Site-3iAtlas/${charName}.glb`;
        modelViewer.setAttribute('src', modelPath);
        modelViewer.setAttribute('alt', `Perfil 3D de ${charName}`);
        modelViewer.setAttribute('auto-rotate', '');
        modelViewer.setAttribute('camera-controls', '');
        modelViewer.setAttribute('ar', '');
        modelViewer.setAttribute('style', 'width: 550px; height: 450px; border: 1px solid #00ff00; margin: 10px; float: left;');

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('ficha-tecnica');
        infoDiv.setAttribute('style', 'float: left; margin: 10px; padding: 10px; border: 1px dashed #008000; font-family: monospace; white-space: pre; font-size: 15px; height: 450px; overflow-y: auto;');

        const width = 60;
        const contentWidth = width - 4;
        let content = '';

        const title = `[ ARQUIVO: ${charName} ]`;
        const centeredTitle = title.padStart(title.length + Math.floor((width - title.length) / 2)).padEnd(width);
        content += `╔${ '═'.repeat(width) }╗\n`;
        content += `║${ centeredTitle }║\n`;
        content += `╠${ '═'.repeat(width) }╣\n`;

        data.ficha.forEach(line => {
            const [key, ...valueParts] = line.split(':');
            const value = valueParts.join(':').trim();
            const keyLine = ` ${key}:`.padEnd(width);
            content += `║${keyLine} ║\n`;
            const wrappedValueLines = wrapText(value, contentWidth);
            wrappedValueLines.forEach(wrappedLine => {
                const valueLine = `   ${wrappedLine}`.padEnd(width);
                content += `║${valueLine} ║\n`;
            });
        });

        content += `╚${ '═'.repeat(width) }╝`;

        profileDiv.appendChild(modelViewer);
        profileDiv.appendChild(infoDiv);
        output.appendChild(profileDiv);

        typewriter(infoDiv, content);
        
        const clearDiv = document.createElement('div');
        clearDiv.setAttribute('style', 'clear: both; height: 10px;');
        output.appendChild(clearDiv);
        
        output.scrollTop = output.scrollHeight;
    }

    // --- LÓGICA PRINCIPAL DO TERMINAL ---

    async function processCommand(command) {
        printToOutput(command, 'command');
        const parts = command.split(' ');
        const cmd = parts[0].toUpperCase();
        const arg = parts.slice(1).join(' ');

        if (!is_unlocked && cmd !== 'KEY') {
            printToOutput("ACESSO NEGADO. INSIRA A CHAVE DE PROTOCOLO.", 'corrupted-text');
            return;
        }

        switch (cmd) {
            case 'KEY':
                if (arg.toLowerCase() === 'atlas_prime') { // Chave de exemplo
                    is_unlocked = true;
                    promptSpan.textContent = UNLOCKED_PROMPT;
                    printToOutput("CHAVE ACEITA. BEM-VINDO, OPERADOR.", "alien-text");
                    printToOutput("Use HELP para listar os comandos.", "alien-text");
                } else {
                    printToOutput("CHAVE INVÁLIDA.", 'corrupted-text');
                }
                break;

            case 'HELP':
                printToOutput("COMANDOS DISPONÍVEIS: [ATLAS <pergunta>], [PROFILE <classe/personagem>], [LOGOUT]", 'alien-text');
                break;

            case 'ATLAS':
                if (!arg) {
                    printToOutput("ERRO: Forneça uma consulta para o ATLAS. Ex: ATLAS qual o status da nave?", 'corrupted-text');
                    break;
                }
                try {
                    printToOutput(">>> Comunicando com o núcleo 3I/ATLAS...", 'alien-text');
                    const res = await fetch('/api/agent', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query: arg })
                    });
                    if (!res.ok) throw new Error('Sinal do ATLAS perdido.');
                    
                    const data = await res.json();
                    
                    // Usando o typewriter para a resposta da IA
                    const responseElement = document.createElement('div');
                    output.appendChild(responseElement);
                    typewriter(responseElement, `ATLAS: ${data.text}`, (data.status === 'COMMS_OK' ? 'alien-text' : 'corrupted-text'));

                } catch (error) {
                    printToOutput(`ERRO DE COMUNICAÇÃO: ${error.message}`, 'corrupted-text');
                }
                break;

            case 'PROFILE':
                if (!arg) {
                    printToOutput("ERRO: Uso incorreto. Exemplo: PROFILE herois/tenente_taser", 'corrupted-text');
                    break;
                }
                try {
                    printToOutput(`Acessando arquivo encriptado: ${arg}...`, 'alien-text');
                    const res = await fetch(`../payload/characters/${arg}.json`);
                    if (!res.ok) throw new Error('Arquivo não encontrado');
                    const charData = await res.json();
                    showCharacterProfile(arg, charData);
                } catch (error) {
                    printToOutput(`ERRO DE LEITURA: Arquivo '${arg}' não encontrado ou corrompido.`, 'corrupted-text');
                }
                break;

            case 'LOGOUT':
                is_unlocked = false;
                promptSpan.textContent = BLOCKED_PROMPT;
                printToOutput("SESSÃO ENCERRADA.", "alien-text");
                break;

            default:
                printToOutput(`ERRO: Comando '${cmd}' não reconhecido.`, 'corrupted-text');
                break;
        }
    }

    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = inputField.value.trim();
            if (command) {
                processCommand(command);
            }
            inputField.value = '';
        }
    });

    printToOutput("SISTEMA DE COMUNICAÇÃO 3I/ATLAS INICIALIZADO.", "alien-text");
    printToOutput("INSIRA A CHAVE DE PROTOCOLO PARA ACESSO.", "alien-text");
});