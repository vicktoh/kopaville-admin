import React, { FC } from "react";
import {
  Avatar,
  Flex,
  Heading,
  HStack,
  VStack,
  Text,
  Button,
} from "@chakra-ui/react";
import { useAppSelector } from "../reducers/types";
import {
  BsChatSquare,
  BsCartCheck,
  BsFolder2Open,
  BsFlag,
} from "react-icons/bs";
import { MdSecurity } from "react-icons/md";
import { Link, useMatch } from "react-router-dom";
import { logOUt } from "../services/authSevices";

export const SideNav: FC = () => {
  const auth = useAppSelector(({ auth }) => auth);

  return (
    <Flex
      direction="column"
      position={"fixed"}
      top={0}
      px={10}
      maxWidth="16rem"
      height="100vh"
      bg="brand.100"
      pb={5}
    >
      <Heading fontSize="lg" my={3}>
        Welcome Admin
      </Heading>

      <HStack spacing={2} mt={4} mb={10}>
        <Avatar name={auth?.displayName} src={auth?.photoUrl} size="lg" />
        <VStack spacing={1}>
          <Text fontWeight="bold">{auth?.displayName}</Text>
          <Text fontSize="xs">{`last seen: ${auth?.lastSeen}`}</Text>
        </VStack>
      </HStack>

      <VStack spacing={8} mt={14} alignItems="flex-start" px={5}>
        <Button
          color={!!useMatch("/dashboard") ? "brand.500" : "black"}
          fontWeight="normal"
          size="sm"
          as={Link}
          to="/dashboard"
          leftIcon={<BsChatSquare />}
          variant="ghost"
        >
          {" "}
          Post
        </Button>
        <Button
          color={!!useMatch("/users") ? "brand.500" : "black"}
          fontWeight="normal"
          size="sm"
          as={Link}
          to="/users"
          leftIcon={<MdSecurity />}
          variant="ghost"
        >
          {" "}
          Admin Users
        </Button>
        <Button
          color={!!useMatch("/jobs") ? "brand.500" : "black"}
          fontWeight="normal"
          size="sm"
          as={Link}
          to="/jobs"
          leftIcon={<BsFolder2Open />}
          variant="ghost"
        >
          Jobs
        </Button>
        <Button
          color={!!useMatch("/reports") ? "brand.500" : "black"}
          fontWeight="normal"
          size="sm"
          as={Link}
          to="/reports"
          leftIcon={<BsFlag />}
          variant="ghost"
        >
          {" "}
          Reports
        </Button>
        <Button
          color={!!useMatch("/market") ? "brand.500" : "black"}
          fontWeight="normal"
          size="sm"
          as={Link}
          to="/market"
          leftIcon={<BsCartCheck />}
          variant="ghost"
        >
          {" "}
          Kopaville Market
        </Button>
      </VStack>
      <Button
        onClick={() => logOUt()}
        variant="solid"
        colorScheme="brand"
        mt="auto"
        mb={5}
      >
        Logout
      </Button>
    </Flex>
  );
};
