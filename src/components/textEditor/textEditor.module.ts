
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TextEditorComponent } from './textEditor';

@NgModule({
  declarations: [
    TextEditorComponent,
  ],
  imports: [
    IonicPageModule.forChild(TextEditorComponent),
  ],
  exports: [
    TextEditorComponent
  ]
})
export class RichTextComponentModule {}