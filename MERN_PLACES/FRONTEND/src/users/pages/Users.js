import React,{useEffect,useState,useContext} from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import useHttpClient from "../../shared/hooks.js/http-client";
import AuthContext from "../../shared/contextApi/AuthContext";
import MetaTags from 'react-meta-tags';
const Users = ()=>{

   const authCtx = useContext(AuthContext)
    const [loadedUsers,setLoadedUsers] = useState();
    const {isLoading,error,sendRequest,errorHandler} = useHttpClient()

    useEffect(()=>{
       
        const fetchUsers = async()=>{
            
            try{   
                const data = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`);
                    
                    
                    setLoadedUsers(data.users);
                    
            }catch(err){
                 
            }
            
        }

        fetchUsers();
        
    },[sendRequest])
   
    return (
        <>
        <MetaTags>
        <title>MERN Meetups</title>
        <meta id="meta-description" name="description" content="Browse a huge list of highly active MERN meetups" />
        </MetaTags>
        <ErrorModal error={error} onClear={errorHandler} />

        {
            isLoading && (
                <div className="center">
                        <LoadingSpinner />
                </div>
            )
        }
        {!isLoading && loadedUsers && <UsersList items={loadedUsers}/>}
        </>
    )
}

export default Users;