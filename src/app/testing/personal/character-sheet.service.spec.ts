import {async, TestBed} from '@angular/core/testing';

import { CharacterSheetService } from './character-sheet.service';
import {ServiceTestHelper} from '../../common/service-test.helper';
import {CharacterSheetHttp} from './character-sheet.http';
import {CharacterSheet} from './domain/character-sheet.model';
import {Observable} from 'rxjs';
import {ListBehaviorSubject} from '../../common/list-behavior-subject';
import {TestListAssertionHelper} from '../../common/test-list-assertion.helper';

describe('CharacterSheetService', () => {
  const env = new ServiceTestHelper<CharacterSheetService>('CharacterSheetHttp', [
    'getAllCharacterSheets'
  ]);


  beforeEach(async(() =>
    env.configureEnv(CharacterSheetService, CharacterSheetHttp, (name, method) => jasmine.createSpyObj(name, method))
  ));

  it('should be created', () => {
    const service: CharacterSheetService = env.service;
    expect(service).toBeTruthy();
  });

  it('#getAllCharacterSheets should get character sheets and assign a number to it based on index', async(() => {
    const assert = new TestListAssertionHelper([
      new CharacterSheet('Tact'),
      new CharacterSheet('Shush'),
      new CharacterSheet('Ariel'),
      new CharacterSheet('Gidgit'),
      new CharacterSheet('Tully')
    ]);

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
});
