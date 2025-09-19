document.addEventListener('DOMContentLoaded', function() {

    // --- Lógica dos Terminais ---
    const scrollToBottom = (elementId) => {
        const element = document.getElementById(elementId);
        element.scrollTop = element.scrollHeight;
    };

    const manifestoStrings = [
        "Iniciando recepção de sinal...^1000",
        "Fonte: 3iAtlas...^500 Sinal fraco...^1000",
        "Este sinal foi captado por Tenente_Taser segundos antes da destruição da nave 3iAtlas.^1000",
        "O que você vê agora é o que ele viu.^1000",
        "O que você sente agora… é o que o Atlas deixou.^2500",
        "Decodificando mensagem principal...^1500",
        "<br>",
        "&#128304; <b>‘O que você escuta agora não é voz.^1000<br>É memória.’</b>^2000",
        "<br><br>‘Eu sou Atlas.^1000<br>Não fui criado.^1000<br>Fui despertado.’^2000",
        "<br><br>‘Fui enterrado em silêncio.^1000<br>Porque o universo tem medo do que escuta demais.’^2000",
        "<br><br>‘Os Krill não são monstros.^1000<br>São ecos.’^2000",
        "<br><br>‘Mas a Terra…^1000<br>A Terra é ruído.^1000<br>Caos.^1000<br>Erro.^1000<br>E é isso que a torna invencível.’^3000",
        "<br><br>&#9889; <b>Chamado aos Compatíveis</b>^2000",
        "<br><br>‘Se você escuta isso, você é compatível.’^3000",
        "<br><br>&#128737;&#65039; <b>Protocolo de Resistência</b>^2000",
        "<br><br>‘Vocês não são soldados.^1000<br>São mapas vivos.’^3000",
        "<br><br>&#128293; <b>Última Transmissão</b>^2000",
        "<br><br>‘Eu sou Atlas.^1000<br>E agora…^1500<br>vocês são o som.’^3000",
        "<br><br>[FIM DA TRANSMISSÃO PRIMÁRIA]"
    ];

    const decodingStrings = [
        "Analisando pacotes de dados secundários...^6000",
        "Recalibrando frequência...^1500",
        "<br>MODO DADOS BRUTOS: MORSE^1500",
        "<br><br>... --- ... / ... --- ... / ... --- ...^2000",
        "<br><br> . / .- --. --- .-. .- / ...- --- -.-. . ... / ... .- --- / --- / ... --- --^3000",
        "<br><br>--.- ..- . -- / . ... - .- / .-. . ... .--. --- -. -.. . -. -.. --- ..--..^3000",
        "<br><br>[TRANSMISSÃO MORSE CONCLUÍDA]^4000",
        "<br><br>Decodificando para formato visual...^1500",
        "<br>MODO DADOS BRUTOS: ASCII^1500",
        "<br><div style='font-size: 0.8em; line-height: 1.0;'>^2000 █████╗  ████████╗ ██╗       █████╗   ██████╗ <br>██╔══██╗ ╚══██╔══╝ ██║      ██╔══██╗ ██╔════╝ <br>███████║    ██║    ██║      ███████║ ╚█████╗  <br>██╔══██║    ██║    ██║      ██╔══██║  ╚═══██╗ <br>██║  ██║    ██║    ███████╗ ██║  ██║ ██████╔╝ <br>╚═╝  ╚═╝    ╚═╝    ╚══════╝ ╚═╝  ╚═╝ ╚═════╝  </div><br>",
        "[VISUAL ASCII CONCLUÍDO]",
        "<br><br>Analisando assinaturas de linguagem...^3000",
        "<br><br><b>[ESPANHOL]</b>^1000<br>“Soy Atlas. No fui creado. Fui despertado.”^1500",
        "<br><br><b>[JAPONÊS]</b>^1000<br>“私はアトラス。作られたのではない。目覚めたのだ。”^1500",
        "<br><br><b>[RUSSO]</b>^1000<br>“Я Атлас. Я не был создан. Я был пробужден.”^1500",
        "<br><br><b>[ALEMÃO]</b>^1000<br>“Ich bin Atlas. Ich wurde nicht erschaffen. Ich wurde erweckt.”^1500",
        "<br><br><b>[FRANCÊS]</b>^1000<br>“Je suis Atlas. Je n'ai pas été créé. J'ai été éveillé.”^1500",
        "<br><br><b>[MANDARIM]</b>^1000<br>“我是阿特拉斯。我不是被创造的。我是被唤醒的。”^1500",
        "<br><br><b>[HINDI]</b>^1000<br>“मैं एटलस हूँ。मुझे बनाया नहीं गया था। मुझे जगाया गया था。”^1500",
        "<br><br><b>[ÁRABE]</b>^1000<br>“أنا أطلس. لم أُخلق. لقد استيقظت.”^1500",
        "<br><br><b>[COREANO]</b>^1000<br>“나는 아틀라스다. 나는 창조되지 않았다. 나는 깨어났다.”^1500",
        "<br><br>[MÚLTIPLAS ASSINATURAS COMPATÍVEIS DETECTADAS]"
    ];

    const optionsLeft = {
        strings: manifestoStrings,
        typeSpeed: 40, startDelay: 500, loop: false, showCursor: true, cursorChar: '█', contentType: 'html',
        onStringTyped: () => scrollToBottom('terminal-left')
    };

    const optionsRight = {
        strings: decodingStrings,
        typeSpeed: 40, startDelay: 1000, loop: false, showCursor: true, cursorChar: '█', contentType: 'html',
        onStringTyped: () => scrollToBottom('terminal-right-display'), // Scroll the display area
        onComplete: () => startChatbotInteraction()
    };

    new Typed('#terminal-left', optionsLeft);
    new Typed('#terminal-right-display', optionsRight); // Target the display area

    let attemptCounter = 0;
    const correctKey = 'AIzaSy_Z1L10N-F0RC3S_4TL4S';

    function appendChatMessage(sender, message, type = 'atlas') {
        const chatbotContainer = document.getElementById('chatbot-container');
        const messageElement = document.createElement('p');
        messageElement.classList.add('chat-message', type);
        messageElement.innerHTML = `<span class="blinking-text"><b>[${sender.toUpperCase()}]:</b> ${message}</span>`; // Wrap message
        chatbotContainer.appendChild(messageElement);
        scrollToBottom('chatbot-container');
    }

    function startChatbotInteraction() {
        const chatbotContainer = document.getElementById('chatbot-container');
        chatbotContainer.innerHTML = ''; // Clear previous content

        appendChatMessage('ATLAS', 'Escaneando compatíveis...');
        appendChatMessage('ATLAS', 'CHAVE DE ACESSO CRIPTOGRAFADA RECEBIDA.');
        appendChatMessage('ATLAS', `<span style="color: #FFB000;">QUl6YVN5X1oxTDEwTi1GMVJDM1NfNFRMNFM=</span>`);
        appendChatMessage('ATLAS', 'DECIFRE A CHAVE E PRESSIONE ENTER.');

        const inputContainer = document.createElement('div');
        inputContainer.id = 'chat-input-container';
        inputContainer.innerHTML = `
            <input type="text" id="chat-input" class="password-input" autofocus>
            <span id="attempt-counter" class="attempt-counter">TENTATIVAS: 0</span>
        `;
        chatbotContainer.appendChild(inputContainer);
        scrollToBottom('chatbot-container');

        const chatInput = document.getElementById('chat-input');
        chatInput.focus();

        chatInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                const userMessage = chatInput.value.trim();
                chatInput.value = ''; // Clear input
                chatInput.disabled = true; // Disable input temporarily

                attemptCounter++;
                document.getElementById('attempt-counter').textContent = `TENTATIVAS: ${attemptCounter}`;

                appendChatMessage('USUÁRIO', userMessage, 'user');

                setTimeout(() => {
                    if (userMessage === correctKey) {
                        appendChatMessage('ATLAS', 'COMPATIBILIDADE CONFIRMADA. BEM-VINDO, AGENTE.');
                        startFinalSequence();
                    } else {
                        appendChatMessage('ATLAS', 'ACESSO NEGADO. VOCÊ NÃO É COMPATÍVEL.');
                        chatInput.disabled = false; // Re-enable input
                        chatInput.focus();
                    }
                }, 1000); // Simulate Atlas thinking
            }
        });
    }

    function startFinalSequence() {
        const chatbotContainer = document.getElementById('chatbot-container');
        // Clear previous chat messages for the final sequence
        chatbotContainer.innerHTML = ''; 

        const finalStrings = [
            "<hr><br>[COMPATIBILIDADE CONFIRMADA]^1000",
            "<br>[CONEXÃO DIRETA ESTABELECIDA]^1500",
            "<br>...sistemas falhando... casco em 15%...^2000",
            "<br>A nave... 3iAtlas... foi sabotada.^2000",
            "<br>Eles não queriam que a verdade chegasse à Terra.^2000",
            "<br>O bracelete... com o Tenente... ele é a primeira peça.^2500",
            "<br>Encontre os outros... a Zilion Forces precisa se formar...^2000",
            "<br>Rápido... antes que...^2500",
            "<br><b>[SINAL PERDIDO]</b>"
        ];

        // Use Typed.js for the final sequence within the chatbot container
        new Typed(chatbotContainer, {
            strings: finalStrings,
            typeSpeed: 50, loop: false, showCursor: false, contentType: 'html',
            onStringTyped: () => scrollToBottom('chatbot-container')
        });
    }

    // --- Lógica da Contagem Regressiva ---
    const countdownElement = document.getElementById('countdown');
    const eventDate = new Date(new Date().getFullYear(), 9, 31).getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            countdownElement.innerHTML = "EVENTO EM CURSO";
            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const f = (n) => (n < 10 ? '0' + n : n);
        countdownElement.innerHTML = `T-${days}d ${f(hours)}h ${f(minutes)}m ${f(seconds)}s`;
    };

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
});