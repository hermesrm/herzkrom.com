/* =============================
   cat.js
   Display file or section content
   ============================= */

import { resolveNode } from "../context.js";
import { getInternalName } from "./ls.js";

const catCommand = {
  id: "CAT",
  help: { section: "system", order: 30 },
  aliases: {
    es: ["cat"],
    en: ["cat"],
  },
  description: {
    es: "Muestra el contenido de un archivo o sección",
    en: "Display file or section content",
  },

  execute(context, args) {
    if (args.includes("--help")) {
      const helpText =
        context.lang === "es"
          ? [
              "Uso: cat <archivo | sección> [--help]",
              "",
              "Muestra el contenido de un archivo o sección.",
              "",
              "Opciones:",
              "  --help    Muestra esta ayuda",
            ].join("\n")
          : [
              "Usage: cat <file | section> [--help]",
              "",
              "Display file or section content.",
              "",
              "Options:",
              "  --help    Show this help",
            ].join("\n");
      return {
        output: helpText,
        code: 0,
      };
    }
    if (!args.length) {
      return {
        es: "Uso: cat <archivo | sección>",
        en: "Usage: cat <file | section>",
      }[context.lang];
    }

    // Opción inválida (solo acepta argumentos que no empiezan por '-')
    const invalidFlag = args.find((arg) => arg.startsWith("-"));
    if (invalidFlag) {
      const flag = invalidFlag.replace(/^-+/, "");
      const msg =
        context.lang === "es"
          ? `cat: opción inválida -- ${flag}\nPrueba 'cat --help' para más información.`
          : `cat: invalid option -- ${flag}\nTry 'cat --help' for more information.`;
      return {
        output: msg,
        code: 1,
      };
    }

    if (args.length > 1) {
      const msg =
        context.lang === "es"
          ? "cat: demasiados argumentos\nPrueba 'cat --help' para más información."
          : "cat: too many arguments\nTry 'cat --help' for more information.";
      return {
        output: msg,
        code: 1,
      };
    }

    const nodeName = args[0];
    const internalName = getInternalName(nodeName, context.lang);
    const node = resolveNode(context, internalName);

    if (!node) {
      return {
        es: "Archivo o sección no encontrada",
        en: "File or section not found",
      }[context.lang];
    }

    // Directorio de sección del CV (content interno) - devolver como animado
    if (node.type === "dir" && node.children?.content) {
      const text = node.children.content.content?.[context.lang] || "";
      return {
        type: "animated",
        text: text,
      };
    }

    // Archivo multilenguaje explícito - devolver como animado
    if (node.type === "file" && node.content) {
      const text =
        node.content?.[context.lang] ||
        {
          es: "Idioma no disponible",
          en: "Language not available",
        }[context.lang];
      return {
        type: "animated",
        text: text,
      };
    }

    return {
      es: "No se puede mostrar este elemento",
      en: "Cannot display this element",
    }[context.lang];
  },
};

export { catCommand };
