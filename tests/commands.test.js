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
import { pwdCommand } from "../js/commands/pwd.js";
import { rebootCommand } from "../js/commands/reboot.js";
import { saveUsername, getSavedUsername, clearSavedUsername } from "../js/storage.js";
import { whoamiCommand } from "../js/commands/whoami.js";
import { updateDocumentLanguage } from "../js/accessibility.js";
import { getCompletions, applyCompletion, getCommonPrefix } from "../js/autocomplete.js";
import { appendCommandHistory, appendTextWithSafeLinks } from "../js/output.js";
import { isInputDebugEnabled } from "../js/debug.js";
import { calcCommand } from "../js/commands/calc.js";
import { profileLinkCommands } from "../js/commands/profile-links.js";

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
  test("debug input: enabled only on localhost", () => {
    assert(
      isInputDebugEnabled({ hostname: "localhost", hash: "", search: "?debug-input" }),
      "Expected debug input to be available on localhost"
    );
    assert(
      isInputDebugEnabled({ hostname: "127.0.0.1", hash: "#debug-input", search: "" }),
      "Expected debug input to be available on IPv4 loopback"
    );
    assert(
      !isInputDebugEnabled({ hostname: "herzkrom.com", hash: "#debug-input", search: "" }),
      "Expected debug input to be disabled on the public domain"
    );
    assert(
      !isInputDebugEnabled({ hostname: "localhost", hash: "", search: "" }),
      "Expected debug input to require an explicit flag"
    );
  });

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

    appendCommandHistory(output, documentRef, "guest@herzkrom.com", "~", "cd profile", 4);
    appendCommandHistory(output, documentRef, "guest@herzkrom.com", "~/profile", "cd contact", 4);
    appendCommandHistory(output, documentRef, "guest@herzkrom.com", "~/profile/contact", "cd ..", 4);

    assert(output.childNodes.length === 4, "Expected output to stay within the configured limit");
    assert(
      output.childNodes[3].children[1].textContent === " cd ..",
      "Expected the latest command to remain visible"
    );
  });

  test("output: only approved profile URLs become clickable links", () => {
    const documentRef = {
      createTextNode(text) {
        return { kind: "text", textContent: text };
      },
      createElement(tag) {
        return { kind: tag };
      },
    };
    const container = {
      children: [],
      appendChild(node) {
        this.children.push(node);
      },
    };

    appendTextWithSafeLinks(
      container,
      "[GitHub](https://github.com/hermesrm) [Email](mailto:contacto@herzkrom.com) [untrusted](javascript:alert(1))",
      documentRef
    );

    const links = container.children.filter((child) => child.kind === "a");
    assert(links.length === 2, "Expected only approved profile and email links to be clickable");
    assert(links[0].href === "https://github.com/hermesrm", "Expected approved GitHub URL");
    assert(links[0].target === "_blank", "Expected links to open in a new tab");
    assert(links[0].rel === "noopener noreferrer", "Expected safe external link attributes");
    assert(links[1].href === "mailto:contacto@herzkrom.com", "Expected approved email link");
    assert(!links[1].target, "Expected email links to use the mail handler directly");
    assert(
      container.children.some((child) => child.textContent.includes("javascript:alert(1)")),
      "Expected untrusted destination to remain plain text"
    );
  });

  test("autocomplete: completes commands, aliases, and translated paths", () => {
    const context = createContext("es");
    const commands = [lsCommand, cdCommand, catCommand];
    const commandMatches = getCompletions("c", context, commands);
    const aliasMatches = getCompletions("per", context, commands);
    const pathMatches = getCompletions("cd /per", context, commands);
    context.cwd = [];
    const currentDirectoryMatches = getCompletions("cd ", context, commands);

    assert(commandMatches.includes("cat"), "Expected cat command completion");
    assert(commandMatches.includes("cd"), "Expected cd command completion");
    assert(aliasMatches.includes("perfil"), "Expected Spanish profile alias completion");
    assert(pathMatches.includes("/perfil"), "Expected translated profile path completion");
    assert(
      currentDirectoryMatches.includes("perfil"),
      "Expected cd followed by a space to suggest root profile entry"
    );
    assert(
      !currentDirectoryMatches.includes("cd"),
      "Expected cd followed by a space not to suggest the command again"
    );
    assert(
      applyCompletion("cd ", "perfil") === "cd perfil",
      "Expected applying a path completion to preserve cd"
    );
    assert(
      applyCompletion("cd /per", "/perfil") === "cd /perfil",
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
      pwdCommand,
      rebootCommand,
      whoamiCommand,
      calcCommand,
      ...profileLinkCommands,
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

  test("whoami: localizes the guest user and preserves custom usernames", () => {
    const spanishContext = createContext("es");
    assert(whoamiCommand.execute(spanishContext, []) === "Invitado", "Expected Spanish guest name");
    spanishContext.visitor.name = "guest";
    assert(whoamiCommand.execute(spanishContext, []) === "Invitado", "Expected Spanish guest id to be localized");
    spanishContext.visitor.name = "ana";
    assert(whoamiCommand.execute(spanishContext, []) === "ana", "Expected custom username to remain unchanged");

    const englishContext = createContext("en");
    assert(whoamiCommand.execute(englishContext, []) === "Guest", "Expected English guest name");
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
    const result = tokenize("cat /profile");
    assert(result.command === "cat", "Expected command 'cat'");
    assert(result.args.length === 1, "Expected one arg");
    assert(result.args[0] === "/profile", "Expected /profile");
  });

  test("resolveAlias: Spanish alias", () => {
    const result = resolveAlias("perfil", "es");
    assert(result === aliasRegistry.es.perfil, "Expected profile alias expansion");
    assert(resolveAlias("perfil", "es") === "cat /profile", "Expected Spanish profile shortcut");
    assert(resolveAlias("profile", "en") === "cat /profile", "Expected English profile shortcut");
    assert(!("acerca" in aliasRegistry.es), "Expected duplicate Spanish profile alias to be removed");
    assert(!("about" in aliasRegistry.en), "Expected duplicate English profile alias to be removed");
  });

  test("ls: root lists profile and contact", () => {
    const context = createContext("es");
    const output = lsCommand.execute(context, []);
    assert(output.includes("perfil"), "Expected profile in ls output");
    assert(output.includes("contacto"), "Expected contact in ls output");
    assert(!output.includes("cv"), "Expected the CV directory to be removed");
  });

  test("ls: hides internal content nodes but cat can still read the section", () => {
    const context = createContext("es");
    context.cwd = ["profile"];

    const shortListing = lsCommand.execute(context, []);
    const longListing = lsCommand.execute(context, ["-l"]);
    const section = catCommand.execute(context, ["."]);

    assert(!shortListing.includes("content"), "Expected short listing to hide content node");
    assert(!longListing.includes("content"), "Expected long listing to hide content node");
    assert(section?.type === "animated", "Expected cat to keep reading the current section");
  });

  test("cd: supports translated path segments", () => {
    const context = createContext("es");
    const output = cdCommand.execute(context, ["/contacto"]);
    assert(output === "", "Expected cd to succeed");
    assert(context.cwd.join("/") === "contact", "Expected cwd to be /contact");
  });

  test("cd: current directory reference", () => {
    const context = createContext("es");
    context.cwd = ["profile"];
    const output = cdCommand.execute(context, ["."]);
    assert(output === "", "Expected cd . to succeed");
    assert(context.cwd.join("/") === "profile", "Expected cwd to remain /profile");
  });

  test("cat: returns animated content for section", () => {
    const context = createContext("es");
    const output = catCommand.execute(context, ["/profile"]);
    assert(output && output.type === "animated", "Expected animated output");
    assert(output.text.includes("Microsoft 365"), "Expected profile summary");
  });

  test("cat: resolves dot segments in relative paths", () => {
    const context = createContext("es");
    context.cwd = ["contact"];

    const currentDirectoryOutput = catCommand.execute(context, ["./content"]);
    const parentDirectoryOutput = catCommand.execute(context, ["../profile"]);

    assert(
      currentDirectoryOutput?.type === "animated",
      "Expected ./content to resolve from the current directory"
    );
    assert(
      parentDirectoryOutput?.type === "animated",
      "Expected ../profile to resolve from the parent directory"
    );
  });

  test("help: --help displays usage in both languages", () => {
    for (const lang of ["es", "en"]) {
      const output = helpCommand.execute(createContext(lang), ["--help"], [helpCommand]);
      const usage = lang === "es" ? "Uso: help" : "Usage: help";
      assert(output?.code === 0, `Expected ${lang} help to succeed`);
      assert(output.output.includes(usage), `Expected ${lang} usage in help output`);
    }
  });

  test("help: returns structured help", () => {
    const context = createContext("en");
    const output = helpCommand.execute(
      context,
      [],
      [
        lsCommand,
        cdCommand,
        catCommand,
        helpCommand,
        languageCommand,
        calcCommand,
        ...profileLinkCommands,
      ]
    );
    assert(output && output.type === "help", "Expected help object");
    assert(Array.isArray(output.primary), "Expected primary list");
    assert(output.primary.some((item) => item.cmd === "calc"), "Expected calc in primary help");
    assert(output.primary.some((item) => item.cmd === "github"), "Expected GitHub shortcut in help");
    assert(output.primary.some((item) => item.cmd === "linkedin"), "Expected LinkedIn shortcut in help");
  });

  test("contact and profile commands: expose the requested links", () => {
    const profile = catCommand.execute(createContext("es"), ["/profile"]);
    assert(profile?.type === "animated", "Expected profile section output");
    assert(
      profile.text.includes("[github.com/hermesrm](https://github.com/hermesrm)"),
      "Expected the clean GitHub URL in profile"
    );
    assert(
      profile.text.includes("[es.linkedin.com/in/hermesrm](https://es.linkedin.com/in/hermesrm)"),
      "Expected the clean LinkedIn URL in profile"
    );
    const contact = catCommand.execute(createContext("es"), ["/contact"]);
    assert(contact.text.includes("[contacto@herzkrom.com](mailto:contacto@herzkrom.com)"), "Expected contact email link");
    assert(!contact.text.includes("Correo:"), "Expected no label before the email");

    const registry = profileLinkCommands;
    for (const [command, expectedUrl] of [
      ["github", "https://github.com/hermesrm"],
      ["linkedin", "https://es.linkedin.com/in/hermesrm"],
    ]) {
      const result = executeInput(command, createContext("es"), registry);
      assert(result?.type === "external-link", `Expected ${command} to return an external link`);
      assert(result.href === expectedUrl, `Expected ${command} to resolve to its approved profile`);
    }
    assert(
      executeInput("open github", createContext("en"), registry).includes("Command not found"),
      "Expected the unrequested open command to be unavailable"
    );
    assert(
      executeInput("abrir github", createContext("es"), registry).includes("Comando no reconocido"),
      "Expected the unrequested abrir command to be unavailable"
    );
  });

  test("calculator: evaluates expressions through command and bare input", () => {
    const context = createContext("es");
    const registry = [calcCommand];

    assert(executeInput("2 + 2", context, registry) === "4", "Expected bare expression to calculate");
    assert(
      executeInput("(2 + 3) * 4", context, registry) === "20",
      "Expected parentheses and precedence to be applied"
    );
    assert(executeInput("sqrt(81)", context, registry) === "9", "Expected square root function");
    assert(executeInput("sin(pi / 2)", context, registry) === "1", "Expected trig function and constant");
    assert(executeInput("max(2, 5, 3)", context, registry) === "5", "Expected multi-argument function");
    assert(executeInput("5!", context, registry) === "120", "Expected factorial operator");
    assert(executeInput("2^3^2", context, registry) === "512", "Expected right-associative power");
    assert(executeInput("-pi", context, registry) === "-3.14159265359", "Expected signed constant");
    assert(executeInput("calcular 2 + 2", context, registry) === "4", "Expected Spanish calc alias");
    assert(
      executeInput("calc 1 / 0", context, registry) === "No se puede dividir entre cero.",
      "Expected division by zero to return a localized error"
    );
    assert(
      executeInput("2 +", context, registry).includes("Expresión matemática inválida"),
      "Expected malformed math input to return a calculator error"
    );
    const help = executeInput("calc --help", context, registry);
    assert(help?.code === 0 && help.output.includes("2 + 2"), "Expected calculator help");
  });

  test("executeInput: unknown command", () => {
    const context = createContext("en");
    const output = executeInput("nope", context, [lsCommand]);
    assert(output.includes("Command not found"), "Expected command not found message");
  });

  test("executeInput: registered profile command takes precedence over alias", () => {
    const context = createContext("es");
    const output = executeInput("github", context, profileLinkCommands);
    assert(output?.type === "external-link", "Expected the GitHub command to run directly");
    assert(output.href === "https://github.com/hermesrm", "Expected the approved GitHub profile");
  });

  test("executeInput: profile alias resolves", () => {
    const context = createContext("es");
    const output = executeInput("perfil", context, [catCommand]);
    assert(output?.type === "animated", "Expected the about alias to resolve to cat");
  });
}
