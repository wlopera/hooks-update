import React, { useReducer, useState, useEffect, useCallback, useContext } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const Ingredients = () => {
  const [useIngredients, setUseIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    console.log("Renderizando ingredientes");
  }, [setUseIngredients]);

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);
    fetch("https://react-hooks-update-8abf4.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        setIsLoading(false);
        return response.json();
      })
      .then((reponseData) => {
        setUseIngredients((prevIngredients) => [...prevIngredients, { id: reponseData.name, ...ingredient }]);
      });
  };

  const removeIngredientHandler = (id) => {
    setIsLoading(true);
    fetch(`https://react-hooks-update-8abf4.firebaseio.com/ingredients/${id}.jon`, {
      method: "DELETE",
    })
      .then((response) => {
        setIsLoading(false);
        setUseIngredients((prevIngredients) => prevIngredients.filter((ingredient) => ingredient.id !== id));
      })
      .catch((err) => {
        setError("Error removiendo ingrediente: " + err);
      });
  };

  const filterIngredientsHandler = useCallback(
    (filterIngredients) => {
      setUseIngredients(filterIngredients);
    },
    [setUseIngredients]
  );

  const clearError = () => {
    setError(null);
    setIsLoading(false);
  };

  console.log(111111111, { error, isLoading });
  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        <IngredientList ingredients={useIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
};

export default Ingredients;
