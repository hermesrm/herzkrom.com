/* =============================
   matrix.js
   Full-screen simulated code cascade
   ============================= */

const matrixCommand = {
  id: "MATRIX",
  help: { section: "system", order: 60 },
  aliases: {
    es: ["matrix"],
    en: ["matrix"],
  },
  description: {
    es: "Inicia una cascada de codigo estilo Matrix",
    en: "Starts a Matrix-style code cascade",
  },

  execute(context, args) {
    if (args.includes("--help")) {
      const helpText =
        context.lang === "es"
          ? [
              "Uso: matrix [--help]",
              "",
              "Muestra una cascada de codigo a pantalla completa.",
              "",
              "Pulsa Esc, Q o toca la pantalla para salir.",
              "",
              "Opciones:",
              "  --help    Muestra esta ayuda",
            ].join("\n")
          : [
              "Usage: matrix [--help]",
              "",
              "Displays a full-screen code cascade.",
              "",
              "Press Esc, Q or tap the screen to exit.",
              "",
              "Options:",
              "  --help    Show this help",
            ].join("\n");
      return { output: helpText, code: 0 };
    }

    if (args.length) {
      const invalidFlag = args.find((arg) => arg && arg.startsWith("-"));
      if (invalidFlag) {
        const flag = invalidFlag.replace(/^-+/, "");
        const msg =
          context.lang === "es"
            ? `matrix: opción inválida -- ${flag}\nPrueba 'matrix --help' para más información.`
            : `matrix: invalid option -- ${flag}\nTry 'matrix --help' for more information.`;
        return { output: msg, code: 1 };
      }

      const msg =
        context.lang === "es"
          ? "matrix: demasiados argumentos\nPrueba 'matrix --help' para más información."
          : "matrix: too many arguments\nTry 'matrix --help' for more information.";
      return { output: msg, code: 1 };
    }

    return "__MATRIX__";
  },
};

export { matrixCommand };
