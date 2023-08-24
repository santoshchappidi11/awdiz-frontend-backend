import { createContext, useEffect, useReducer } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

export const AuthContexts = createContext();

const intialState = {
  currentUser: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, currentUser: action.payload };
    case "LOGOUT":
      return { ...state, currentUser: null };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, intialState);
  // console.log(state);

  const Login = (userData) => {
    // localStorage.setItem("current-user", JSON.stringify(userData.user));
    localStorage.setItem("Token", JSON.stringify(userData.token));

    dispatch({
      type: "LOGIN",
      payload: userData.user,
    });
  };

  const Logout = () => {
    localStorage.removeItem("Token");
    dispatch({
      type: "LOGOUT",
    });
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      const token = JSON.parse(localStorage.getItem("Token")) || "";
      if (token?.length) {
        const response = await axios.post(
          "http://localhost:8002/get-current-user",
          { token }
        );

        if (response.data.success) {
          dispatch({
            type: "LOGIN",
            payload: response.data.user,
          });
        } else {
          toast.error(response.data.message);
        }
      }
    };

    getCurrentUser();
  }, []);

  return (
    <AuthContexts.Provider value={{ state, Login, Logout }}>
      {children}
    </AuthContexts.Provider>
  );
};

export default AuthProvider;
