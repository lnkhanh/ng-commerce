import { Injectable } from '@angular/core';
import { UserType } from '@app/modules/auth/_models/user.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class Credential {
  public accessTokenKey: string = null;
  public currentUser: UserType = null;
  public cacheTime = 60 * 60 * 24 * 14; // TTL in seconds for 2 weeks

  cache = localStorage;

  constructor() { }

  public getAccessToken() {
    if (this.accessTokenKey) {
      return this.accessTokenKey;
    }

    const token = this.cache.getItem(environment.authAccessToken);

    this.accessTokenKey = token;

    return token;
  }

  public setAccessToken(token: string) {
    this.accessTokenKey = token;

    if (token) {
      this.cache.setItem(environment.authAccessToken, token);
    } else {
      this.cache.removeItem(environment.authAccessToken);
    }
  }

  public getCurrentUser() {
    const userStr = this.cache.getItem(environment.localUserKey);

    if (!userStr) {
      return null;
    }

    return (this.currentUser = JSON.parse(userStr));
  }

  public setCurrentUser(user: UserType) {
    if (!user) {
      return;
    }
    
    this.cache.setItem(environment.localUserKey, JSON.stringify(user));
    this.currentUser = user;
  }
}
