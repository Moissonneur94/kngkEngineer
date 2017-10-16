export class CSearch {
  sResult: string;
  type: string;
  FoundText: string;
  code: string;

  constructor(object: Object) {
    this.sResult = object["sResult"];
    this.type = object["type"];
    this.FoundText = object["FoundText"];
    this.code = object["code"];
  }
}