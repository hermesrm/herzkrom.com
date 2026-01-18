/* =============================
   whoami.js
   Display current session user
   ============================= */

const whoamiCommand = {
  id: "WHOAMI",
  aliases: {
    es: ["whoami"],
    en: ["whoami"],
  },
  description: {
    es: "Muestra el usuario actual de la sesión",
    en: "Display the current session user",
  },

  execute(context, args) {
    if (args && args.length) {
      return {
        es: "whoami: demasiados argumentos",
        en: "whoami: too many arguments",
      }[context.lang];
    }
    return context.visitor.name || "guest";
  },
};

export { whoamiCommand };
