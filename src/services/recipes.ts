import {Recipe} from "../models/recipe";
import {Ingredient} from "../models/ingredient";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth";

@Injectable()
export class RecipesService{
  private recipes: Recipe[] = [];

  constructor(private httpClient: HttpClient, private authService: AuthService){}

  addRecipe(title: string, description: string, difficulty: string, ingredients: Ingredient[]){
    this.recipes.push(new Recipe(title, description, difficulty, ingredients));
    console.log(this.recipes);
  }

  getRecipes(){
    return this.recipes.slice();
  }

  updateRecipe(index: number, title: string, description: string, difficulty: string, ingredients: Ingredient[]){
    this.recipes[index] = new Recipe(title, description, difficulty, ingredients);
  }

  removeRecipe(index: number){
    this.recipes.splice(index, 1);
  }

  storeList(token: string){
    let userId = this.authService.getActiveUser().uid;
    return this.httpClient.
    put('https://ionic2-recipebook-1aef2.firebaseio.com/' + userId + '/recipes.json?auth=' + token,
      this.recipes);
  }

  fetchList(token: string){
    let userId = this.authService.getActiveUser().uid;
    return this.httpClient.
    get('https://ionic2-recipebook-1aef2.firebaseio.com/' + userId + '/recipes.json?auth=' + token)
      .do((recipes: Recipe[]) => {
        if (recipes){
          this.recipes = recipes;
        } else {
          this.recipes = [];
          return recipes;
        }

        /* When we have a recipe without ingredients added, We've to create the property 'ingredients' in order
        * to don't get an error (not founding this property) */
        for (let item of recipes) {
          if (!item.hasOwnProperty('ingredients')) {
            item.ingredients = [];
          }
        }
        return recipes;
      });
  }
}
