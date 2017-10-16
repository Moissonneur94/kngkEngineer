import { CUser, CUrgency, CStatus, CCategory, CService } from "../classes"

export class CCancelTask{
  code: string;
  name: string;
  usageType: string;
  comBody: string;
  dateOfExecution: any;
  created: any;
  executor: CUser;
  owner: CUser;
  urgency: CUrgency;
  service: CService;
  category: CCategory;
  status: CStatus;

  constructor(object: Object) {
    this.created = object["created"];
    this.owner = ("object" === typeof object["owner"])? object["owner"] : new CUser({});
    this.code = object["code"];
    this.status = ("object" === typeof object["status"])? object["status"] : new CStatus({});
    this.executor = ("object" === typeof object["executor"])? object["executor"] : new CUser({});
    this.usageType = object["usageType"];
    this.service = ("object" === typeof object["service"])? object["service"] : new CService({});
    this.dateOfExecution = object["dateOfExecution"];
    this.category = ("object" === typeof object["category"])? object["category"] : new CCategory({});
    this.urgency = ("object" === typeof object["urgency"])? object["urgency"] : new CUrgency({});

    this.comBody = object["comBody"];
  }

}