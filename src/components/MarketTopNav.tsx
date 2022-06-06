import React, { FC } from "react";
import { Button, Flex, HStack } from "@chakra-ui/react";
import { NavLink, useMatch } from "react-router-dom";

export const MarketTopNav: FC = () => {
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
          to={`/market`}
          color={!!useMatch("/market") ? "brand.400" : "black"}
        >
          Products
        </Button>
        <Button
          variant="ghost"
          size="xs"
          as={NavLink}
          to={`/market/categories`}
          color={!!useMatch("/market/categories") ? "brand.400" : "black"}
        >
          Categories
        </Button>
        <Button
          variant="ghost"
          size="xs"
          as={NavLink}
          to={`/market/vendors`}
          color={!!useMatch("/market/vendors") ? "brand.400" : "black"}
        >
          Vendors
        </Button>
      </HStack>
    </Flex>
  );
};
