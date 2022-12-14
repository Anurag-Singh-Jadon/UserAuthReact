import React,{useState} from 'react';
const AuthContext = React.createContext({
    token:'',
    isLoggedIn: false,             /*    This tells us whether the current user of website is login or not  */
    login: (token) => {},
    logout: () => {}
});

export const AuthContextProvider = (props) => {
  const [token,setToken] = useState(null)

  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
     setToken(token)
  };

  const logoutHandler = () =>{
    setToken(null)
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler
  }

    return <AuthContext.Provider value={contextValue}>
        {props.children}
    </AuthContext.Provider>
};

export default AuthContext;