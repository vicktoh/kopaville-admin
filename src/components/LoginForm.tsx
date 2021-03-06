import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useFormik } from "formik";
import React, { FC } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../reducers/authSlice";
import { firebaseAuth } from "../services/firebase";
import { Auth } from "../types/Auth";

export const LoginForm: FC = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const credentials = await signInWithEmailAndPassword(
          firebaseAuth,
          values.email,
          values.password
        );
        const user = credentials.user;
        const idToken = await user.getIdTokenResult();
        const claims = idToken.claims;
        console.log("my claims", claims);
        if (claims?.admin) {
          const auth: Auth = {
            userId: user.uid,
            displayName: user.displayName || "Unknown name",
            photoUrl: user.photoURL || "",
            lastSeen: user.metadata?.lastSignInTime || "",
          };
          dispatch(setAuth(auth));
        } else {
          toast({
            title: "You are not an admin user",
            status: "error",
          });
          signOut(firebaseAuth);
        }
      } catch (error) {
        const err: any = error;
        toast({
          title: "Could not sign in",
          description: err?.message || "unknown error occured, try again",
          status: "error",
        });
      }
    },
  });
  return (
    <Flex px={5} direction="column">
      <Heading mt={3} mb={7}>
        Kopaville Admin
      </Heading>
      <form onSubmit={formik.handleSubmit}>
        <FormControl isRequired>
          <FormLabel htmlFor="email">email</FormLabel>
          <Input
            borderColor="brand.400"
            id="email"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            type="email"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="email">password</FormLabel>
          <Input
            borderColor="brand.400"
            id="password"
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
        </FormControl>
        <Button
          isLoading={formik.isSubmitting}
          my={4}
          colorScheme="brand"
          type="submit"
        >
          Login
        </Button>
      </form>
    </Flex>
  );
};
