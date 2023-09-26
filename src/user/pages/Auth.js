import React, {useState, useContext} from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_EMAIL,
         VALIDATOR_MINLENGTH,
         VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import {useForm} from '../../shared/hooks/form-hook'
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css'

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState()


  const [formState, inputHandler, setFormData] = useForm(
      {
         email:{
            value:'',
            isValid: false
         },
         password:{
            value:'',
            isValid:false
         }
      },
      false
   );

   const switchModeHandler = () => {
      if(!isLoginMode){
            setFormData(
               {
                  ...formState.inputs,
                  name: undefined
               }, 
               formState.inputs.email.isValid && formState.inputs.password.isValid 
               );
      } else {
         setFormData({
            ...formState.inputs,
            name:{
               value:'',
               isValid:false
            }
         }, false
         );
      }
      setIsLoginMode(prevMode => !prevMode)
   };
  const authSubmitHandler = async Event => {
   Event.preventDefault();
   
   //send http request with the fetch api provided by modern java script
   //or it can be done by using axios
   setIsLoading(true);
   if(isLoginMode){
      try{
         
         const response = await fetch('http://localhost:5000/api/users/login',{
            method:'POST',
            headers:{
             'Content-Type':'application/json'  
            },
            body:JSON.stringify({
               email: formState.inputs.email.value,
               password: formState.inputs.password.value
            })
         });
        const responseData = await response.json();
        if(!response.ok){
         return next(new Error(responseData.message))
        }
        auth.login();
        setIsLoading(false);
      }catch(err){
       console.log(err);
       setIsLoading(false)
       setError(err.message || 'Something went Wrong, Please try again')
      }
   }
   else{
      try{
         
         const response = await fetch('http://localhost:5000/api/users/signup',{
            method:'POST',
            headers:{
             'Content-Type':'application/json'  
            },
            body:JSON.stringify({
               name: formState.inputs.name.value,
               email: formState.inputs.email.value,
               password: formState.inputs.password.value
            })
         });
        const responseData = await response.json();
        if(!response.ok){
         return next(new Error(responseData.message))
        }
        auth.login();
        setIsLoading(false);
      }catch(err){
       console.log(err);
       setIsLoading(false)
       setError(err.message || 'Something went Wrong, Please try again')
      }
   }
   setIsLoading(false)

  // console.log(formState.inputs);
  };
const errorHandler = () => {
   setError(null);
}

 return (
   <React.Fragment>
   <ErrorModal error={error} onClear= {errorHandler} />
   <Card className="authentication">
   {isLoading && <LoadingSpinner asOverlay />}
   <h2>Login Required</h2>
   <hr />
   <form onSubmit={authSubmitHandler}>
     {!isLoginMode && <Input 
        element="input"
        id="name"
        type="text"
        label="User Name"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter your user name" 
        onInput={inputHandler}
     />}
     <Input
        element="input"
        id="email"
        type="email"
        label="E-Mail"
        validators={[VALIDATOR_EMAIL()]}
        errorText="Please enter a valid email address." 
        onInput={inputHandler}
        />
     <Input
        element="input"
        id="password"
        type="password"
        label="Password"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter your password (atleast 5 character)." 
        onInput={inputHandler}
        />
        <Button type="submit" disable ={!formState.isValid}>
        {isLoginMode ?  'Login' : 'Signup' }
        </Button>
   </form>
   <Button inverse onClick={switchModeHandler}>
   Switch To  {isLoginMode ? 'Signup' : 'Login'}
   </Button>
</Card>
</React.Fragment>
 )
 
 
} 

export default Auth;