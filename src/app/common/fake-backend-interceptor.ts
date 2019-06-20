/**
 *  From: https://jasonwatmore.com/post/2018/06/22/angular-6-mock-backend-example-for-backendless-development
 */
import {Injectable} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, dematerialize, materialize, mergeMap} from 'rxjs/operators';
import {CharacterSheetHttp} from '../testing/personal/services/character-sheet.http';

@Injectable({providedIn: 'root'})
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // array in local storage for character sheets
    const characterSheets: any[] = JSON.parse(localStorage.getItem('characters')) || [];

    return of(null).pipe(mergeMap(() => {
      // get all
      if (req.url.endsWith(`${CharacterSheetHttp.API}/`) && req.method === 'GET') {
        return of(new HttpResponse({ status: 200, body: characterSheets}));
      }

      // get by id
      if (req.url.match(/\/api\/character-sheets\/\d+$/) && req.method === 'GET') {
        const urlParts = req.url.split('/');
        const id = parseInt(urlParts[urlParts.length - 1], 10);
        const matchedSheet = characterSheets.filter(characterSheet => characterSheet.id === id);
        const sheet = matchedSheet.length ? matchedSheet[0] : null;

        return of(new HttpResponse({ status: 200, body: sheet }));
      }

      // save new
      if (req.url.endsWith(`${CharacterSheetHttp.API}/`) && req.method === 'POST') {
        // get new sheet object from post body
        const newCharacterSheet = req.body;

        // validation
        const duplicateSheet = characterSheets.filter(sheet => sheet.name === newCharacterSheet.name).length;
        if (duplicateSheet) {
          return throwError({ error: { message: `Name: ${newCharacterSheet.name} is already taken`}});
        }

        const currentId = parseInt(localStorage.getItem('characterSheetCount') || '0', 10) + 1;

        localStorage.setItem('characterSheetCount', `${currentId}`);

        newCharacterSheet.id = currentId;
        characterSheets.push(newCharacterSheet);

        localStorage.setItem('characters', JSON.stringify(characterSheets));

        return of(new HttpResponse({ status: 200, body: newCharacterSheet }));
      }

      // delete
      if (req.url.match(/\/api\/character-sheets\/\d+$/) && req.method === 'DELETE') {
        const urlParts = req.url.split('/');
        const id = parseInt(urlParts[urlParts.length - 1], 10);

        let deleted = false;

        for (let i = 0; i < characterSheets.length; i++) {
          const sheet = characterSheets[i];

          if (sheet.id === id) {
            // delete sheet
            deleted = true;
            characterSheets.splice(i, 1);
            localStorage.setItem('characters', JSON.stringify(characterSheets));
            break;
          }
        }

        return of(new HttpResponse({ status: 200, body: deleted }));
      }

      return next.handle(req);
    }))

    // call materialize and dematerialize to ensure delay even if an error is thrown
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
