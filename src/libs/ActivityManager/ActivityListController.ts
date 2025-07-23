import { randomIntFromInterval as rnd } from "@src/utils/randomIntFromInterval";
import { existsSync, lstatSync, readdirSync } from "node:fs";

export interface ActivityList {
  name: string;
  prefix: string;
  enable: boolean;
  activities: string[];
}

export class ActivityListController {
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

  public addActivitiesList(list: ActivityList): void {
    this._activityLists.push(list);
  }

  public getRandomActivity(): string {
    const index = rnd(0, this._activityLists.length - 1);
    const { activities } = this._activityLists[index];

    return activities[rnd(0, activities.length)];
  }

  public async registerActivityList(path: string) {
    if (!existsSync(path)) return;

    const stat = lstatSync(path);
    const isDir = stat.isDirectory();
    const isFile = stat.isFile();

    if (!isDir && !isFile)
      throw new Error("Parameter 'path' is not path to directory or file");

    if (isDir) {
      const directory = readdirSync(path, {
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
