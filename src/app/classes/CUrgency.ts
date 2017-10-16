export class CUrgency {
	
	urgency: string;
	
  constructor(object: Object) {
    this.urgency = (undefined !== object["urgency"])? object["urgency"] : "";
  }

	onChange() {

	}
}