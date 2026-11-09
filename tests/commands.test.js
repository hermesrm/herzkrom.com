import { aliasRegistry } from "../js/aliases.js";
import { fileSystem } from "../js/filesystem.js";
import { resolveAlias, tokenize, executeInput } from "../js/parser.js";
import { lsCommand } from "../js/commands/ls.js";
import { cdCommand } from "../js/commands/cd.js";
import { catCommand } from "../js/commands/cat.js";
import { clearCommand } from "../js/commands/clear.js";
import { helpCommand } from "../js/commands/help.js";
import { historyCommand } from "../js/commands/history.js";
import { languageCommand } from "../js/commands/idioma.js";
import { pdfCommand } from "../js/commands/pdf.js";
import { pwdCommand } from "../js/commands/pwd.js";
import { rebootCommand } from "../js/commands/reboot.js";
import { saveUsername, getSavedUsername, clearSavedUsername } from "../js/storage.js";
import { whoamiCommand } from "../js/commands/whoami.js";
import { updateDocumentLanguage } from "../js/accessibility.js";
import { getCompletions, applyCompletion, getCommonPrefix } from "../js/autocomplete.js";
import { appendCommandHistory } from "../js/output.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

function createContext(lang = "es") {
  return {
    cwd: [],
    lang,
    history: [],
    historyIndex: null,
    visitor: { name: null },
    fs: fileSystem,
  };
}

