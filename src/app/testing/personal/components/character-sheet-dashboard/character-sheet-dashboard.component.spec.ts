import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterSheetDashboardComponent} from './character-sheet-dashboard.component';
import {CharacterSheetService} from '../../services/character-sheet.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ListBehaviorSubject} from '../../../../common/list-behavior-subject';
import {CharacterSheet} from '../../domain/character-sheet.model';
import {By} from '@angular/platform-browser';
import {DebugElement, ElementRef} from '@angular/core';
import {TestListAssertionHelper} from '../../../../common/test-list-assertion.helper';
import {SingleObjectList} from '../../../../common/single-object-list';

fdescribe('CharacterSheetDashboardComponent', () => {
  let component: CharacterSheetDashboardComponent;
  let fixture: ComponentFixture<CharacterSheetDashboardComponent>;

  const serviceSpy = jasmine.createSpyObj('CharacterSheetService', [
    'getAllCharacterSheets', 'getCharacterSheetById', 'saveNewCharacterSheet', 'deleteCharacterSheet'
  ]);

  const expectedSheets: CharacterSheet[] = [
    new CharacterSheet('Tact', 1),
    new CharacterSheet('Shush', 2),
    new CharacterSheet('Ariel', 3),
    new CharacterSheet('Gidgit', 4),
    new CharacterSheet('Tully', 5)
  ];


  // region SPECIFIC TO THIS TEMPLATE

  const sharedSheetLookupFn = (expected: CharacterSheet[], assignFn: (sheet: CharacterSheet) => any, selectorValue: string) => {
    const expectedVal = expected.map(assignFn);

    // setup expected values
    const assert = new TestListAssertionHelper(expectedVal);

    // get the rows of character data
    const rows: DebugElement[] = fixture.debugElement.queryAll(By.css('.sheets'));

    // class element from row
    const idSelector = By.css(selectorValue);

    // get element based on class and map it to its element (html rendered)
    assert.actualList = rows.map(row => row.queryAll(idSelector)[0]).map(div => div.nativeElement);

    assert.testSameLength();

    // check that <div>{number}</div> contains val
    assert.testCustom((id, el) => el.toString().includes(id));
  };

  const checkRenderedLists = (expected: CharacterSheet[]) => {
    // check the ids match for each row
    sharedSheetLookupFn(expected, sheet => sheet.id, '.sheet-id');

    // check the names match for each row
    sharedSheetLookupFn(expected, sheet => sheet.name, '.sheet-name');
  };

  const getFirstButtonsFn = () => {
    // get the first element in the list
    const rows: DebugElement[] = fixture.debugElement.queryAll(By.css('.sheets'));

    const firstRow: DebugElement = rows[0];

    // get the first buttons
    return firstRow.queryAll(By.css('button'));
  };

  // endregion SPECIFIC TO THIS TEMPLATE

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterSheetDashboardComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [ { provide: CharacterSheetService, useValue: serviceSpy } ]
    })
    .compileComponents().then(() => {
      serviceSpy.selectedCharacterSheet$ = new SingleObjectList();
      serviceSpy.characterSheets$ = ListBehaviorSubject.create();
      serviceSpy.newCharacterSheet$ = new SingleObjectList(CharacterSheet.generateNewCharacterSheet());

      fixture = TestBed.createComponent(CharacterSheetDashboardComponent);
      component = fixture.componentInstance;

      serviceSpy.getAllCharacterSheets.and.callFake(() => serviceSpy.characterSheets$.next(expectedSheets));
      serviceSpy.getCharacterSheetById.and.callFake(id => {
        const foundSheet = expectedSheets.find(sheet => sheet.id === id);

        // has to change the component's service variable
        component.characterSheetService.selectedCharacterSheet$.change(foundSheet);
      });
      serviceSpy.deleteCharacterSheet.and.callFake(id => {
        component.characterSheetService.characterSheets$.removeByCriteria('id', id);
      });
      serviceSpy.saveNewCharacterSheet.and.callFake(() => {
        const sheet = component.characterSheetService.newCharacterSheet$.getItem();

        component.characterSheetService.newCharacterSheet$.change(CharacterSheet.generateNewCharacterSheet());

        sheet.applyFormGroup();

        sheet.id = 6;

        component.characterSheetService.characterSheets$.add(sheet);
      });

      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all character sheets', async(() => {
    checkRenderedLists(expectedSheets);
  }));

  it('should display a character when button gets clicked', async(() => {
    // get buttons from first item in list
    const buttons = getFirstButtonsFn();

    const selectButton = buttons[0];

    // click the button
    selectButton.nativeElement.click();

    fixture.detectChanges();

    const selectedSheet = component.characterSheetService.selectedCharacterSheet$.getItem();

    // find the selected element id and name sections
    const idElement = fixture.debugElement.queryAll(By.css('.selected-sheet-id'))[0].nativeElement;
    const nameElement = fixture.debugElement.queryAll(By.css('.selected-sheet-name'))[0].nativeElement;

    // assert the changes
    expect(idElement.innerText.includes('' + selectedSheet.id)).toEqual(true);
    expect(nameElement.innerText.includes(selectedSheet.name)).toEqual(true);
  }));

  it('should delete a character if the delete button gets clicked', async(() => {
    // get buttons from first item in list
    const buttons = getFirstButtonsFn();

    const deleteButton = buttons[1];

    // click the button
    deleteButton.nativeElement.click();

    fixture.detectChanges();

    // check that it has been removed
    const existingSheets = component.characterSheetService.characterSheets$.getValue();

    checkRenderedLists(existingSheets);
  }));

  it('should input into the form, click the save button, and the new one should append to the bottom', async(() => {
    const expectedNew = new CharacterSheet('Goober', 6);

    // change form control
    component.characterSheetService.newCharacterSheet$.getItem().form.controls['name'].setValue('Goober');

    fixture.detectChanges();

    // get the submit button
    const submitButton = fixture.debugElement.queryAll(By.css('.save-sheet-btn'))[0];

    // click the button
    submitButton.nativeElement.click();

    fixture.detectChanges();

    // check that is has been added
    checkRenderedLists([...expectedSheets, expectedNew]);
  }));
});
