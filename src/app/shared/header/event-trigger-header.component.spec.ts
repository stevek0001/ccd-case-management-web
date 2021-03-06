import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EventTriggerHeaderComponent } from './event-trigger-header.component';
import { DebugElement } from '@angular/core';
import { text } from '../../test/helpers';
import { By } from '@angular/platform-browser';
import { CaseEventTrigger } from '../domain/case-view/case-event-trigger.model';

describe('EventTriggerHeaderComponent', () => {

  const $HEADING = By.css('h3');

  const EVENT_TRIGGER: CaseEventTrigger = {
    id: 'TEST_TRIGGER',
    name: 'Test Trigger',
    description: 'This is a test trigger',
    case_id: '456',
    case_fields: [],
    event_token: 'test-token',
    wizard_pages: []
  };

  let fixture: ComponentFixture<EventTriggerHeaderComponent>;
  let component: EventTriggerHeaderComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          EventTriggerHeaderComponent
        ],
        providers: []
      })
      .compileComponents();

    fixture = TestBed.createComponent(EventTriggerHeaderComponent);
    component = fixture.componentInstance;

    component.eventTrigger = EVENT_TRIGGER;

    de = fixture.debugElement;
    fixture.detectChanges();
  }));

  it('should render a header based on the case details', () => {
    let header = de.query($HEADING);
    expect(header).toBeTruthy();
    expect(text(header)).toEqual('Test Trigger');
  });

});
