import { createContext, useReducer } from "react";

export const AuthContexts = createContext();

const intialState = {
  currentUser: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, currentUser: action.payload };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, intialState);

  const Login = (userData) => {
    localStorage.setItem("current-user", JSON.stringify(userData.user));
    localStorage.setItem("Token", JSON.stringify(userData.token));

    dispatch({
      type: "LOGIN",
      payload: userData.user,
    });
  };

  return (
    <AuthContexts.Provider value={{ state, Login }}>
      {children}
    </AuthContexts.Provider>
  );
};

export default AuthProvider;
