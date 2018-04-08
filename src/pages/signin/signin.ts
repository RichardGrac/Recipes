import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth";

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authService: AuthService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
  }

  onSignin(form: NgForm){
    const loading = this.loadingCtrl.create({
      content: 'Verificando credenciales'
    });
    loading.present();

    this.authService.signin(form.value.email, form.value.password)
      .then(data => {
        loading.dismiss();
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Autentificación incorrecta',
          message: error.message,
          buttons: ['Aceptar'],
          cssClass: 'black-title'
        });
        alert.present();
      });
  }
}
