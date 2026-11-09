import { aliasRegistry } from "../js/aliases.js";
import { fileSystem } from "../js/filesystem.js";
import { resolveAlias, tokenize, executeInput } from "../js/parser.js";
import { lsCommand } from "../js/commands/ls.js";
import { cdCommand } from "../js/commands/cd.js";
import { catCommand } from "../js/commands/cat.js";
import { helpCommand } from "../js/commands/help.js";
import { languageCommand } from "../js/commands/idioma.js";
import { pdfCommand } from "../js/commands/pdf.js";

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
