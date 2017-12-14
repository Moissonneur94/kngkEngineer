export class CUrgency {
  public urgency: string;

  constructor(object: object) {
    this.urgency = undefined !== object["urgency"] ? object["urgency"] : "";
  }
}
