import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import { ContactComponent } from './testing/medium-basic/contact/contact.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserComponent } from './testing/medium-basic/user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
