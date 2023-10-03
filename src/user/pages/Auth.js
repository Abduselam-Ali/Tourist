import React, {useState, useContext} from 'react';
import axios from "axios"

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_EMAIL,
         VALIDATOR_MINLENGTH,
         VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import {useForm} from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css'

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

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
                  name: undefined,
                  image: undefined
               }, 
               formState.inputs.email.isValid && formState.inputs.password.isValid 
               );
      } else {
         setFormData({
            ...formState.inputs,
            name:{
               value:'',
               isValid:false
            },
            image:{
               value: null,
               isValid: false
            }
         }, false
         );
      }
      setIsLoginMode(prevMode => !prevMode)
   };
  const authSubmitHandler = async event => {
   event.preventDefault();
   
   //send http request with the fetch api provided by modern java script
   //or it can be done by using axios  
   if(isLoginMode){
      try{
          const responseData = await sendRequest(
         'http://localhost:5000/api/users/login',
         'POST',
         JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
         }),
            {
             'Content-Type':'application/json'  
            }
         );
         
        auth.login(responseData.user.id);
      }catch(err){}
   }else{
    //  try{
           const formData = new FormData();
           formData.append('email', formState.inputs.email.value);
           formData.append('name', formState.inputs.name.value);
           formData.append('password', formState.inputs.password.value);
           formData.append('image', formState.inputs.image.value);
        
           axios
               .post('http://localhost:5000/api/users/signup',{},formData)
               .then((res) => {
                  console.log(res);

               });
   //        await sendRequest(
   //          'http://localhost:5000/api/users/signup',
   //          'POST',
   //          formData
   //          );
   //          console.log('sign up taen place--------------');
   //   // auth.login(responseData.user.id);
   //    }catch(err){
   //     console.log('something--------------');
   //    }
   }

  };
 return (
   <React.Fragment>
   <ErrorModal error={error} onClear= {clearError} />
   <Card className="authentication">
   {isLoading && <LoadingSpinner asOverlay />}
   <h2>Login Required</h2>
   <hr />
   <form onSubmit={authSubmitHandler}>
     {!isLoginMode && (<Input 
        element="input"
        id="name"
        type="text"
        label="User Name"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter your user name" 
        onInput={inputHandler}
     /> )}
     {!isLoginMode && ( 
      <ImageUpload center id="image" onInput={inputHandler} />
 )}
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
        validators={[VALIDATOR_MINLENGTH(6)]}
        errorText="Please enter your password (atleast 6 character)." 
        onInput={inputHandler}
        />
        <Button type="submit" disabled ={!formState.isValid}>
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