/* =============================
   history.js
   Command history display
   ============================= */

const historyCommand = {
  id: "HISTORY",
  aliases: {
    es: ["history"],
    en: ["history"],
  },
  description: {
    es: "Muestra el historial de comandos",
    en: "Show command history",
  },

  execute(context, args) {
    const lang = context?.lang === "es" ? "es" : "en";
    if (args && args.length) {
      return {
        es: "history: demasiados argumentos",
        en: "history: too many arguments",
      }[lang];
    }

    if (!context?.history?.length) {
      return {
        es: "No hay comandos en el historial",
        en: "No commands in history",
      }[lang];
    }

    return context.history.map((cmd, index) => `${index + 1}  ${cmd}`).join("\n");
  },
};

export { historyCommand };
