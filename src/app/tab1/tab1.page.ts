import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/user';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];
  user!: User;

  constructor(private alertController: AlertController, private userService: UserService, private auth: AuthService) { }

  ngOnInit() {
    this.auth.getUser().then(u => {
      this.userService.getUserByEmail(u?.email!).subscribe(user => {
        this.user = user;
      })
    })
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    BarcodeScanner.isGoogleBarcodeScannerModuleAvailable()
      .then(res => {
        if (!res.available) {
          BarcodeScanner.installGoogleBarcodeScannerModule();
        }
      })
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();


    if (!this.user.codes.includes(barcodes[0].rawValue)) {
      this.barcodes.push(...barcodes);
      this.user.codes.push(barcodes[0].rawValue);
      const alert = await this.alertController.create({
        header: 'Código utilizado',
        message: barcodes[0].rawValue,
        buttons: ['OK'],
      });
      await alert.present();

    } else {
      const alert = await this.alertController.create({
        header: 'Código utilizado',
        message: 'Ya no puede utilizar este código QR',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permiso denegado',
      message: 'Porfavor de permisos a la aplicacion para usar la camara.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
