import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActionSheetController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private auth: AuthService, private actionSheetCtrl: ActionSheetController, private loadingController: LoadingController) { }

  async logOut() {
    this.presentActionSheet()
      .then(res => {
        console.log(res);

        if (res === true)
          this.presentLoading();
        setTimeout(() => {
          this.auth.logout();
        }, 3000);
      });
  }

  async presentActionSheet() {
    return new Promise(async (resolve) => {
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Desea salir?',
        buttons: [
          {
            text: 'Cerrar sesión',
            handler: () => {
              return resolve(true)
            }
          },
          {
            text: 'Cancelar',
            handler: () => {
              return resolve(false)
            }
          },

        ],
        cssClass: 'my-custom-class',
        keyboardClose: true,
        mode: 'md'
      });

      await actionSheet.present();

    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cerrando...',
      duration: 3000,
    });
    await loading.present();
  }

}
