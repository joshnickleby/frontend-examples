import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getUsers(): { name: string }[] {
    return [{ name: 'user1' }];
  }
}
