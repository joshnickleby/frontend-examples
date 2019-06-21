import {Injectable} from '@angular/core';
import {CharacterSheetHttp} from './character-sheet.http';
import {ListBehaviorSubject} from '../../../common/list-behavior-subject';
import {CharacterSheet} from '../domain/character-sheet.model';
import {tap} from 'rxjs/operators';
import {FileAware} from '../../../common/file-aware';
import {SingleObjectList} from '../../../common/single-object-list';

@Injectable({
  providedIn: 'root'
})
export class CharacterSheetService extends FileAware {

  characterSheets$: ListBehaviorSubject<CharacterSheet> = ListBehaviorSubject.create();

  newCharacterSheet$: SingleObjectList<CharacterSheet> = new SingleObjectList(CharacterSheet.generateNewCharacterSheet());

  selectedCharacterSheet$: SingleObjectList<CharacterSheet> = new SingleObjectList();

  constructor(private http: CharacterSheetHttp) {
    super('CharacterSheetService');
  }

  getAllCharacterSheets(): void {
    this.log('getAllCharacterSheets', this.http);

    this.http.getAllCharacterSheets()
      .pipe(
        tap(sheets => this.logTable('getAllCharacterSheets', 'Character Sheets', sheets))
      )
      .subscribe(sheets => this.characterSheets$.next(sheets));
  }

  getCharacterSheetById(id: number) {
    this.http.getCharacterSheetById(id).pipe(
      tap(sheet => this.log('getCharacterSheetById', sheet))
    ).subscribe(sheet => this.selectedCharacterSheet$.change(sheet));
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

  deleteCharacterSheet(id: number) {
    this.http.deleteCharacterSheet(id).pipe(
      tap(deleted => console.log('deleteCharacterSheet', deleted ? 'Success' : 'ERROR!', id)),
      tap(deleted => {
        if (deleted) { this.getAllCharacterSheets(); }
      })
    ).subscribe();
  }
}
