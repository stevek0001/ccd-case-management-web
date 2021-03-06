import createSpyObj = jasmine.createSpyObj;
import { CaseEditWizardGuard } from './case-edit-wizard.guard';
import { ActivatedRouteSnapshot } from '@angular/router';
import { TestRouteSnapshotBuilder } from '../../test/test-route-snapshot-builder';
import { CaseEventTrigger } from '../../shared/domain/case-view/case-event-trigger.model';
import { WizardPage } from '../../shared/domain/wizard-page.model';
import { CaseField } from '../../shared/domain/definition/case-field.model';
import { AlertService } from '../alert/alert.service';

describe('CaseEditWizardGuard', () => {

  const PARENT_URL = '/case/123/trigger/editEvent';
  const PARENT_URL_SEGMENTS = PARENT_URL.split('/');

  let router: any;
  let routerHelper: any;
  let route: ActivatedRouteSnapshot;

  let eventTrigger: CaseEventTrigger;
  let routeParams: any;

  let wizardFactory: any;
  let wizard: any;
  let alertService: any;

  let wizardGuard: CaseEditWizardGuard;

  beforeEach(() => {

    eventTrigger = {
      id: 'editCase',
      name: 'Edit case',
      case_fields: [ new CaseField() ],
      event_token: 'xxx',
      wizard_pages: [ page('pageX') ],
    };

    routeParams = {
      'page': 'pageX'
    };

    router = createSpyObj('router', ['navigate']);
    router.navigate.and.returnValue(Promise.resolve(true));
    routerHelper = createSpyObj('RouterHelperService', ['getUrlSegmentsFromRoot']);
    routerHelper.getUrlSegmentsFromRoot.and.returnValue(PARENT_URL_SEGMENTS);

    let parentRoute = new TestRouteSnapshotBuilder().withData({
      eventTrigger: eventTrigger
    }).build();
    route = new TestRouteSnapshotBuilder()
      .withParent(parentRoute)
      .withParams(routeParams)
      .build();

    wizard = createSpyObj('Wizard', ['firstPage', 'hasPage', 'getPage', 'nextPage']);
    wizard.hasPage.and.returnValue(true);
    wizard.getPage.and.returnValue(eventTrigger.wizard_pages[0]);

    wizardFactory = createSpyObj('WizardFactory', ['create']);
    wizardFactory.create.and.returnValue(wizard);

    alertService = createSpyObj<AlertService>('AlertService', ['error']);

    wizardGuard = new CaseEditWizardGuard(router, routerHelper, wizardFactory, alertService);
  });

  it('by default, should not redirect', () => {
    wizardGuard.resolve(route);

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('by default, should resolve successfully', done => {
    wizardGuard.resolve(route)
      .then(value => {
        expect(value).toBeTruthy();
      })
      .then(done)
      .catch(fail);
  });

  describe('when no fields', () => {

    it('should redirect to submit page when fields are `null`', () => {
      eventTrigger.case_fields = null;

      wizardGuard.resolve(route);

      expect(router.navigate).toHaveBeenCalledWith([...PARENT_URL_SEGMENTS, 'submit']);
    });

    it('should redirect to submit page when fields are empty', () => {
      eventTrigger.case_fields = [];

      wizardGuard.resolve(route);

      expect(router.navigate).toHaveBeenCalledWith([...PARENT_URL_SEGMENTS, 'submit']);
    });

    it('should resolve with false as current navigation was cancelled', done => {
      eventTrigger.case_fields = null;

      wizardGuard.resolve(route)
        .then(value => expect(value).toEqual(false))
        .then(done)
        .catch(fail);
    });

  });

  describe('when no pages', () => {
    it('should redirect to submit page when pages are `null`', () => {
      eventTrigger.wizard_pages = null;

      wizardGuard.resolve(route);

      expect(router.navigate).toHaveBeenCalledWith([...PARENT_URL_SEGMENTS, 'submit']);
    });

    it('should redirect to submit page when pages are empty', () => {
      eventTrigger.wizard_pages = [];

      wizardGuard.resolve(route);

      expect(router.navigate).toHaveBeenCalledWith([...PARENT_URL_SEGMENTS, 'submit']);
    });

    it('should resolve with false as current navigation was cancelled', done => {
      eventTrigger.wizard_pages = null;

      wizardGuard.resolve(route)
        .then(value => expect(value).toEqual(false))
        .then(done)
        .catch(fail);
    });
  });

  describe('when no `page` param in route', () => {
    beforeEach(() => {
      delete routeParams['page'];

      wizard.firstPage.and.returnValue(page('page1'));
    });

    it('should redirect to first visible page of wizard', () => {
      wizardGuard.resolve(route);

      expect(router.navigate).toHaveBeenCalledWith([...PARENT_URL_SEGMENTS, 'page1']);
      expect(wizard.firstPage).toHaveBeenCalled();
    });

    it('should resolve with false as current navigation was cancelled', done => {
      wizardGuard.resolve(route)
        .then(value => expect(value).toEqual(false))
        .then(done)
        .catch(fail);
    });

    it('should redirect when `page` param is empty', () => {
      routeParams['page'] = '';

      wizardGuard.resolve(route);

      expect(router.navigate).toHaveBeenCalledWith([...PARENT_URL_SEGMENTS, 'page1']);
    });

    it('should redirect to submit when all pages hidden', () => {
      wizard.firstPage.and.returnValue(null);

      wizardGuard.resolve(route);

      expect(router.navigate).toHaveBeenCalledWith([...PARENT_URL_SEGMENTS, 'submit']);
    });
  });

  describe('when accessing an unknown page', () => {
    beforeEach(() => {
      routeParams['page'] = 'unknown';

      wizard.firstPage.and.returnValue(page('page1'));
      wizard.hasPage.and.returnValue(false);
    });

    it('should redirect to first wizard page', () => {
      wizardGuard.resolve(route);

      expect(wizard.hasPage).toHaveBeenCalledWith('unknown');
      expect(router.navigate).toHaveBeenCalledWith([...PARENT_URL_SEGMENTS, 'page1']);
    });

    it('should alert error', done => {
      wizardGuard.resolve(route)
        .then(() => {
          expect(alertService.error).toHaveBeenCalledWith(`No page could be found for 'unknown'`);
        })
        .then(done)
        .catch(fail);
    });

    it('should resolve with false as current navigation was cancelled', done => {
      wizardGuard.resolve(route)
        .then(value => expect(value).toEqual(false))
        .then(done)
        .catch(fail);
    });
  });

  function page(pageId: string): WizardPage {
    let wp = new WizardPage();
    wp.id = pageId;
    return wp;
  }
});
