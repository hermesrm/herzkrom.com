/* =============================
   echo.js
   Display text
   ============================= */

const echoCommand = {
  id: "ECHO",
  help: { section: "system", order: 60 },
  aliases: {
    es: ["echo"],
    en: ["echo"],
  },
  description: {
    es: "Muestra un texto en la pantalla",
    en: "Display a line of text",
  },

  execute(context, args) {
    if (args?.includes("--help")) {
      const helpText =
        context.lang === "es"
          ? ["Uso: echo <texto>", "", "Muestra el texto indicado."].join("\n")
          : ["Usage: echo <text>", "", "Display the given text."].join("\n");
      return { output: helpText, code: 0 };
    }

    if (!args || !args.length) {
      return "";
    }

    // ES: Normaliza salida a string. EN: Normalize output to string.
    return args.map((arg) => String(arg)).join(" ");
  },
};

export { echoCommand };
