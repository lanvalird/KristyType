import { BOT_LOG_PREFIX } from "../Bot";

export const printLogColorType = {
  getDefault: () => {
    return "\x1b[0;35m";
  },
  getSuccess: () => {
    return "\x1b[0;32m";
  },
  getError: () => {
    return "\x1b[0;31m";
  },
};
export function printLog(message: string, type?: string) {
  if (!type) {
    type = printLogColorType.getDefault();
  }
  console.log(BOT_LOG_PREFIX + type + message + "\x1b[0m");
}
