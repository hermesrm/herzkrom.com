import {
  evaluateExpression,
  formatExpressionResult,
  getCalculatorErrorMessage,
} from "../calculator.js";

const calcCommand = {
  id: "CALC",
  help: { section: "primary", order: 30 },
  aliases: {
    es: ["calc", "calcular"],
    en: ["calc", "math"],
  },
  description: {
    es: "Calcula expresiones aritméticas y científicas",
    en: "Evaluate arithmetic and scientific expressions",
  },

  execute(context, args) {
    if (args?.includes("--help")) {
      const helpText =
        context.lang === "es"
          ? [
              "Uso: calc <expresión>",
              "",
              "Evalúa operaciones científicas, funciones y constantes con paréntesis.",
              "Ejemplos: sqrt(81), sin(pi / 2), 5!",
              "También puedes escribir directamente: 2 + 2",
              "Las funciones trigonométricas usan radianes.",
            ].join("\n")
          : [
              "Usage: calc <expression>",
              "",
              "Evaluate scientific operations, functions, and constants with parentheses.",
              "Examples: sqrt(81), sin(pi / 2), 5!",
              "You can also enter an expression directly: 2 + 2",
              "Trigonometric functions use radians.",
            ].join("\n");
      return { output: helpText, code: 0 };
    }

    if (!args?.length) {
      return context.lang === "es"
        ? "Uso: calc <expresión> (ejemplo: calc (2 + 3) * 4)"
        : "Usage: calc <expression> (example: calc (2 + 3) * 4)";
    }

    try {
      return formatExpressionResult(evaluateExpression(args.join(" ")));
    } catch (error) {
      return getCalculatorErrorMessage(error, context.lang);
    }
  },
};

export { calcCommand };
