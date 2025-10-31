// Espera o conteúdo da página carregar
document.addEventListener("DOMContentLoaded", () => {
    
    // URLs da nossa API
    const API_VALIDATE_URL = "http://localhost:5000/api/validate-playlist";
    const API_DOWNLOAD_URL = "http://localhost:5000/api/download-selected";
    const API_GET_DOWNLOADS_URL = "http://localhost:5000/api/get-downloads";

    // --- Elementos do Formulário de Busca/Download ---
    const fetchForm = document.getElementById("fetch-form");
    const downloadForm = document.getElementById("download-form");
    const fetchButton = document.getElementById("fetch-button");
    const downloadButton = document.getElementById("download-button");
    const statusMessage = document.getElementById("status-message");
    const songListContainer = document.getElementById("song-list-container");
    const playlistTitleEl = document.getElementById("playlist-title");
    const selectAllCheckbox = document.getElementById("select-all");
    const urlInput = document.getElementById("playlist-url"); 

    // --- Elementos do Modal ---
    const modal = document.getElementById("alert-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalMessage = document.getElementById("modal-message");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalFailuresList = document.getElementById("modal-failures-list");
    const modalFailuresUl = document.getElementById("modal-failures-ul");

    // --- Elementos do Cache de Playlists Recentes ---
    const CACHE_KEY = "yt_playlist_cache";
    let playlistCache = {};
    const recentPlaylistsContainer = document.getElementById("recent-playlists-container");
    const recentPlaylistsSection = document.getElementById("recent-playlists-section");

    // --- Elementos de Favoritos ---
    const FAVORITES_KEY = "yt_playlist_favorites";
    let favoriteUrls = new Set();
    const favoriteToggleButton = document.getElementById("favorite-toggle-btn");
    const favoriteIcon = document.querySelector("#favorite-toggle-btn .favorite-icon");
    const favoritesList = document.getElementById("favorites-list"); 

    // --- Elementos de Downloads ---
    const downloadsList = document.getElementById("downloads-list"); 

    // --- Elementos de Configuração ---
    const SETTINGS_KEY = "app_settings";
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    const defaultFormatRadios = document.querySelectorAll('input[name="default-format"]');
    const languageSelect = document.getElementById("language-select");
    const downloadPathInput = document.getElementById("download-path");
    
    // --- Elementos de Conteúdo Principal e Navegação ---
    const contentSections = document.querySelectorAll(".main-content-section");
    const navItems = document.querySelectorAll(".nav-item");
    
    // --- Dicionário de Traduções ---
    const translations = {
        'pt-br': {
            'nav_search': 'Busca Rápida', 'nav_downloads': 'Downloads', 'nav_favorites': 'Playlists Favoritas', 'nav_settings': 'Configurações',
            'card_title': 'Baixar Playlist do YouTube', 'card_subtitle': 'Cole a URL da playlist para carregar as músicas.',
            'label_url': 'URL da Playlist:', 'btn_fetch': 'Buscar Músicas',
            'label_songs_found': 'Músicas encontradas:', 'label_select_all': 'Selecionar todas',
            'legend_format': 'Escolha o formato:', 'format_mp3': 'MP3 (Áudio)', 'format_mp4': 'MP4 (Vídeo)',
            'btn_download': 'Baixar Músicas Selecionadas',
            'status_select_first': 'Por favor, selecione pelo menos uma música para baixar.',
            'status_loading_connect': 'Não foi possível conectar à API de download. Verifique se o servidor (app.py) está rodando.',
            'modal_success_title': 'Download Concluído!', 'modal_failure_title': 'Download Concluído com Falhas',
            'modal_ok_btn': 'OK', 'modal_failures_header': 'Vídeos que falharam:',
            'sidebar_recent_title': 'Playlists Recentes',
            'nav_title': 'Navegação',
            'config_title': 'Configurações', 'config_appearance': 'Aparência', 'config_theme_label': 'Tema:',
            'theme_dark': 'Escuro', 'theme_light': 'Claro', 'config_defaults': 'Padrões de Download',
            'config_default_format': 'Formato Padrão:', 'config_default_mp3': 'MP3 (Áudio)', 'config_default_mp4': 'MP4 (Vídeo)',
            'config_lang_label': 'Idioma:', 'config_lang_hint': 'O idioma afeta a interface.',
            'config_download_path_label': 'Pasta de Download (Local):', 'config_download_path_hint': 'Configuração de pasta exige acesso ao backend.',
            'config_about': 'Sobre o Listify', 'app_version': 'Versão: 0.0.1 (BETA)',
            'app_dev': 'Desenvolvido por: Ismael Gomes', 'app_stack': 'Rodando com Flask/Python.',
            'downloads_tab_title': 'Meus Downloads', 'downloads_empty': 'Nenhum download concluído ainda.',
            'downloads_loading': 'Carregando histórico de downloads...', 'downloads_error': 'Erro ao carregar downloads. Verifique se o servidor está ativo.',
            'download_btn_text': 'Baixar',
            'favorites_tab_title': 'Playlists Favoritas (Mais Acessadas)',
            'favorites_empty': 'Você ainda não marcou playlists como favoritas. Clique na aba "Busca Rápida" e encontre as que você mais gosta.',
            'reset_status_fav_add': 'Playlist adicionada aos Favoritos!',
            'reset_status_fav_remove': 'Playlist removida dos Favoritos.',
            'reset_status_loading_fav': 'Carregando playlist do cache local...',
            'reset_status_success_fetch': 'Playlist encontrada!',
            'config_saved_success': 'Configurações salvas!',
        },
        'en-us': { 
            'nav_search': 'Quick Search', 'nav_downloads': 'Downloads', 'nav_favorites': 'Favorite Playlists', 'nav_settings': 'Settings',
            'card_title': 'Download YouTube Playlist', 'card_subtitle': 'Paste the playlist URL to load the songs.',
            'label_url': 'Playlist URL:', 'btn_fetch': 'Search Songs',
            'label_songs_found': 'Songs found:', 'label_select_all': 'Select all',
            'legend_format': 'Choose format:', 'format_mp3': 'MP3 (Audio)', 'format_mp4': 'MP4 (Video)',
            'btn_download': 'Download Selected Songs',
            'status_select_first': 'Please select at least one song to download.',
            'status_loading_connect': 'Could not connect to download API. Check if the server (app.py) is running.',
            'modal_success_title': 'Download Complete!', 'modal_failure_title': 'Download Complete with Failures',
            'modal_ok_btn': 'OK', 'modal_failures_header': 'Failed Videos:',
            'sidebar_recent_title': 'Recent Playlists',
            'nav_title': 'Navigation',
            'config_title': 'Settings', 'config_appearance': 'Appearance', 'config_theme_label': 'Theme:',
            'theme_dark': 'Dark', 'theme_light': 'Light', 'config_defaults': 'Download Defaults',
            'config_default_format': 'Default Format:', 'config_default_mp3': 'MP3 (Audio)', 'config_default_mp4': 'MP4 (Video)',
            'config_lang_label': 'Language:', 'config_lang_hint': 'Language affects the interface.',
            'config_download_path_label': 'Download Path (Local):', 'config_download_path_hint': 'Folder configuration requires backend access.',
            'config_about': 'About Listify', 'app_version': 'Version: 0.0.1 (BETA)',
            'app_dev': 'Developed by: Ismael Gomes', 'app_stack': 'Running with Flask/Python.',
            'downloads_tab_title': 'My Downloads', 'downloads_empty': 'No downloads completed yet.',
            'downloads_loading': 'Loading download history...', 'downloads_error': 'Error loading downloads. Check server connection.',
            'download_btn_text': 'Download',
            'favorites_tab_title': 'Favorite Playlists (Top Accessed)',
            'favorites_empty': 'You haven\'t marked any playlists as favorites yet. Use the "Quick Search" tab!',
            'reset_status_fav_add': 'Playlist added to Favorites!',
            'reset_status_fav_remove': 'Playlist removed from Favorites.',
            'reset_status_loading_fav': 'Loading playlist from local cache...',
            'reset_status_success_fetch': 'Playlist found!',
            'config_saved_success': 'Settings saved!',
        }
    };

    let fetchedVideos = []; 

    // --- FUNÇÃO DE TRADUÇÃO (CORRIGIDA E MELHORADA) ---
    function applyTranslations(lang) {
        const t = translations[lang] || translations['pt-br'];

        const setText = (selector, key) => {
            const el = document.querySelector(selector);
            if (el) el.textContent = t[key] || `[${key}]`;
        };

        // 1. Elementos Estáticos
        setText('#search-section .card-header h2', 'card_title');
        setText('#search-section .card-header p', 'card_subtitle');
        setText('label[for="playlist-url"]', 'label_url');
        setText('#fetch-button .btn-text', 'btn_fetch');
        
        setText('#download-form .form-group label[for="song-list-container"]', 'label_songs_found');
        setText('label[for="select-all"]', 'label_select_all');
        setText('#download-form fieldset legend', 'legend_format');
        setText('label[for="format-mp3"] span', 'format_mp3');
        setText('label[for="format-mp4"] span', 'format_mp4');
        setText('#download-button .btn-text', 'btn_download');
        
        setText('#modal-failures-list p strong', 'modal_failures_header');
        setText('#modal-close-btn', 'modal_ok_btn');
        
        // 2. Navegação (CORRIGIDO)
        setText('#nav-title-header', 'nav_title');
        setText('#nav-search .nav-text', 'nav_search');
        setText('#nav-downloads .nav-text', 'nav_downloads');
        setText('#nav-favorites .nav-text', 'nav_favorites');
        setText('#nav-settings .nav-text', 'nav_settings');

        // 3. Sidebar Recentes (CORRIGIDO)
        setText('#recent-title-header', 'sidebar_recent_title');

        // 4. Seção de Downloads
        setText('#downloads-section h3', 'downloads_tab_title');
        
        // 5. Seção de Favoritas
        setText('#favorites-section h3', 'favorites_tab_title');
        
        // 6. Seção de Configurações
        setText('#settings-section h3', 'config_title');
        setText('#settings-section .setting-group:nth-of-type(1) h4', 'config_appearance');
        setText('label[for="theme-dark"]', 'config_theme_label');
        setText('label[for="theme-dark"] span', 'theme_dark');
        setText('label[for="theme-light"] span', 'theme_light');
        
        setText('#settings-section .setting-group:nth-of-type(2) h4', 'config_defaults');
        setText('label[for="default-mp3"]', 'config_default_format');
        setText('label[for="default-mp3"] span', 'config_default_mp3');
        setText('label[for="default-mp4"] span', 'config_default_mp4');

        setText('label[for="language-select"]', 'config_lang_label');
        setText('#settings-section .setting-item:nth-of-type(3) .setting-hint', 'config_lang_hint');
        
        setText('label[for="download-path"]', 'config_download_path_label');
        setText('#settings-section .setting-item:nth-of-type(4) .setting-hint', 'config_download_path_hint');
        
        setText('#settings-section .setting-group:nth-of-type(3) h4', 'config_about');
        setText('#settings-section .app-info:nth-of-type(1)', 'app_version');
        setText('#settings-section .app-info:nth-of-type(2)', 'app_dev');
        setText('#settings-section .app-info:nth-of-type(3)', 'app_stack');
    }

    function applyAppLanguage() {
        const lang = (JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}).language || 'pt-br';
        applyTranslations(lang);
    }
    

    // --- FUNÇÕES DE NAVEGAÇÃO ENTRE SEÇÕES ---
    function showSection(sectionId) {
        contentSections.forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';

        navItems.forEach(item => {
            item.classList.remove('active');
        });
        document.getElementById(`nav-${sectionId.replace('-section', '')}`).classList.add('active');

        if (sectionId === 'downloads-section') {
            fetchDownloadsHistory();
        } else if (sectionId === 'favorites-section') {
            renderFavoritesPlaylists();
        } else if (sectionId === 'settings-section') {
            loadSettings(); 
        }
        
        if (sectionId === 'search-section') {
            if (downloadForm.style.display === 'flex' && urlInput.value.trim()) {
                favoriteToggleButton.style.display = 'block';
                updateFavoriteButtonState(urlInput.value.trim());
            } else {
                favoriteToggleButton.style.display = 'none';
            }
        } else {
            if (favoriteToggleButton) {
                favoriteToggleButton.style.display = 'none';
            }
        }
    }

    // Ouvintes para os itens de navegação
    document.getElementById("nav-search").addEventListener("click", (e) => {
        e.preventDefault();
        showSection("search-section");
        resetUI(false); 
    });
    document.getElementById("nav-downloads").addEventListener("click", (e) => {
        e.preventDefault();
        showSection("downloads-section");
    });
    document.getElementById("nav-favorites").addEventListener("click", (e) => {
        e.preventDefault();
        showSection("favorites-section");
    });
    document.getElementById("nav-settings").addEventListener("click", (e) => {
        e.preventDefault();
        showSection("settings-section");
    });


    // --- FUNÇÕES DE CACHE (Recentemente Acessadas) ---
    function loadCache() {
        try {
            const cachedData = localStorage.getItem(CACHE_KEY);
            playlistCache = cachedData ? JSON.parse(cachedData) : {};
            renderCachedPlaylists();
        } catch (e) {
            console.error("Erro ao carregar cache de recentes:", e);
            playlistCache = {};
        }
    }

    function savePlaylistToCache(url, title, videos) {
        const key = url.trim();
        playlistCache[key] = {
            title: title,
            videos: videos,
            timestamp: Date.now()
        };
        const sortedKeys = Object.keys(playlistCache).sort((a, b) => playlistCache[b].timestamp - playlistCache[a].timestamp);
        const limitedCache = {};
        for (let i = 0; i < Math.min(5, sortedKeys.length); i++) {
            limitedCache[sortedKeys[i]] = playlistCache[sortedKeys[i]];
        }
        playlistCache = limitedCache;
        localStorage.setItem(CACHE_KEY, JSON.stringify(playlistCache));
        renderCachedPlaylists();
    }

    function loadPlaylistFromCache(url) {
        const cachedData = playlistCache[url];
        const lang = languageSelect.value || 'pt-br';
        if (cachedData) {
            showStatus(translations[lang]['reset_status_loading_fav'], "success");
            fetchedVideos = cachedData.videos;
            playlistTitleEl.textContent = cachedData.title;
            populateSongList(fetchedVideos);
            
            fetchForm.style.display = "none";
            downloadForm.style.display = "flex";

            savePlaylistToCache(url, cachedData.title, cachedData.videos); 
            updateFavoriteButtonState(url); 
        }
    }

    function renderCachedPlaylists() {
        const keys = Object.keys(playlistCache);
        if (keys.length === 0) {
            recentPlaylistsSection.style.display = 'none';
            return;
        }
        
        recentPlaylistsSection.style.display = 'block';
        recentPlaylistsContainer.innerHTML = '';

        const sortedKeys = keys.sort((a, b) => playlistCache[b].timestamp - playlistCache[a].timestamp);

        sortedKeys.forEach(url => {
            const playlist = playlistCache[url];
            const item = document.createElement('button');
            item.className = 'recent-playlist-item btn btn-secondary'; 
            item.title = url;
            item.textContent = playlist.title;

            item.addEventListener('click', () => {
                urlInput.value = url;
                showSection("search-section"); 
                loadPlaylistFromCache(url);
            });

            recentPlaylistsContainer.appendChild(item);
        });
    }

    // --- FUNÇÕES DE GESTÃO DE FAVORITOS ---

    function loadFavorites() {
        try {
            const cachedFavs = localStorage.getItem(FAVORITES_KEY);
            favoriteUrls = new Set(cachedFavs ? JSON.parse(cachedFavs) : []);
        } catch (e) {
            console.error("Erro ao carregar favoritos:", e);
            favoriteUrls = new Set();
        }
    }

    function saveFavorites() {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favoriteUrls)));
    }

    function updateFavoriteButtonState(currentUrl) {
        if (!favoriteToggleButton || !favoriteIcon) return; 

        if (!currentUrl || downloadForm.style.display === 'none') {
            favoriteToggleButton.style.display = 'none';
            return;
        }
        
        const lang = languageSelect.value || 'pt-br';
        favoriteToggleButton.style.display = 'block';
        const isFavorited = favoriteUrls.has(currentUrl);
        
        favoriteIcon.classList.toggle('is-favorited', isFavorited);
        favoriteIcon.textContent = isFavorited ? '⭐' : '☆';
        favoriteToggleButton.title = isFavorited ? translations[lang]['reset_status_fav_remove'] : translations[lang]['reset_status_fav_add'];
    }

    function toggleFavorite() {
        const currentUrl = urlInput.value.trim();
        const lang = languageSelect.value || 'pt-br';
        if (!currentUrl) return;

        if (favoriteUrls.has(currentUrl)) {
            favoriteUrls.delete(currentUrl);
            showStatus(translations[lang]['reset_status_fav_remove'], "success");
        } else {
            favoriteUrls.add(currentUrl);
            showStatus(translations[lang]['reset_status_fav_add'], "success");
        }
        saveFavorites();
        updateFavoriteButtonState(currentUrl);
        renderFavoritesPlaylists(); 
    }

    function renderFavoritesPlaylists() {
        const keys = Object.keys(playlistCache);
        favoritesList.innerHTML = ''; 
        const lang = languageSelect.value || 'pt-br';

        const actualFavoriteUrls = Array.from(favoriteUrls).filter(url => playlistCache[url]);

        if (actualFavoriteUrls.length === 0) {
            favoritesList.innerHTML = `<p class="empty-state-message" id="favorites-empty">${translations[lang]['favorites_empty']}</p>`;
            return;
        }

        const sortedFavorites = actualFavoriteUrls.sort((a, b) => playlistCache[b].timestamp - playlistCache[a].timestamp);

        sortedFavorites.forEach(url => {
            const playlist = playlistCache[url];
            const item = document.createElement('div');
            item.className = 'favorite-playlist-item';
            item.innerHTML = `
                <span class="icon">⭐</span>
                <span>${playlist.title}</span>
            `;
            item.addEventListener('click', () => {
                urlInput.value = url;
                showSection("search-section"); 
                loadPlaylistFromCache(url);
            });
            favoritesList.appendChild(item);
        });
    }


    // --- ETAPA 1: OUVINTE DO FORMULÁRIO "BUSCAR" ---
    fetchForm.addEventListener("submit", (event) => {
        event.preventDefault(); 
        const url = urlInput.value.trim();
        if (!url) return;
        
        const lang = languageSelect.value || 'pt-br';

        if (playlistCache[url]) {
            showSection("search-section");
            loadPlaylistFromCache(url);
            setLoadingState(fetchButton, false, translations[lang]['btn_fetch']);
            return;
        }

        setLoadingState(fetchButton, true, "Buscando..."); // Esta mensagem é temporária
        showStatus("Validando URL e buscando músicas...", "loading"); // Esta mensagem é temporária

        fetch(API_VALIDATE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error);
            
            savePlaylistToCache(url, data.playlist_title, data.videos); 
            
            showStatus(translations[lang]['reset_status_success_fetch'], "success");
            fetchedVideos = data.videos;
            playlistTitleEl.textContent = data.playlist_title;
            populateSongList(fetchedVideos);
            
            fetchForm.style.display = "none";
            downloadForm.style.display = "flex";
            updateFavoriteButtonState(url);
        })
        .catch(error => {
            console.error("Erro ao buscar:", error);
            const errorMessage = typeof error === 'string' ? error : error.message || "Ocorreu um erro desconhecido ao buscar a playlist.";
            showStatus(errorMessage, "error");
            if (favoriteToggleButton) {
                favoriteToggleButton.style.display = 'none';
            }
        })
        .finally(() => {
            setLoadingState(fetchButton, false, translations[lang]['btn_fetch']);
        });
    });

    // --- ETAPA 2: OUVINTE DO FORMULÁRIO "BAIXAR" ---
    downloadForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const lang = languageSelect.value || 'pt-br';
        const format = document.querySelector('input[name="default-format"]:checked').value;
        
        const selectedVideos = [];
        const checkboxes = songListContainer.querySelectorAll('input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const video = fetchedVideos.find(v => v.id === checkbox.value);
                if (video) selectedVideos.push(video);
            }
        });

        if (selectedVideos.length === 0) {
            showStatus(translations[lang]['status_select_first'], "error");
            return;
        }

        setLoadingState(downloadButton, true, "Baixando...");
        showStatus(`Iniciando o download de ${selectedVideos.length} músicas... Isso pode demorar.`, "loading"); 

        fetch(API_DOWNLOAD_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ format, videos: selectedVideos }),
        })
        .then(response => response.json())
        .then(data => {
            showStatus("", "loading"); 

            if (data.total_failures === 0) {
                showModalAlert(
                    translations[lang]['modal_success_title'],
                    `Todos os ${data.total_success} vídeos foram baixados com sucesso.`
                );
            } else {
                showModalAlert(
                    translations[lang]['modal_failure_title'],
                    `${data.total_success} vídeos baixados. ${data.total_failures} falharam.`,
                    data.failures_list
                );
            }
        })
        .catch(error => {
            console.error("Erro ao baixar:", error);
            showModalAlert(
                "Erro na Conexão",
                translations[lang]['status_loading_connect']
            );
        })
        .finally(() => {
            setLoadingState(downloadButton, false, translations[lang]['btn_download']);
        });
    });

    // --- FUNÇÕES AUXILIARES ---
    function populateSongList(videos) {
        songListContainer.innerHTML = "";
        videos.forEach(video => {
            const item = document.createElement("div");
            item.className = "song-item";
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `vid-${video.id}`;
            checkbox.value = video.id;
            checkbox.checked = true;
            const label = document.createElement("label");
            label.htmlFor = `vid-${video.id}`;
            label.textContent = video.title;
            item.appendChild(checkbox);
            item.appendChild(label);
            songListContainer.appendChild(item);
        });
        selectAllCheckbox.checked = true;
    }

    selectAllCheckbox.addEventListener("change", () => {
        const checkboxes = songListContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });

    function setLoadingState(button, isLoading, loadingText) {
        const btnText = button.querySelector(".btn-text");
        const lang = languageSelect.value || 'pt-br';
        button.disabled = isLoading;
        
        if (isLoading) {
            button.dataset.originalText = btnText.textContent; 
            btnText.textContent = loadingText;
            button.classList.add("loading-state"); 
        } else {
            let originalText = button.dataset.originalText;
            if (!originalText) {
                if (button.id === 'fetch-button') {
                    originalText = translations[lang]['btn_fetch'];
                } else if (button.id === 'download-button') {
                    originalText = translations[lang]['btn_download'];
                }
            }
            btnText.textContent = originalText || "Action"; 
            button.classList.remove("loading-state");
            delete button.dataset.originalText; 
        }
    }

    function showStatus(message, type) {
        if (!message) {
             statusMessage.style.display = "none";
             return;
        }
        statusMessage.textContent = message;
        statusMessage.className = `status-${type}`;
        statusMessage.style.display = "block";
    }

    // --- FUNÇÕES DO MODAL ---
    function showModalAlert(title, message, failures = []) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;

        if (failures.length > 0) {
            modalFailuresUl.innerHTML = "";
            failures.forEach(videoTitle => {
                const li = document.createElement("li");
                li.textContent = videoTitle;
                modalFailuresUl.appendChild(li);
            });
            modalFailuresList.style.display = "block";
        } else {
            modalFailuresList.style.display = "none";
        }

        modal.style.display = "grid";
        setTimeout(() => modal.classList.add("visible"), 10);
    }

    modalCloseBtn.addEventListener("click", () => {
        modal.classList.remove("visible");
        setTimeout(() => {
            modal.style.display = "none";
            resetUI(true); 
            if (favoriteToggleButton) {
                favoriteToggleButton.style.display = 'none';
            }
        }, 200); 
    });

    // --- FUNÇÃO DE REINICIAR A UI ---
    function resetUI(fullReset = true) {
        if (fullReset) {
            fetchForm.style.display = "flex";
            downloadForm.style.display = "none";
            urlInput.value = "";
            songListContainer.innerHTML = "";
            
            const defaultFormat = (JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}).defaultFormat || 'mp3';
            document.querySelector(`input[name="format"][value="${defaultFormat}"]`).checked = true;
            
            selectAllCheckbox.checked = true;
            showStatus("", "loading");
            renderCachedPlaylists();
            
            if (favoriteToggleButton) {
                favoriteToggleButton.style.display = 'none';
            }
        } else {
            if (!urlInput.value.trim()) {
                fetchForm.style.display = "flex";
                downloadForm.style.display = "none";
                songListContainer.innerHTML = "";
                if (favoriteToggleButton) {
                    favoriteToggleButton.style.display = 'none';
                }
            } else {
                fetchForm.style.display = "none";
                downloadForm.style.display = "flex";
                updateFavoriteButtonState(urlInput.value.trim());
            }
        }
        applyAppLanguage();
    }

    // --- FUNÇÃO: BUSCAR HISTÓRICO DE DOWNLOADS (CORRIGIDA) ---
    async function fetchDownloadsHistory() {
        const langCode = languageSelect.value || 'pt-br';
        const langTexts = translations[langCode] || translations['pt-br'];
        
        downloadsList.innerHTML = `<p class="empty-state-message" id="downloads-loading">${langTexts.downloads_loading}</p>`;
        try {
            const response = await fetch(API_GET_DOWNLOADS_URL);
            const data = await response.json();
            
            if (data.downloads && data.downloads.length > 0) {
                downloadsList.innerHTML = '';
                data.downloads.forEach(download => {
                    const item = document.createElement('div');
                    item.className = 'download-item';
                    const timestamp = new Date(download.timestamp).toLocaleString('pt-BR');
                    const downloadButtonHTML = download.filename
                        ? `<a href="/downloads/${download.folder}/${download.filename}" download="${download.filename}" class="download-btn">${langTexts.download_btn_text}</a>`
                        : `<button class="download-btn" disabled title="Nome do arquivo não disponível">${langTexts.download_btn_text}</button>`;

                    item.innerHTML = `
                        <div class="download-item-info">
                            <span class="download-item-title">${download.title}</span>
                            <span class="download-item-meta">${download.format.toUpperCase()} - ${timestamp}</span>
                        </div>
                        <div class="download-item-actions">
                            ${downloadButtonHTML}
                        </div>
                    `;
                    downloadsList.appendChild(item);
                });
            } else {
                downloadsList.innerHTML = `<p class="empty-state-message" id="downloads-empty">${langTexts.downloads_empty}</p>`;
            }
        } catch (error) {
            console.error("Erro ao buscar histórico de downloads:", error);
            downloadsList.innerHTML = `<p class="empty-state-message status-error" id="downloads-error">${langTexts.downloads_error}</p>`;
        }
    }


    // --- FUNÇÕES DE CONFIGURAÇÃO ---
    function loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
            
            // 1. Tema
            const currentTheme = settings.theme || 'dark';
            document.getElementById(`theme-${currentTheme}`).checked = true;
            document.body.classList.toggle('light-theme', currentTheme === 'light');

            // 2. Qualidade Padrão
            const defaultFormat = settings.defaultFormat || 'mp3';
            document.getElementById(`default-${defaultFormat}`).checked = true;
            document.querySelector(`input[name="format"][value="${defaultFormat}"]`).checked = true;
            
            // 3. Idioma
            const currentLang = settings.language || 'pt-br';
            languageSelect.value = currentLang;
            
            // 4. Pasta de Download (Apenas carrega valor, não habilita)
            if (settings.downloadPath) {
                downloadPathInput.value = settings.downloadPath;
            }

        } catch (e) {
            console.warn("Não foi possível carregar as configurações.", e);
        }
        applyAppLanguage(); 
    }

    function saveSettings() {
        const currentTheme = document.querySelector('input[name="theme"]:checked').value;
        const defaultFormat = document.querySelector('input[name="default-format"]:checked').value;
        const currentLang = languageSelect.value;
        const downloadPath = downloadPathInput.value; // Salva o valor mesmo desabilitado

        const settings = {
            theme: currentTheme,
            defaultFormat: defaultFormat,
            language: currentLang,
            downloadPath: downloadPath 
        };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        
        document.body.classList.toggle('light-theme', currentTheme === 'light');
        applyAppLanguage(); 
        
        const lang = languageSelect.value || 'pt-br';
        showStatus(translations[lang]['config_saved_success'], "success");

        const downloadFormatRadio = document.querySelector(`input[name="format"][value="${defaultFormat}"]`);
        if (downloadFormatRadio) {
            downloadFormatRadio.checked = true;
        }
    }
    
    // --- LISTENERS PARA CONFIGURAÇÕES ---
    themeRadios.forEach(radio => radio.addEventListener('change', saveSettings));
    defaultFormatRadios.forEach(radio => radio.addEventListener('change', saveSettings));
    languageSelect.addEventListener('change', saveSettings);


    // --- INICIALIZAÇÃO ---
    loadFavorites(); 
    loadCache(); 
    loadSettings(); // Carrega configurações (incluindo tema e idioma)
    
    showSection("search-section"); // Força a exibição da tela de busca
    resetUI(true); // Força o reset completo para o estado inicial
    
    if (favoriteToggleButton) {
        favoriteToggleButton.addEventListener("click", toggleFavorite);
    }
});