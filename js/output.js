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

function appendTextWithSafeLinks(container, text, documentRef = globalThis.document) {
  const allowedLinks =
    /\[([^\]]+)\]\((https:\/\/(?:github\.com\/hermesrm|es\.linkedin\.com\/in\/hermesrm)|mailto:(?:contacto|contact)@herzkrom\.com)\)/g;
  let position = 0;
  let match;

  while ((match = allowedLinks.exec(text))) {
    if (match.index > position) {
      container.appendChild(documentRef.createTextNode(text.slice(position, match.index)));
    }

    const link = documentRef.createElement("a");
    link.href = match[2];
    link.className = "terminal-link";
    if (match[2].startsWith("https://")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    link.textContent = match[1];
    container.appendChild(link);
    position = allowedLinks.lastIndex;
  }

  if (position < text.length) {
    container.appendChild(documentRef.createTextNode(text.slice(position)));
  }
}

export { trimOutputNodes, appendCommandHistory, appendTextWithSafeLinks };
