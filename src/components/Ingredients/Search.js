import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;

  const [enteredFilter, setEnteredFilter] = useState("");

  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(111, enteredFilter, inputRef.current.value);
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? "" : `?orderBy="title"&equalTo="${enteredFilter}"`;

        fetch("https://react-hooks-update-8abf4.firebaseio.com/ingredients.json" + query, {
          method: "GET",
          headers: { "Access-Control-Allow-Origin": "http://localhost:3000" },
        })
          .then((response) => {
            return response.json();
          })
          .then((responseData) => {
            const loadIngredients = [];
            for (const key in responseData) {
              loadIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount,
              });
            }
            onLoadIngredients(loadIngredients);
          });
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filtrar por el Titulo</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
