import React ,{useState,useEffect} from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import PlaceList from '../components/PlaceList';
import { useParams } from 'react-router-dom';
import useHttpClient from '../../shared/hooks.js/http-client';
import MetaTags from 'react-meta-tags';

const UserPlaces = () => {
  const [loadedPlaces,setLoadedPlace] = useState()
  const userId = useParams().userId;
const {isLoading,error,sendRequest,errorHandler}  = useHttpClient();
useEffect(()=>{
  
const fetchUsersPlace = async()=>{
  try{
    const data = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
    setLoadedPlace(data.place);
  }
  catch(err)
  {
    
  }
 
 

}

fetchUsersPlace();
},[sendRequest,userId])

 return (<>
   <MetaTags>
   <title> Meetups</title>
            <meta id="meta-description" name="description" content="My meetups to explore" />
   </MetaTags>
 <ErrorModal error={error} onClear={errorHandler} />
 {isLoading && <LoadingSpinner asOverlay />}
 {
   !isLoading && loadedPlaces &&  <PlaceList items={loadedPlaces} />
 }

 </>);
};

export default UserPlaces;