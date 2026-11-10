/* =============================
   context.js
   Session context and helpers
   ============================= */

import { fileSystem } from "./filesystem.js";

/*
  ES: SessionContext almacena todo el estado vivo de la sesión; no guardar estado fuera de aquí.
  EN: SessionContext holds all live session state; do not persist state outside this object.
*/

/**
 * @typedef {import("./filesystem.js").DirNode} DirNode
 */

/**
 * @typedef {Object} SessionState
 * @property {string[]} cwd
 * @property {"es"|"en"} lang
 * @property {string[]} history
 * @property {number|null} historyIndex
 * @property {{name: string|null}} visitor
 * @property {DirNode} fs
 */

/** @type {SessionState} */
const SessionContext = {
  cwd: [], // Directorio actual como array (ej. ['profile'])
  lang: "es", // Idioma activo ('es' | 'en')
  history: [], // Historial de comandos
  historyIndex: null, // Índice para navegación con ↑ ↓
  visitor: {
    name: null, // Nombre introducido por el visitante
  },
  fs: fileSystem, // Referencia al filesystem virtual
};

/* =============================
   Helpers de contexto
   ============================= */

/* ES: Resuelve el nodo actual desde cwd. EN: Resolve current node from cwd. */
function resolveCwd(context = SessionContext) {
  let node = context.fs;

  for (const dir of context.cwd) {
    if (!node.children || !node.children[dir]) {
      return null;
    }
    node = node.children[dir];
  }

  return node;
}

/* ES: Ruta actual como string (solo para mostrar). EN: Current path string for display. */
function getCwdPath(context = SessionContext) {
  if (!context.cwd.length) return "/";
  return "/" + context.cwd.join("/");
}

/* ES: Resuelve una ruta a un directorio (cd). EN: Resolve a path to a directory (cd). */
function resolvePath(context, path) {
  if (!context || !context.fs) {
    return null;
  }
  if (typeof path !== "string") {
    return null;
  }
  let parts;
  let node;
  let newCwd = [];

  if (!path || path === "/") {
    return { node: context.fs, cwd: [] };
  }

  // Ruta absoluta
  if (path.startsWith("/")) {
    parts = path.split("/").filter(Boolean);
    node = context.fs;
  }
  // Ruta relativa
  else {
    parts = path.split("/").filter(Boolean);
    node = resolveCwd(context);
    newCwd = [...context.cwd];
  }

  for (const part of parts) {
    if (part === ".") {
      continue;
    }

    if (part === "..") {
      newCwd.pop();
      node = context.fs;
      for (const dir of newCwd) {
        if (!node?.children?.[dir]) {
          return null;
        }
        node = node.children[dir];
      }
      continue;
    }

    if (!node?.children || !node.children[part]) {
      return null;
    }

    node = node.children[part];
    if (node.type !== "dir") {
      return null;
    }

    newCwd.push(part);
  }

  return { node, cwd: newCwd };
}

/* ES: Resuelve una ruta a un nodo (archivo o dir). EN: Resolve a path to a node (file or dir). */
function resolveNode(context, path) {
  if (!context || !context.fs || typeof path !== "string") {
    return null;
  }

  const nodeStack = [context.fs];
  if (!path.startsWith("/")) {
    for (const dir of context.cwd) {
      const currentNode = nodeStack[nodeStack.length - 1];
      const child = currentNode?.children?.[dir];
      if (!child || child.type !== "dir") return null;
      nodeStack.push(child);
    }
  }

  const parts = path.split("/").filter(Boolean);
  for (const part of parts) {
    const currentNode = nodeStack[nodeStack.length - 1];

    if (part === ".") {
      continue;
    }

    if (part === "..") {
      if (currentNode.type !== "dir") return null;
      if (nodeStack.length > 1) nodeStack.pop();
      continue;
    }

    if (currentNode.type !== "dir" || !currentNode.children?.[part]) {
      return null;
    }
    nodeStack.push(currentNode.children[part]);
  }

  return nodeStack[nodeStack.length - 1];
}

export { SessionContext, resolveCwd, getCwdPath, resolvePath, resolveNode };
