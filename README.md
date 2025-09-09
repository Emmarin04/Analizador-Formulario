# Analizador-Formulario
¡Por supuesto! Un buen archivo `README.md` es fundamental para cualquier proyecto en GitHub. Explica qué es, para qué sirve y cómo configurarlo.

Aquí tienes un `README.md` completo y bien estructurado, escrito en formato Markdown. Simplemente puedes copiar y pegar este contenido en un nuevo archivo llamado `README.md` dentro de tu repositorio de GitHub.

---

# Analizador de Aplicaciones Educativas con IA

Una herramienta web para pre-rellenar un formulario de Google Forms mediante el análisis de contenido con la API de Gemini.

[![Licencia: GPL v3](https://img.shields.io/badge/Licencia-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## 📝 Descripción del Proyecto

Este proyecto es una página web independiente diseñada para simplificar el proceso de añadir nuevas aplicaciones a un repositorio educativo. En lugar de rellenar manualmente un largo formulario de Google Forms, esta herramienta permite al usuario proporcionar una URL o una descripción de su aplicación. Un modelo de IA (Gemini de Google) analiza el contenido y extrae automáticamente la información relevante para rellenar los campos del formulario.

El objetivo principal es agilizar las contribuciones de la comunidad, reduciendo la fricción y el tiempo necesario para registrar una nueva herramienta educativa.

## 🚀 Características Principales

*   **Análisis Dual**: Capaz de procesar tanto una URL pública como un texto plano (descripción o código fuente).
*   **Extracción de Datos con IA**: Identifica y extrae automáticamente:
    *   Título de la aplicación.
    *   Descripción educativa concisa.
    *   Palabras clave relevantes.
    *   Tipo de recurso (Juego, Simulador, Test, etc.).
    *   Niveles educativos adecuados.
    *   Áreas de conocimiento cubiertas.
*   **Integración con Google Forms**: Construye dinámicamente una URL de pre-llenado (`usp=pp_url`) para que el usuario solo tenga que revisar y enviar el formulario.
*   **Autocompletado Inteligente**: Detecta la plataforma de creación (ej. Netlify, Replit) a partir de la URL para preseleccionar una opción.
*   **Interfaz Sencilla**: Una interfaz de usuario limpia y directa construida con Tailwind CSS.
*   **Persistencia Local**: Guarda el nombre del autor y la plataforma seleccionada en el almacenamiento local del navegador para futuras visitas.

## ⚙️ Cómo Funciona

1.  El usuario introduce su nombre, selecciona la plataforma y proporciona la URL o la descripción de su aplicación.
2.  El JavaScript del lado del cliente construye un *prompt* detallado solicitando a la IA que analice el contenido y devuelva una estructura JSON específica.
3.  Se realiza una petición `fetch` a la API de Google Gemini, enviando el *prompt* y la clave API.
4.  La IA procesa la solicitud y devuelve un objeto JSON con los datos extraídos (`titulo`, `descripcion`, `palabrasClave`, etc.).
5.  El script recibe la respuesta JSON y construye una URL para el Google Form, añadiendo cada dato extraído como un parámetro para el campo correspondiente.
6.  Finalmente, se muestra al usuario un botón para abrir esta nueva URL en una pestaña nueva, presentando el formulario ya completado.

## 🛠️ Configuración

Para utilizar este proyecto, necesitas configurar tres partes principales dentro del archivo HTML.

### 1. Configurar el Google Form

Primero, debes obtener los identificadores de tu formulario y de cada una de tus preguntas.

1.  **ID del Formulario**: Es la cadena larga de caracteres en la URL de tu formulario.
    `https://docs.google.com/forms/d/e/AQUI_VA_EL_ID_DEL_FORMULARIO/viewform`
2.  **ID de las Preguntas (`entry.xxxxx`)**:
    *   Abre tu formulario como si fueras a rellenarlo.
    *   Haz clic derecho en el campo de una pregunta y selecciona "Inspeccionar". Busca el atributo `name` del elemento `<input>` o `<textarea>`, que será algo como `entry.1234567890`.
    *   Repite este proceso para cada campo que quieras rellenar.

Luego, actualiza el objeto `GOOGLE_FORM_CONFIG` en el código JavaScript:

```javascript
const GOOGLE_FORM_CONFIG = {
    formId: "AQUI_VA_EL_ID_DEL_FORMULARIO",
    fieldIds: {
        autor: "entry.2027879855",
        titulo: "entry.1936764678",
        url: "entry.927393209",
        // ... y así con todos los demás campos
    }
};```

### 2. Obtener una Clave API de Gemini

Esta herramienta requiere una clave API de Google AI para funcionar.

1.  Ve a [Google AI Studio](https://aistudio.google.com/).
2.  Haz clic en **"Get API key"** y crea una nueva clave.
3.  Copia la clave generada.

Abre el archivo HTML y pega tu clave en la siguiente línea:

```javascript
const apiKey = "AQUÍ_VA_TU_CLAVE_API_DE_GEMINI";
```

### 3. Publicar la Página Web

Sube el archivo HTML a un servicio de alojamiento estático para obtener una URL pública. Algunas opciones gratuitas son:
*   **GitHub Pages**
*   **Netlify**
*   **Vercel**

Una vez publicado, usa la URL de la página para enlazarla desde tu Google Form.

## 💻 Pila Tecnológica

*   **HTML5**
*   **Tailwind CSS** (vía CDN)
*   **JavaScript Moderno** (ES Modules)
*   **Google Gemini API**

## 📄 Licencia

Este proyecto está distribuido bajo la Licencia GPL v3. Esto significa que eres libre de usar, modificar y distribuir el código, siempre y cuando cualquier trabajo derivado también sea de código abierto y se distribuya bajo la misma licencia.

---
*Desarrollado en el contexto de la comunidad [Vibe Coding Educativo](https://t.me/vceduca).*
