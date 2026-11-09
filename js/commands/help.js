/* =============================
  help.js
  Dynamic help command
  ============================= */

import { aliasRegistry } from "../aliases.js";

const helpCommand = {
  id: "HELP",
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

    // ES: help general devuelve estructura para render en columnas. EN: General help returns structure for column render.
    const lang = context.lang;
    const aliases = Object.keys(aliasRegistry[lang] || {}); // Mantiene orden definido en aliases.js

    const aliasDescriptions =
      lang === "es"
        ? {
            acerca: "Acerca de mí",
            habilidades: "Habilidades técnicas",
            competencias: "Competencias profesionales",
            experiencia: "Experiencia laboral",
            educacion: "Formación",
            proyectos: "Proyectos personales",
            contacto: "Información de contacto",
            pdf: "Disponibilidad del CV en PDF",
          }
        : {
            about: "About me",
            skills: "Technical skills",
            competencies: "Professional competencies",
            experience: "Work experience",
            education: "Education",
            projects: "Personal projects",
            contact: "Contact information",
            pdf: "PDF résumé availability",
          };

    const LINUX_IDS = new Set([
      "LS",
      "CD",
      "CAT",
      "PWD",
      "CLEAR",
      "ECHO",
      "HISTORY",
      "WHOAMI",
      "HELP",
      "REBOOT",
    ]);
    const native = commandRegistry.filter((c) => LINUX_IDS.has(c.id));

    return {
      type: "help",
      lang,
      primaryTitle: lang === "es" ? "Comandos principales:" : "Primary commands:",
      systemTitle: lang === "es" ? "Comandos del sistema (Linux):" : "System commands (Linux):",
      primary: aliases.map((name) => ({
        cmd: name,
        desc: aliasDescriptions[name] || (lang === "es" ? "Comando principal" : "Primary command"),
      })),
      system: native.map((cmd) => ({
        cmd: cmd.aliases[lang][0],
        desc: cmd.description[lang],
      })),
      note: {
        es: "Nota: Esta es una simulación controlada. No se ejecutan comandos reales.",
        en: "Note: This is a controlled simulation. No real system commands are executed.",
      }[lang],
    };
  },
};

export { helpCommand };
