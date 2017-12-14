import { CCategory } from "../classes";

export class CService {
  public id: string;
  public name: string;
  public avatar: string;
  public group: string;
  public category: CCategory;
  public comBody: string;
  public keys: number;

  constructor(object: object) {
    this.avatar = object["avatar"];
    this.id = object["id"];
    this.name = object["name"];
    this.group = object["group"];
    this.category =
      "object" === typeof object["category"]
        ? object["category"]
        : new CCategory({});

    this.comBody = object["comBody"];
    this.keys = object["keys"];
  }
}
