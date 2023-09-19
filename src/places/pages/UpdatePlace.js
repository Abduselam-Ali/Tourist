import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {VALIDATOR_REQUIRE,
        VALIDATOR_MINLENGTH
  } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';

import './UpdatePlace.css';

const DUMMY_PLACES =[
    {
        id : 'p1',
        title: 'Empire State Bouilding',
        description:'One of the scysciper in the world',
        imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKOa4tfkllpBUR4kLZyqxwuAFlJQ_FFTOhRg9LKO_FPg&s',
        address:'20 W 34th St., New York, NY 10001, United States',
        location: {
            lat: 40.7484405,
            lng: -73.9882393
        },
        creator:'u1',

    },
    {
        id : 'p2',
        title: 'Empire State Bouilding',
        description:'One of the scysciper in the world',
        imageUrl:' https://www.esbnyc.com/sites/default/files/styles/2_features_right/public/2022-07/Raymond%20Uzanas.jpg?itok=sZcO7yxH',
        address:'20 W 34th St., New York, NY 10001, United States',
        location: {
            lat: 40.7484405,
            lng: -73.9882393
        },
        creator:'u2',

    },

];

const UpdatePlace = () => {

    const [isLoading, setIsLoading] = useState(true);
      const placeId = useParams().placeId;

      const [formState, inputHandler, setFormData] = useForm({
        title:{
            value:'',
            isValid: false
        },
        description:{
            value: '',
            isValid: false
        }
      }, false)


      const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId)
      
      useEffect (() => {
        if(!identifiedPlace){
            setFormData({
                title:{
                    value:identifiedPlace.title,
                    isValid: true
                },
                description:{
                    value: identifiedPlace.description,
                    isValid: true
                }
              }, true);
        }
         
          setIsLoading(false)
      },[setFormData, identifiedPlace]);
      

      const placeUpdateSubmitHandler = Event => {
        Event.preventDefault();
       };
       
      if(!identifiedPlace){
        return (
            <div className="center">
            <h2>Could not find place!</h2>
            </div>
        );
       }
       if (isLoading){
        return (
            <div className="center">
            <h2>Loading...</h2>
            </div>
        );
       }
       return (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input 
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={formState.inputs.title.value}
            initialValid={formState.inputs.title.isValid}
        />
        <Input 
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a vaid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={formState.inputs.description.value}
            initialValid={formState.inputs.description.isValid}
        />
        <Button type="submit" disabled={!formState.isValid}>Update Place</Button>

        </form>
       )
     
}

export default UpdatePlace;