import React from "react";
import { NavLink } from "react-router-dom";

export const RecipesHeaderComponent = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <span className="navbar-brand">Recipe Book</span>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#recipeBookNavbar"
        aria-controls="recipeBookNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="recipeBookNavbar">
        <div className="navbar-nav">
          <NavLink
            to="/recipes"
            activeClassName="active"
            className="nav-item nav-link"
          >
            Recipes
          </NavLink>
          <NavLink
            to="/shopping-list"
            activeClassName="active"
            className="nav-item nav-link"
          >
            Shopping List
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
