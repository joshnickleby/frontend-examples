import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CharacterSheet} from '../domain/character-sheet.model';
import {JSON_HTTP_OPTIONS} from '../../../common/http.constants';

/**
 * Used for mocking in the service
 */
@Injectable({providedIn: 'root'})
export class CharacterSheetHttp {

  // not a real endpoint
  static API = '/api/character-sheets';

  id: number = (Math.random() * 1000) + 1;

  constructor(private http: HttpClient) {}

  getAllCharacterSheets(): Observable<CharacterSheet[]> {
    return this.http.get<CharacterSheet[]>(`${CharacterSheetHttp.API}/`);
  }

  saveNewCharacterSheet(sheet: CharacterSheet): Observable<CharacterSheet> {
    return this.http.post<CharacterSheet>(`${CharacterSheetHttp.API}/`, sheet, JSON_HTTP_OPTIONS);
  }
}
