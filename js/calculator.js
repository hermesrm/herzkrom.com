const MAX_EXPRESSION_LENGTH = 256;
const MAX_TOKEN_COUNT = 128;
const TOKEN_PATTERN = /\s*([a-z]+|\*\*|[()+\-*/%^!,]|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)/iy;
const NUMBER_PATTERN = /^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
const CONSTANTS = {
  e: Math.E,
  ln10: Math.LN10,
  ln2: Math.LN2,
  log2e: Math.LOG2E,
  log10e: Math.LOG10E,
  phi: (1 + Math.sqrt(5)) / 2,
  pi: Math.PI,
  sqrt2: Math.SQRT2,
  tau: 2 * Math.PI,
};
const FUNCTIONS = {
  abs: { min: 1, max: 1, evaluate: Math.abs },
  acos: { min: 1, max: 1, evaluate: Math.acos },
  asin: { min: 1, max: 1, evaluate: Math.asin },
  atan: { min: 1, max: 1, evaluate: Math.atan },
  atan2: { min: 2, max: 2, evaluate: Math.atan2 },
  cbrt: { min: 1, max: 1, evaluate: Math.cbrt },
  ceil: { min: 1, max: 1, evaluate: Math.ceil },
  cos: { min: 1, max: 1, evaluate: Math.cos },
  cosh: { min: 1, max: 1, evaluate: Math.cosh },
  exp: { min: 1, max: 1, evaluate: Math.exp },
  floor: { min: 1, max: 1, evaluate: Math.floor },
  hypot: { min: 1, max: MAX_TOKEN_COUNT, evaluate: Math.hypot },
  ln: { min: 1, max: 1, evaluate: Math.log },
  log: { min: 1, max: 1, evaluate: Math.log10 },
  log2: { min: 1, max: 1, evaluate: Math.log2 },
  max: { min: 1, max: MAX_TOKEN_COUNT, evaluate: Math.max },
  min: { min: 1, max: MAX_TOKEN_COUNT, evaluate: Math.min },
  round: { min: 1, max: 1, evaluate: Math.round },
  sin: { min: 1, max: 1, evaluate: Math.sin },
  sinh: { min: 1, max: 1, evaluate: Math.sinh },
  sqrt: { min: 1, max: 1, evaluate: Math.sqrt },
  tan: { min: 1, max: 1, evaluate: Math.tan },
  tanh: { min: 1, max: 1, evaluate: Math.tanh },
  trunc: { min: 1, max: 1, evaluate: Math.trunc },
};