export function runCommandTests(test) {
  test("output: command history stays within the node limit", () => {
    const documentRef = {
      createElement() {
        return {
          children: [],
          appendChild(child) {
            this.children.push(child);
          },
        };
      },
    };
    const output = {
      childNodes: [],
      appendChild(node) {
        this.childNodes.push(node);
      },
      removeChild(node) {
        const index = this.childNodes.indexOf(node);
        this.childNodes.splice(index, 1);
      },
      get firstChild() {
        return this.childNodes[0];
      },
    };

    appendCommandHistory(output, documentRef, "guest@herzkrom.com", "~", "cd cv", 4);
    appendCommandHistory(output, documentRef, "guest@herzkrom.com", "~/cv", "cd skills", 4);
    appendCommandHistory(output, documentRef, "guest@herzkrom.com", "~/cv/skills", "cd ..", 4);

    assert(output.childNodes.length === 4, "Expected output to stay within the configured limit");
    assert(
      output.childNodes[3].children[1].textContent === " cd ..",
      "Expected the latest command to remain visible"
    );
  });

  test("autocomplete: completes commands, aliases, and translated paths", () => {
    const context = createContext("es");
    const commands = [lsCommand, cdCommand, catCommand];
    const commandMatches = getCompletions("c", context, commands);
    const aliasMatches = getCompletions("ac", context, commands);
    const pathMatches = getCompletions("cd /cv/educacion", context, commands);
    context.cwd = ["cv"];
    const currentDirectoryMatches = getCompletions("cd ", context, commands);

    assert(commandMatches.includes("cat"), "Expected cat command completion");
    assert(commandMatches.includes("cd"), "Expected cd command completion");
    assert(aliasMatches.includes("acerca"), "Expected Spanish alias completion");
    assert(pathMatches.includes("/cv/educación"), "Expected accent-insensitive path completion");
    assert(
      currentDirectoryMatches.includes("acerca"),
      "Expected cd followed by a space to suggest current directory entries"
    );
    assert(
      !currentDirectoryMatches.includes("cd"),
      "Expected cd followed by a space not to suggest the command again"
    );
    assert(
      applyCompletion("cd ", "acerca") === "cd acerca",
      "Expected applying a path completion to preserve cd"
    );
    assert(
      applyCompletion("cd /cv/educ", "/cv/educación") === "cd /cv/educación",
      "Expected completion to preserve the command"
    );
    assert(getCommonPrefix(["cat", "clear"]) === "c", "Expected common prefix");
  });

  test("accessibility: labels follow the active language", () => {
    const elements = new Map(
      ["terminal", "hidden-input"].map((id) => [
        id,
        {
          attributes: {},
          setAttribute(name, value) {
            this.attributes[name] = value;
          },
        },
      ])
    );
    const documentRef = {
      documentElement: { lang: "" },
      getElementById(id) {
        return elements.get(id);
      },
    };

    updateDocumentLanguage("en", documentRef);
    assert(documentRef.documentElement.lang === "en", "Expected document language to be English");
    assert(
      elements.get("terminal").attributes["aria-label"] === "Interactive terminal",
      "Expected terminal label in English"
    );
    assert(
      elements.get("hidden-input").attributes["aria-label"] === "Command input",
      "Expected input label in English"
    );

    updateDocumentLanguage("es", documentRef);
    assert(documentRef.documentElement.lang === "es", "Expected document language to be Spanish");
    assert(
      elements.get("terminal").attributes["aria-label"] === "Terminal interactiva",
      "Expected terminal label in Spanish"
    );
    assert(
      elements.get("hidden-input").attributes["aria-label"] === "Entrada de comandos",
      "Expected input label in Spanish"
    );
  });

  test("commands: help describes available behavior in both languages", () => {
    const commands = [
      lsCommand,
      cdCommand,
      catCommand,
      clearCommand,
      historyCommand,
      pdfCommand,
      pwdCommand,
      rebootCommand,
      whoamiCommand,
    ];

    for (const lang of ["es", "en"]) {
      for (const command of commands) {
        const result = command.execute(createContext(lang), ["--help"]);
        assert(result?.code === 0, `Expected ${command.id} help to succeed in ${lang}`);
        assert(
          !/por implementar|to be implemented/i.test(result.output),
          `Expected ${command.id} help to omit placeholders in ${lang}`
        );
      }
    }

    const lsHelp = lsCommand.execute(createContext("es"), ["--help"]);
    assert(lsHelp.output.includes("-l"), "Expected ls help to document the -l option");
  });

  test("storage: blocked persistence does not break the session", () => {
    const blockedStorage = {
      getItem() {
        throw new Error("Storage access denied");
      },
      setItem() {
        throw new Error("Storage access denied");
      },
      removeItem() {
        throw new Error("Storage access denied");
      },
    };

    assert(
      JSON.stringify(getSavedUsername(blockedStorage)) ===
        JSON.stringify({ prompt: null, display: null }),
      "Expected blocked reads to return an empty saved username"
    );
    saveUsername("guest", "Guest", blockedStorage);
    clearSavedUsername(blockedStorage);
  });

  test("storage: inaccessible localStorage property does not break the session", () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() {
        throw new Error("Storage access denied");
      },
    });

    try {
      assert(
        getSavedUsername().prompt === null,
        "Expected inaccessible storage to return an empty saved username"
      );
      saveUsername("guest", "Guest");
      clearSavedUsername();
    } finally {
      if (descriptor) {
        Object.defineProperty(globalThis, "localStorage", descriptor);
      } else {
        delete globalThis.localStorage;
      }
    }
  });

  test("storage: username is saved and cleared", () => {
    const values = new Map();
    const storage = {
      getItem(key) {
        return values.get(key) || null;
      },
      setItem(key, value) {
        values.set(key, value);
      },
      removeItem(key) {
        values.delete(key);
      },
    };

    saveUsername("ana", "Ana", storage);
    const saved = getSavedUsername(storage);
    assert(saved.prompt === "ana", "Expected prompt username to be saved");
    assert(saved.display === "Ana", "Expected display username to be saved");

    clearSavedUsername(storage);
    assert(getSavedUsername(storage).prompt === null, "Expected username to be cleared");
  });

  test("tokenize: command and args", () => {
    const result = tokenize("cat /cv/about");
    assert(result.command === "cat", "Expected command 'cat'");
    assert(result.args.length === 1, "Expected one arg");
    assert(result.args[0] === "/cv/about", "Expected /cv/about");
  });

  test("resolveAlias: Spanish alias", () => {
    const result = resolveAlias("acerca", "es");
    assert(result === aliasRegistry.es.acerca, "Expected alias expansion");
  });

  test("ls: root lists cv", () => {
    const context = createContext("es");
    const output = lsCommand.execute(context, []);
    assert(output.includes("cv"), "Expected 'cv' in ls output");
  });

  test("cd: supports translated path segments", () => {
    const context = createContext("es");
    const output = cdCommand.execute(context, ["/cv/educación"]);
    assert(output === "", "Expected cd to succeed");
    assert(context.cwd.join("/") === "cv/education", "Expected cwd to be /cv/education");
  });

  test("cd: current directory reference", () => {
    const context = createContext("es");
    context.cwd = ["cv"];
    const output = cdCommand.execute(context, ["."]);
    assert(output === "", "Expected cd . to succeed");
    assert(context.cwd.join("/") === "cv", "Expected cwd to remain /cv");
  });

  test("cat: returns animated content for section", () => {
    const context = createContext("es");
    const output = catCommand.execute(context, ["/cv/skills"]);
    assert(output && output.type === "animated", "Expected animated output");
    assert(output.text.includes("Microsoft 365"), "Expected skills content");
  });

  test("cat: resolves dot segments in relative paths", () => {
    const context = createContext("es");
    context.cwd = ["cv"];

    const currentDirectoryOutput = catCommand.execute(context, ["./about"]);
    const parentDirectoryOutput = catCommand.execute(context, ["../cv/about"]);

    assert(
      currentDirectoryOutput?.type === "animated",
      "Expected ./about to resolve from the current directory"
    );
    assert(
      parentDirectoryOutput?.type === "animated",
      "Expected ../cv/about to resolve from the parent directory"
    );
  });

  test("help: returns structured help", () => {
    const context = createContext("en");
    const output = helpCommand.execute(
      context,
      [],
      [lsCommand, cdCommand, catCommand, helpCommand, languageCommand]
    );
    assert(output && output.type === "help", "Expected help object");
    assert(Array.isArray(output.primary), "Expected primary list");
  });

  test("executeInput: unknown command", () => {
    const context = createContext("en");
    const output = executeInput("nope", context, [lsCommand]);
    assert(output.includes("Command not found"), "Expected command not found message");
  });

  test("executeInput: registered command takes precedence over alias", () => {
    const context = createContext("es");
    const output = executeInput("pdf", context, [pdfCommand, catCommand]);
    assert(typeof output === "string", "Expected the pdf command to run directly");
    assert(output.includes("no está disponible"), "Expected PDF availability status");
  });

  test("executeInput: feature aliases still resolve", () => {
    const context = createContext("es");
    const output = executeInput("acerca", context, [catCommand]);
    assert(output?.type === "animated", "Expected the about alias to resolve to cat");
  });
}
