import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Layout from "../core/Layout";
import {read, update, updateUser} from './apiUser';

const Profile = (props) => {
   const [values, setValues] = useState({
      name: '',
      email: '',
      password: '',
      error: false,
      success: ''
   });

   const {name, email, password, error, success} = values;

   const {token} = isAuthenticated();

   const init = (userId) => {
      // console.log(userId)
      read(userId, token).then(data => {
         if (data.error){
            setValues({...values, error: true})
         }else{
            setValues({...values, name: data.name, email: data.email})
         }
      })

   }

   useEffect(() => {
      init(props.match.params.userId);
   },[])

   return (
      <Layout title="Profile" 
           description="Update your profile"
           className="container-fluid"
      >
        <h2 className="mb-4"> Profile Update </h2>
         {JSON.stringify(values)}
      </Layout>
    )
   
}

export default Profile;