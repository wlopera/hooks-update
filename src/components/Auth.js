import React, { useContext } from "react";

import Card from "./UI/Card";
import "./Auth.css";
import { AuthContext } from "../context/auth-context";

const Auth = (props) => {
  const authContext = useContext(AuthContext);

  const loginHandler = () => {
    authContext.login();
  };

  return (
    <div className="auth">
      <Card>
        <h2>Usted no esta autenticado!</h2>
        <p>Por favor, conectese para continuar.</p>
        <button onClick={loginHandler}>Conectar</button>
      </Card>
    </div>
  );
};

export default Auth;
