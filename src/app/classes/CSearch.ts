export class CSearch {
  public sResult: string;
  public type: string;
  public FoundText: string;
  public code: string;

  constructor(object: object) {
    this.sResult = object["sResult"];
    this.type = object["type"];
    this.FoundText = object["FoundText"];
    this.code = object["code"];
  }
}
