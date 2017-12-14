import { CUser, CUrgency, CStatus, CCategory, CService } from "../classes";

export class CCancelTask {
  public code: string;
  public name: string;
  public usageType: string;
  public comBody: string;
  public dateOfExecution: any;
  public created: any;
  public executor: CUser;
  public owner: CUser;
  public urgency: CUrgency;
  public service: CService;
  public category: CCategory;
  public status: CStatus;

  constructor(object: object) {
    this.created = object["created"];
    this.owner =
      "object" === typeof object["owner"] ? object["owner"] : new CUser({});
    this.code = object["code"];
    this.status =
      "object" === typeof object["status"] ? object["status"] : new CStatus({});
    this.executor =
      "object" === typeof object["executor"]
        ? object["executor"]
        : new CUser({});
    this.usageType = object["usageType"];
    this.service =
      "object" === typeof object["service"]
        ? object["service"]
        : new CService({});
    this.dateOfExecution = object["dateOfExecution"];
    this.category =
      "object" === typeof object["category"]
        ? object["category"]
        : new CCategory({});
    this.urgency =
      "object" === typeof object["urgency"]
        ? object["urgency"]
        : new CUrgency({});

    this.comBody = object["comBody"];
  }
}
