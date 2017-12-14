import { CStatus } from "../classes";

export class COption {
  public code: string;
  public name: string;
  public serviceCategory: string;
  public created: any;
  public status: CStatus;
  public org: string;
  public reqSource: string;

  constructor(object: object) {
    this.serviceCategory = object["serviceCategory"];
    this.status =
      "object" === typeof object["status"] ? object["status"] : new CStatus({});
    this.created = object["created"];
    this.code = object["code"];
    this.reqSource = object["reqSource"];
    this.name = object["name"];
    this.org = object["org"];
  }
}
