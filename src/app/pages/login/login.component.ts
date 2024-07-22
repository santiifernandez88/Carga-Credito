import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  email: string = "";
  password: string = "";
  flagError: boolean = false;
  loggedUser: string = "";
  msjError: string = "";

  constructor(private router: Router, public auth: AuthService) {}

  LoginUser() {
    this.auth.login(this.email, this.password).then((res) => {
      if (res.user.email !== null) this.auth.userActive = res.user;
      this.goTo('home');
      this.flagError = false;
      this.email ="";
      this.password = "";
    }).catch((e) => {
      this.flagError = true;

      switch(e.code) {
        case "auth/invalid-email":
          this.msjError = "Email invalido";
          break;
        case "auth/user-not-found":
          this.msjError = "Usuario no encontrado";
          break;
        case "auth/wrong-password":
          this.msjError = "Contraseña incorrecta";
          break;
        case "auth/too-many-requests":
          this.msjError = "Demasiados intentos. Por favor intente más tarde.";
          break;
        default:
          this.msjError = "Error al iniciar sesión: " + e.code;
          break;
      }
    });
  }

  Rellenar(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}
