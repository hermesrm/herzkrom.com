const EXTERNAL_PROFILES = {
  github: {
    href: "https://github.com/hermesrm",
    label: "hermesrm (Hermes Rodríguez Mohedano)",
  },
  linkedin: {
    href: "https://es.linkedin.com/in/hermesrm",
    label: "Hermes Rodríguez Mohedano - Prosegur | LinkedIn",
  },
};

const openLinkCommand = {
  id: "OPEN_LINK",
  aliases: {
    es: ["abrir", "open", "github", "linkedin"],
    en: ["open", "abrir", "github", "linkedin"],
  },
  description: {
    es: "Abre un perfil externo",
    en: "Open an external profile",
  },

  execute(context, args) {
    if (args?.includes("--help")) {
      const helpText =
        context.lang === "es"
          ? [
              "Uso: abrir <github|linkedin>",
              "",
              "Abre uno de los perfiles externos disponibles.",
            ].join("\n")
          : [
              "Usage: open <github|linkedin>",
              "",
              "Open one of the available external profiles.",
            ].join("\n");
      return { output: helpText, code: 0 };
    }

    const profileName = args?.length === 1 ? args[0].toLowerCase() : context.inputCmd;
    const profile = profileName ? EXTERNAL_PROFILES[profileName] : null;
    if (!profile) {
      return context.lang === "es"
        ? "Uso: abrir <github|linkedin>"
        : "Usage: open <github|linkedin>";
    }

    return {
      type: "external-link",
      href: profile.href,
      label: profile.label,
    };
  },
};

export { openLinkCommand };
