# Herzkrom — Consola interactiva

## Español

### Resumen

Este es mi espacio personal en formato de terminal web. Incluye un perfil breve, enlaces de contacto y herramientas interactivas. Puedes explorarlo con comandos como `help`, `ls` y `cat`, en español o en inglés. Los comandos son una simulación: no ejecutan procesos ni comandos del sistema en tu equipo.

### Ejecución local

La aplicación es estática y no necesita compilarse. Para probarla en tu equipo, inicia un servidor HTTP desde la raíz del repositorio:

```sh
python3 -m http.server 8000
```

Abre `http://localhost:8000` en el navegador. No abras `index.html` directamente como archivo: el navegador necesita cargar los módulos ES a través de HTTP.

Al entrar, puedes escribir un nombre o pulsar `Enter` para continuar como `guest`. Después, escribe un comando y pulsa `Enter`; `help` muestra las opciones disponibles.

### Accesibilidad y comportamiento

- La salida usa `role="log"` y `aria-live="polite"`; las sugerencias de Tab también se anuncian.
- Las etiquetas accesibles y el idioma del documento cambian junto con el idioma de la sesión.
- Si el sistema prefiere menos movimiento, se desactivan el parpadeo del cursor y el scroll suave.
- La entrada visualmente oculta permite escribir con teclado, también en móvil.

### Estructura del proyecto

- `index.html` — punto de entrada de la app
- `css/terminal.css` — estilos de la terminal
- `js/` — código JS modular
  - `main.js` — inicialización, interfaz, entrada y teclado
  - `locales.js` — idiomas soportados, detección y fallback
  - `ui-text.js` — mensajes de bienvenida e interfaz
  - `context.js` — estado de sesión y resolución de rutas virtuales
  - `filesystem.js` — contenido virtual del perfil y contacto (multilenguaje)
  - `parser.js` — tokenización, alias y despacho de comandos
  - `aliases.js` — alias semánticos por idioma
  - `autocomplete.js` — sugerencias de comandos, alias y rutas
  - `accessibility.js` — idioma del documento y etiquetas accesibles
  - `storage.js` — persistencia opcional del nombre
  - `output.js` — renderizado del historial y límite de nodos
  - `commands/index.js` — registro único de comandos
  - `commands/` — implementación y metadatos de ayuda de los comandos
  - `tests/` — pruebas de comandos, rutas, accesibilidad y utilidades

### Comandos principales

- `help` — Muestra la ayuda general; `help <comando>` da detalles y `help --help` explica el propio comando.
- `ls` — Lista el contenido del directorio actual (`ls -l` para modo largo).
- `cd [ruta]` — Cambia de directorio; sin ruta vuelve a `/`. Acepta rutas relativas y absolutas, incluyendo `.` y `..`.
- `cat <archivo|sección>` — Muestra contenido multilenguaje; acepta rutas relativas y absolutas, incluyendo `.` y `..`.
- `idioma <es|en>` / `language <es|en>` — Cambia el idioma de la sesión.
- `pwd` — Muestra la ruta actual.
- `clear` — Limpia la salida de la terminal.
- `echo <texto>` — Muestra texto simple.
- `history` — Muestra historial de comandos.
- `perfil` / `profile` — Muestra una presentación breve y enlaces a GitHub y LinkedIn.
- `contacto` / `contact` — Muestra el correo de contacto.
- `github` / `linkedin` — Abre los perfiles externos.
- `calc` — Evalúa expresiones aritméticas y científicas.
- `reboot` — Reinicia la sesión simulada.

### Autocompletado (Tab)

- Pulsa Tab para completar comandos y alias según el idioma activo.
- Después de `cd` o `cat`, Tab sugiere rutas del directorio actual.
- Las coincidencias no distinguen mayúsculas ni acentos al completar rutas.

### Notas para desarrolladores

- El idioma inicial se detecta en el navegador: las variantes `es-*` usan español y el resto inglés. Inglés solo es fallback para idiomas no soportados; cambiar el idioma manualmente afecta a la sesión actual.
- Para añadir un comando, crea un archivo en `js/commands/` que exporte `{ id, aliases, description, help, execute(context,args,registry) }` y regístralo en `commands/index.js`. La ayuda se genera desde sus metadatos `help.section` y `help.order`.
- Para añadir un idioma, inclúyelo en `locales.js` y completa los catálogos de UI, aliases, rutas, accesibilidad, comandos, errores de calculadora y contenido del filesystem. `npm test` comprueba la cobertura de todos los idiomas soportados.
- `SessionContext` (`context.js`) guarda el estado de la sesión. `storage.js` recuerda el nombre con `localStorage` cuando está disponible; si el navegador lo bloquea, la aplicación sigue funcionando sin guardarlo.
- `aliases.js` define en un mismo lugar los aliases de navegación, sus descripciones y su orden en la ayuda. `parser.js` los resuelve antes de ejecutar cada comando.
- `filesystem.js` contiene únicamente el perfil breve y los datos de contacto en español e inglés.
- `autocomplete.js` calcula las sugerencias. `main.js` gestiona Tab y el ciclo entre ellas.
- La interfaz inserta texto con `textContent` y limita la salida a 600 nodos y el historial a 200 comandos.
- `output.js` dibuja el prompt y aplica el límite de salida.
- En `localhost`, puedes añadir `?debug-input` para ver eventos de teclado en la salida y en la consola. Las trazas incluyen el texto escrito; no lo uses al introducir datos reales. Esta opción no se activa en el dominio público.

