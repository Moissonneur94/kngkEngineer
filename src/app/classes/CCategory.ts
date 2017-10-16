export class CCategory {

  id: string;
  avatar: string;
  name: string;
  serviceOwner: string;
  typeCategory: string;


  constructor(object: Object) {
    this.avatar = object["avatar"];
    this.id = object["id"];
    this.name = object["name"];
    this.serviceOwner = object["serviceOwner"];
    this.typeCategory = object["typeCategory"];
  }

}