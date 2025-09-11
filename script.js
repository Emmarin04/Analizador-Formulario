// --- CONFIGURACIÓN ---
const GOOGLE_FORM_CONFIG = {
    formId: "AIzaSyA_dU02VW_faoCSvyLFW7hpIjn4Uudcr0g",
    fieldIds: {
        autor: "entry.2027879855",
        titulo: "entry.1936764678",
        url: "entry.927393209",
        descripcion: "entry.1687157750",
        palabrasClave: "entry.1849932620",
        tipoRecurso: "entry.1975186150",
        nivelEducativo: "entry.1339686242",
        areaConocimiento: "entry.1763651912",
        plataforma: "entry.837026772"
    }
};

const translations = {
    es: {
        pageTitle: "Analizador de Aplicaciones Educativas con IA",
        mainTitle: "Analizador de Aplicaciones Educativas con IA",
        mainDescription: "Introduce tus datos y la URL o descripción de una aplicación. La IA la analizará y preparará un borrador en tu formulario de Google con todos los campos deducidos.",
        authorLabel: "Nombre de autor/a o alias",
        platformLabel: "Plataforma de creación",
        platformDefaultOption: "Selecciona una plataforma",
        analysisSourceLabel: "Fuente del análisis",
        analysisModeText: "Descripción / Código",
        analysisModeUrl: "Solo URL",
        appUrlLabel: "URL de la aplicación",
        appDescriptionLabel: "Descripción o código fuente a analizar",
        appDescriptionPlaceholder: "Pega aquí una descripción detallada de la aplicación o su código fuente...",
        analyzeButton: "Analizar con IA",
        analyzingButton: "Analizando...",
        openFormButton: "Abrir Formulario Rellenado",
        license: "Licencia GPL v3",
        statusContacting: "Contactando con la IA para analizar...",
        statusSuccess: "¡Análisis completado! Haz clic abajo para abrir el formulario.",
        errorInvalidURL: "Por favor, introduce una URL válida.",
        errorInvalidDescription: "Por favor, introduce una descripción o código fuente.",
        errorGeneric: "Error: {message}. Inténtalo de nuevo."
    },
    en: {
        pageTitle: "AI Educational App Analyzer",
        mainTitle: "AI Educational App Analyzer",
        mainDescription: "Enter your data and the URL or description of an application. The AI will analyze it and prepare a draft in your Google Form with all the deduced fields.",
        authorLabel: "Author's name or alias",
        platformLabel: "Creation Platform",
        platformDefaultOption: "Select a platform",
        analysisSourceLabel: "Analysis Source",
        analysisModeText: "Description / Code",
        analysisModeUrl: "URL Only",
        appUrlLabel: "Application URL",
        appDescriptionLabel: "Description or source code to analyze",
        appDescriptionPlaceholder: "Paste a detailed description of the application or its source code here...",
        analyzeButton: "Analyze with AI",
        analyzingButton: "Analyzing...",
        openFormButton: "Open Prefilled Form",
        license: "GPL v3 License",
        statusContacting: "Contacting AI for analysis...",
        statusSuccess: "Analysis complete! Click below to open the form.",
        errorInvalidURL: "Please enter a valid URL.",
        errorInvalidDescription: "Please enter a description or source code.",
        errorGeneric: "Error: {message}. Please try again."
    }
};

// --- DOM & ESTADO ---
const form = document.getElementById('analisisForm');
const authorInput = document.getElementById('authorName');
const platformSelect = document.getElementById('platformSelect');
const urlInput = document.getElementById('appUrl');
const descriptionInput = document.getElementById('appDescription');
const submitButton = document.getElementById('analizarBtn');
const statusMessage = document.getElementById('statusMessage');
const resultArea = document.getElementById('resultArea');
const openFormLink = document.getElementById('openFormLink');
const modeUrlBtn = document.getElementById('modeUrlBtn');
const modeTextBtn = document.getElementById('modeTextBtn');
const urlInputContainer = document.getElementById('urlInputContainer');
const descriptionInputContainer = document.getElementById('descriptionInputContainer');
const themeToggle = document.getElementById('theme-toggle');
const langEsBtn = document.getElementById('lang-es');
const langEnBtn = document.getElementById('lang-en');

let analysisMode = 'text';
let currentLang = 'es';

// --- LÓGICA DE LA INTERFAZ ---

