export class CError {
  public faultheader: string;
  public faultstring: string;

  constructor(object: object) {
    this.faultheader = object["faultheader"];
    this.faultstring = object["faultstring"];
  }
}
