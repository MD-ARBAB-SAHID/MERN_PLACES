import {useState,useCallback} from "react"

const useHttpClient = ()=>{
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState();
    const errorHandler = ()=>{
        setError(null);
    }
    const sendRequest = useCallback(async (url,
        method="GET",
        headers = {},
        body=null)=>{
            try{
                setIsLoading(true);
                const response = await fetch(url,{
                    method:method,
                    headers:headers,
                    body
                });
                    const data = await response.json();
                if(!response.ok)
                {
                    throw new Error(data.message)
                }
                setIsLoading(false);
                return data;
            }catch(err){
            
                setError(err.message);
                setIsLoading(false);
                throw new Error(err.message);
            }
                
    },[])
    return {isLoading,error,sendRequest,errorHandler}
}

export default useHttpClient;