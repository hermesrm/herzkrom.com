const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

function isInputDebugEnabled(location) {
  if (!LOCAL_HOSTS.has(location.hostname)) return false;

  return location.hash.includes("debug-input") || location.search.includes("debug-input");
}

export { isInputDebugEnabled };
