import React, { useEffect, useState } from 'react';
import './App.css';
import { useAppSelector } from './reducers/types';
import {onAuthStateChanged} from 'firebase/auth';
import { firebaseAuth } from './services/firebase';
import {Flex, Text } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { setAuth } from './reducers/authSlice';
import { Login } from './pages/Login';
import MainRoutes from './navigation';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const auth = useAppSelector(({auth}) => auth);
  const dispatch = useDispatch();
  console.log({auth});
  useEffect(()=>{
    if(!auth){
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
            // let idToken = await user.getIdTokenResult();
            // let claims = idToken.claims;
            const userDetails = {
                userId: user.uid,
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                displayName: user.displayName || '',
                lastSeen: user.metadata?.lastSignInTime || "",
                photoURL: user.photoURL,
            };

            dispatch(setAuth(userDetails));
            setLoading(false);
        } else {
            setLoading(false);
            dispatch(setAuth(null));
        }
    });

    return () => unsubscribe();
    }
  }, [auth, dispatch]);
  
  if(loading && auth == null){
    return(
      <Flex width = "100vw" height="100vh" direction="column" justifyContent="center" alignItems="center" >
        <Text>Loading</Text>
      </Flex>
    )
  }
  if (auth === null || Object.keys(auth).length === 0) {
    return (
            <Login />
       
    );
}
return (
    <Flex direction="column" width="100vw" height="100vh" position="relative" overflowX="hidden">
        <MainRoutes />
    </Flex>
);
}

export default App;
