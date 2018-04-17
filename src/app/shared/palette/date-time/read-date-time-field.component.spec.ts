import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadDateTimeFieldComponent } from './read-date-time-field.component';
import { DebugElement } from '@angular/core';
import { FieldType } from '../../domain/definition/field-type.model';
import { CaseField } from '../../domain/definition/case-field.model';
import { DatePipe } from '../utils/date.pipe';

describe('ReadDateTimeFieldComponent', () => {

  const FIELD_TYPE: FieldType = {
    id: 'Date',
    type: 'Date'
  };
  const VALUE = '1800-07-15';
  const CASE_FIELD: CaseField = {
    id: 'x',
    label: 'X',
    display_context: 'OPTIONAL',
    field_type: FIELD_TYPE,
    value: VALUE
  };
  const FORMATTED_VALUE = 'Jul 15, 1800';
  const EMPTY = '';

  let fixture: ComponentFixture<ReadDateTimeFieldComponent>;
  let component: ReadDateTimeFieldComponent;
  let de: DebugElement;

  beforeEach(async(() => {

    TestBed
      .configureTestingModule({
        declarations: [
          ReadDateTimeFieldComponent,
          DatePipe
        ],
        providers: []
      })
      .compileComponents();

    fixture = TestBed.createComponent(ReadDateTimeFieldComponent);
    component = fixture.componentInstance;

    component.caseField = CASE_FIELD;

    de = fixture.debugElement;
    fixture.detectChanges();
  }));

  it('should render output with date pipe formatting', () => {
    component.caseField.value = VALUE;
    fixture.detectChanges();

    expect(de.nativeElement.textContent).toEqual(FORMATTED_VALUE);
  });

  it('should render empty string value as empty string', () => {
    component.caseField.value = '';
    fixture.detectChanges();

    expect(de.nativeElement.textContent).toEqual(EMPTY);
  });

  it('should render undefined value as empty string', () => {
    component.caseField.value = undefined;
    fixture.detectChanges();

    expect(de.nativeElement.textContent).toEqual(EMPTY);
  });

  it('should render null value as empty string', () => {
    component.caseField.value = null;
    fixture.detectChanges();

    expect(de.nativeElement.textContent).toEqual(EMPTY);
  });

});
