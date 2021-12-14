import React from "react";
import { Link, RouteChildrenProps } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { RecipeNotFoundComponent } from "./RecipeNotFound";
import { Recipe, Ingredient } from "../models/Recipe";
import { generateKey } from "../utils/utils";

const ingredientSchema: Yup.ObjectSchema<Ingredient> = Yup.object({
  name: Yup.string().required("Ingredient name is required."),
  amount: Yup.number()
    .required("Ingredient amount is required.")
    .min(1, "At least 1 unit is required.")
    .integer("Ingredient amount must be an integer."),
}).defined();

const initialRecipe: Recipe = {
  id: generateKey(Math.random()),
  name: "",
  imageUrl: "",
  description: "",
  ingredients: new Array<Ingredient>(),
};

const initialIngredient: Ingredient = {
  name: "",
  amount: 1,
};

interface RecipesFormComponentProps
  extends RouteChildrenProps<{ recipeId: string }> {
  onAddingRecipe?: (recipe: Recipe) => void;
  onUpdatingRecipe?: (recipe: Recipe) => void;
  allRecipes?: Recipe[];
}

export const RecipeFormComponent = (props: RecipesFormComponentProps) => {
  const recipeId = props?.match?.params?.recipeId;
  if (props.onUpdatingRecipe && (!recipeId || !props.allRecipes)) {
    return <RecipeNotFoundComponent />;
  }

  const recipeToEdit = props.allRecipes?.find(
    (recipe) => recipe.id === recipeId
  );

  return (
    <Formik
      initialValues={recipeToEdit ?? initialRecipe}
      onSubmit={(recipeFromForm: Recipe, formikHelpers) => {
        if (props.onUpdatingRecipe) {
          props.onUpdatingRecipe(recipeFromForm);
        } else if (props.onAddingRecipe) {
          formikHelpers.setFieldValue('id', generateKey(recipeFromForm.name))
          props.onAddingRecipe(recipeFromForm);
        }
        props.history.push("/recipes");
      }}
      validationSchema={Yup.object({
        name: Yup.string().required("Name is required."),
        imageUrl: Yup.string()
          .url("Image URL is not a valid URL.")
          .required("Image URL is required."),
        description: Yup.string().required("Description is required."),
        ingredients: Yup.array().of(ingredientSchema),
      })}
    >
      {(formikProps) => (
        <Form>
          <button
            className="btn btn-success"
            type="submit"
            disabled={!formikProps.isValid || formikProps.isSubmitting}
          >
            Save
          </button>
          <Link to="/recipes" className="btn btn-danger">
            Cancel
          </Link>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <Field name="name" id="name" className="form-control" />
            <ErrorMessage name="name" className="text-danger" component="div" />
          </div>
          <div className="form-group">
            <label htmlFor="imageUrl">Image URL</label>
            <Field name="imageUrl" id="imageUrl" className="form-control" />
            {formikProps.values.imageUrl && !formikProps.errors.imageUrl ? (
              <img
                src={formikProps.values.imageUrl}
                style={{ maxHeight: 200, maxWidth: 200 }}
                alt="Recipe"
              />
            ) : null}
            <ErrorMessage
              name="imageUrl"
              className="text-danger"
              component="div"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <Field
              name="description"
              id="description"
              as="textarea"
              className="form-control"
            />
            <ErrorMessage
              name="description"
              className="text-danger"
              component="div"
            />
          </div>
          <hr />

          <div className="form-group">
            <FieldArray
              name="ingredients"
              render={(arrayHelpers) => (
                <div>
                  {formikProps.values.ingredients.map((ingredient, index) => (
                    <div key={index} className="form-row">
                      <div className="form-group col-md-8">
                        <Field
                          name={`ingredients[${index}].name`}
                          className="form-control"
                          placeholder="Ingredient name"
                        />
                        <ErrorMessage
                          name={`ingredients[${index}].name`}
                          className="text-danger"
                          component="div"
                        />
                      </div>
                      <div className="form-group col-md-3">
                        <Field
                          name={`ingredients[${index}].amount`}
                          type="number"
                          className="form-control"
                          placeholder="Amount"
                        />
                        <ErrorMessage
                          name={`ingredients[${index}].amount`}
                          className="text-danger"
                          component="div"
                        />
                      </div>
                      <div className="form-group col-md-1">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      arrayHelpers.push(initialIngredient);
                    }}
                  >
                    Add Ingredient
                  </button>
                </div>
              )}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};
