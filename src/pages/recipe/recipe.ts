import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Recipe} from "../../models/recipe";
import {EditRecipePage} from "../edit-recipe/edit-recipe";
import {RecipesService} from "../../services/recipes";
import {ShoppingListService} from "../../services/shopping-list";

@IonicPage()
@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html',
})
export class RecipePage implements OnInit{
  recipe: Recipe;
  index: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public recipesService: RecipesService,
              public slService: ShoppingListService,
              public toastCtrl: ToastController) {
  }

  ngOnInit(){
    this.recipe = this.navParams.get('recipe');
    console.log(this.recipe);
    this.index = this.navParams.get('index');
  }

  onEditRecipe(){
    this.navCtrl.push(EditRecipePage, {mode: 'Editar', recipe: this.recipe, index: this.index});
  }

  onAddIngredients(){
    this.slService.addItems(this.recipe.ingredients);
    this.toastCtrl.create({
      message: '¡Ingredientes agregados!',
      duration: 3000,
      position: 'bottom'
    }).present();

  }

  onDeleteRecipe(){
    this.recipesService.removeRecipe(this.index);
    this.navCtrl.popToRoot();
  }

}