### Desarrollo y pruebas

Para ejecutar las pruebas y el lint, instala primero las dependencias desde la raíz del repositorio:

```sh
npm ci
npm test
npm run lint
```

`npm run format` ejecuta Prettier y modifica los archivos que lo necesiten; revisa el diff después de usarlo.

---

## English

### Summary

This is my personal space in the form of a web terminal. It includes a short profile, contact links, and interactive tools. Explore it with commands such as `help`, `ls` and `cat`, in either Spanish or English. The commands are simulated; they do not run shell commands or processes on your computer.

### Run locally

The app is static and needs no build step. To try it locally, start an HTTP server from the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser. Do not open `index.html` directly as a file; the browser needs to load the ES modules over HTTP.

Enter a name when prompted, or press `Enter` to continue as `guest`. Then type a command and press `Enter`; `help` lists the available commands.

### Accessibility and behavior

- Output uses `role="log"` and `aria-live="polite"`; Tab suggestions are announced as well.
- Accessible labels and the document language update with the session language.
- Cursor blinking and smooth scrolling are disabled when reduced motion is preferred.
- A visually hidden input handles keyboard input, including on mobile.

### Project structure

- `index.html` — application entry point
- `css/terminal.css` — terminal styles
- `js/` — modular JS code
  - `main.js` — initialization, UI, input and keyboard flow
  - `locales.js` — supported languages, detection and fallback
  - `ui-text.js` — welcome and interface messages
  - `context.js` — session state and virtual path resolution
  - `filesystem.js` — virtual profile and contact content (multilanguage)
  - `parser.js` — tokenization, alias resolution and command dispatch
  - `aliases.js` — semantic aliases by language
  - `autocomplete.js` — command, alias and path suggestions
  - `accessibility.js` — document language and accessible labels
  - `storage.js` — optional username persistence
  - `output.js` — command history rendering and node limit
  - `commands/index.js` — single command registry
  - `commands/` — command implementations
  - `tests/` — command, path, accessibility and utility tests

### Main commands

- `help` — Shows general help; `help <command>` gives details and `help --help` explains the command itself.
- `ls` — List directory contents (`ls -l` for long format).
- `cd [path]` — Change directory; with no path, returns to `/`. Supports relative and absolute paths, including `.` and `..`.
- `cat <file|section>` — Show multilingual content; supports relative and absolute paths, including `.` and `..`.
- `idioma <es|en>` / `language <es|en>` — Change the current session language.
- `pwd` — Print working directory.
- `clear` — Clear the terminal output.
- `echo <text>` — Print plain text.
- `history` — Show command history.
- `profile` / `perfil` — Shows a short introduction and GitHub and LinkedIn links.
- `contact` / `contacto` — Shows the contact email.
- `github` / `linkedin` — Opens the external profiles.
- `calc` — Evaluates arithmetic and scientific expressions.
- `reboot` — Reset the simulated session.

### Autocomplete (Tab)

- Press Tab to complete commands and aliases for the active language.
- After `cd` or `cat`, Tab suggests paths from the current directory.
- Path completion ignores letter case and accents.

### Developer notes

- The initial language is detected from the browser: `es-*` variants use Spanish and all others use English. English is only the fallback for unsupported languages; a manual language change applies to the current session.
- To add a command, create a file in `js/commands/` exporting `{ id, aliases, description, help, execute(context,args,registry) }` and register it in `commands/index.js`. Help is generated from its `help.section` and `help.order` metadata.
- To add a language, include it in `locales.js` and complete the UI, aliases, paths, accessibility, command, calculator-error and filesystem-content catalogs. `npm test` checks catalog coverage for all supported languages.
- `SessionContext` (`context.js`) holds live session state. `storage.js` remembers the username in `localStorage` when available; the app still works if the browser blocks storage.
- `aliases.js` keeps navigation aliases, their descriptions and help order together. `parser.js` resolves them before running a command.
- `filesystem.js` holds only the short profile and contact details in Spanish and English.
- `autocomplete.js` calculates suggestions. `main.js` handles Tab and cycles through them.
- The UI inserts text with `textContent` and caps output at 600 nodes and history at 200 commands.
- `output.js` renders the prompt and enforces the output limit.
- On `localhost`, add `?debug-input` to log keyboard events to the output and browser console. The logs include typed text, so do not use it with real data. This option is disabled on the public domain.

### Development and tests

To run tests and lint, first install the development dependencies from the repository root:

```sh
npm ci
npm test
npm run lint
```

`npm run format` runs Prettier and rewrites files that need formatting; review the diff afterward.
