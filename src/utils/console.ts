import { log_prefix } from "../config.json";

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
  console.log(log_prefix + type + message + "\x1b[0m");
}
