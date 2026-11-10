import { lsCommand } from "./ls.js";
import { cdCommand } from "./cd.js";
import { catCommand } from "./cat.js";
import { helpCommand } from "./help.js";
import { languageCommand } from "./idioma.js";
import { historyCommand } from "./history.js";
import { whoamiCommand } from "./whoami.js";
import { pwdCommand } from "./pwd.js";
import { clearCommand } from "./clear.js";
import { echoCommand } from "./echo.js";
import { rebootCommand } from "./reboot.js";
import { calcCommand } from "./calc.js";
import { profileLinkCommands } from "./profile-links.js";

const commandRegistry = [
  lsCommand,
  cdCommand,
  catCommand,
  helpCommand,
  languageCommand,
  historyCommand,
  whoamiCommand,
  pwdCommand,
  clearCommand,
  echoCommand,
  rebootCommand,
  calcCommand,
  ...profileLinkCommands,
];

export { commandRegistry };
