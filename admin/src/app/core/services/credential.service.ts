import { Injectable } from '@angular/core';

const USER_NAME_KEY = 'userName';

@Injectable({
  providedIn: 'root',
})
export class Credential {
  public accessTokenKey: string = null;
  public userName: any = null;
  public cacheTime = 60 * 60 * 24 * 14; // TTL in seconds for 2 weeks

  cache = localStorage;

  constructor() {}

  public getUsername() {
    if (this.userName) {
      return this.userName;
    }

    return (this.userName = this.cache.getItem(USER_NAME_KEY));
  }

  public setUserName(userName: string) {
    this.userName = userName;

    if (userName) {
      this.cache.setItem(USER_NAME_KEY, userName);
    } else {
      this.cache.removeItem(USER_NAME_KEY);
    }
  }
}
