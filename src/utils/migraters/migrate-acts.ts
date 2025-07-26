/*
    ФАЙЛ ДЛЯ ПЕРЕНОСА СТАРЫХ АКТИВНОСТЕЙ В НОВЫЙ ФОРМАТ АКТИВНОСТЕЙ
    ---------------------------------------------------------------

    Работает на активностях для версий с      1.0.4       по 2.0.0
                                         (необупликована)
*/

import fs from "fs";
import path from "path";
import { Printer, PrinterColors } from "../../libs/Printer";

const pr = new Printer("MIGRATER", "");

const mainFolder = [process.cwd(), "src", "assets", "activities", "files"]; // ПУТЬ К ИСХОДНИКАМ
const acts: Array<{ name: string; path: string; acts: string[] }> = [];

const dir = path.join(...mainFolder);
function syncFiles(dir: string) {
  fs.readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .forEach((file) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const act = require(path.join(dir, file));
      const pathFile = path.join(dir, file);

      acts.push({
        name: path.basename(pathFile).slice(0, -5),
        path: pathFile
          .replace(path.join(...mainFolder) + "\\", "")
          .slice(0, -path.basename(pathFile).length),
        acts: act,
      });
    });

  fs.readdirSync(dir)
    .filter((folder) => fs.lstatSync(path.join(dir, folder)).isDirectory())
    .forEach((folder) => syncFiles(path.join(dir, folder)));
}

function preMigrate(acts: { name: string; path: string; acts: string[] }[]) {
  const res: {
    name: string;
    enable: boolean;
    prefix: string;
    activities: string[];
    parent: string;
  }[] = [];

  acts.forEach((act) =>
    res.push({
      name: act.name,
      prefix: "",
      enable: true,
      activities: act.acts.flat(),
      parent: act.path,
    }),
  );

  return res;
}

function migrate(
  acts: {
    name: string;
    enable: boolean;
    prefix: string;
    activities: string[];
    parent: string;
  }[],
) {
  const mother = path.join(
    process.cwd(),
    "src",
    "generated",
    "activities",
    "files",
  );

  fs.mkdirSync(mother, {
    recursive: true,
  });

  acts.forEach((act) => {
    const { parent, ...exit } = act;

    fs.mkdirSync(path.join(mother, parent), { recursive: true });
    fs.writeFileSync(
      path.join(mother, parent, act.name + ".json"),
      JSON.stringify(exit, undefined, 2),
    );

    pr.print(parent + act.name + ".json", PrinterColors.Success);
  });
}

syncFiles(dir);

migrate(preMigrate(acts));
