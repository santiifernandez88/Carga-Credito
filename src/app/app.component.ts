import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() { }

  // @HostListener('document:readystatechange', ['$event'])
  //   onReadyStateChanged(event:any) {
  //       if (event.target.readyState === 'complete') {
  //           SplashScreen.hide();
  //       }
  //   }
}
