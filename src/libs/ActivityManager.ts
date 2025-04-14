// Мой мозг не смог адекватно обработать т/з и теперь вот:
export class ActivityManager {
  private _activity: string = "";

  constructor(activitiesPath: string) {}

  get activity() {
    return this._activity;
  }
}
