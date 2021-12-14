export interface Ingredient {
  name: string;
  amount: number;
}

export interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: Ingredient[];
}
