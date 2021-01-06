import React, { useEffect } from 'react';
import './App.css';
import Imessage from './Imessage';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser,login,logout } from './features/userSlice'
import Login from './Login';
import { auth } from './firebase';

function App() {

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(()=>{
    auth.onAuthStateChanged(authUser=>{
      if(authUser){
        //user is logged in
        dispatch(login({
          uid: authUser.uid,
          photo: authUser.photoURL,
          email: authUser.email,
          displayName: authUser.displayName,
        }))
      }else{
        //user is logged out
        dispatch(logout());
      }
    })
  },[dispatch])

  return (
    //BEM
    <div className="app">
    {user ? <Imessage /> : <Login /> }
    </div>
  );
}

export default App;
