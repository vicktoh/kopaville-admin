import { Flex, Heading, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import React, { FC } from "react";
import { BsPhone, BsTruck } from "react-icons/bs";
import { Order } from "../types/Product";
type AddressProps = {
  address: Order["billing"] | undefined;
};
export const AddressCard: FC<AddressProps> = ({ address }) => {
  return (
    <Flex direction="column">
      <HStack>
        <Icon as={BsTruck} />
        <Heading fontSize="md">{address?.address}</Heading>
      </HStack>
      <HStack my={5}>
        <Icon as={BsPhone} />
        <Text fontSize="md">{address?.phone}</Text>
      </HStack>
      <HStack spacing={5} flexWrap="wrap" mt={5}>
        <VStack spacing={0} alignItems="flex-start">
          <Text fontSize="sm" color="brand.500">
            city
          </Text>
          <Text>{address?.city}</Text>
        </VStack>
        <VStack spacing={0} alignItems="flex-start">
          <Text fontSize="sm" color="brand.500">
            postal code
          </Text>
          <Text>{address?.postalCode}</Text>
        </VStack>
        <VStack spacing={0} alignItems="flex-start">
          <Text fontSize="sm" color="brand.500">
            state
          </Text>
          <Text>{address?.state}</Text>
        </VStack>
      </HStack>
    </Flex>
  );
};
