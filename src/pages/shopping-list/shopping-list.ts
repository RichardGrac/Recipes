import {Component} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  PopoverController
} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {ShoppingListService} from "../../services/shopping-list";
import {Ingredient} from "../../models/ingredient";
import {AuthService} from "../../services/auth";
import {DatabaseOptionsPage} from "../database-options/database-options";

@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  items: Ingredient[] = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private shoppingListService: ShoppingListService,
                private popoverCtrl: PopoverController,
                private authService: AuthService,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController) {
  }

  ionViewWillEnter(){
    this.loadItems();
  }

  onAddItem(form: NgForm){
    //  value.X is the "name" of the respective input
    console.log(form.value.ingredientName, form.value.amount);
    this.shoppingListService.addItem(form.value.ingredientName, form.value.amount);
    form.reset();
    // To refresh the new Items added.
    this.loadItems();
  }

  // To obtain a copy of all the items saved.
  private loadItems(){
    this.items = this.shoppingListService.getItems();
  }

  // To delete an item in our array of items saved.
  onDeleteItem(index: number){
      this.shoppingListService.removeItem(index);
      this.loadItems();
  }

  onShowOptions(event: MouseEvent){
      const loading = this.loadingCtrl.create({
        content: 'Espere por favor...'
      });

      const popover = this.popoverCtrl.create(DatabaseOptionsPage,{}, {cssClass: 'white-title'});
      popover.present({ev: event});
      popover.onDidDismiss(data => {

        if(!data){
          return;
        }

        /* onAction() in database-options.ts We dismiss returning the 'action' var, so we take it. */
        if (data.action == 'load'){
          loading.present();
          this.authService.getActiveUser().getIdToken()
            .then(
              (token: string) => {
                this.shoppingListService.fetchList(token)
                  .subscribe(
                    (list: Ingredient[]) => {
                      loading.dismiss();
                      // If the list has data
                      if(list){
                        this.items = list;
                      }else{
                        this.items = [];
                      }
                    },
                    error => {
                      loading.dismiss();
                      this.handleError(error.message);
                    }
                  );
              });

        }else if (data.action == 'store'){
          loading.present();
          this.authService.getActiveUser().getIdToken()
            .then(
              (token: string) => {
                this.shoppingListService.storeList(token)
                  .subscribe(
                    () => loading.dismiss(),
                  error => {
                      loading.dismiss();
                      this.handleError(error.message);
                  }
                  );
            });
        }
      })
  }

  private handleError(errorMessage: string){
      const alert = this.alertCtrl.create({
        title: 'Error',
        message: errorMessage,
        buttons: ['Ok'],
        cssClass: 'black-title'
      });
      alert.present();
  }
}
