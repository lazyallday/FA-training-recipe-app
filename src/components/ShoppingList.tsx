import React from "react";
import { Formik, Form, Field, FormikProps } from "formik";
import { Ingredient } from "../models/Recipe";
import { generateKey } from "../utils/utils";

export const ShoppingListComponent = (props: {
  shoppingIngredients: Ingredient[];
  onAddNewIngredient: (ingredient: Ingredient) => void;
  onUpdateIngredient: (
    oldIngredient: Ingredient,
    newIngredient: Ingredient
  ) => void;
  onClearIngredient: (ingredient: Ingredient) => void;
  onDeleteIngredient: (ingredient: Ingredient) => void;
}) => {
  const [selectedIngredient, setSelectedIngredient] = React.useState(
    null as Ingredient | null
  );

  const selectIngredient = (
    formikProps: FormikProps<Ingredient>,
    ingredient: Ingredient
  ) => {
    formikProps.setValues(ingredient);
    setSelectedIngredient(ingredient);
  };

  const handleAddNewIngredient = (formikProps: FormikProps<Ingredient>) => {
    props.onAddNewIngredient(formikProps.values);
    formikProps.setValues({ name: "", amount: 0 });
    setSelectedIngredient(null);
  };

  const handleUpdateSelectedIngredient = (
    formikProps: FormikProps<Ingredient>
  ) => {
    if (selectedIngredient) {
      props.onUpdateIngredient(selectedIngredient, formikProps.values);
      setSelectedIngredient(formikProps.values);
    }
  };

  const handleClearSelectedIngredient = (
    formikProps: FormikProps<Ingredient>
  ) => {
    if (selectedIngredient) {
      props.onClearIngredient(selectedIngredient);
      const clearedIngredient = { name: selectedIngredient.name, amount: 0 };
      formikProps.setValues(clearedIngredient);
      setSelectedIngredient(clearedIngredient);
    } else {
      const freshIngredient = formikProps.values;
      freshIngredient.amount = 0;
      formikProps.setValues(freshIngredient);
      setSelectedIngredient(freshIngredient);
    }
  };

  const handleDeleteSelectedIngredient = (
    formikProps: FormikProps<Ingredient>
  ) => {
    if (selectedIngredient) {
      props.onDeleteIngredient(selectedIngredient);
      formikProps.setValues({ name: "", amount: 0 });
      setSelectedIngredient(null);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ name: "", amount: 0 }}
        onSubmit={(values) => {
          //
        }}
      >
        {(formikProps) => (
          <>
            <div>
              <Form>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="name">Name</label>
                    <Field name="name" id="name" className="form-control" />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="amount">Amount</label>
                    <Field
                      name="amount"
                      id="amount"
                      type="number"
                      className="form-control"
                    />
                  </div>
                </div>
              </Form>
            </div>

            <div>
              {selectedIngredient ? (
                <>
                  <button
                    onClick={handleUpdateSelectedIngredient.bind(
                      null,
                      formikProps
                    )}
                    className="btn btn-success"
                    type="button"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleDeleteSelectedIngredient.bind(
                      null,
                      formikProps
                    )}
                    className="btn btn-danger"
                    type="button"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddNewIngredient.bind(null, formikProps)}
                  className="btn btn-success"
                  type="button"
                >
                  Add
                </button>
              )}

              <button
                onClick={handleClearSelectedIngredient.bind(null, formikProps)}
                className="btn btn-primary"
                type="button"
              >
                Clear
              </button>
            </div>
            <hr />

            <div>
              <ul className="list-group">
                {props.shoppingIngredients.map((ingredient) => (
                  <li
                    key={generateKey(ingredient.name)}
                    className="list-group-item"
                    onClick={selectIngredient.bind(
                      null,
                      formikProps,
                      ingredient
                    )}
                  >
                    {ingredient.name} ({ingredient.amount})
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};
