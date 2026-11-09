/* =============================
   ls.js
   List directory contents
   ============================= */

import { resolveCwd } from "../context.js";

// ES: Mapeo de nombres de directorios por idioma. EN: Directory name mapping per language.
const directoryNames = {
  about: { es: "acerca", en: "about" },
  skills: { es: "habilidades", en: "skills" },
  competencies: { es: "competencias", en: "competencies" },
  experience: { es: "experiencia", en: "experience" },
  education: { es: "educación", en: "education" },
  projects: { es: "proyectos", en: "projects" },
  contact: { es: "contacto", en: "contact" },
  pdf: { es: "pdf", en: "pdf" },
};

function getDisplayName(name, lang) {
  return directoryNames[name]?.[lang] || name;
}

function normalizeName(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Función inversa: convierte nombre traducido al nombre raw del filesystem
function getInternalName(displayName, lang) {
  const translateSegment = (segment) => {
    if (!segment || segment === "." || segment === "..") return segment;
    const normalized = normalizeName(segment);
    for (const [raw, translations] of Object.entries(directoryNames)) {
      if (normalizeName(translations[lang]) === normalized) {
        return raw;
      }
    }
    return segment;
  };

  if (displayName && displayName.includes("/")) {
    const hasLeadingSlash = displayName.startsWith("/");
    const parts = displayName.split("/").filter((part) => part.length > 0);
    const translated = parts.map((part) => translateSegment(part)).join("/");
    return (hasLeadingSlash ? "/" : "") + translated;
  }

  return translateSegment(displayName);
}

const lsCommand = {
  id: "LS",
  aliases: {
    es: ["ls"],
    en: ["ls"],
  },
  description: {
    es: "Lista el contenido del directorio actual",
    en: "List directory contents",
  },

  execute(context, args) {
    if (args.includes("--help")) {
      const helpText =
        context.lang === "es"
          ? [
              "Uso: ls [-l] [--help]",
              "",
              "Lista el contenido del directorio actual.",
              "",
              "Opciones:",
              "  -l        Muestra el formato largo (tipo y nombre)",
              "  --help    Muestra esta ayuda",
            ].join("\n")
          : [
              "Usage: ls [-l] [--help]",
              "",
              "List directory contents.",
              "",
              "Options:",
              "  -l        Show long format (type and name)",
              "  --help    Show this help",
            ].join("\n");
      return {
        output: helpText,
        code: 0,
      };
    }
    const invalidFlag = args?.find((arg) => arg.startsWith("-") && arg !== "-l");
    if (invalidFlag) {
      const flag = invalidFlag.replace(/^-+/, "");
      const msg =
        context.lang === "es"
          ? `ls: opción inválida -- ${flag}\nPrueba 'ls --help' para más información.`
          : `ls: invalid option -- ${flag}\nTry 'ls --help' for more information.`;
      return {
        output: msg,
        code: 1,
      };
    }

    const node = resolveCwd(context);

    if (!node || node.type !== "dir") {
      return {
        es: "No es un directorio",
        en: "Not a directory",
      }[context.lang];
    }

    const hasLongFlag = args && args.includes("-l");
    const items = Object.entries(node.children).filter(([name]) => name !== "content");

    if (!hasLongFlag) {
      // Formato simple - mostrar nombres traducidos
      return items.map(([name]) => getDisplayName(name, context.lang)).join("  ");
    }

    // Formato largo (-l)
    const lines = items.map(([name, child]) => {
      const displayName = getDisplayName(name, context.lang);
      const type = child.type === "dir" ? "d" : "-";
      const typeStr = child.type === "dir" ? "/" : "";
      return `${type}  ${displayName}${typeStr}`;
    });

    return lines.join("\n");
  },
};

export { lsCommand, getDisplayName, getInternalName };
