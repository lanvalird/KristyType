import { randomIntFromInterval as rnd } from "@src/utils/randomIntFromInterval";
import { promises as fs } from "node:fs";
import { join } from "node:path";

export interface ActivityList {
  name: string;
  prefix: string;
  enable: boolean;
  activities: string[];
}

export class ActivityListController {
  private _activityLists: ActivityList[];

  constructor(activitiesLists: ActivityList[] = []) {
    this._activityLists = this.validateActivitiesLists(activitiesLists);
  }

  set activitiesLists(lists: ActivityList[]) {
    this._activityLists = this.validateActivitiesLists(lists);
  }

  get activitiesLists(): ActivityList[] {
    return structuredClone(this._activityLists);
  }

  public addActivitiesList(list: ActivityList): void {
    this.validateActivityList(list);
    this._activityLists.push(structuredClone(list));
  }

  public async getRandomList(allowEmpty = false): Promise<ActivityList> {
    if (this._activityLists.length === 0) {
      throw new Error("No activity lists available");
    }

    const lists = allowEmpty
      ? this._activityLists
      : this._activityLists.filter((list) => list.activities?.length > 0);

    if (lists.length === 0) {
      throw new Error(
        allowEmpty
          ? "No activity lists available"
          : "No non-empty activity lists available",
      );
    }

    return lists[rnd(0, lists.length - 1)];
  }

  public async getRandomActivity(): Promise<string> {
    const randomList = await this.getRandomList();

    if (randomList.activities.length === 0) {
      throw new Error("Selected activity list is empty");
    }

    return randomList.activities[rnd(0, randomList.activities.length - 1)];
  }

  public async registerActivityList(path: string): Promise<void> {
    try {
      await this._registerActivityList(path);
    } catch (err) {
      console.error(`Error processing path ${path}:`, err);
      throw err;
    }
  }

  private async _registerActivityList(path: string): Promise<void> {
    try {
      await fs.access(path);

      const stat = await fs.lstat(path);

      if (stat.isDirectory()) {
        await this.processDirectory(path);
      } else if (stat.isFile()) {
        await this.processFile(path);
      }
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        console.warn(`Path does not exist: ${path}`);
        return;
      }
      throw err;
    }
  }

  private validateActivitiesLists(lists: ActivityList[]): ActivityList[] {
    if (!Array.isArray(lists)) {
      throw new Error("Activities lists must be an array");
    }
    return lists.map((list) => this.validateActivityList(list));
  }

  private validateActivityList(list: ActivityList): ActivityList {
    if (!list || typeof list !== "object") {
      throw new Error("Activity list must be an object");
    }
    if (!list.activities || !Array.isArray(list.activities)) {
      throw new Error("Activity list must have an activities array");
    }
    return list;
  }

  private async processDirectory(dirPath: string): Promise<void> {
    const files = await fs.readdir(dirPath, {
      withFileTypes: true,
      encoding: "utf8",
    });

    await Promise.all(
      files
        .filter((dirent) => dirent.isFile() && dirent.name.endsWith(".json"))
        .map(async (file) => {
          try {
            await this.loadAndAddConfig(join(dirPath, file.name));
          } catch (err) {
            console.error(`Error loading file ${file.name}:`, err);
          }
        }),
    );
  }

  private async processFile(filePath: string): Promise<void> {
    if (!filePath.endsWith(".json")) {
      console.warn(`Skipping non-JSON file: ${filePath}`);
      return;
    }

    await this.loadAndAddConfig(filePath);
  }

  private async loadAndAddConfig(filePath: string): Promise<void> {
    try {
      const imported = await import(filePath);
      const config = imported.default || imported;
      this.addActivitiesList(config);
    } catch (err) {
      console.error(`Error parsing file ${filePath}:`, err);
      throw err;
    }
  }
}
