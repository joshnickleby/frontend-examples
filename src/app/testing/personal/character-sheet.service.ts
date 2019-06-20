import {Injectable} from '@angular/core';
import {CharacterSheetHttp} from './character-sheet.http';
import {ListBehaviorSubject} from '../../common/list-behavior-subject';
import {CharacterSheet} from './domain/character-sheet.model';
import {tap} from 'rxjs/operators';
import {FileAware} from '../../common/file-aware';

@Injectable({
  providedIn: 'root'
})
export class CharacterSheetService extends FileAware {

  characterSheets$: ListBehaviorSubject<CharacterSheet> = ListBehaviorSubject.create();

  constructor(private http: CharacterSheetHttp) {
    super('CharacterSheetService');
  }

  getAllCharacterSheets(): void {
    this.http.getAllCharacterSheets()
      .pipe(
        tap(sheets => this.logTable('getAllCharacterSheets', 'Character Sheets', sheets))
      )
      .subscribe(sheets => this.characterSheets$.next(sheets));
  }
}
