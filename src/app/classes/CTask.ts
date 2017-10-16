import { CUser, CUrgency, CStatus, CCategory, CService } from "../classes";

export class CTask {
	
  created: any;
  owner: CUser;
  id: string;
  subject: string;
  body: string;
  dateOfExecution: any;
  status:  CStatus;
  executor: CUser;
  usageType: string;
  service: CService;

  category: CCategory;
  lastupdate: any;
  dateOfCompletion: any;
  urgency: CUrgency;
  
  comBody: string;

	constructor(object: Object) {
    this.created = object["created"];
    this.owner = ("object" === typeof object["owner"])? object["owner"] : new CUser({});
    this.id = object["id"];
    this.subject = object["subject"];
    this.body = object["body"];
    this.dateOfExecution = object["dateOfExecution"];
    this.status = ("object" === typeof object["status"])? object["status"] : new CStatus({});
    this.executor = ("object" === typeof object["executor"])? object["executor"] : new CUser({});
    this.usageType = object["usageType"];
    this.service = ("object" === typeof object["service"])? object["service"] : new CService({});

    this.category = ("object" === typeof object["category"])? object["category"] : new CCategory({});
    this.lastupdate = object["lastupdate"];
    this.dateOfCompletion = object["dateOfCompletion"];
    this.urgency = ("object" === typeof object["urgency"])? object["urgency"] : new CUrgency({});

    this.comBody = object["comBody"];
	}


}