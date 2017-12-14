export class CStatus {
  public status: string;

  constructor(object: object) {
    this.status = object["status"];
  }
}
