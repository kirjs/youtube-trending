import { Injectable } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, signOut } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly user$ = authState(this.auth);

  hasCurrentUser(){
    return this.auth.currentUser;
  }

  constructor(public auth: Auth) {
  }

  async login() {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async logout() {
    await signOut(this.auth);
  }
}