// Cambio de Modo de Análisis (URL vs. Texto)
function setAnalysisMode(mode) {
    analysisMode = mode;
    const activeClasses = ['bg-cyan-600', 'text-white'];
    const inactiveClasses = ['bg-gray-200', 'text-gray-700', 'dark:bg-gray-600', 'dark:text-gray-300'];

    if (mode === 'url') {
        descriptionInputContainer.classList.add('hidden');
        urlInputContainer.classList.remove('hidden');
        
        modeUrlBtn.classList.add(...activeClasses);
        modeUrlBtn.classList.remove(...inactiveClasses);
        modeTextBtn.classList.remove(...activeClasses);
        modeTextBtn.classList.add(...inactiveClasses);
        
        descriptionInput.required = false;
        urlInput.required = true;
    } else { // mode 'text'
        descriptionInputContainer.classList.remove('hidden');
        urlInputContainer.classList.remove('hidden');
        
        modeTextBtn.classList.add(...activeClasses);
        modeTextBtn.classList.remove(...inactiveClasses);
        modeUrlBtn.classList.remove(...activeClasses);
        modeUrlBtn.classList.add(...inactiveClasses);

        descriptionInput.required = true;
        urlInput.required = false;
    }
}

// Cambio de Tema (Día/Noche)
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    document.getElementById('theme-icon-dark').classList.toggle('hidden', isDarkMode);
    document.getElementById('theme-icon-light').classList.toggle('hidden', !isDarkMode);
}

// Cambio de Idioma
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.dataset.translate;
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    // Actualizar botones de idioma
    const activeClasses = ['bg-cyan-600', 'text-white'];
    const inactiveClasses = ['bg-transparent', 'text-gray-800', 'dark:text-white'];
    if (lang === 'es') {
        langEsBtn.classList.add(...activeClasses);
        langEsBtn.classList.remove(...inactiveClasses);
        langEnBtn.classList.remove(...activeClasses);
        langEnBtn.classList.add(...inactiveClasses);
    } else {
        langEnBtn.classList.add(...activeClasses);
        langEnBtn.classList.remove(...inactiveClasses);
        langEsBtn.classList.remove(...activeClasses);
        langEsBtn.classList.add(...inactiveClasses);
    }
}

// --- LÓGICA PRINCIPAL DEL ANÁLISIS ---
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const author = authorInput.value.trim();
    const platform = platformSelect.value;
    const urlToAnalyze = urlInput.value.trim();
    const descriptionToAnalyze = descriptionInput.value.trim();

    let sourceContent;

    if (analysisMode === 'url') {
        if (!urlToAnalyze) {
            updateStatus(translations[currentLang].errorInvalidURL, 'error');
            return;
        }
        sourceContent = `la página web en la URL: ${urlToAnalyze}`;
    } else {
        if (!descriptionToAnalyze) {
            updateStatus(translations[currentLang].errorInvalidDescription, 'error');
            return;
        }
        sourceContent = `el siguiente texto, que puede ser una descripción o el código fuente de una aplicación:\n\n---\n${descriptionToAnalyze}\n---`;
        if (urlToAnalyze) {
            sourceContent += `\nLa URL de referencia es: ${urlToAnalyze}`;
        }
    }
    
    setLoadingState(true);
    resultArea.classList.add('hidden'); 
    updateStatus(translations[currentLang].statusContacting, 'loading');

    try {
        const prompt = `Como experto en catalogación de tecnología educativa, analiza ${sourceContent}.
        Extrae la siguiente información y respóndela en un objeto JSON válido con las claves especificadas:

        1.  "titulo": Un título conciso y atractivo para la aplicación.
        2.  "descripcion": Una descripción breve (2-3 frases) que resuma su propósito educativo y cómo funciona.
        3.  "palabrasClave": Un string con 3 a 5 palabras clave relevantes, separadas por comas.
        4.  "tipoRecurso": Un array con uno o más tipos de recurso aplicables de esta lista: ["Juego / Gamificación", "Simulador / Laboratorio virtual", "Cuestionario / Test / Evaluación", "Tutorial / Guía paso a paso", "Herramienta de creación", "Presentación / Infografía interactiva", "Asistente / Tutor con IA", "Colección / Repositorio / Biblioteca", "Visualización de datos / Mapa interactivo", "Otro"].
        5.  "nivelEducativo": Un array con uno o más niveles de esta lista: ["Infantil", "Primaria", "Secundaria", "Bachillerato", "Formación Profesional", "Universidad", "Formación para Adultos / Autoaprendizaje", "Formación del profesorado"].
        6.  "areaConocimiento": Un array con una o más áreas de esta lista: ["Ciencia y Tecnología", "Pensamiento Lógico-Matemático", "Lenguaje y Comunicación", "Ciencias Sociales y Cívicas", "Artes y Humanidades", "Desarrollo Personal y Social", "Recursos para la docencia y la organización", "Idiomas"].

        Responde únicamente con el objeto JSON. No incluyas texto adicional.`;
        
        const schema = {
            type: "OBJECT", properties: { "titulo": { "type": "STRING" }, "descripcion": { "type": "STRING" }, "palabrasClave": { "type": "STRING" }, "tipoRecurso": { "type": "ARRAY", "items": { "type": "STRING" }}, "nivelEducativo": { "type": "ARRAY", "items": { "type": "STRING" }}, "areaConocimiento": { "type": "ARRAY", "items": { "type": "STRING" }} },
            required: ["titulo", "descripcion", "palabrasClave", "tipoRecurso", "nivelEducativo", "areaConocimiento"]
        };
        
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", responseSchema: schema }};
        const apiKey = ""; // IMPORTANTE: Pon tu API Key aquí
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

        if (!response.ok) throw new Error(`Error de la API [${response.status}]: ${await response.text()}`);

        const result = await response.json();
        
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            const aiContent = JSON.parse(result.candidates[0].content.parts[0].text);
            updateStatus(translations[currentLang].statusSuccess, 'success');
            const formUrl = buildGoogleFormUrl(aiContent, urlToAnalyze, author, platform);
            openFormLink.href = formUrl;
            resultArea.classList.remove('hidden');
        } else {
            throw new Error("La IA no devolvió un resultado válido.");
        }

    } catch (error) {
        console.error('Error en el proceso:', error);
        updateStatus(translations[currentLang].errorGeneric.replace('{message}', error.message), 'error');
    } finally {
        setLoadingState(false);
    }
}

