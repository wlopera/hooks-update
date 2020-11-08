import React, { useReducer, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;

    case "ADD":
      return [...currentIngredients, action.ingredient];

    case "DELETE":
      return currentIngredients.filter((ingred) => ingred.id !== action.id);

    default:
      throw new Error("No se pudo procesar la acción del Reducer");
  }
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...curHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...curHttpState, error: null };

    default:
      throw new Error("Error en consulta servicio HTTP");
  }
};

const Ingredients = () => {
  const [useIngredients, dispatch] = useReducer(ingredientsReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });

  const addIngredientHandler = useCallback((ingredient) => {
    dispatchHttp({ type: "SEND" });
    fetch("https://react-hooks-update-8abf4.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "http://localhost:3000" },
    })
      .then((response) => {
        dispatchHttp({ type: "RESPONSE" });
        return response.json();
      })
      .then((reponseData) => {
        //setUseIngredients((prevIngredients) => [...prevIngredients, { id: reponseData.name, ...ingredient }]);
        dispatch({ type: "ADD", ingredient: { id: reponseData.name, ...ingredient } });
      });
  }, []);

  const removeIngredientHandler = useCallback((id) => {
    dispatchHttp({ type: "SEND" });
    fetch(`https://react-hooks-update-8abf4.firebaseio.com/ingredients/${id}.json`, {
      method: "DELETE",
      headers: { "Access-Control-Allow-Origin": "http://localhost:3000" },
    })
      .then((response) => {
        dispatchHttp({ type: "RESPONSE" });
        //setUseIngredients((prevIngredients) => prevIngredients.filter((ingredient) => ingredient.id !== id));
        dispatch({ type: "DELETE", id: id });
      })
      .catch((err) => {
        dispatchHttp({ type: "SEND", errorMessage: "Error removiendo ingrediente: " + err });
      });
  }, []);

  const filterIngredientsHandler = useCallback(
    (filterIngredients) => {
      //setUseIngredients(filterIngredients);
      dispatch({ type: "SET", ingredients: filterIngredients });
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatchHttp({ type: "CLEAR" });
  }, []);

  const ingredientList = useMemo(() => {
    return <IngredientList ingredients={useIngredients} onRemoveItem={removeIngredientHandler} />;
  }, [useIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading} />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
