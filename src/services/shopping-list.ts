import {Ingredient} from "../models/ingredient";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth";
import 'rxjs/Rx';

@Injectable()
export class ShoppingListService{
  private ingredients: Ingredient[] = [];

  constructor(private httpClient: HttpClient, private authService: AuthService){

  }

  addItem(name: string, amount: number){
    var band = false;
    for (var i = 0; i < this.ingredients.length; i++){
      if (this.ingredients[i].name.toUpperCase() == name.toUpperCase()){
        var quantity = this.ingredients[i].amount;
        quantity += amount;
        this.ingredients[i].amount = quantity;
        band = true;
      }
    }
    if (!band){
      this.ingredients.push(new Ingredient(name, amount));
    }
  }

  addItems(items: Ingredient[]){
    // This method does Add the items after the ones We've.
    // this.ingredients.push(...items);

    // In order to doesn't have duplicate products, We only add one more to the existent
    for(var i = 0; i < items.length; i++){
      var band = false;
      for (var j = 0; j < this.ingredients.length; j++){
        if (this.ingredients[j].name.trim().toUpperCase() == items[i].name.trim().toUpperCase()){
          this.ingredients[j].amount++;
          band = true;
        }
      }
      if (!band){
        this.ingredients.push(new Ingredient(items[i].name, 1));
      }
    }
  }

  // slice() returns a copy of ingredients
  getItems(){
    return this.ingredients.slice();
  }

  removeItem(index: number){
    this.ingredients.splice(index,1);
  }

  storeList(token: string){
    const userId = this.authService.getActiveUser().uid;
    return this.httpClient.
    put('https://ionic2-recipebook-1aef2.firebaseio.com/' + userId + '/shopping-list.json?auth=' + token,
      this.ingredients);
  }

  fetchList(token: string){
    const userId = this.authService.getActiveUser().uid;
    return this.httpClient.get('https://ionic2-recipebook-1aef2.firebaseio.com/' + userId +
      '/shopping-list.json?auth=' + token)
      .do((ingredients: Ingredient[]) => {
        if (ingredients){
          this.ingredients = ingredients;
        } else{
          this.ingredients = [];
        }
      });
  }
}
