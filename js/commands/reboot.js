/* =============================
   reboot.js
   Reset terminal session
   ============================= */

// ES: Devuelve una señal para que la capa principal reinicie la sesión.
// EN: Returns a signal so the main layer resets the session.
const rebootCommand = {
  id: "REBOOT",
  aliases: {
    es: ["reboot"],
    en: ["reboot"],
  },
  description: {
    es: "Reinicia la consola simulada",
    en: "Reboot the simulated console",
  },

  execute(context, args) {
    if (args && args.length) {
      return {
        es: "reboot: demasiados argumentos",
        en: "reboot: too many arguments",
      }[context.lang];
    }
    return "__REBOOT__"; // señal especial
  },
};

export { rebootCommand };
