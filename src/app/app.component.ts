import {Component, ViewChild} from '@angular/core';
import {MenuController, NavController, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TabsPage} from "../pages/tabs/tabs";
import {SigninPage} from "../pages/signin/signin";
import {SignupPage} from "../pages/signup/signup";
import firebase from 'firebase';
import {AuthService} from "../services/auth";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  tabsPage = TabsPage;
  signinPage = SigninPage;
  signupPage = SignupPage;
  isAuthenticated = false;

  // We reference #nav from app.html
  @ViewChild('nav') nav: NavController;


  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              private menuCtrl: MenuController, private authService: AuthService) {

    /* This will connect with our Firebase Session and application */
    firebase.initializeApp({
        apiKey: "AIzaSyDQVawqbvHLmMK7RUVTEOKJ-8ZsAaD1DMI",
        authDomain: "ionic2-recipebook-1aef2.firebaseapp.com"
    });

    /* This will controle the status of the currently user authentication */
    firebase.auth().onAuthStateChanged(user =>{
      if(user){
        this.isAuthenticated = true;
        this.nav.setRoot(this.tabsPage);
      }else{
        this.isAuthenticated = false;
        this.nav.setRoot(this.signinPage);
      }

    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  /*
  * Method that loads the passed page from an argument.
  * */
  onLoad(page: any){
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onLogout(){
    this.authService.logout();
    this.menuCtrl.close();
  }
}

