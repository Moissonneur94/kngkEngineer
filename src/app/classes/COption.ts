import { CStatus } from "../classes";
export class COption {
  
  code: string;
  name: string;
  serviceCategory: string;
  created: any;
  status:  CStatus;
  org: string;
  reqSource: string;



  constructor(object: Object) {
    this.serviceCategory = object["serviceCategory"];
    this.status = ("object" === typeof object["status"])? object["status"] : new CStatus({});
    this.created = object["created"];
    this.code = object["code"];
    this.reqSource = object["reqSource"];
    this.name = object["name"];
    this.org = object["org"];
    


  }

  
}