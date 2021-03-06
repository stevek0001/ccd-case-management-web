let StepUtils = require('../../../utils/step.utils.js')
let Login = require('../../../page-objects/login.po.js')
let CaseListResults = require('../../../page-objects/caseListResults.po.js')
let CaseCreateStep = require('../../../page-objects/caseCreateStep.po.js')
let CaseCreateCYA = require('../../../page-objects/caseCreateCYA.po.js')
let CaseView = require('../../../page-objects/caseView.po.js')

describe('create and view case - simple email type (read/write)', function() {

beforeEach(function(){

   let browserUtils = new BrowserUtils("", false)

   browser.ignoreSynchronization = true
   browser.get(process.env.TEST_FRONTEND_URL || 'http://localhost:3451').then(function()
      { let loginPage = new Login
        loginPage.signInTo()
      })

});

afterEach(function(){

  let browserUtils = new BrowserUtils("", false)
  browserUtils.signOut()

});

it('Should create case with simple email type and display on case view', function() {

   let caseListResultsPage = new CaseListResults

   caseListResultsPage.isLoaded()

   let stopAtStep = 0

   let stepUtils = new StepUtils
   stepUtils.caseListResultsPageStartingANewCase()

   let caseCreateStep = new CaseCreateStep

   caseCreateStep.continueBy(stopAtStep)

   let failedOnMissingFieldLabel = 'Field labels missing from field on create step' + stopAtStep
   let failedOnMissingFieldHint = 'Field hint missing from field on create step' + stopAtStep
   let failedOnFieldValue = 'Field value was not set as expected on create step' + stopAtStep

   expect(caseCreateStep.getEmailInputFieldLabel()).toBe('An `Email` field (Optional)', failedOnMissingFieldLabel)
   expect(caseCreateStep.getEmailInputFieldHint()).toBe('A valid email address.', failedOnMissingFieldHint)
   expect(caseCreateStep.getEmailInputFieldBoxValue()).toBe('', failedOnFieldValue)

   caseCreateStep.setEmailInputFieldBoxValue('test.email@bobmail.info')

   let stopAtCYA = 3

   caseCreateStep.continueBy(stopAtCYA)

   caseCreateCYAPage = new CaseCreateCYA

   let l = ['An `Email` field']
   let v = ['test.email@bobmail.info']
   let c = ['Change']

   failedOnMissingFieldLabel = 'Field labels missing from field on check your answers page'
   failedOnFieldValue = 'Field value was not set as expected on check your answers page'
   let failedOnMissingLink = 'Link was missing from check your answers page'

   expect(caseCreateCYAPage.getFormRowLabelText(4)).toEqual(l, failedOnMissingFieldLabel)
   expect(caseCreateCYAPage.getFormRowValueText(4)).toEqual(v, failedOnFieldValue)
   expect(caseCreateCYAPage.getFormRowChangeLinkText(4)).toEqual(c, failedOnMissingLink)
   caseCreateCYAPage.clickSubmitButton()

   let caseViewPage = new CaseView

   caseViewPage.clickTabLabeled('First tab')

   failedOnMissingFieldLabel = 'Field labels missing from field on case view page'
   failedOnFieldValue = 'Field value was not set as expected on case view page'

   expect(caseViewPage.getTabRowLabelText(4)).toBe('An `Email` field', failedOnMissingFieldLabel)
   expect(caseViewPage.getTabRowValueText(4)).toBe('test.email@bobmail.info', failedOnFieldValue)

})

it('Should create case with simple email type (use previous) and displayed on case view', function() {

   let caseListResultsPage = new CaseListResults

   caseListResultsPage.isLoaded()

   let stopAtStep = 0

   let stepUtils = new StepUtils
   stepUtils.caseListResultsPageStartingANewCase()

   let caseCreateStep = new CaseCreateStep

   caseCreateStep.continueBy(stopAtStep)

   caseCreateStep.setEmailInputFieldBoxValue('test.email@bobmail.info')
   caseCreateStep.clickContinueButton()
   caseCreateStep.clickPreviousButton()
   browser.waitForAngular

   let failedOnFieldValue = 'Field value was not set as expected on create step ' + stopAtStep

   expect(caseCreateStep.getEmailInputFieldBoxValue()).toBe('test.email@bobmail.info', failedOnFieldValue)

   caseCreateStep.setEmailInputFieldBoxValue('test.email2@bobmail.info')

   let stopAtCYA = 3

   caseCreateStep.continueBy(stopAtCYA)

   caseCreateCYAPage = new CaseCreateCYA

   let l = ['An `Email` field']
   let v = ['test.email2@bobmail.info']

   failedOnMissingFieldLabel = 'Field labels missing from field on check your answers page'
   failedOnFieldValue = 'Field value was not set as expected on check your answers page'

   expect(caseCreateCYAPage.getFormRowLabelText(4)).toEqual(l, failedOnMissingFieldLabel)
   expect(caseCreateCYAPage.getFormRowValueText(4)).toEqual(v, failedOnFieldValue)
   caseCreateCYAPage.clickSubmitButton()

   let caseViewPage = new CaseView

   caseViewPage.clickTabLabeled('First tab')

   failedOnMissingFieldLabel = 'Field labels missing from field on case view page'
   failedOnFieldValue = 'Field value was not set as expected on case view page'

   expect(caseViewPage.getTabRowLabelText(4)).toBe('An `Email` field', failedOnMissingFieldLabel)
   expect(caseViewPage.getTabRowValueText(4)).toBe('test.email2@bobmail.info', failedOnFieldValue)

 })

it('Should create a case with email type (using check your answers) and displayed on caseview', function() {

   let caseListResultsPage = new CaseListResults

   caseListResultsPage.isLoaded()

   let stopAtStep = 0

   let stepUtils = new StepUtils
   stepUtils.caseListResultsPageStartingANewCase()

   let caseCreateStep = new CaseCreateStep

   caseCreateStep.continueBy(stopAtStep)

   caseCreateStep.continueBy(stopAtStep)
   caseCreateStep.setEmailInputFieldBoxValue('test.email@bobmail.info')

   let stopAtCYA = 3

   caseCreateStep.continueBy(stopAtCYA)

   caseCreateCYAPage = new CaseCreateCYA

   caseCreateCYAPage.clickFormRowChangeLink(1)

   let failedOnFieldValue = 'Field value was not set as expected on create step ' + stopAtStep

   expect(caseCreateStep.getEmailInputFieldBoxValue()).toBe('test.email@bobmail.info', failedOnFieldValue)

   caseCreateStep.setEmailInputFieldBoxValue('test.email2@bobmail.info')

   caseCreateStep.continueBy(stopAtCYA)

   caseCreateCYAPage = new CaseCreateCYA

   let l = ['An `Email` field']
   let v = ['test.email2@bobmail.info']

   failedOnMissingFieldLabel = 'Field labels missing from field on check your answers page'
   failedOnFieldValue = 'Field value was not set as expected on check your answers page'

   expect(caseCreateCYAPage.getFormRowLabelText(4)).toEqual(l, failedOnMissingFieldLabel)
   expect(caseCreateCYAPage.getFormRowValueText(4)).toEqual(v, failedOnFieldValue)
   caseCreateCYAPage.clickSubmitButton()

   let caseViewPage = new CaseView

   caseViewPage.clickTabLabeled('First tab')

   failedOnMissingFieldLabel = 'Field labels missing from field on case view page'
   failedOnFieldValue = 'Field value was not set as expected on case view page'

   expect(caseViewPage.getTabRowLabelText(4)).toBe('An `Email` field', failedOnMissingFieldLabel)
   expect(caseViewPage.getTabRowValueText(4)).toBe('test.email2@bobmail.info', failedOnFieldValue)

});

});
