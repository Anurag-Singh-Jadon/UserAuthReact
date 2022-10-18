

import { useState, useRef,useContext } from 'react';
import {useHistory} from 'react-router-dom';
import AuthContext from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);       /* Here useContext aim to use Token during login or logout*/

  const [isLogin, setIsLogin] = useState(true);
  const[isLoading,setIsLoding] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // optional: Add validation
    setIsLoding(true);
    let url;
    if (isLogin) {
      //For SignIn
      url =
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB7GtCk1TkWuzry6ocIy1Bn-oTryW5nMJw'
    } else {
      //For Signup
      url = 
       'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB7GtCk1TkWuzry6ocIy1Bn-oTryW5nMJw'
    
    }

    fetch(
      url,
      {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then((res) => {
      setIsLoding(false);
      if (res.ok) {
       return res.json();
      } else {
        return res.json().then((data) => {
          let errorMessage = 'Authentication failed';
          // if(data && data.error && data.error.message){
          //  errorMessage = data.error.message;
          // }
         
         throw new Error(errorMessage);
        });
      }
    }).then(data => {
      authCtx.login(data.idToken);           /* Here we can see the token             */
       history.replace('/')
    }).catch(err =>{
      alert(err.message);
    });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>

          {!isLoading &&<button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending Request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
