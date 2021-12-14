import React, { useState } from 'react';
import { BrowserRouter, Redirect, Switch, Link, Route } from 'react-router-dom';
import { RecipeDetailComponent } from './RecipeDetail';
import { RecipeFormComponent } from './RecipesForm';
import { RecipesHeaderComponent } from './RecipesHeader';
import { RecipesListComponent } from './RecipesList';
import { ShoppingListComponent } from './ShoppingList';
import { Recipe, Ingredient } from '../models/Recipe';
import _ from 'lodash'

const findIndexOfIngredient = (array: Ingredient[], ingredient: Ingredient) => {
  const index = array.findIndex(
    (item) => item.name === ingredient.name && item.amount === ingredient.amount
  );
  return index;
};

export const RecipesBookComponent = () => {
  const [recipes, setRecipes] = useState([] as Recipe[]);
  const [shoppingIngredients, setShoppingIngredients] = useState(
    [] as Ingredient[]
  );

  const addRecipe = (recipe: Recipe) => {
    setRecipes([...recipes, recipe]);
  };

  const updateRecipe = (recipeUpdatedValues: Recipe) => {
    const existingRecipeToUpdate = recipes.find(
      (recipe) => recipe.id === recipeUpdatedValues.id
    );
    if (existingRecipeToUpdate) {
      existingRecipeToUpdate.name = recipeUpdatedValues.name;
      existingRecipeToUpdate.imageUrl = recipeUpdatedValues.imageUrl;
      existingRecipeToUpdate.description = recipeUpdatedValues.description;
      existingRecipeToUpdate.ingredients = recipeUpdatedValues.ingredients;
      setRecipes([...recipes]);
    }
  };

  const deleteRecipe = (recipeIdToDelete: string) => {
    const index = recipes.findIndex((recipe) => recipe.id === recipeIdToDelete);
    if (index !== -1) {
      recipes.splice(index, 1);
      setRecipes([...recipes]);
    }
  };

  const updateShoppingIngredient = (
    oldIngredient: Ingredient,
    newIngredient: Ingredient
  ) => {
    const index = findIndexOfIngredient(shoppingIngredients, oldIngredient);
    if (index !== -1) {
      shoppingIngredients.splice(index, 1, newIngredient);
      setShoppingIngredients([...shoppingIngredients]);
    }
  };

  const clearShoppingIngredient = (ingredient: Ingredient) => {
    const existingIngredientToClear = shoppingIngredients.find(
      (item) => item.name === ingredient.name && item.amount === ingredient.amount
    );
    if (existingIngredientToClear) {
      existingIngredientToClear.amount = 0;
      setShoppingIngredients([...shoppingIngredients]);
    }
  };

  const deleteShoppingIngredient = (ingredient: Ingredient) => {
    const index = findIndexOfIngredient(shoppingIngredients, ingredient);
    if (index !== -1) {
      shoppingIngredients.splice(index, 1);
      setShoppingIngredients([...shoppingIngredients]);
    }
  };

  const addToShoppingIngredients = (ingredientsToAdd: Ingredient[]) => {
    shoppingIngredients.push(...ingredientsToAdd);
    const newList = groupItems(shoppingIngredients)
    setShoppingIngredients(newList);
  };

  const addIngredient = (ingredient: Ingredient) => {
    shoppingIngredients.push(ingredient);
    const newList = groupItems(shoppingIngredients)
    setShoppingIngredients(newList);
  }

  return (
    <div>
      <BrowserRouter>
        <RecipesHeaderComponent />

        <div className="container">
          <Switch>
            <Redirect exact from="/" to="/recipes" />

            <Route path="/recipes">
              <div className="row">
                <div className="col-md-6">
                  <Link
                    to="/recipes/create"
                    className="btn btn-success"
                    role="button"
                  >
                    New Recipe
                  </Link>
                  <hr />
                  <Route path="/recipes">
                    <RecipesListComponent recipes={recipes} />
                  </Route>
                </div>

                <div className="col-md-6">
                  <Switch>
                    <Route
                      path="/recipes/edit/:recipeId"
                      render={(routeProps) => (
                        // If you don't want to pass route props explicitly here, use Router Hooks in the child component(s) instead
                        <RecipeFormComponent
                          onUpdatingRecipe={updateRecipe}
                          allRecipes={recipes}
                          {...routeProps} // Plugging in route props (match, location, history) to the child component(s)
                        />
                      )}
                    />

                    <Route
                      path="/recipes/create"
                      render={(routeProps) => (
                        <RecipeFormComponent
                          onAddingRecipe={addRecipe}
                          {...routeProps}
                        />
                      )}
                    />

                    <Route
                      path="/recipes/:recipeId"
                      render={(routeProps) => (
                        <RecipeDetailComponent
                          allRecipes={recipes}
                          onDeleteRecipe={deleteRecipe}
                          onAddIngredientsToShoppingList={
                            addToShoppingIngredients
                          }
                          {...routeProps}
                        />
                      )}
                    />

                    <Route path="/recipes">
                      <h1>Please select a Recipe!</h1>
                    </Route>
                  </Switch>
                </div>
              </div>
            </Route>

            <Route path="/shopping-list">
              <ShoppingListComponent
                shoppingIngredients={shoppingIngredients}
                onAddNewIngredient={addIngredient}
                onUpdateIngredient={updateShoppingIngredient}
                onClearIngredient={clearShoppingIngredient}
                onDeleteIngredient={deleteShoppingIngredient}
              />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};


function groupItems(arr: any[]) {
  const group = _.groupBy(arr, "name");
  let newList: any[] = [];
  for (const item of Object.values(group)) {
    if (item.length > 1) {
      const newObject = {
        name: item[0].name,
        amount: item.map((_item) => (+_item.amount)).reduce((prev, curr) => prev + curr)
      };
      newList.push(newObject);
    } else {
      newList = newList.concat(item);
    }
  }
  return newList
}