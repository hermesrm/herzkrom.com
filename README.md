# Herzkrom — CV interactivo

## Español

### Resumen

Este es mi currículum en formato de terminal web. Puedes recorrer mi perfil con comandos como `help`, `ls` y `cat`, en español o en inglés. Los comandos son una simulación: no ejecutan procesos ni comandos del sistema en tu equipo.

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
  - `context.js` — estado de sesión y resolución de rutas virtuales
  - `filesystem.js` — estructura virtual del CV (multilenguaje)
  - `parser.js` — tokenización, alias y despacho de comandos
  - `aliases.js` — alias semánticos por idioma
  - `autocomplete.js` — sugerencias de comandos, alias y rutas
  - `accessibility.js` — idioma del documento y etiquetas accesibles
  - `storage.js` — persistencia opcional del nombre
  - `output.js` — renderizado del historial y límite de nodos
  - `commands/` — implementación de los comandos
  - `tests/` — pruebas de comandos, rutas, accesibilidad y utilidades

### Comandos principales

- `help` — Muestra la ayuda general; `help <comando>` da detalles y `help --help` explica el propio comando.
- `ls` — Lista el contenido del directorio actual (`ls -l` para modo largo).
- `cd [ruta]` — Cambia de directorio; sin ruta vuelve a `/`. Acepta rutas relativas y absolutas, incluyendo `.` y `..`.
- `cat <archivo|sección>` — Muestra contenido multilenguaje; acepta rutas relativas y absolutas, incluyendo `.` y `..`.
- `idioma <es|en>` — Muestra o cambia el idioma cuando la sesión está en español; en inglés se usa `language <es|en>`.
- `pwd` — Muestra la ruta actual.
- `clear` — Limpia la salida de la terminal.
- `echo <texto>` — Muestra texto simple.
- `history` — Muestra historial de comandos.
- `pdf` — Informa que todavía no hay un CV en PDF disponible.
- `reboot` — Reinicia la sesión simulada.

### Autocompletado (Tab)

- Pulsa Tab para completar comandos y alias según el idioma activo.
- Después de `cd` o `cat`, Tab sugiere rutas del directorio actual.
- Las coincidencias no distinguen mayúsculas ni acentos; por ejemplo, `educacion` encuentra `educación`.

### Notas para desarrolladores

- Para añadir un comando, crea un archivo en `js/commands/` que exporte `{ id, aliases, description, execute(context,args,registry) }`, regístralo en `main.js` y añade pruebas.
- `SessionContext` (`context.js`) guarda el estado de la sesión. `storage.js` recuerda el nombre con `localStorage` cuando está disponible; si el navegador lo bloquea, la aplicación sigue funcionando sin guardarlo.
- `aliases.js` reúne los alias en español e inglés. `parser.js` los resuelve antes de ejecutar cada comando.
- `filesystem.js` contiene el CV; cada sección guarda su texto en español e inglés.
- `autocomplete.js` calcula las sugerencias. `main.js` gestiona Tab y el ciclo entre ellas.
- La interfaz inserta texto con `textContent` y limita la salida a 600 nodos y el historial a 200 comandos.
- `output.js` dibuja el prompt y aplica el límite de salida.

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

This is my résumé in the form of a web terminal. Explore my profile with commands such as `help`, `ls` and `cat`, in either Spanish or English. The commands are simulated; they do not run shell commands or processes on your computer.

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
  - `context.js` — session state and virtual path resolution
  - `filesystem.js` — virtual CV structure (multilanguage)
  - `parser.js` — tokenization, alias resolution and command dispatch
  - `aliases.js` — semantic aliases by language
  - `autocomplete.js` — command, alias and path suggestions
  - `accessibility.js` — document language and accessible labels
  - `storage.js` — optional username persistence
  - `output.js` — command history rendering and node limit
  - `commands/` — command implementations
  - `tests/` — command, path, accessibility and utility tests

### Main commands

- `help` — Shows general help; `help <command>` gives details and `help --help` explains the command itself.
- `ls` — List directory contents (`ls -l` for long format).
- `cd [path]` — Change directory; with no path, returns to `/`. Supports relative and absolute paths, including `.` and `..`.
- `cat <file|section>` — Show multilingual content; supports relative and absolute paths, including `.` and `..`.
- `idioma <es|en>` — Show or change the language in Spanish sessions; English sessions use `language <es|en>`.
- `pwd` — Print working directory.
- `clear` — Clear the terminal output.
- `echo <text>` — Print plain text.
- `history` — Show command history.
- `pdf` — Reports that there is no PDF résumé available yet.
- `reboot` — Reset the simulated session.

### Autocomplete (Tab)

- Press Tab to complete commands and aliases for the active language.
- After `cd` or `cat`, Tab suggests paths from the current directory.
- Matching ignores letter case and accents; for example, `educacion` finds `educación`.

### Developer notes

- To add a command, create a file in `js/commands/` exporting `{ id, aliases, description, execute(context,args,registry) }`, register it in `main.js`, and add tests.
- `SessionContext` (`context.js`) holds live session state. `storage.js` remembers the username in `localStorage` when available; the app still works if the browser blocks storage.
- `aliases.js` contains the Spanish and English aliases. `parser.js` resolves them before running a command.
- `filesystem.js` holds the CV; each section stores its text in Spanish and English.
- `autocomplete.js` calculates suggestions. `main.js` handles Tab and cycles through them.
- The UI inserts text with `textContent` and caps output at 600 nodes and history at 200 commands.
- `output.js` renders the prompt and enforces the output limit.

### Development and tests

To run tests and lint, first install the development dependencies from the repository root:

```sh
npm ci
npm test
npm run lint
```

`npm run format` runs Prettier and rewrites files that need formatting; review the diff afterward.
