/* =============================
  help.js
  Dynamic help command
  ============================= */

import { getNavigationHelpEntries } from "../aliases.js";

const helpCommand = {
  id: "HELP",
  help: { section: "system", order: 90 },
  aliases: {
    es: ["help"],
    en: ["help"],
  },
  description: {
    es: "Muestra la ayuda del sistema",
    en: "Show system help",
  },

  execute(context, args, commandRegistry) {
    if (args?.includes("--help")) {
      const helpText =
        context.lang === "es"
          ? [
              "Uso: help [<comando> | --help]",
              "",
              "Muestra la ayuda general o la descripción de un comando.",
              "",
              "Opciones:",
              "  --help    Muestra esta ayuda",
            ].join("\n")
          : [
              "Usage: help [<command> | --help]",
              "",
              "Show general help or the description of a command.",
              "",
              "Options:",
              "  --help    Show this help",
            ].join("\n");
      return {
        output: helpText,
        code: 0,
      };
    }

    // help <comando>
    if (args && args.length) {
      if (args.length > 1) {
        const msg =
          context.lang === "es"
            ? "help: demasiados argumentos\nPrueba 'help --help' para más información."
            : "help: too many arguments\nTry 'help --help' for more information.";
        return {
          output: msg,
          code: 1,
        };
      }
      const target = args[0];
      const cmd = commandRegistry.find((c) => c.aliases[context.lang]?.includes(target));

      if (!cmd) {
        return {
          es: `No hay ayuda disponible para '${target}'`,
          en: `No help available for '${target}'`,
        }[context.lang];
      }

      return `${target}\n${cmd.description[context.lang]}`;
    }

    const lang = context.lang;
    const navigationEntries = getNavigationHelpEntries(lang);
    const commandEntries = commandRegistry
      .filter((command) => command.help?.section)
      .map((command) => ({
        command: command.aliases[lang][0],
        description: command.description[lang],
        ...command.help,
      }));
    const helpSections = [...navigationEntries, ...commandEntries].reduce(
      (sections, entry) => {
        sections[entry.section].push(entry);
        return sections;
      },
      { primary: [], system: [] }
    );
    const sortHelpEntries = (entries) =>
      entries
        .sort((left, right) => left.order - right.order)
        .map(({ command, description }) => ({ cmd: command, desc: description }));

    return {
      type: "help",
      lang,
      primaryTitle: lang === "es" ? "Comandos principales:" : "Primary commands:",
      systemTitle: lang === "es" ? "Comandos del sistema (Linux):" : "System commands (Linux):",
      primary: sortHelpEntries(helpSections.primary),
      system: sortHelpEntries(helpSections.system),
      note: {
        es: "Nota: Esta es una simulación controlada. No se ejecutan comandos reales.",
        en: "Note: This is a controlled simulation. No real system commands are executed.",
      }[lang],
    };
  },
};

export { helpCommand };
