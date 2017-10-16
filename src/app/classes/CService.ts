import { CCategory } from "../classes";

export class CService {
	
	id: string;
	name: string;
	avatar: string;
  group: string;
  category: CCategory;

  comBody: string;
  keys: number;


	constructor(object: Object) {
    this.avatar = object["avatar"];
    this.id = object["id"];
    this.name = object["name"];
    this.group = object["group"];
    this.category = ("object" === typeof object["category"])? object["category"] : new CCategory({});

    this.comBody = object["comBody"];
    this.keys = object["keys"];
	}


}