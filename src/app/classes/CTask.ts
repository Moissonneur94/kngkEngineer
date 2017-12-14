import { CUser, CUrgency, CStatus, CCategory, CService } from "../classes";

export class CTask {
  public created: any;
  public owner: CUser;
  public id: string;
  public subject: string;
  public body: string;
  public dateOfExecution: any;
  public status: CStatus;
  public executor: CUser;
  public usageType: string;
  public service: CService;

  public category: CCategory;
  public lastupdate: any;
  public dateOfCompletion: any;
  public urgency: CUrgency;

  public comBody: string;

  constructor(object: object) {
    this.created = object["created"];
    this.owner =
      "object" === typeof object["owner"] ? object["owner"] : new CUser({});
    this.id = object["id"];
    this.subject = object["subject"];
    this.body = object["body"];
    this.dateOfExecution = object["dateOfExecution"];
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

    this.category =
      "object" === typeof object["category"]
        ? object["category"]
        : new CCategory({});
    this.lastupdate = object["lastupdate"];
    this.dateOfCompletion = object["dateOfCompletion"];
    this.urgency =
      "object" === typeof object["urgency"]
        ? object["urgency"]
        : new CUrgency({});

    this.comBody = object["comBody"];
  }
}
