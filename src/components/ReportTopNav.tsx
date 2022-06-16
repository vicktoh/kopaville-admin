import React, { FC } from "react";
import { Button, Flex, HStack } from "@chakra-ui/react";
import { NavLink, useMatch } from "react-router-dom";

export const ReportTopNav: FC = () => {
  return (
    <Flex
      direction="row"
      width="100%"
      position="sticky"
      py={3}
      px={1}
      bg="secondary.300"
      top={0}
    >
      <HStack spacing={5} ml="auto">
        <Button
          variant="ghost"
          size="xs"
          as={NavLink}
          to={`/reports`}
          color={!!useMatch("/reports") ? "brand.400" : "black"}
        >
          Reported Posts
        </Button>
        <Button
          variant="ghost"
          size="xs"
          as={NavLink}
          to={`/reports/users`}
          color={!!useMatch("/reports/users") ? "brand.400" : "black"}
        >
          Reported Users
        </Button>
      </HStack>
    </Flex>
  );
};
