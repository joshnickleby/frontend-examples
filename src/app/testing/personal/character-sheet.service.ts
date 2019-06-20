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

  private numberOfCharacterSheets = 1;

  characterSheets$: ListBehaviorSubject<CharacterSheet> = ListBehaviorSubject.create();

  constructor(private http: CharacterSheetHttp) {
    super('CharacterSheetService');
  }

  getAllCharacterSheets(): void {
    this.log('getAllCharacterSheets', this.http);

    this.http.getAllCharacterSheets()
      .pipe(
        tap(sheets => this.logTable('getAllCharacterSheets', 'Character Sheets', sheets)),
        tap(sheets => sheets.forEach(sheet => sheet.id = this.numberOfCharacterSheets++))  // testing purposes
      )
      .subscribe(sheets => this.characterSheets$.next(sheets));
  }
}
