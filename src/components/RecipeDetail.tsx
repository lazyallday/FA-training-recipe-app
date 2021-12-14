import React, { useState } from 'react';
import { RouteChildrenProps, Link } from 'react-router-dom';
import { RecipeNotFoundComponent } from './RecipeNotFound';
import { Recipe, Ingredient } from '../models/Recipe';
import { generateKey } from '../utils/utils';

interface RecipeDetailComponentProps
  extends RouteChildrenProps<{ recipeId: string }> {
  allRecipes: Recipe[];
  onDeleteRecipe: (recipeId: string) => void;
  onAddIngredientsToShoppingList: (ingredients: Ingredient[]) => void;
}

export const RecipeDetailComponent = (props: RecipeDetailComponentProps) => {
  const [show, setShow] = useState(false);

  const recipeId = props?.match?.params?.recipeId;

  if (!recipeId) {
    return <RecipeNotFoundComponent />;
  }

  const recipeToShow = props.allRecipes.find(
    (recipe) => recipe.id === recipeId
  );

  if (!recipeToShow) {
    return <RecipeNotFoundComponent />;
  }

  const handleClickDelete = () => {
    props.onDeleteRecipe(recipeId);
  };

  const handleGoToShoppingList = () => {
    props.onAddIngredientsToShoppingList(recipeToShow.ingredients);
    props.history.push('/shopping-list');
  };

  const toggleDropdown = () => {
    setShow(!show);
  };

  return (
    <div>
      <div>
        <img
          src={recipeToShow.imageUrl}
          style={{ maxHeight: 200, maxWidth: 200 }}
          alt="Recipe"
        />
      </div>
      <h1>{recipeToShow.name}</h1>

      <div className={`dropdown ${show ? 'show' : ''}`}>
        <button
          className="btn btn-primary dropdown-toggle"
          type="button"
          onClick={toggleDropdown}
        >
          Manage Recipe
        </button>
        <div className={`dropdown-menu ${show ? 'show' : ''}`}>
          <button
            className="dropdown-item"
            type="button"
            onClick={handleGoToShoppingList}
          >
            To Shopping List
          </button>
          <Link
            to={`/recipes/edit/${recipeToShow.id}`}
            className="dropdown-item"
          >
            Edit Recipe
          </Link>
          <button
            className="dropdown-item"
            type="button"
            onClick={handleClickDelete}
          >
            Delete Recipe
          </button>
        </div>
      </div>

      <p>{recipeToShow.description}</p>
      <ul className="list-group">
        {recipeToShow.ingredients.map((ingredient) => (
          <li key={generateKey(ingredient.name)} className="list-group-item">
            {ingredient.name} - {ingredient.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};
