import { Component } from "@angular/core";

@Component({
  selector: "search",
  templateUrl: "search.html"
})
export class SearchComponent {
  public sClick: boolean = false; // для вывода результатов поиска
  public sInput: string;

  public searchOrder() {
    // проверка заполнености поля
    if (this.sInput != null) {
      this.sClick = true;
    }
  }
}
