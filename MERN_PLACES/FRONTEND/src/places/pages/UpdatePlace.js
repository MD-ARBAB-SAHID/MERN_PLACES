import React, { useEffect, useState } from "react"
import { useParams } from "react-router";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH } from "../../shared/components/util/validators";
import "./NewPlace.css"
import useForm from "../../shared/hooks.js/form-hook";
import useHttpClient from "../../shared/hooks.js/http-client";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHistory } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../shared/contextApi/AuthContext";
const UpdataPlace =()=>{
  const history = useHistory()
  const authCtx = useContext(AuthContext)
 const [identifiedPlace,setIdentifiedPlace] = useState();
    const params = useParams();
    const placeId = params.placeId;
   const {isLoading,error,sendRequest,errorHandler} = useHttpClient();


    const [onInput,state,setData] = useForm({
        title:{
            value:"",
            isValid:false
        },
        description:{
            value:"",
            isValid:false
        }
    },false)

    const changeHandler = async(event)=>{
      event.preventDefault();
    
      try{
        await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,"PATCH",
        {'Content-Type':"application/json",
        'Authorization':'Bearer '+authCtx.token},
        JSON.stringify({
          title:state.inputs.title.value,
          description:state.inputs.description.value
        }))

        history.replace(`/${authCtx.userId}/places`)
      }catch(err)
      {
 
      }
    }

    useEffect(()=>{
        const fetchUsersPlace = async()=>{
          try{
              

               const data  = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);

               setIdentifiedPlace(data.place);
               
          }catch(err){

          }
        }
        fetchUsersPlace();
    },[placeId,sendRequest,setData])
    if(isLoading)
    {
      return <div className="center">
      <LoadingSpinner asOverlay/>
  </div>
    }
    if(!identifiedPlace && !error)
    {
        return <div className="center">
            <h2>Could Not Find Place</h2>
        </div>
    }
    return (
      <>
<ErrorModal error={error} onClear={errorHandler}/>
    
       <form className="place-form" onSubmit={changeHandler}>
         {
           !isLoading && identifiedPlace && (<><Input element="input" type="text" label="Title" id="title" errorText="Please Enter A Valid Title" validators={[VALIDATOR_REQUIRE()]}
           onInput={onInput} value={identifiedPlace.title} isValid={true}/>
           
           <Input element="input" type="text" id="description" errorText="Please enter atleast 5 characters" validators={[VALIDATOR_MINLENGTH(5)]} onInput={onInput} label="Description" value={identifiedPlace.description} isValid={true}/>
           <Button type="submit" disabled={!state.isValid} >Update place</Button></>)
         }
            

       </form>
       </>
    )
}
export default UpdataPlace