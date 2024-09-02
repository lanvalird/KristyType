import { Printer } from "@src/libs/Printer";
import fs from "fs";
import path from "path";

export default function () {
  const pr = new Printer("KRISTY");

  fs.readFile(path.join(__dirname, "../changelog.txt"), "utf8", (e, d) => {
    if (e instanceof Error) return;
    pr.notify(d);
  });
}
