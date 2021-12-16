import React, { useCallback, useReducer } from "react";
import { validate } from "../components/util/validators";

const reducerFormFn = (state,action)=>{
    
    switch(action.type)
    {   case "SET_DATA":
    return {
        ...state,
        inputs:action.inputs,
        isValid:action.isValid
    }
        case "CHANGE_INPUT":
    let formIsValid = true;
            for(const inputId in state.inputs)
            {   if(!state.inputs[inputId])
                {
                    continue;
                }
                if(inputId===action.inputId)
                {   
                    formIsValid = formIsValid && action.isValid;
                }
                else{
                
              
                    formIsValid = formIsValid && state.inputs[inputId].isValid
                    ;
                   
                    
                }
            }
            return{
                ...state,
                inputs:{
                    ...state.inputs,
                    [action.inputId]:{
                        value:action.value,
                        isValid:action.isValid
                    }
                },
                isValid:formIsValid
            }
        default:
            return state;
    }
    }

    const useForm = (inputDetails,validity)=>{

        const onInput = useCallback((id,value,isValid)=>{
        
            dispatch({type:"CHANGE_INPUT",value:value,inputId:id,isValid:isValid})
        },[])

        const [state,dispatch] = useReducer(reducerFormFn,
            {
                inputs:inputDetails,
                isValid:validity
            }
        )

        const setData = useCallback((inputData,validity)=>{
                dispatch({
                    type:"SET_DATA",
                    inputs:inputData,
                    isValid:validity
                })
        },[])
        
            return [onInput,state,setData];
    }

    export default useForm;