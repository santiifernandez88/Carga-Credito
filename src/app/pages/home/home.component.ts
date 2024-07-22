import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, AlertController } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { ResetConfirmationModalComponent } from '../reset-confirmation-modal/reset-confirmation-modal.component'; // Importa el componente del modal

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonContent, IonTitle, IonToolbar, IonHeader, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomeComponent implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];
  user!: User;
  codigo!: string;
  userSubscription!: Subscription;

  constructor(
    private modalController: ModalController, 
    private userService: UserService, 
    private auth: AuthService, 
    private router: Router,
    private alertController : AlertController
  ) { }

  async ngOnInit() {
    await this.loadUser();
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    BarcodeScanner.isGoogleBarcodeScannerModuleAvailable()
      .then(res => {
        if (!res.available) {
          BarcodeScanner.installGoogleBarcodeScannerModule();
        }
      });
  }

  async loadUser() {
    const userEmail = this.auth.getUserEmail();
    if (userEmail) {
      try {
        const user = await this.userService.getUserByEmail(userEmail);
        if (user) {
          this.user = user;
          console.log(this.user);
          console.log(userEmail);
        } else {
          console.error('Usuario no encontrado');
          console.log(userEmail);
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    } else {
      console.error('No se ha proporcionado un email de usuario válido');
    }
  }

  async credits() {
    let cantidadCargas = 1;

    if (this.user.perfil == "admin") {
      cantidadCargas = 2;
    }

    if (this.countOccurrences(this.user.codes, this.codigo) < cantidadCargas) {
      switch (this.codigo) {
        case "8c95def646b6127282ed50454b73240300dccabc":
          this.user.credito += 10;
          break;
        case "ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ":
          this.user.credito += 50;
          break;
        case "2786f4877b9091dcad7f35751bfcf5d5ea712b2f":
          this.user.credito += 100;
          break;
      }
      this.user.codes.push(this.codigo);
      await this.userService.updateUser(this.user);
    } else {
      const alert = await this.alertController.create({
        header: 'Código utilizado',
        message: `No puede utilizar más de ${cantidadCargas} vez este código QR`,
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  countOccurrences(arr: string[], value: string): number {
    return arr.reduce((count, current) => current === value ? count + 1 : count, 0);
  }

  async presentResetConfirmation() {
    const modal = await this.modalController.create({
      component: ResetConfirmationModalComponent,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data && data.confirmed) {
      await this.performReset();
    }
  }

  async performReset() {
    this.user.codes = [];
    this.user.credito = 0;
    await this.userService.updateUser(this.user);
  }

  async reset() {
    await this.presentResetConfirmation();
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();

    this.codigo = barcodes[0].rawValue;

    await this.credits();
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permiso denegado',
      message: 'Por favor, otorgue permisos a la aplicación para usar la cámara.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  CloseSession() {
    this.auth.logout();
    this.router.navigateByUrl("login");
  }
}