function createCalculatorError(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

function tokenizeExpression(expression) {
  const input = expression.trim();
  if (!input || input.length > MAX_EXPRESSION_LENGTH) {
    throw createCalculatorError("INVALID_EXPRESSION");
  }

  const tokens = [];
  let position = 0;
  while (position < input.length) {
    TOKEN_PATTERN.lastIndex = position;
    const match = TOKEN_PATTERN.exec(input);
    if (!match) {
      throw createCalculatorError("INVALID_EXPRESSION");
    }

    tokens.push(match[1]);
    if (tokens.length > MAX_TOKEN_COUNT) {
      throw createCalculatorError("INVALID_EXPRESSION");
    }
    position = TOKEN_PATTERN.lastIndex;
  }

  return tokens;
}

function evaluateExpression(expression) {
  const tokens = tokenizeExpression(expression);
  let position = 0;

  function peek() {
    return tokens[position];
  }

  function parsePrimary() {
    const token = peek();
    let value;

    if (token === "(") {
      position++;
      value = parseAdditive();
      if (peek() !== ")") {
        throw createCalculatorError("INVALID_EXPRESSION");
      }
      position++;
    } else if (NUMBER_PATTERN.test(token || "")) {
      value = Number(token);
      position++;
    } else if (/^[a-z]+$/i.test(token || "")) {
      const name = token.toLowerCase();
      position++;

      if (Object.hasOwn(CONSTANTS, name)) {
        value = CONSTANTS[name];
      } else {
        const calculatorFunction = FUNCTIONS[name];
        if (!calculatorFunction || peek() !== "(") {
          throw createCalculatorError("INVALID_EXPRESSION");
        }

        position++;
        const args = [];
        if (peek() !== ")") {
          args.push(parseAdditive());
          while (peek() === ",") {
            position++;
            args.push(parseAdditive());
          }
        }
        if (peek() !== ")") {
          throw createCalculatorError("INVALID_EXPRESSION");
        }
        position++;

        if (args.length < calculatorFunction.min || args.length > calculatorFunction.max) {
          throw createCalculatorError("INVALID_EXPRESSION");
        }
        value = calculatorFunction.evaluate(...args);
        if (Number.isNaN(value)) {
          throw createCalculatorError("DOMAIN_ERROR");
        }
      }
    } else {
      throw createCalculatorError("INVALID_EXPRESSION");
    }

    while (peek() === "!") {
      position++;
      value = factorial(value);
    }
    return assertFinite(value);
  }

  function parsePower() {
    const base = parsePrimary();
    if (peek() !== "**" && peek() !== "^") return base;

    position++;
    return assertFinite(base ** parseUnary());
  }

  function parseUnary() {
    if (peek() === "+") {
      position++;
      return parseUnary();
    }
    if (peek() === "-") {
      position++;
      return -parseUnary();
    }
    return parsePower();
  }

  function parseMultiplicative() {
    let value = parseUnary();
    while (["*", "/", "%"].includes(peek())) {
      const operator = tokens[position++];
      const right = parseUnary();
      if ((operator === "/" || operator === "%") && right === 0) {
        throw createCalculatorError("DIVISION_BY_ZERO");
      }
      if (operator === "*") value *= right;
      if (operator === "/") value /= right;
      if (operator === "%") value %= right;
      value = assertFinite(value);
    }
    return value;
  }

  function parseAdditive() {
    let value = parseMultiplicative();
    while (["+", "-"].includes(peek())) {
      const operator = tokens[position++];
      const right = parseMultiplicative();
      value = assertFinite(operator === "+" ? value + right : value - right);
    }
    return value;
  }

  const result = parseAdditive();
  if (position !== tokens.length) {
    throw createCalculatorError("INVALID_EXPRESSION");
  }
  return result;
}

function assertFinite(value) {
  if (!Number.isFinite(value)) {
    throw createCalculatorError("RESULT_OUT_OF_RANGE");
  }
  return value;
}

function factorial(value) {
  if (!Number.isInteger(value) || value < 0 || value > 170) {
    throw createCalculatorError("DOMAIN_ERROR");
  }

  let result = 1;
  for (let factor = 2; factor <= value; factor++) {
    result *= factor;
  }
  return result;
}

function formatExpressionResult(value) {
  const rounded = Number(value.toPrecision(12));
  return String(Object.is(rounded, -0) ? 0 : rounded);
}

function isMathExpressionCandidate(input) {
  const expression = input.trim().replace(/^[+-]\s*/, "");
  return (
    /^\s*(?:\d|\.|\(|[+-]\s*(?:\d|\.|\())/.test(input) ||
    /^\s*(?:abs|acos|asin|atan2?|cbrt|ceil|cosh?|exp|floor|hypot|ln|log2?|max|min|round|sin|sinh|sqrt|tan|tanh|trunc)\s*\(/i.test(
      expression
    ) ||
    /^\s*(?:e|ln10|ln2|log2e|log10e|phi|pi|sqrt2|tau)\b/i.test(expression)
  );
}

function getCalculatorErrorMessage(error, lang = "en") {
  const messages = {
    es: {
      INVALID_EXPRESSION: "Expresión matemática inválida. Ejemplo: calc (2 + 3) * 4",
      DIVISION_BY_ZERO: "No se puede dividir entre cero.",
      DOMAIN_ERROR: "La operación está fuera del dominio matemático permitido.",
      RESULT_OUT_OF_RANGE: "El resultado está fuera del rango permitido.",
    },
    en: {
      INVALID_EXPRESSION: "Invalid math expression. Example: calc (2 + 3) * 4",
      DIVISION_BY_ZERO: "Cannot divide by zero.",
      DOMAIN_ERROR: "The operation is outside the supported mathematical domain.",
      RESULT_OUT_OF_RANGE: "The result is out of range.",
    },
  };

  return messages[lang]?.[error?.code] || messages.en.INVALID_EXPRESSION;
}

export {
  evaluateExpression,
  formatExpressionResult,
  getCalculatorErrorMessage,
  isMathExpressionCandidate,
};
