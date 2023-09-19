import React from "react";
import {useParams} from 'react-router-dom';

import PlaceList from "../components/PlaceList";

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

const UserPlaces = () =>{
    const userId = useParams().userId;
    const loadedPlaces = DUMMY_PLACES.filter(place=>place.creator===userId)
    return <PlaceList items={loadedPlaces} />
}

export default UserPlaces;