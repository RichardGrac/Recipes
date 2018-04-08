import {Ingredient} from "./ingredient";

export class Recipe{
  constructor(public title: string,
              public description: string,
              public difficulty,
              public ingredients: Ingredient[]){}
}
