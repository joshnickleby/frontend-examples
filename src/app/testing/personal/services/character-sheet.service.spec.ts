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
    const assert = new TestListAssertionHelper(expectedSheets);

    const obs = ListBehaviorSubject.create(assert.expectedList);

    // mock the http call
    env.httpSpy.getAllCharacterSheets.and.returnValue(obs);

    // populate the variables in the service
    env.service.getAllCharacterSheets();

    env.service.characterSheets$.subscribe(sheets => {
      assert.actualList = sheets;

      expect(assert.testSameLength()).toEqual(true);

      expect(assert.testSameValues('name')).toEqual(true);

      expect(assert.testSameValuesCustom('id', [1, 2, 3, 4, 5])).toEqual(true);
    });
  }));

  it('#getCharacterSheetById should get the sheet by id', async(() => {
    const expected = expectedSheets[1];

    const obs = new BehaviorSubject(expected);

    // mock the http call
    env.httpSpy.getCharacterSheetById.and.callFake(id => id === 2 ? obs : null);

    env.service.getCharacterSheetById(2);

    env.service.selectedCharacterSheet$.subscribe(sheetWrapper => {
      const sheet = sheetWrapper[0];
      expect(sheet.id).toEqual(2);
      expect(sheet.name).toEqual(expectedSheets[1].name);
    });
  }));
});
