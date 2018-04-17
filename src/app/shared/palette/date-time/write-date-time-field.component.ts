import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ccd-write-date-time-field',
  templateUrl: './write-date-time-field.html'
})
export class WriteDateTimeFieldComponent extends AbstractFieldWriteComponent implements OnInit {

  dateTimeControl: FormControl;

  ngOnInit(): void {
    this.dateTimeControl = this.registerControl(new FormControl(this.caseField.value));
  }

}