// --- FUNCIONES AUXILIARES ---
function buildGoogleFormUrl(aiData, appUrl, authorName, platform) {
    const baseUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_CONFIG.formId}/viewform?usp=pp_url`;
    const params = new URLSearchParams();
    
    params.append(GOOGLE_FORM_CONFIG.fieldIds.titulo, aiData.titulo || '');
    params.append(GOOGLE_FORM_CONFIG.fieldIds.descripcion, aiData.descripcion || '');
    params.append(GOOGLE_FORM_CONFIG.fieldIds.palabrasClave, aiData.palabrasClave || '');
    params.append(GOOGLE_FORM_CONFIG.fieldIds.url, appUrl || '');
    params.append(GOOGLE_FORM_CONFIG.fieldIds.autor, authorName || '');
    params.append(GOOGLE_FORM_CONFIG.fieldIds.plataforma, platform || '');
    
    aiData.tipoRecurso?.forEach(item => params.append(GOOGLE_FORM_CONFIG.fieldIds.tipoRecurso, item));
    aiData.nivelEducativo?.forEach(item => params.append(GOOGLE_FORM_CONFIG.fieldIds.nivelEducativo, item));
    aiData.areaConocimiento?.forEach(item => params.append(GOOGLE_FORM_CONFIG.fieldIds.areaConocimiento, item));

    return `${baseUrl}&${params.toString()}`;
}

function updateStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = 'text-gray-600'; // Reset classes
    switch(type) {
        case 'success': statusMessage.classList.add('text-green-500'); break;
        case 'error': statusMessage.classList.add('text-red-500'); break;
        default: statusMessage.classList.add('dark:text-gray-400'); break;
    }
}

function setLoadingState(isLoading) {
    submitButton.disabled = isLoading;
    const spinner = submitButton.querySelector('.spinner');
    const buttonText = submitButton.querySelector('span');
    const buttonTextKey = isLoading ? 'analyzingButton' : 'analyzeButton';
    
    if (isLoading && !spinner) {
        const newSpinner = document.createElement('div');
        newSpinner.className = 'spinner';
        submitButton.prepend(newSpinner);
    } else if (!isLoading && spinner) {
        spinner.remove();
    }
    
    if (buttonText) {
        buttonText.textContent = translations[currentLang][buttonTextKey];
    }
}

// --- EVENT LISTENERS E INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    // Restaurar preferencias del usuario
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        toggleTheme();
    }

    const savedLang = localStorage.getItem('language') || 'es';
    setLanguage(savedLang);

    const savedAuthor = localStorage.getItem('authorName');
    if (savedAuthor) authorInput.value = savedAuthor;
    
    const savedPlatform = localStorage.getItem('creationPlatform');
    if (savedPlatform) platformSelect.value = savedPlatform;

    // Inicializar estado de la UI
    setAnalysisMode('text');

    // Asignar eventos
    form.addEventListener('submit', handleFormSubmit);
    modeUrlBtn.addEventListener('click', () => setAnalysisMode('url'));
    modeTextBtn.addEventListener('click', () => setAnalysisMode('text'));
    themeToggle.addEventListener('click', toggleTheme);
    langEsBtn.addEventListener('click', () => setLanguage('es'));
    langEnBtn.addEventListener('click', () => setLanguage('en'));
    authorInput.addEventListener('input', () => localStorage.setItem('authorName', authorInput.value));
    platformSelect.addEventListener('change', () => localStorage.setItem('creationPlatform', platformSelect.value));

});


