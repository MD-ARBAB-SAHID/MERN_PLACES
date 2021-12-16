import React, { useCallback, useReducer ,useContext} from "react";
import "./NewPlace.css"
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/components/util/validators";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button"
import useForm from "../../shared/hooks.js/form-hook";
import AuthContext from "../../shared/contextApi/AuthContext";
import useHttpClient from "../../shared/hooks.js/http-client";
import { useHistory } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import MetaTags from 'react-meta-tags';

const NewPlace =()=>{
    const history = useHistory();
    const {isLoading,error,sendRequest,errorHandler} = useHttpClient()
    const authCtx = useContext(AuthContext)
    const[onInput,state] = useForm({
    title:{
        value:'',
        isValid:false
    },
    description:{
        value:'',
        isValid:false
    },
    address:{
        value:'',
        isValid:false
    },
    image:{
        value:null,
        isValid:false
    }
   },false)
    const submitHandler = async (event)=>{
        event.preventDefault();
       
        const formData = new FormData();
        formData.append('title',state.inputs.title.value);
        formData.append('description',state.inputs.description.value);
        formData.append('address',state.inputs.address.value);
        formData.append('image',state.inputs.image.value);
        


        try{
        await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places`,
          "POST",
        {
             "Authorization":"Bearer "+authCtx.token  
            },
            formData
          )

          history.replace("/");


        }catch(err){

        }
    }

    
    return (
        <>
        <MetaTags>
        <title>Add Meetup</title>
        <meta id="meta-description" name="description" content="Add your own meetups and create amazing networking opportunities" />
        </MetaTags>
        <ErrorModal error={error} onClear={errorHandler} />
        <form className="place-form" onSubmit={submitHandler}>
            {isLoading && <LoadingSpinner asOverlay />}
            <Input element="input" type="text" label="Title" id="title" errorText="Please Enter A Valid Title" validators={[VALIDATOR_REQUIRE()]}
            onInput={onInput}/>
            
            <Input element="input" type="text" id="description" errorText="Please enter atleast 5 characters" validators={[VALIDATOR_MINLENGTH(5)]} onInput={onInput} label="Description"/>
            <ImageUpload onInput={onInput} center id="image"/>
            <Input element="input" type="text" id="address" errorText="Please enter valid address" validators={[VALIDATOR_REQUIRE()]} onInput={onInput} label="Address"/>
            <Button type="submit" disabled={!state.isValid} >Add place</Button>
        </form>
        </>
    )
}

export default NewPlace;
