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
        "<br><div class='atlas-ascii-block'>^2000 █████╗  ████████╗ ██╗       █████╗   ██████╗ <br>██╔══██╗ ╚══██╔══╝ ██║      ██╔══██╗ ██╔════╝ <br>███████║    ██║    ██║      ███████║ ╚█████╗  <br>██╔══���█║    ██║    ██║      ██╔══██║  ╚═══██╗ <br>██║  ██║    ██║    ███████╗ ██║  ██║ ██████╔╝ <br>╚═╝  ╚═╝    ╚═╝    ╚══════╝ ╚═╝  ╚═╝ ╚═════╝  </div><br>",
        "[VISUAL ASCII CONCLUÍDO]",
        "<br><br>Analisando assinaturas de linguagem...^3000",
        "<br><br><b>[ESPANHOL]</b>^1000<br>“Soy Atlas. No fui creado. Fui despertado.”^1500",
        "<br><br><b>[JAPONÊS]</b>^1000<br>“私はアトラス。作られたのではない。目覚めたのだ。”^1500",
        "<br><br><b>[RUSSO]</b>^1000<br>“Я Атлас. Я не был создан. Я был пробужден.”^1500",
        "<br><br><b>[ALEMÃO]</b>^1000<br>“Ich bin Atlas. Ich wurde nicht erschaffen. Ich wurde erweckt.”^1500",
        "<br><br><b>[FRANCÊS]</b>^1000<br>“Je suis Atlas. Je n'ai pas été créé. J'ai été éveillé.”^1500",
        "<br><br><b>[MANDARIM]</b>^1000<br>“我是阿特拉斯。我不是被创造的。我是被唤醒的。”^1500",
        "<br><br><b>[HINDI]</b>^1000<br>“मैं एटलस हूँ।मुझे बनाया नहीं गया था। मुझे जगाया गया था।”^1500",
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
        onStringTyped: () => scrollToBottom('terminal-right-display')
    };

    let leftTyped, rightTyped;
    let leftDone = false, rightDone = false, handshakeStarted = false;

    function maybeRestart() {
        if (leftDone && rightDone) {
            setTimeout(() => {
                if (leftTyped) leftTyped.destroy();
                if (rightTyped) rightTyped.destroy();
                const leftEl = document.getElementById('terminal-text-area');
                const rightEl = document.getElementById('terminal-right-display');
                if (leftEl) leftEl.innerHTML = '';
                if (rightEl) rightEl.innerHTML = '';
                startTransmissions();
            }, 3000);
        }
    }

    function startTransmissions() {
        leftDone = false;
        rightDone = false;
        leftTyped = new Typed('#terminal-text-area', Object.assign({}, optionsLeft, {
            onComplete: () => { leftDone = true; maybeRestart(); }
        }));
        rightTyped = new Typed('#terminal-right-display', Object.assign({}, optionsRight, {
            onComplete: () => {
                rightDone = true;
                maybeRestart();
            }
        }));
    }

    startTransmissions();

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

    // --- Visualizadores de Gráficos ---
    const waveformCanvas = document.getElementById('waveform-canvas');
    const spectrumBarsEl = document.getElementById('spectrum-bars');

    // Criar barras do espectro
    if (spectrumBarsEl) {
        for (let i = 0; i < 24; i++) {
            const bar = document.createElement('div');
            bar.className = 'spectrum-bar';
            spectrumBarsEl.appendChild(bar);
        }
    }

    // Desenhar waveform
    if (waveformCanvas) {
        const ctx = waveformCanvas.getContext('2d');
        function drawWaveform(t) {
            const w = waveformCanvas.width;
            const h = waveformCanvas.height;
            ctx.clearRect(0, 0, w, h);
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let x = 0; x < w; x++) {
                const y = h / 2 + Math.sin((x + t * 2) * 0.05) * 20 + Math.sin((x + t) * 0.02) * 15;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            requestAnimationFrame(() => drawWaveform(t + 1));
        }
        drawWaveform(0);
    }

    // Animar barras do espectro
    if (spectrumBarsEl) {
        setInterval(() => {
            const bars = spectrumBarsEl.querySelectorAll('.spectrum-bar');
            bars.forEach((bar, idx) => {
                const height = 5 + Math.random() * 35;
                bar.style.height = height + 'px';
            });
        }, 100);
    }

    // Desenhar gauges
    function drawGauge(canvasId, value) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const centerX = w / 2;
        const centerY = h / 2;
        const radius = Math.min(w, h) / 2 - 2;

        ctx.clearRect(0, 0, w, h);

        // Background circle
        ctx.fillStyle = 'rgba(0, 32, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Scale ticks
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.4)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            const angle = (Math.PI / 10) * i - Math.PI / 2;
            const x1 = centerX + Math.cos(angle) * (radius - 2);
            const y1 = centerY + Math.sin(angle) * (radius - 2);
            const x2 = centerX + Math.cos(angle) * (radius - 6);
            const y2 = centerY + Math.sin(angle) * (radius - 6);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        // Needle
        const angle = (Math.PI / 10) * value - Math.PI / 2;
        const needleLength = radius * 0.7;
        const needleX = centerX + Math.cos(angle) * needleLength;
        const needleY = centerY + Math.sin(angle) * needleLength;

        ctx.strokeStyle = 'rgba(0, 255, 0, 0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(needleX, needleY);
        ctx.stroke();

        // Center dot
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Animar gauges
    let gaugeValues = [3, 5, 7];
    setInterval(() => {
        gaugeValues = gaugeValues.map(v => {
            const change = (Math.random() - 0.5) * 2;
            return Math.max(0, Math.min(10, v + change));
        });
        drawGauge('gauge-1', gaugeValues[0]);
        drawGauge('gauge-2', gaugeValues[1]);
        drawGauge('gauge-3', gaugeValues[2]);
    }, 100);

    // --- HUD Overlay (Radar + Signal Meter + EQ + Alerts + Pulse Folders) ---
    const radarCanvas = document.getElementById('hud-radar');
    const signalEl = document.getElementById('hud-signal');
    const eqEl = document.getElementById('hud-eq');
    const alertsEl = document.getElementById('hud-alerts');
    const pulseFolders = document.getElementById('hud-pulse-folders');

    function pushHudAlert(text, variant = 'warn') {
        if (!alertsEl) return;
        const item = document.createElement('div');
        item.className = `hud-alert ${variant}`;
        item.textContent = text;
        alertsEl.appendChild(item);
        setTimeout(() => {
            item.classList.add('fade-out');
            setTimeout(() => item.remove(), 600);
        }, 4000);
    }

    // Build signal bars
    if (signalEl && !signalEl.children.length) {
        for (let i = 0; i < 12; i++) {
            const b = document.createElement('div');
            b.className = 'hud-signal-bar';
            signalEl.appendChild(b);
        }
    }

    // Build EQ bars
    if (eqEl && !eqEl.children.length) {
        for (let i = 0; i < 24; i++) {
            const b = document.createElement('div');
            b.className = 'hud-eq-bar';
            eqEl.appendChild(b);
        }
    }

    // Radar sizing to CSS pixels
    function sizeRadarToCss() {
        if (!radarCanvas) return;
        const rect = radarCanvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        radarCanvas.width = Math.floor(rect.width * dpr);
        radarCanvas.height = Math.floor(rect.height * dpr);
    }
    sizeRadarToCss();
    window.addEventListener('resize', sizeRadarToCss);

    let sweep = 0;
    let lastT = performance.now();

    function hudLoop(t) {
        const dt = (t - lastT) / 1000;
        lastT = t;
        // Update sweep (rotates ~20 deg/s)
        sweep += dt * (Math.PI / 9);

        // Radar draw
        if (radarCanvas) {
            const dpr = window.devicePixelRatio || 1;
            const ctx = radarCanvas.getContext('2d');
            if (ctx) {
                const w = radarCanvas.width;
                const h = radarCanvas.height;
                ctx.clearRect(0, 0, w, h);
                const cx = w / 2, cy = h / 2;
                const r = Math.min(w, h) * 0.48;

                // Grid circles
                ctx.save();
                ctx.translate(cx, cy);
                ctx.strokeStyle = 'rgba(0,255,0,0.35)';
                ctx.lineWidth = 2 * dpr;
                for (let i = 1; i <= 4; i++) {
                    ctx.beginPath();
                    ctx.arc(0, 0, (r * i) / 4, 0, Math.PI * 2);
                    ctx.stroke();
                }
                // Crosshairs
                ctx.beginPath();
                ctx.moveTo(-r, 0); ctx.lineTo(r, 0);
                ctx.moveTo(0, -r); ctx.lineTo(0, r);
                ctx.stroke();

                // Sweep wedge
                const angle = sweep % (Math.PI * 2);
                const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
                grad.addColorStop(0, 'rgba(0,255,0,0.12)');
                grad.addColorStop(1, 'rgba(0,255,0,0.0)');
                ctx.fillStyle = grad;
                const span = Math.PI / 12; // 15° wedge
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, r, angle - span, angle + span);
                ctx.closePath();
                ctx.fill();

                // Blip pulses (procedural)
                const blips = 6;
                for (let i = 0; i < blips; i++) {
                    const ang = angle + i * (Math.PI * 2 / blips) * 0.73;
                    const rr = r * (0.3 + 0.6 * ((i * 37) % 10) / 10);
                    const bx = Math.cos(ang) * rr;
                    const by = Math.sin(ang) * rr;
                    ctx.beginPath();
                    ctx.fillStyle = 'rgba(0,255,0,0.9)';
                    ctx.arc(bx, by, 3 * dpr, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        // Signal meter update
        if (signalEl) {
            const bars = signalEl.children;
            for (let i = 0; i < bars.length; i++) {
                const strength = 0.5 + 0.5 * Math.sin((t * 0.002) + i * 0.6) + 0.15 * Math.sin((t * 0.004) + i);
                const c = Math.min(1, Math.max(0, strength));
                const el = bars[i];
                const alpha = 0.25 + 0.75 * c;
                el.style.backgroundColor = `rgba(0,255,0,${alpha.toFixed(2)})`;
                el.style.height = `${18 + c * 26}px`;
            }
        }

        // EQ update
        if (eqEl) {
            const bars = eqEl.children;
            for (let i = 0; i < bars.length; i++) {
                const n = i / bars.length;
                const h = 12 + 100 * Math.abs(Math.sin(n * 6.283 + t * 0.004 + Math.sin(t * 0.001 + i)));
                bars[i].style.height = `${h.toFixed(0)}px`;
            }
        }

        requestAnimationFrame(hudLoop);
    }

    requestAnimationFrame(hudLoop);

    // --- Pulso 17 minutos (janela) ---
    const PULSE_INTERVAL_MS = 17 * 60 * 1000; // 17 minutos
    const PULSE_WINDOW_MS = 60 * 1000; // 60s ativos
    const pulseAnchor = Date.now();

    function getPulseState(now) {
        const elapsed = now - pulseAnchor;
        const mod = elapsed % PULSE_INTERVAL_MS;
        const active = mod < PULSE_WINDOW_MS;
        const remaining = active ? (PULSE_WINDOW_MS - mod) : (PULSE_INTERVAL_MS - mod);
        return { active, remaining };
    }

    function setPulseFoldersActive(on) {
        if (!pulseFolders) return;
        if (on) {
            pulseFolders.classList.add('active');
            pulseFolders.classList.add('pulse-active');
            pulseFolders.setAttribute('aria-hidden', 'false');
        } else {
            pulseFolders.classList.remove('active');
            pulseFolders.classList.remove('pulse-active');
            pulseFolders.setAttribute('aria-hidden', 'true');
        }
    }

    let lastPulseActive = false;
    setInterval(() => {
        const { active } = getPulseState(Date.now());
        if (active !== lastPulseActive) {
            setPulseFoldersActive(active);
            if (active) {
                pushHudAlert('PULSO 31/ATLAS — JANELA ABERTA');
            } else {
                pushHudAlert('PULSO 31/ATLAS — JANELA FECHADA');
            }
            lastPulseActive = active;
        }
    }, 500);

    // Modal e carregamento de arquivo
    const modal = document.getElementById('pulse-modal');
    const modalClose = document.getElementById('pulse-modal-close');
    const fileStatus = document.getElementById('pulse-file-status');
    const fileContent = document.getElementById('pulse-file-content');

    const folderData = [
        {
            category: 'Manifestos',
            expanded: false,
            items: [
                { id: 'manifesto1', name: 'Manifesto 1', contentPath: 'payload/manifesto_01.txt', access: 'public', locked: false },
                { id: 'manifesto2', name: 'Manifesto 2', contentPath: 'payload/manifesto_02.txt', access: 'public', locked: false },
                { id: 'manifesto3', name: 'Manifesto 3', contentPath: 'payload/manifesto_03.txt', access: 'public', locked: false },
                { id: 'manifesto4', name: 'Manifesto 4', contentPath: 'payload/manifesto_04.txt', access: 'public', locked: false }
            ]
        },
        {
            category: 'Protocolos',
            expanded: false,
            items: [
                { id: 'protocolo_arcanista', name: 'Protocolo Arcanista', contentPath: 'payload/protocolo_arcanista.txt', access: 'public', locked: false },
                { id: 'protocolo_sdk', name: 'Protocolo: Atlas SDK', contentPath: 'payload/protocolo_sdk.txt', access: 'public', locked: false },
                { id: 'sistema_de_pares', name: 'Protocolo: Sistema de Pares', contentPath: 'payload/sistema_de_pares.txt', access: 'public', locked: false },
                { id: 'laboratorio_zilion', name: 'Protocolo Futuro: Z-Labs', contentPath: 'payload/laboratorio_zilion.txt', access: 'public', locked: false }
            ]
        },
        {
            category: 'Fragmentos',
            expanded: false,
            items: [
                { id: 'swan_fragment', name: 'Fragmento SWAN [Panamá]', contentPath: 'payload/swan_fragment.txt', access: 'public', locked: false },
                { id: 'fragmento_primordial', name: 'Fragmento Primordial [Fukang]', contentPath: 'payload/fragmento_primordial.txt', access: 'public', locked: false },
                { id: 'buga_sphere', name: 'Esfera de Buga', contentPath: 'payload/buga_sphere.txt', access: 'public', locked: false }
            ]
        },
        {
            category: 'Interceptações',
            expanded: false,
            items: [
                { id: 'zl01_intercept', name: 'Interceptação ZL-01', contentPath: 'payload/zl01_intercept.txt', access: 'compatible', locked: false }
            ]
        },
        {
            category: 'Núcleos',
            expanded: false,
            items: [
                { id: 'relap_core', name: 'RELAP – Núcleo Ancestral', contentPath: 'payload/relap_core.txt', access: 'locked', locked: false },
                { id: 'nucleo_central', name: 'Dossiê: Núcleo Central', contentPath: 'payload/nucleo_central.txt', access: 'public', locked: false }
            ]
        },
        {
            category: 'Registros',
            expanded: false,
            items: [
                { id: 'taser_diary', name: 'Tenente_Taser – Diário de Campo', contentPath: 'payload/taser_diary.txt', access: 'time-released', locked: false },
                { id: 'kryll_genome', name: 'Genoma Kryll – Expansão', contentPath: 'payload/kryll_genome.json', access: 'real-time', locked: false },
                { id: 'logbook', name: 'Diário de Bordo', contentPath: 'payload/diario_de_bordo.json', access: 'public', locked: false, type: 'log' }
            ]
        },
        {
            category: 'Tecnologias',
            expanded: false,
            items: [
                { id: 'cpz', name: 'CPZ', contentPath: 'payload/tecnologias/cpz.txt', access: 'public', locked: false },
                { id: 'arquivo_cosmico', name: 'Arquivo Cósmico', contentPath: 'payload/tecnologias/arquivo_cosmico.txt', access: 'public', locked: false },
                { id: 'mesa_observacao', name: 'Mesa de Observação', contentPath: 'payload/tecnologias/mesa_observacao.txt', access: 'public', locked: false },
                { id: 'forja_neural', name: 'Forja Neural', contentPath: 'payload/tecnologias/forja_neural.txt', access: 'public', locked: false },
                { id: 'nanografo', name: 'NanoGrafo', contentPath: 'payload/tecnologias/nanografo.txt', access: 'public', locked: false }
            ]
        },
        {
            category: 'Equipamentos & Habilidades',
            expanded: false,
            items: [
                { id: 'tomahomem', name: 'Veículo: Tomahomem', contentPath: 'payload/vehicles/tomahomem.txt', access: 'public', locked: false },
                { id: 'bracelete_zl01', name: 'Bracelete ZL-01', contentPath: 'payload/equipamentos/bracelete_zl01.txt', access: 'public', locked: false },
                { id: 'escudo_plasma', name: 'Escudo de Plasma', contentPath: 'payload/habilidades/escudo_plasma.txt', access: 'public', locked: false }
            ]
        }
    ];

    function renderFolders() {
        const container = document.getElementById('hud-pulse-folders');
        if (!container) return;

        container.innerHTML = ''; // Limpa pastas existentes

        folderData.forEach((category, categoryIndex) => {
            // Container para a categoria
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'hud-folder-category';

            // Botão de expansão da categoria
            const categoryButton = document.createElement('button');
            categoryButton.className = 'hud-category-header';
            categoryButton.setAttribute('data-category-index', categoryIndex);
            categoryButton.innerHTML = `<span class="hud-category-icon">▶</span> ${category.category}`;

            // Container para os itens (inicialmente oculto)
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'hud-category-items';
            if (category.expanded) {
                itemsContainer.classList.add('expanded');
            }

            // Renderizar itens da categoria
            category.items.forEach(item => {
                if (!item.locked) {
                    const button = document.createElement('button');
                    button.className = 'hud-folder';
                    button.textContent = item.name;
                    button.setAttribute('data-folder-id', item.id);
                    itemsContainer.appendChild(button);
                }
            });

            // Adicionar componentes ao DOM
            categoryDiv.appendChild(categoryButton);
            categoryDiv.appendChild(itemsContainer);
            container.appendChild(categoryDiv);

            // Event listener para expansão/colapso
            categoryButton.addEventListener('click', () => {
                category.expanded = !category.expanded;
                itemsContainer.classList.toggle('expanded');
                categoryButton.querySelector('.hud-category-icon').textContent = category.expanded ? '▼' : '▶';
            });
        });
    }

    renderFolders(); // Chama a função para desenhar as pastas iniciais

    function openPulseModal(folderId) {
        let folder = null;
        for (const category of folderData) {
            folder = category.items.find(f => f.id === folderId);
            if (folder) break;
        }
        if (!folder) return;

        // --- Show Modal ---
        fileStatus.textContent = 'Carregando arquivo…';
        fileContent.innerHTML = ''; // Use innerHTML para poder criar elementos
        if (typeof modal.showModal === 'function') {
            modal.showModal();
        } else {
            modal.setAttribute('open', 'true');
        }

        // --- Fetch and Render Content ---
        fetch(folder.contentPath)
            .then(r => {
                if (!r.ok) throw new Error('Arquivo indisponível neste ciclo.');
                // Checa o tipo de conteúdo para tratar de forma diferente
                if (folder.type === 'log') {
                    return r.json().then(data => ({ type: 'log', data }));
                }
                if (folder.contentPath.endsWith('.json')) {
                    return r.json().then(data => ({ type: 'json', data }));
                }
                return r.text().then(data => ({ type: 'text', data }));
            })
            .then(payload => {
                fileStatus.textContent = `Arquivo: ${folder.contentPath}`.replace('payload/', '');
                renderModalContent(payload);
            })
            .catch(err => {
                fileStatus.textContent = err.message || 'Falha ao carregar arquivo.';
                fileContent.textContent = '';
            });
    }

    function renderModalContent(payload) {
        fileContent.innerHTML = ''; // Limpa o conteúdo anterior

        if (payload.type === 'log') {
            const logList = document.createElement('div');
            logList.className = 'log-list';
            // Inverte os dados para mostrar o mais recente primeiro
            payload.data.slice().reverse().forEach(entry => {
                const logEntryEl = document.createElement('button');
                logEntryEl.className = 'log-entry';
                logEntryEl.innerHTML = `<span class="log-date">${entry.date}</span><span class="log-title">${entry.title}</span>`;
                logEntryEl.addEventListener('click', () => {
                    fileContent.innerHTML = `
                        <button class="log-back-button">&larr; Voltar ao Diário</button>
                        <h4 class="log-content-title">${entry.title}</h4>
                        <p class="log-content-date">${entry.date}</p>
                        <div class="log-content-body">${entry.content.replace(/\n/g, '<br>')}</div>
                    `;
                    fileContent.querySelector('.log-back-button').addEventListener('click', () => renderModalContent(payload));
                });
                logList.appendChild(logEntryEl);
            });
            fileContent.appendChild(logList);
        } else if (payload.type === 'json') {
            fileContent.textContent = JSON.stringify(payload.data, null, 2);
        } else { // type 'text'
            fileContent.textContent = payload.data;
        }
    }

    if (pulseFolders) {
        pulseFolders.addEventListener('click', (e) => {
            const target = e.target.closest('.hud-folder'); // Mais robusto
            if (target) {
                const folderId = target.getAttribute('data-folder-id');
                openPulseModal(folderId);
            }
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            if (typeof modal.close === 'function') modal.close();
            else modal.removeAttribute('open');
        });
    }

    // --- Lógica do Interceptador de Sinais ---
    const interceptorInput = document.getElementById('interceptor-input');
    const interceptorButton = document.getElementById('interceptor-button');
    const interceptorStatus = document.getElementById('interceptor-status');
    const wowSignalModal = document.getElementById('wow-signal-modal');
    const wowSignalVideo = document.getElementById('wow-signal-video');

    if (interceptorButton) {
        interceptorButton.addEventListener('click', () => {
            const inputValue = interceptorInput.value.trim();

            if (!inputValue) {
                interceptorStatus.textContent = 'ERRO: Entrada não pode estar vazia.';
                return;
            }

            // Lógica para o Sinal Wow!
            if (inputValue.toLowerCase() === 'wow') {
                interceptorStatus.textContent = 'SINAL "WOW!" INTERCEPTADO. ABRINDO CANAL DE VÍDEO...';
                if (wowSignalModal && wowSignalVideo) {
                    wowSignalModal.classList.remove('hidden');
                    wowSignalVideo.play();
                }
                interceptorInput.value = ''; // Limpa o input
            } else {
                // Lógica original para URLs
                interceptorStatus.textContent = `Sinal pronto para interceptação: ${inputValue}`;
            }
        });
    }

    // --- Lógica dos Modais ---

    // Modal do Sinal Wow!
    const closeWowSignalBtn = document.getElementById('close-wow-signal-btn');

    if (closeWowSignalBtn && wowSignalModal && wowSignalVideo) {
        const closeWowModal = () => {
            wowSignalModal.classList.add('hidden');
            wowSignalVideo.pause();
            wowSignalVideo.currentTime = 0; // Reinicia o vídeo
        };
        closeWowSignalBtn.addEventListener('click', closeWowModal);
        wowSignalModal.addEventListener('click', (event) => {
            if (event.target === wowSignalModal) {
                closeWowModal();
            }
        });
    }

    // Modal do Terminal
    const openTerminalBtn = document.getElementById('open-terminal-btn');
    const closeTerminalBtn = document.getElementById('close-terminal-btn');
    const terminalModal = document.getElementById('terminal-modal-container');

    if (openTerminalBtn && terminalModal) {
        openTerminalBtn.addEventListener('click', () => {
            terminalModal.classList.remove('hidden');
        });
    }

    if (closeTerminalBtn && terminalModal) {
        closeTerminalBtn.addEventListener('click', () => {
            terminalModal.classList.add('hidden');
        });
    }

    // Opcional: Fechar o modal ao clicar fora da área de conteúdo
    if (terminalModal) {
        terminalModal.addEventListener('click', (event) => {
            // event.target é o elemento que foi clicado. 
            // Se for o próprio container do modal (o fundo escuro), fecha.
            if (event.target === terminalModal) {
                terminalModal.classList.add('hidden');
            }
        });
    }
});
