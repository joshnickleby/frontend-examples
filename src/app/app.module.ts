import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import {AppComponent} from './app.component';
import { ContactComponent } from './testing/medium-basic/contact/contact.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserComponent } from './testing/medium-basic/user/user.component';
import { CharacterSheetDashboardComponent } from './testing/personal/components/character-sheet-dashboard/character-sheet-dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {fakeBackendProvider} from './common/fake-backend-interceptor';
import {HttpClientModule} from '@angular/common/http';

const routes: Routes = [
  { path: '', redirectTo: '/character-sheet-dashboard', pathMatch: 'full' },
  { path: 'character-sheet-dashboard',  component: CharacterSheetDashboardComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    UserComponent,
    CharacterSheetDashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    fakeBackendProvider
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
