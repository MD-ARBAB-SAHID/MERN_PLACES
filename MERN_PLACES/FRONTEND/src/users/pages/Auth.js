import React,{useContext, useState} from "react"
import Card from "../../shared/components/UIElements/Card"
import useForm from "../../shared/hooks.js/form-hook"
import Input from "../../shared/components/FormElements/Input"
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from "../../shared/components/util/validators"
import Button from "../../shared/components/FormElements/Button"
import "./Auth.css"
import AuthContext from "../../shared/contextApi/AuthContext"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import useHttpClient from "../../shared/hooks.js/http-client"
import ImageUpload from "../../shared/components/FormElements/ImageUpload"
import MetaTags from 'react-meta-tags';

const Auth = ()=>{
    const authCtx = useContext(AuthContext)
    const[isLogin,setIsLogin]  = useState(true);
    const {isLoading,error,sendRequest,errorHandler} = useHttpClient()

    const onSubmitHandler = async (event)=>{
        event.preventDefault();
    
        if(isLogin){
            try{
                const data = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/login`,"POST",{
                    'Content-Type':"application/json"
                },JSON.stringify({
                  
                    email:state.inputs.email.value,
                    password:state.inputs.password.value
                }))
                
            authCtx.login(data.userId,data.token);
            }catch(err)
            {   
             
               
            }
        }else{
            console.log(state.inputs.image.value)
            try{
                const formData = new FormData();
                formData.append("name",state.inputs.name.value);
                formData.append("email",state.inputs.email.value);
                formData.append("password",state.inputs.password.value);
                formData.append("image",state.inputs.image.value);
                const data = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/signin`,"POST",{},formData)
            
            authCtx.login(data.userId,data.token);
            }catch(err)
            {   
                console.log(err);
               
            }
            
           
        }
       
    }
    const [onInput,state,setData] = useForm({
        email:{
            value:'',
            isValid:false
        },
        password:{
            value:'',
            isValid:false
        }
    },false)
    const switchState = ()=>{
        if(isLogin)
        {
            setData({
                ...state.inputs,
                name:{
                    value:'',
                    isValid:false
                },
                image:{
                    value:null,
                    isValid:false
                }
            },false)
        }
        else
        {
            setData({
                ...state.inputs,
                name:undefined,
                image:undefined
            },state.inputs.email.isValid && state.inputs.password.isValid)
        }
        setIsLogin((prv)=>{
            return !prv;
        })
    }

    let metaTags = isLogin ? <MetaTags>
    <title>Login</title>
            <meta id="meta-description" name="description" content="Login to explore meetups" />
    </MetaTags> : <MetaTags>
    
    <title>SignUp</title>
            <meta id="meta-description" name="description" content="Create your account  to explore meetups" />
    </MetaTags>
        
    
  
   return  (<>
   {metaTags}
   <ErrorModal error={error} onClear={errorHandler} />
   <Card className="authentication">
       {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>

        <hr />

        <form onSubmit={onSubmitHandler}>
        {
            !isLogin &&  <Input element="input" 
            type="text" 
            id="name" 
            label="Name" 
            onInput={onInput} 
            validators={[VALIDATOR_MINLENGTH(5)]} 
            errorText="Please enter name of 5 characters"/>
        }
        {!isLogin && <ImageUpload id="image" center="center"
        onInput={onInput}/>}
        <Input element="input" 
        type="email" 
        id="email" 
        label="Email" 
        onInput={onInput} 
        validators={[VALIDATOR_EMAIL()]} 
        errorText="Please Enter A Valid Email"/>

<Input element="input" 
        type="password" 
        id="password"
        label="password" 
        onInput={onInput} 
        validators={[VALIDATOR_MINLENGTH(5)]} 
        errorText="Password should be 6 characters long"/>

<Button  disabled={!state.isValid} >{isLogin ? "Login" : "SignUp"}</Button>

        </form>
        <Button onClick={switchState}>{isLogin ? "Switch to SignUp" : "Switch to Login" }</Button>
        
    </Card>
    </>)
}

export default Auth;