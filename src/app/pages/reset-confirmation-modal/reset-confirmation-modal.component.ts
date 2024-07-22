import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput } from "@ionic/angular/standalone";

@Component({
  selector: 'app-reset-confirmation-modal',
  templateUrl: './reset-confirmation-modal.component.html',
  styleUrls: ['./reset-confirmation-modal.component.scss'],
  standalone: true,
  imports: [IonInput, IonButton, IonHeader, IonToolbar, IonTitle, IonContent]
})
export class ResetConfirmationModalComponent {
  constructor(private modalController: ModalController) {}

  confirm() {
    this.modalController.dismiss({ confirmed: true });
  }

  cancel() {
    this.modalController.dismiss({ confirmed: false });
  }
}
