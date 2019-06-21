import {async} from '@angular/core/testing';

import {CharacterSheetService} from './character-sheet.service';
import {ServiceTestHelper} from '../../../common/service-test.helper';
import {CharacterSheetHttp} from './character-sheet.http';
import {CharacterSheet} from '../domain/character-sheet.model';
import {ListBehaviorSubject} from '../../../common/list-behavior-subject';
import {TestListAssertionHelper} from '../../../common/test-list-assertion.helper';
import {BehaviorSubject} from 'rxjs';

describe('CharacterSheetService', () => {
  const env = new ServiceTestHelper<CharacterSheetService>('CharacterSheetHttp', [
    'getAllCharacterSheets', 'getCharacterSheetById', 'saveNewCharacterSheet', 'deleteCharacterSheet'
  ]);

  const expectedSheets = [
    new CharacterSheet('Tact', 1),
    new CharacterSheet('Shush', 2),
    new CharacterSheet('Ariel', 3),
    new CharacterSheet('Gidgit', 4),
    new CharacterSheet('Tully', 5)
  ];

  beforeEach(async(() =>
    env.configureEnv(CharacterSheetService, CharacterSheetHttp, (name, method) => jasmine.createSpyObj(name, method))
  ));

  it('should be created', () => {
    const service: CharacterSheetService = env.service;
    expect(service).toBeTruthy();
  });

  it('#getAllCharacterSheets should get character sheets', async(() => {
    // add the expected sheets to the list comparator
    const assert = new TestListAssertionHelper(expectedSheets);

    // create an observable as a return to the http request
    const obs = ListBehaviorSubject.create(assert.expectedList);

    // mock the http call and return the observable
    env.httpSpy.getAllCharacterSheets.and.returnValue(obs);

    // populate the variables in the service
    env.service.getAllCharacterSheets();

    // check the returned sheets
    env.service.characterSheets$.subscribe(sheets => {
      assert.actualList = sheets;

      // check that they are the same size
      expect(assert.testSameLength()).toEqual(true);

      // check they have the same name
      expect(assert.testSameValues('name')).toEqual(true);

      // check they have the given id
      expect(assert.testSameValuesCustom('id', [1, 2, 3, 4, 5])).toEqual(true);
    });
  }));

  it('#getCharacterSheetById should get the sheet by id', async(() => {
    const expected = expectedSheets[1];

    const obs = new BehaviorSubject(expected);

    // mock the http call and return the expected observable
    env.httpSpy.getCharacterSheetById.and.callFake(id => id === 2 ? obs : null);

    // call the service to get by id 2
    env.service.getCharacterSheetById(2);

    // check that the sheet has the correct id and name
    env.service.selectedCharacterSheet$.subscribe(sheetWrapper => {
      const sheet = sheetWrapper[0];
      expect(sheet.id).toEqual(2);
      expect(sheet.name).toEqual(expectedSheets[1].name);
    });
  }));

  it('#saveNewCharacterSheet should save new sheet', async(() => {
    // create the object with the form inside
    const formCharacterSheet = CharacterSheet.generateNewCharacterSheet();

    // populate the form data
    formCharacterSheet.form.get('name').setValue('Toby');

    // add object to service
    env.service.newCharacterSheet$.change(formCharacterSheet);

    // when http save gets called add an id and return it as though it was saved
    env.httpSpy.saveNewCharacterSheet.and.callFake(sheet => {
      sheet.id = 6;
      return new BehaviorSubject(sheet);
    });

    // call service - it should populate the list of all with just the one sheet
    env.service.saveNewCharacterSheet();

    // check that there is only one sheet at that it is the correct one
    env.service.characterSheets$.subscribe(sheets => {
      expect(sheets.length).toEqual(1);

      const sheet = sheets[0];

      expect(sheet.id).toEqual(6);
      expect(sheet.name).toEqual('Toby');
    });
  }));
});
