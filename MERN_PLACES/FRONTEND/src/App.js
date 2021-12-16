import React, { useCallback, useContext, useEffect,Suspense } from 'react';
import {Route,Switch,Redirect} from "react-router-dom"
// import NewPlace from './places/pages/New Place';

// import Users from './users/pages/Users';
// import UserPlaces from './places/pages/UserPlaces';
// import UpdataPlace from './places/pages/UpdatePlace';
// import Auth from './users/pages/Auth';
import AuthContext from './shared/contextApi/AuthContext';
import { useState} from 'react';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const NewPlace = React.lazy(()=>import('./places/pages/New Place'))
const UserPlaces = React.lazy(()=>import('./places/pages/UserPlaces'))
const UpdataPlace = React.lazy(()=>import('./places/pages/UpdatePlace'))
const  Users= React.lazy(()=>import('./users/pages/Users'))
const Auth = React.lazy(()=>import('./users/pages/Auth'))
let filter;
function App() {
  let routes;
  
  const [token,setToken] = useState(false);
  const [isUserId,setUserId] = useState(null);
 const [tokenExpiry,setTokenExpiry] = useState();
  const loginHandler = useCallback((userId,token,expiryDate)=>{

  setUserId(userId);
    setToken(token);
    const expiration = expiryDate || new Date(new Date().getTime() + 1000*60*60);
    setTokenExpiry(expiration);
 
    localStorage.setItem("userData",JSON.stringify({
      userId:userId,
      token:token,
      expiry:expiration.toISOString()
    }))
  },[])

  useEffect(()=>{
 

    const storedData = JSON.parse(localStorage.getItem("userData"));
    if(storedData && storedData.token && new Date(storedData.expiry)>new Date())
    {
      loginHandler(storedData.userId,storedData.token,new Date(storedData.expiry));
    }
  },[loginHandler])

  const logoutHandler= useCallback(()=>{
    
    setUserId(null)
setToken(null);
setTokenExpiry(null);
localStorage.removeItem('userData');
  },[])

  useEffect(()=>{
    
    if(token && tokenExpiry){
    
      const remain = tokenExpiry.getTime() - new Date().getTime();
      console.log("Remain "+remain);
     filter =  setTimeout(logoutHandler,remain);
    }else{
      
      clearTimeout(filter);
    }
  },[token,logoutHandler,tokenExpiry]);

  
if(token)
{
  routes=(
    <Switch>
        <Route path="/" exact>
      <Users />
  </Route>
  <Route path="/:userId/places" exact>
      <UserPlaces/>
  </Route>
  <Route path="/places/new" exact>
      <NewPlace />
  </Route>
  <Route path="/places/:placeId" >
     <UpdataPlace />
  </Route>
  <Redirect to="/" />

  </Switch>
  )
}
else{

  routes = (<Switch>
     <Route path="/" exact>
      <Users />
  </Route>
  <Route path="/:userId/places" exact>
      <UserPlaces/>
  </Route>
  <Route path="/auth" >
     <Auth />
  </Route>
  <Redirect to="/auth" />

  </Switch>)
}
  return (<AuthContext.Provider value={{isLoggedIn:!!token,
    token:token,
    userId:isUserId,
  login:loginHandler,
  logout:logoutHandler}}>
<MainNavigation />
<main>
  <Suspense fallback={<div className="center"><LoadingSpinner /></div>}>
  {routes}
  </Suspense>
 
  </main>
  
  
  
  </AuthContext.Provider>)
  
    
  
}

export default App;
