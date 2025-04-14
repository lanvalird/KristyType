import { randomIntFromInterval } from "@src/utils/randomIntFromInterval";
import fs from "node:fs";

interface ActivityList {
  name: string;
  prefix: string;
  enable: boolean;
  activities: string[];
}

export class ActivityManager {
  private _activityLists: ActivityList[] = [];

  constructor(activitiesLists: ActivityList[]) {
    this._activityLists = activitiesLists;
  }

  set activitiesLists(lists: ActivityList[]) {
    this._activityLists = lists;
  }

  get activitiesLists() {
    return this._activityLists;
  }

  public addActivitiesList(list: ActivityList) {
    this._activityLists.push(list);
  }

  public getRandomActivity() {
    const list =
      this._activityLists[
        randomIntFromInterval(0, this._activityLists.length - 1)
      ].activities;
    const activity = list[randomIntFromInterval(0, list.length)];

    return activity;
  }

  public async registerActivityList(path: string) {
    if (!fs.existsSync(path)) return;

    const isDir = fs.lstatSync(path).isDirectory();
    const isFile = fs.lstatSync(path).isFile();
    if (!isDir && !isFile)
      throw new Error("Parameter 'path' is not path to directory or file");

    if (isDir) {
      const directory = fs.readdirSync(path, {
        withFileTypes: true,
        encoding: "utf8",
      });
      for (let i = 0; i < directory.length; i++) {
        const file = directory[i];
        if (!file.isFile() || !file.name.endsWith(".json")) return;

        const config: ActivityList = await import(
          `${file.parentPath}/${file.name}`
        );
        this.addActivitiesList(config);
      }
    } else {
      const config: ActivityList = await import(path);
      this.addActivitiesList(config);
    }
  }
}
