import {Injectable} from '@angular/core';

@Injectable()
export class UserServiceMock {

  constructor() { }

  getUsers(): { name: string }[] {
    return [{ name: 'user1' }];
  }
}
