import {Component} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  PopoverController
} from 'ionic-angular';
import {EditRecipePage} from "../edit-recipe/edit-recipe";
import {Recipe} from "../../models/recipe";
import {RecipesService} from "../../services/recipes";
import {RecipePage} from "../recipe/recipe";
import {AuthService} from "../../services/auth";
import {DatabaseOptionsPage} from "../database-options/database-options";

@IonicPage()
@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {
  recipes: Recipe[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private recipesService: RecipesService,
              private popoverCtrl: PopoverController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private authService: AuthService) {

  }

  ionViewWillEnter() {
    this.recipes = this.recipesService.getRecipes();
  }

  /* Due to We're going to use the same page to create a "New" Recipe and
  * to "Edit" a Recipe. We pass a own variable to know it */
  onNewRecipe() {
    this.navCtrl.push(EditRecipePage, {mode: 'Nueva'});
  }

  onLoadRecipe(recipe: Recipe, index: number) {
    this.navCtrl.push(RecipePage, {recipe: recipe, index: index});
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
              this.recipesService.fetchList(token)
                .subscribe(
                  (list: Recipe[]) => {
                    loading.dismiss();
                    // If the list has data
                    if(list){
                      this.recipes = list;
                    }else{
                      this.recipes = [];
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
              this.recipesService.storeList(token)
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
