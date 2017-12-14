export class CUser {
  public fio: string;
  public avatar: string;
  public position: string;
  public channelTelephone: string;
  public countActive: string;
  public company: string;
  public email: string;
  public telephone: string;
  public departament: string;
  public manager: string;

  constructor(object: object) {
    this.fio = object["fio"];
    this.avatar = object["avatar"];
    this.position = object["position"];
    this.channelTelephone = object["channelTelephone"];
    this.countActive = object["countActive"];
    this.company = object["company"];
    this.email = object["email"];
    this.telephone = object["telephone"];
    this.departament = object["departament"];
    this.manager = object["manager"];
  }
}
