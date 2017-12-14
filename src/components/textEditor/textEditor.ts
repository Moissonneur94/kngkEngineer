// import { StatusBar } from "@ionic-native/status-bar";
import { Component, ViewChild, ElementRef, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "text-editor",
  templateUrl: "textEditor.html"
})
export class TextEditorComponent {
  @ViewChild("editor") public editor: ElementRef;
  @ViewChild("decorate") public decorate: ElementRef;
  @ViewChild("styler") public styler: ElementRef;

  @Input() public formControlItem: FormControl;

  public uniqueId = `editor${Math.floor(Math.random() * 1000000)}`;

  // private wireupResize() {

  //   let element = this.editor.nativeElement as HTMLDivElement;

  //   let height = (window.innerHeight || document.body.clientHeight) - 250;
  //   let textareaHeight = Math.round((height / 100.00) * 45);
  //   element.style.height = `${textareaHeight}px`;

  // }

  private updateItem() {
    const element = this.editor.nativeElement as HTMLDivElement;
    element.innerHTML = this.formControlItem.value;

    element.innerHTML =
      element.innerHTML != null || element.innerHTML !== "" ? "" : "<p></p>";

    const updateItem = () => {
      this.formControlItem.setValue(element.innerHTML);
    };

    element.onchange = () => updateItem();
    element.onkeyup = () => updateItem();
    element.onpaste = () => updateItem();
    element.oninput = () => updateItem();
  }

  private wireupButtons() {
    const buttons = (this.decorate
      .nativeElement as HTMLDivElement).getElementsByTagName("button");
    // for (const button of buttons) {
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];

      let command = button.getAttribute("data-command");

      if (command.includes("|")) {
        const parameter = command.split("|")[1];
        command = command.split("|")[0];

        button.addEventListener("click", () => {
          document.execCommand(command, false, parameter);
        });
      } else {
        button.addEventListener("click", () => {
          document.execCommand(command);
        });
      }
    }
  }

  public ngAfterContentInit() {
    this.updateItem();
    this.wireupButtons();
  }
}
