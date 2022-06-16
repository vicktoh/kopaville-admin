import { Avatar, Flex, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import React, { FC } from "react";
import { Profile } from "../types/Profile";
type UserProfileProps = {
  profile: Profile;
};
export const UserProfile: FC<UserProfileProps> = ({ profile }) => {
  return (
    <Flex direction="column" px={2} pt={5}>
      <HStack spacing={2} my={5}>
        <Avatar
          src={profile?.profileUrl}
          name={profile.loginInfo.fullname}
          size="lg"
        />
        <VStack spacing={2} alignItems="flex-start">
          <Text fontSize="lg">{profile.loginInfo.fullname}</Text>
          <Heading fontSize="md">{profile.loginInfo.username || ""}</Heading>
        </VStack>
      </HStack>
      <Text>{profile.loginInfo?.email}</Text>
      <HStack spacing={8} my={5}>
        <Text fontSize="md" fontWeight="semibold">{`Followers: ${
          profile.followerships?.followers || 0
        }`}</Text>
        <Text fontSize="md" fontWeight="semibold">{`Following: ${
          profile.followerships?.following || 0
        }`}</Text>
        <Text fontSize="md" fontWeight="semibold">{`Account type: ${
          profile.loginInfo.type || "Individual"
        }`}</Text>
      </HStack>
      <HStack my={5} spacing={8}>
        <VStack alignItems="flex-start" spacing={2}>
          <Text fontSize="sm">Serving State</Text>
          <Heading fontSize="md">
            {profile.profile?.servingState || "-"}
          </Heading>
        </VStack>
        <VStack alignItems="flex-start" spacing={2}>
          <Text fontSize="sm">State Of Origin</Text>
          <Heading fontSize="md">
            {profile.profile?.stateOfOrigin || "-"}
          </Heading>
        </VStack>
        <VStack alignItems="flex-start" spacing={2}>
          <Text fontSize="sm">PPA</Text>
          <Heading fontSize="md">{profile.profile?.ppa || "-"}</Heading>
        </VStack>
      </HStack>
    </Flex>
  );
};
