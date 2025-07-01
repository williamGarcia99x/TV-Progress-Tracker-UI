"use client";

import { useState, createContext, useContext } from "react";

type AuthContextType = {
  token: string;
  userId: number;
};

//Set the initial state to null because on mounting the user is not authenticated
const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  //this the state that we want to share with the children components
  //we can use this state to store the user authentication status
  const [state, setstate] = useState(0);

  return (
    <AuthContext.Provider value={{ state, setstate }}>
      {children}
      <Foo count={state} />
    </AuthContext.Provider>
  );
}
export default AuthProvider;

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("AuthProvider was used outside of the AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };

function Foo({ count }: { count: number }) {
  console.log(count);
  return <div>{count}</div>;
}
