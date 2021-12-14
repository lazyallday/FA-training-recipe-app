import React from "react";
import { NavLink } from "react-router-dom";
import { Recipe } from "../models/Recipe";

export const RecipesListComponent = (props: { recipes: Recipe[] }) => {
  return (
    <div className="list-group">
      {props.recipes.map((recipe) => (
        <NavLink
          key={recipe.id}
          to={`/recipes/${recipe.id}`}
          className="list-group-item list-group-item-action"
          activeClassName="active"
        >
          <div className="d-flex w-100 justify-content-between">
            <div>
              <h5 className="mb-1">{recipe.name}</h5>
              <p>{recipe.description}</p>
            </div>
            <div>
              <img src={recipe.imageUrl} style={{ maxHeight: 50, maxWidth: 50 }} alt="Recipe" />
            </div>
          </div>
        </NavLink>
      ))}
    </div>
  );
};
