/* =============================
   pwd.js
   Print working directory
   ============================= */

import { getCwdPath } from "../context.js";

const pwdCommand = {
  id: "PWD",
  aliases: {
    es: ["pwd"],
    en: ["pwd"],
  },
  description: {
    es: "Muestra la ruta actual",
    en: "Print working directory",
  },

  execute(context, args) {
    if (args && args.length) {
      return {
        es: "pwd: demasiados argumentos",
        en: "pwd: too many arguments",
      }[context.lang];
    }
    return getCwdPath(context);
  },
};

export { pwdCommand };
