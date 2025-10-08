document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarContent = document.getElementById('sidebar-content');
    const canvas = document.getElementById('grid-container');
    const activationZone = document.getElementById('activation-zone');
    const nextPageBtn = document.getElementById('next-page-btn');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    const rightSidebar = document.getElementById('right-sidebar');
    const rightSidebarToggle = document.getElementById('right-sidebar-toggle');

    let fullStoryData = {};
    let panelElements = [];
    let isPanelActive = false;
    let currentPageIndex = 0;
    let currentPanelIndex = 0;
    let isMuted = true; // O som começa desligado
    let activeVideo = null; // Referência para o vídeo tocando

    // --- CARREGAMENTO DA HISTÓRIA ---
    fetch('/hq-viewer/assets/historia_hq01.json')
        .then(response => response.json())
        .then(data => {
            fullStoryData = data;
            initPage(currentPageIndex);
        })
        .catch(error => console.error('Erro ao carregar a história da HQ:', error));

    // --- LÓGICA DE CONTROLE DE SOM ---
    soundToggleBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        soundToggleBtn.classList.toggle('muted', isMuted);
        soundToggleBtn.textContent = isMuted ? '🔇' : '🔊';
        
        // Se um vídeo estiver tocando, atualiza seu som imediatamente
        if(activeVideo) {
            activeVideo.muted = isMuted;
        }
    });

    // --- LÓGICA DE NAVEGAÇÃO ---
    nextPageBtn.addEventListener('click', () => {
        if (currentPageIndex < fullStoryData.paginas.length - 1) {
            currentPageIndex++;
            initPage(currentPageIndex);
        }
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            initPage(currentPageIndex);
        }
    });

    // --- LÓGICA DO SIDEBAR ---
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        sidebarToggle.textContent = sidebar.classList.contains('collapsed') ? '>' : '<';
        setTimeout(repositionPanels, 500); // Reposiciona após a animação
    });

    rightSidebarToggle.addEventListener('click', () => {
        rightSidebar.classList.toggle('collapsed');
        rightSidebarToggle.textContent = rightSidebar.classList.contains('collapsed') ? '<' : '>';
        setTimeout(repositionPanels, 500); // Reposiciona após a animação
    });

    function repositionPanels() {
        const canvasRect = canvas.getBoundingClientRect();
        panelElements.forEach(panel => {
            if (panel.style.display === 'none') return; // Não reposiciona painéis que já sumiram

            // Previne que o painel ativo seja reposicionado aleatoriamente
            if(panel.classList.contains('video-active') || isPanelActive && panel.classList.contains('toview')) return;

            panel.style.top = `${Math.random() * (canvasRect.height - panel.offsetHeight)}px`;
            panel.style.left = `${Math.random() * (canvasRect.width - panel.offsetWidth)}px`;
        });
    }

    function updateSidebar(pageIndex, panelIndex) {
        const story = fullStoryData.paginas[pageIndex]?.paineis.find(p => p.id === panelIndex);
        if (!story) return;

        sidebarContent.innerHTML = '';
        const title = document.createElement('h2');
        title.textContent = story.scene;
        sidebarContent.appendChild(title);

        story.narrative.forEach(item => {
            const p = document.createElement('p');
            p.textContent = item.content;
            p.className = `sidebar-${item.type}`;
            sidebarContent.appendChild(p);
        });
    }

    // --- INICIALIZAÇÃO DA PÁGINA ---
    function initPage(pageIndex) {
        canvas.innerHTML = '';
        panelElements = [];
        currentPanelIndex = 0;
        nextPageBtn.classList.add('hidden');
        prevPageBtn.classList.add('hidden');
        canvas.appendChild(activationZone);

        const pageData = fullStoryData.paginas[pageIndex];
        if (!pageData) return;

        pageData.paineis.forEach((panelData) => {
            const panel = document.createElement('div');
            panel.className = 'grid-panel';
            panel.dataset.internalIndex = panelData.id;

            const img = document.createElement('img');
            img.src = `/hq-viewer/assets/images/HQ-01_Zilion_Force/painel_${panelData.id}.png`;
            
            const video = document.createElement('video');
            video.src = `/hq-viewer/assets/videos/HQ-01_Zilion_Force_Vídeos/painel_${panelData.id}.mp4`;
            video.muted = isMuted; // Respeita o estado atual do som
            video.loop = false;
            video.preload = 'auto';

            panel.appendChild(img);
            panel.appendChild(video);
            canvas.appendChild(panel);
            panelElements.push(panel);

            const canvasRect = canvas.getBoundingClientRect();
            img.onload = () => {
                // A rotação é definida uma vez, a posição é controlada por repositionPanels
                panel.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            };

            const draggie = new Draggabilly(panel);
            draggie.on('dragEnd', () => {
                if (isPanelActive) return;
                if (checkOverlap(panel, activationZone) && panel.classList.contains('toview')) {
                    activatePanel(panel);
                }
            });
        });
        // Um pequeno delay para garantir que os painéis foram adicionados ao DOM antes de posicionar
        setTimeout(() => {
            repositionPanels();
            updatePanelStates();
        }, 100);
    }

    function updatePanelStates() {
        const pageData = fullStoryData.paginas[currentPageIndex];
        if (!pageData) return;

        panelElements.forEach((panel) => {
            const panelId = parseInt(panel.dataset.internalIndex, 10);
            const currentStoryPanel = pageData.paineis[currentPanelIndex];
            
            panel.classList.remove('toview', 'viewed');

            if (!currentStoryPanel) return;

            if (panelId < currentStoryPanel.id) {
                panel.classList.add('viewed');
            } else if (panelId === currentStoryPanel.id) {
                panel.classList.add('toview');
            }
        });
        
        const currentGlobalId = pageData.paineis[currentPanelIndex]?.id;
        if(currentGlobalId !== undefined) {
            updateSidebar(currentPageIndex, currentGlobalId);
        }
    }

    function checkOverlap(elem1, elem2) {
        const rect1 = elem1.getBoundingClientRect();
        const rect2 = elem2.getBoundingClientRect();
        return !(
            rect1.right < rect2.left || rect1.left > rect2.right ||
            rect1.bottom < rect2.top || rect1.top > rect2.bottom
        );
    }

    function activatePanel(panel) {
        isPanelActive = true;
        activeVideo = panel.querySelector('video');
        activeVideo.muted = isMuted; // Garante que o som está no estado correto antes de tocar

        const zoneRect = activationZone.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        panel.style.transition = 'all 0.5s ease-in-out';
        panel.style.top = `${zoneRect.top - canvasRect.top}px`;
        panel.style.left = `${zoneRect.left - canvasRect.left}px`;
        panel.style.width = `${zoneRect.width}px`;
        panel.style.height = `${zoneRect.height}px`;
        panel.style.transform = 'rotate(0deg)';

        setTimeout(() => {
            panel.classList.add('video-active');
            activeVideo.play();

            activeVideo.onended = () => {
                activeVideo = null; // Limpa a referência
                panel.style.transition = 'opacity 1s ease-out';
                panel.style.opacity = '0';
                
                panel.classList.remove('toview');
                panel.classList.add('viewed');
                currentPanelIndex++;
                
                setTimeout(() => panel.style.display = 'none', 1000);

                const pageData = fullStoryData.paginas[currentPageIndex];
                if (currentPanelIndex >= pageData.paineis.length) {
                    if (currentPageIndex < fullStoryData.paginas.length - 1) {
                        nextPageBtn.classList.remove('hidden');
                    }
                    if (currentPageIndex > 0) {
                        prevPageBtn.classList.remove('hidden');
                    }
                    isPanelActive = false;
                    return;
                }

                updatePanelStates();
                isPanelActive = false;
            };
        }, 700);
    }
});
