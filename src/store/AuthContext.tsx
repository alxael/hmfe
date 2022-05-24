import { createContext, useState } from "react";

const AuthContext = createContext({
  token: "",
  isLoggedIn: false,
  login: (token: string, expirationTime: string) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime: string) => {
  const currentTime = new Date().getTime();
  const adjustedExpirationTime = new Date(expirationTime).getTime();
  const remainingTime = adjustedExpirationTime - currentTime;
  return remainingTime;
}

export const AuthContextProvider = (props: any) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState<string | null>(initialToken);

  const userIsLoggedIn = !!token;

  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const loginHandler = (loginToken: string, expirationTime: string) => {
    localStorage.setItem("token", loginToken);
    setToken(loginToken);
    const remainingTime = calculateRemainingTime(expirationTime);
    setTimeout(logoutHandler, remainingTime);
  };

  const contextValue = {
    token: token as string,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;