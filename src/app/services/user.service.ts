import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Firestore, addDoc, collection, doc, getDocs, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { onSnapshot, query } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private dataRef = collection(this.firestore, 'usuarios');

  constructor(private firestore: Firestore) { }

  createUser(user: User) {
    if (user === null) return Promise.reject();
    const docs = doc(this.dataRef);
    user.id = docs.id;
    return setDoc(docs, user);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(this.dataRef, where('email', '==', email));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data() as User;
        return data;
      } else {
        return null; // No se encontró ningún usuario con ese correo electrónico
      }
    } catch (error) {
      console.error('Error al obtener usuario por email:', error);
      return null;
    }
  }

  async updateUser(user: User) {
    if (user) {
      const docsUser = doc(this.dataRef, user.id);
      updateDoc(docsUser, { codes: user.codes, credito: user.credito });
    }
  }

}
