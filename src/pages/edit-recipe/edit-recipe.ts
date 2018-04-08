import {Component, OnInit} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipesService} from "../../services/recipes";
import {Recipe} from "../../models/recipe";

@IonicPage()
@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit{
  mode = 'New';
  dificultOptions = ['Fácil', 'Media', 'Difícil'];
  recipeForm: FormGroup;
  recipe: Recipe;
  index: number;

  selectOptions = {
    cssClass: 'black-title'
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              public toastCtrl: ToastController,
              private recipesService: RecipesService) {
  }

  ngOnInit(): void {
    this.mode = this.navParams.get('mode');
    if (this.mode == 'Editar'){
      this.recipe = this.navParams.get('recipe');
      this.index = this.navParams.get('index');
    }
    // Initialize the FormGroup
    this.initializeForm();
  }

  /*
  * FormControl parameters:
  *   1. Default value
  *   2. Is required / minLength / maxLength / ...
  * */
  private initializeForm() {
    let title = null;
    let description = null;
    let difficulty = 'Media';
    let ingredients = [];

    if(this.mode == 'Editar'){
      title = this.recipe.title;
      description = this.recipe.description;
      difficulty = this.recipe.difficulty;
      for(let ingredient of this.recipe.ingredients){
        ingredients.push(new FormControl(ingredient.name, Validators.required));
      }
    }

    this.recipeForm = new FormGroup({
      'title': new FormControl(title, Validators.required),
      'description': new FormControl(description, Validators.required),
      'difficulty': new FormControl(difficulty, Validators.required),
      'ingredients': new FormArray(ingredients)
    });
  }

  onSubmit(){
    const value = this.recipeForm.value;
    let ingredients = [];
    if (value.ingredients.length > 0){
      /* We're going to transform each element to set the amount equals one. */
      ingredients = value.ingredients.map(name => {
        return {name: name, amount: 1};
      });
    }
    if (this.mode == 'Editar'){
      this.recipesService.updateRecipe(this.index, value.title, value.description, value.difficulty, ingredients);
    }else{
      this.recipesService.addRecipe(value.title, value.description, value.difficulty, ingredients);
    }
    this.recipeForm.reset();
    this.navCtrl.popToRoot();

  }

  onManageIngredients(){
    const actionSheet = this.actionSheetCtrl.create({
      title: '¿Qué quieres hacer?',
      cssClass: 'font-black',
      buttons: [
        {
          text: 'Agregar ingrediente',
          handler: () => {
            this.createNewIngredientAlert().present();
          }
        },
        {
          text: 'Quitar todos los Ingredientes',
          role: 'destructive',
          handler: () => {
              const fArray: FormArray = <FormArray>this.recipeForm.get('ingredients');
              const len = fArray.length;
              if (len > 0){
                for(let i = len - 1; i >= 0; i--){
                  fArray.removeAt(i);
                }
                this.showToastMessage('¡Ingredientes eliminados!')
              }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  /*
  * This method will Show an Alert Windows with an input asking for a Ingredient name
  * */
  private createNewIngredientAlert(){
    return this.alertCtrl.create({
      title: 'Agregar ingrediente',
      cssClass: 'black-title',
      inputs: [
        {
          name: 'name',
          placeholder: 'Nombre'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: data => {
            if(data.name.trim() == '' || data.name == null){
              this.showToastMessage('Por favor ingrese un valor valido');
              return;
            }

            //Angular doesn't know that 'ingredients' is an array, We should to say him that it's one (<FormArray>)
            (<FormArray>this.recipeForm.get('ingredients')).push(new FormControl(data.name, Validators.required));
            this.showToastMessage('¡Ingrediente agregado!')

          }
        }
      ]
    });
  }

  showToastMessage(message: string){
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'font-black',
    }).present();
  }

  onDeleteItem(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
