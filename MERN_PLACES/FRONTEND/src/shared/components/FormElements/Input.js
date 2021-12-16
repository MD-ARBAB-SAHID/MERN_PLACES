import React, { useEffect, useReducer } from "react"
import "./Input.css"
import { validate } from "../util/validators"
const reducerFn = (state,action)=>{
    switch(action.type)
    {
        case "CHANGE" :
        return{
                ...state,
                value:action.val,
                isValid:validate(action.val,action.validators)
        }
        case "TOUCHED" :
            return {
                ...state,
                isTouched:true
            }
        default:
            return {
               state
            }
           
    }
}
const Input = (props)=>{

    const [state,dispatch] = useReducer(reducerFn,{
        value:props.value || "",
        isValid:props.isValid || false,
        isTouched:false
    })

const {onInput,id} = props;
const {value,isValid}=state;
    useEffect(()=>{
        
        onInput(id,value,isValid);
       
    },[onInput,id,value,isValid])

    const changeHandler = (event)=>{
        dispatch({type:"CHANGE",val:event.target.value,validators:props.validators})
    }

    const blurHandler = (event)=>{
        dispatch({type:"TOUCHED"});
    }

    const input = props.element==="input" ? <input type={props.type} id={props.id} onChange={changeHandler} value={state.value} onBlur={blurHandler}/> : <textarea rows={props.rows || 30} id={props.id} onChange={changeHandler} value={state.value} onBlur={blurHandler}/> 

    return (
        <div className={`form-control ${!state.isValid &&state.isTouched && "form-control--invalid" }`}>
        <label htmlFor={props.id}>{props.label}</label>
        {input}
        {!state.isValid && state.isTouched && <p>{props.errorText}</p>}
        </div>
    )
}

export default Input;