export class CCategory {
  public id: string;
  public avatar: string;
  public name: string;
  public serviceOwner: string;
  public typeCategory: string;

  constructor(object: object) {
    this.avatar = object["avatar"];
    this.id = object["id"];
    this.name = object["name"];
    this.serviceOwner = object["serviceOwner"];
    this.typeCategory = object["typeCategory"];
  }
}
