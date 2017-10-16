export class CUser {

		fio: string;
		avatar: string;
    position: string;
    channelTelephone: string;
    countActive: string;
    company: string;
    email: string;
    telephone: string;
    departament: string;
    manager: string;

	constructor(object: Object) {
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

	onChange() {

	}
}