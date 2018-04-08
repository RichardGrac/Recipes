import {Component} from "@angular/core";
import {ViewController} from "ionic-angular";

@Component({
  selector: 'page-sl-options',
  template: `
    <ion-grid text-center>
      <ion-row>
        <ion-col>
          <h3>Guardar y Cargar</h3>
        </ion-col>
      </ion-row>
      
      <ion-row>
        <ion-col>
          <button ion-button outline (click)="onAction('load')">Cargar lista</button>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col>
          <button ion-button outline (click)="onAction('store')">Guardar lista</button>
        </ion-col>
      </ion-row>

    </ion-grid>
  `
})

export class DatabaseOptionsPage {

  constructor(public viewCtrl: ViewController){}

  onAction(action: string){
    this.viewCtrl.dismiss({ action: action });
  }
}
