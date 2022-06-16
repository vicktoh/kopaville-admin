import React, { useEffect, useState } from "react";
import { useAppSelector } from "./reducers/types";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "./services/firebase";
import { Flex, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { setAuth } from "./reducers/authSlice";
import { Login } from "./pages/Login";
import MainRoutes from "./navigation";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const auth = useAppSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  console.log({ auth });
  useEffect(() => {
    if (!auth) {
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          const idToken = await user.getIdTokenResult();
          const claims = idToken.claims;
          console.log({ claims });
          if (claims?.admin) {
            const userDetails = {
              userId: user.uid,
              email: user.email || "",
              phoneNumber: user.phoneNumber || "",
              displayName: user.displayName || "",
              lastSeen: user.metadata?.lastSignInTime || "",
              photoUrl: user.photoURL || "",
            };

            dispatch(setAuth(userDetails));
            setLoading(false);
          } else {
            setLoading(false);
            dispatch(setAuth(null));
          }
        } else {
          setLoading(false);
          dispatch(setAuth(null));
        }
      });

      return () => unsubscribe();
    }
  }, [auth, dispatch]);

  if (loading && auth == null) {
    return (
      <Flex
        width="100vw"
        height="100vh"
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Text>Loading</Text>
      </Flex>
    );
  }
  if (auth === null || Object.keys(auth).length === 0) {
    return <Login />;
  }
  return <MainRoutes />;
}

export default App;
