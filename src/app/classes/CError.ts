export class CError {

  faultheader: string;
  faultstring: string;

	constructor(object: Object) {
    this.faultheader = object["faultheader"];
    this.faultstring = object["faultstring"];
	}
}