import {Injectable} from '@angular/core';
import {CharacterSheetHttp} from './character-sheet.http';
import {ListBehaviorSubject} from '../../../common/list-behavior-subject';
import {CharacterSheet, generateNewCharacterSheetForm} from '../domain/character-sheet.model';
import {tap} from 'rxjs/operators';
import {FileAware} from '../../../common/file-aware';
import {FormGroup} from '@angular/forms';
import {SingleObjectList} from '../../../common/single-object-list';

@Injectable({
  providedIn: 'root'
})
export class CharacterSheetService extends FileAware {

  private numberOfCharacterSheets = 1;

  characterSheets$: ListBehaviorSubject<CharacterSheet> = ListBehaviorSubject.create();

  newCharacterSheet$: SingleObjectList<CharacterSheet> = new SingleObjectList(CharacterSheet.generateNewCharacterSheet());

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

  saveNewCharacterSheet(): void {
    const sheet = this.newCharacterSheet$.getItem();

    this.newCharacterSheet$.change(CharacterSheet.generateNewCharacterSheet());

    sheet.applyFormGroup();

    console.log(sheet);

    this.http.saveNewCharacterSheet(sheet).pipe(
      tap(savedSheet => this.log('saveNewCharacterSheet', savedSheet)),
      tap(savedSheet => this.getAllCharacterSheets())
    ).subscribe();
  }
}
