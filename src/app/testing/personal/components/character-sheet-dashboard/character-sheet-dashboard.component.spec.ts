import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterSheetDashboardComponent } from './character-sheet-dashboard.component';
import {CharacterSheetService} from '../../services/character-sheet.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ListBehaviorSubject} from '../../../../common/list-behavior-subject';
import {CharacterSheet} from '../../domain/character-sheet.model';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {TestListAssertionHelper} from '../../../../common/test-list-assertion.helper';

describe('CharacterSheetDashboardComponent', () => {
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

  const sharedSheetLookupFn = (assignFn: (sheet: CharacterSheet) => any, selectorValue: string) => {
    const expectedVal = expectedSheets.map(assignFn);

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
      serviceSpy.characterSheets$ = ListBehaviorSubject.create();

      serviceSpy.getAllCharacterSheets.and.callFake(() => serviceSpy.characterSheets$.next(expectedSheets));

      fixture = TestBed.createComponent(CharacterSheetDashboardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all character sheets', async(() => {
    // check the ids match for each row
    sharedSheetLookupFn(sheet => sheet.id, '.sheet-id');

    // check the names match for each row
    sharedSheetLookupFn(sheet => sheet.name, '.sheet-name');
  }));
});
