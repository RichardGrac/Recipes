import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authService: AuthService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
  }

  onSignup(form: NgForm){
    const loading = this.loadingCtrl.create({
        content: 'Registrandote...'
    });
    loading.present();

    this.authService.signup(form.value.email, form.value.password)
      .then(data => {
        loading.dismiss();
      })
      .catch(error =>{
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Registro fallido',
          message: error.message,
          buttons: ['Aceptar'],
          cssClass: 'black-title'
        });
        alert.present();
      });
  }

}
