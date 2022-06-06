import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import React, { FC } from "react";
type StateComponentProps = {
  loading?: boolean;
  text?: string;
  loadingText?: string;
  description?: string;
};
export const StateComponent: FC<StateComponentProps> = ({
  loading = false,
  loadingText = "Please Wait...",
  text = "Oops there's nothing to show here",
  description = "Theres is no data to show here refine your search or try again",
}) => {
  if (loading) {
    return (
      <Flex flex="1 1 auto" justifyContent="center" alignItems="center">
        <Spinner />
        <Text fontSize="md">{loadingText}</Text>
      </Flex>
    );
  }
  return (
    <Flex flex="1 1 auto">
      <Heading fontSize="lg">{text}</Heading>
      <Text>{description}</Text>
    </Flex>
  );
};
