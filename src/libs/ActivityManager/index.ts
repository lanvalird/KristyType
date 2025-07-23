import { ActivityList, ActivityListController } from "./ActivityListController";

export class ActivityManager {
  private _alc: ActivityListController;

  constructor(activitiesLists: ActivityList[]) {
    this._alc = new ActivityListController(activitiesLists);
  }

  public addActivityList(list: ActivityList) {
    this._alc.addActivitiesList;
  }

  public getRandomActivity() {
    return this._alc.getRandomActivity();
  }

  public async registerActivityList(path: string) {
    return this._alc.registerActivityList(path);
  }
}
