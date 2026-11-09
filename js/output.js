function trimOutputNodes(output, maxNodes) {
  while (output.childNodes.length > maxNodes) {
    output.removeChild(output.firstChild);
  }
}

function appendCommandHistory(output, documentRef, userHost, path, command, maxNodes) {
  const promptDiv = documentRef.createElement("div");
  const userSpan = documentRef.createElement("span");
  userSpan.className = "prompt";
  userSpan.textContent = userHost;
  const pathSpan = documentRef.createElement("span");
  pathSpan.className = "prompt-path";
  pathSpan.textContent = ` ${path}`;
  promptDiv.appendChild(userSpan);
  promptDiv.appendChild(pathSpan);
  output.appendChild(promptDiv);

  const commandDiv = documentRef.createElement("div");
  const symbolSpan = documentRef.createElement("span");
  symbolSpan.className = "prompt-symbol";
  symbolSpan.textContent = "$";
  const textSpan = documentRef.createElement("span");
  textSpan.textContent = ` ${command}`;
  commandDiv.appendChild(symbolSpan);
  commandDiv.appendChild(textSpan);
  output.appendChild(commandDiv);

  trimOutputNodes(output, maxNodes);
}

export { trimOutputNodes, appendCommandHistory };
