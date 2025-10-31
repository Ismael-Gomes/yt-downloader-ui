# **🎵 Listify (YT Playlist Downloader UI)**

Este é o **frontend oficial** para o **YT Downloader API**.  
 Uma interface de usuário moderna, de página única (**SPA**), construída inteiramente com **HTML**, **CSS** e **JavaScript (Vanilla JS)**.  
 Ela permite que os usuários colem URLs de playlists do YouTube para baixar vídeos como **MP3 (áudio)** ou **MP4 (vídeo)**.

---

## **✨ Funcionalidades**

* **Busca de Playlists:** Valida e busca informações de playlists do YouTube.

* **Seleção de Músicas:** Permite ao usuário escolher quais faixas da playlist deseja baixar.

* **Histórico de Downloads:** Aba “Downloads” lista todos os downloads concluídos com sucesso (enquanto o servidor backend estiver ativo).

* **Playlists Favoritas:** Permite favoritar playlists para acesso rápido.

* **Playlists Recentes:** Armazena automaticamente as 5 últimas playlists buscadas no sidebar esquerdo.

* **Configurações Avançadas:**

  * **Tema:** Suporte a tema Claro (Light Mode) e Escuro (Dark Mode).

  * **Idioma:** Interface traduzível (**PT-BR / EN-US**).

  * **Formato Padrão:** Define MP3 ou MP4 como seleção padrão.

---

## **🚀 Como Funciona (Instalação e Uso)**

Este projeto é apenas o **frontend** e depende 100% do **yt-downloader-api** (substitua pelo link do seu repositório backend) para funcionar.

### **Pré-requisitos**

* O **Backend (yt-downloader-api)** deve estar rodando. Por padrão, ele executa em:  
   `http://localhost:5000`

* Um navegador moderno (Chrome, Firefox, Edge, etc.)

### **Rodando o Frontend**

1. Clone este repositório.

2. Certifique-se de que o servidor backend (**app.py**) esteja rodando.

3. Abra o arquivo `html/index.html` diretamente no seu navegador.

4. A aplicação se conectará automaticamente à API em `http://localhost:5000`.

---

## **📁 Estrutura do Projeto**

/  
├── css/  
│   └── style.css         \# Folha de estilos principal (temas, layout, etc.)  
├── html/  
│   └── index.html        \# Único arquivo HTML da aplicação  
├── img/  
│   ├── listify-logo.png  \# Logo principal e favicon  
│   └── ...  
├── js/  
│   └── script.js         \# Todo o código JavaScript da aplicação (APIs, estado, UI)  
└── README.md             \# Este arquivo

---

## **⚙️ Lógica do JavaScript (`script.js`)**

O arquivo `script.js` é responsável por **controlar toda a aplicação**, incluindo:

### **🧠 Gerenciamento de Estado**

Utiliza o **localStorage** do navegador para armazenar:

* `app_settings` → Configurações do aplicativo

* `yt_playlist_favorites` → Playlists favoritas

* `yt_playlist_cache` → Últimas playlists buscadas

### **🔄 Navegação**

A função `showSection()` controla qual das quatro abas está visível:

* **Busca**

* **Downloads**

* **Favoritas**

* **Configurações**

Essa função simula a navegação de uma **SPA (Single Page Application)**.

### **🌐 API**

Utiliza `fetch()` para comunicação com o backend:

* `POST /api/validate-playlist`

* `POST /api/download-selected`

* `GET /api/get-downloads`

### **🌍 Tradução**

Um objeto `translations` no topo do script contém os textos para:

* `pt-br`

* `en-us`

A função `applyTranslations()` é chamada quando o idioma é alterado nas Configurações.

### **🎨 Tema**

A classe `.light-theme` é adicionada ou removida do `<body>` com base na seleção do usuário, alternando entre os modos **claro** e **escuro**.

---

## **🧩 Tecnologias Utilizadas**

* **HTML5**

* **CSS3 (Flexbox \+ Variables)**

* **JavaScript (Vanilla)**

* **LocalStorage**

* **Fetch API**

---

## **🧑‍💻 Autor**

**Listify UI** — Interface oficial para o \[YT Downloader API\].  
 Desenvolvido com ❤️ por Ismael Gomes.
