import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore } from '@angular/fire/firestore';
import { Auth, UserCredential, browserSessionPersistence, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, setPersistence, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userActive: any;

  constructor(private auth: Auth, private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userActive = user;
      } else {
        this.userActive = null;
      }
    });
  }

  async login(email: string, password: string): Promise<UserCredential> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    this.userActive = userCredential.user;
    return userCredential;
  }

  async register(email: string, password: string): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    this.userActive = userCredential.user;
    return userCredential;
  }

  getUser() {
    return this.userActive;
  }

  getUserEmail() {
    return this.userActive ? this.userActive.email : null;
  }

  logout() {
    this.auth.signOut().then(() => {
      this.userActive = null;
      this.router.navigate(['login']);
    });
  }
}
