const PROFILES = {
  github: {
    href: "https://github.com/hermesrm",
    label: "github.com/hermesrm",
    description: {
      es: "Abre el perfil de GitHub",
      en: "Open the GitHub profile",
    },
  },
  linkedin: {
    href: "https://es.linkedin.com/in/hermesrm",
    label: "es.linkedin.com/in/hermesrm",
    description: {
      es: "Abre el perfil de LinkedIn",
      en: "Open the LinkedIn profile",
    },
  },
};

function createProfileCommand(profileName) {
  const profile = PROFILES[profileName];

  return {
    id: profileName.toUpperCase(),
    aliases: {
      es: [profileName],
      en: [profileName],
    },
    description: profile.description,

    execute(context, args) {
      if (args?.includes("--help")) {
        return {
          output:
            context.lang === "es"
              ? `Uso: ${profileName} [--help]`
              : `Usage: ${profileName} [--help]`,
          code: 0,
        };
      }

      if (args?.length) {
        return context.lang === "es"
          ? `Uso: ${profileName} [--help]`
          : `Usage: ${profileName} [--help]`;
      }

      return {
        type: "external-link",
        href: profile.href,
        label: profile.label,
      };
    },
  };
}

const githubCommand = createProfileCommand("github");
const linkedinCommand = createProfileCommand("linkedin");
const profileLinkCommands = [githubCommand, linkedinCommand];

export { githubCommand, linkedinCommand, profileLinkCommands };
