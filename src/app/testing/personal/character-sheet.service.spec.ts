import { TestBed } from '@angular/core/testing';

import { CharacterSheetService } from './character-sheet.service';
import {ServiceTestHelper} from '../../common/service-test.helper';
import {CharacterSheetHttp} from './character-sheet.http';

describe('CharacterSheetService', () => {
  const env = new ServiceTestHelper<CharacterSheetService>('CharacterSheetHttp', [
    'getAllCharacterSheets'
  ]);


  beforeEach(() =>
    env.configureEnv(CharacterSheetService, CharacterSheetHttp, (name, method) => jasmine.createSpyObj(name, method))
  );

  it('should be created', () => {
    const service: CharacterSheetService = TestBed.get(CharacterSheetService);
    expect(service).toBeTruthy();
  });
});
