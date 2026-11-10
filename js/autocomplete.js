import { aliasRegistry } from "./aliases.js";
import { resolvePath, resolveCwd } from "./context.js";
import { getDisplayName } from "./commands/ls.js";
import { SUPPORTED_LANGUAGES } from "./locales.js";

function filterAliasesByLanguage(word, lang) {
  const current = aliasRegistry[lang] || {};
  const otherAliases = new Set(
    SUPPORTED_LANGUAGES.filter((language) => language !== lang).flatMap((language) =>
      Object.keys(aliasRegistry[language] || {})
    )
  );
  const normalizedWord = normalizeForMatch(word);

  return Object.keys(current)
    .filter((alias) => normalizeForMatch(alias).startsWith(normalizedWord))
    .filter((alias) => !otherAliases.has(alias));
}

function normalizeForMatch(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getCompletions(input, context, commandRegistry) {
  const hasTrailingSpace = /\s$/.test(input);
  const trimmed = input.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length === 1) {
    const word = parts[0].toLowerCase();
    const normalizedWord = normalizeForMatch(word);

    if (!word) return [];
    if (hasTrailingSpace && (word === "cd" || word === "cat")) {
      return getPathCompletions("", context);
    }

    const commandMatches = commandRegistry
      .flatMap((cmd) => cmd.aliases[context.lang] || [])
      .filter((alias) => normalizeForMatch(alias).startsWith(normalizedWord));
    const aliasMatches = filterAliasesByLanguage(word, context.lang);

    return [...commandMatches, ...aliasMatches];
  }

  if (parts.length > 1) {
    const command = parts[0].toLowerCase();
    const lastPart = parts[parts.length - 1];

    if ((command === "cd" || command === "cat") && lastPart) {
      return getPathCompletions(lastPart, context);
    }
  }

  return [];
}

function getPathCompletions(pathPrefix, context) {
  try {
    let currentNode = null;
    let baseDir = "";

    if (!pathPrefix) {
      currentNode = resolveCwd(context);
    } else if (pathPrefix.includes("/")) {
      const lastSlash = pathPrefix.lastIndexOf("/");
      baseDir = pathPrefix.slice(0, lastSlash + 1);
      const searchTerm = pathPrefix.slice(lastSlash + 1);

      const dirResult = resolvePath(context, baseDir);
      if (!dirResult) return [];

      currentNode = dirResult.node;
      pathPrefix = searchTerm;
    } else {
      currentNode = resolveCwd(context);
    }

    if (!currentNode || currentNode.type !== "dir") {
      return [];
    }

    const normalizedPrefix = normalizeForMatch(pathPrefix);
    const displayItems = Object.keys(currentNode.children || {}).map((name) => ({
      display: getDisplayName(name, context.lang),
    }));
    const matches = displayItems.filter((item) =>
      normalizeForMatch(item.display).startsWith(normalizedPrefix)
    );

    return matches.map((item) => baseDir + item.display);
  } catch (error) {
    console.error("Error en getPathCompletions:", error);
    return [];
  }
}

function applyCompletion(input, completion) {
  const hasTrailingSpace = /\s$/.test(input);
  const parts = input.trim().split(/\s+/);
  if (parts.length === 1) {
    if (hasTrailingSpace && parts[0]) {
      return `${parts[0]} ${completion}`;
    }
    return completion;
  }
  parts[parts.length - 1] = completion;
  return parts.join(" ");
}

function getCommonPrefix(items) {
  if (!items.length) return "";
  let prefix = items[0];
  for (let i = 1; i < items.length; i++) {
    const item = items[i];
    let j = 0;
    while (j < prefix.length && j < item.length && prefix[j] === item[j]) {
      j++;
    }
    prefix = prefix.slice(0, j);
    if (!prefix) break;
  }
  return prefix;
}

export { getCompletions, applyCompletion, getCommonPrefix };
