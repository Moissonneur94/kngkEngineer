import { Component} from '@angular/core';


@Component({
  selector: 'search',
  templateUrl: 'search.html'
})
export class SearchComponent {

		sClick: boolean= false; //для вывода результатьв поиска
    sInput: string; 
			
  constructor() {
   
  }

  searchOrder() {
    
    //проверка заполнености поля
  	if(this.sInput!=null) {
  	 this.sClick = true;
    }
  		

  	 
  }
}
