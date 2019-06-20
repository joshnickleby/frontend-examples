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

      // // get by id
      // if (req.url.match(`${CharacterSheetHttp.API}\d+$`) && req.method === 'GET') {
      //
      // }

      if (req.url.endsWith(`${CharacterSheetHttp.API}/`) && req.method === 'POST') {
        // get new sheet object from post body
        const newCharacterSheet = req.body;

        // validation
        const duplicateSheet = characterSheets.filter(sheet => sheet.name === newCharacterSheet.name).length;
        if (duplicateSheet) {
          return throwError({ error: { message: `Name: ${newCharacterSheet.name} is already taken`}});
        }

        newCharacterSheet.id = characterSheets.length + 1;
        characterSheets.push(newCharacterSheet);

        localStorage.setItem('characters', JSON.stringify(characterSheets));

        return of(new HttpResponse({ status: 200, body: newCharacterSheet }));
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
