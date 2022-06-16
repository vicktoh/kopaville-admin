import {
  Avatar,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { BsMailbox, BsPerson } from "react-icons/bs";
import { FaGlobeAsia } from "react-icons/fa";
import { fetchProfile } from "../services/userServices";
import { Profile } from "../types/Profile";
import { StateComponent } from "./StateComponent";
type UserProps = {
  userId: string;
};
export const UserCard: FC<UserProps> = ({ userId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile>();
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await fetchProfile(userId);
        setProfile(profile);
      } catch (error) {
        const err: any = error;
        toast({
          title: "Unable to fetch user",
          description: err?.message || "Unknonw Error",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <StateComponent loading={true} loadingText="Fetching User Profile.." />
    );
  }

  return profile ? (
    <Flex direction="column">
      <HStack spacing={4} alignItems="center">
        <Avatar
          size="lg"
          src={profile.profileUrl}
          name={profile.loginInfo.fullname}
        />
        <VStack spacing={0} alignItems="flex-start">
          <Heading size="md">{profile.loginInfo?.fullname}</Heading>
          <Text size="md">{profile.loginInfo?.username}</Text>
        </VStack>
      </HStack>
      <HStack spacing={4} flexWrap="wrap">
        <VStack my={4} spacing={0} alignItems="flex-start">
          <HStack>
            <Icon as={BsMailbox} fontSize="sm" color="brand.500" />
            <Text fontSize="sm">Email</Text>
          </HStack>
          <Text fontSize="md" color="brand.500">
            {profile.loginInfo.email}
          </Text>
        </VStack>
        <VStack my={4} spacing={0} alignItems="flex-start">
          <HStack>
            <Icon as={FaGlobeAsia} fontSize="sm" color="brand.500" />
            <Text fontSize="sm">State</Text>
          </HStack>
          <Text fontSize="md" color="brand.500">
            {profile.profile?.servingState}
          </Text>
        </VStack>
        <VStack my={4} spacing={0} alignItems="flex-start">
          <HStack>
            <Icon as={BsPerson} fontSize="sm" color="brand.500" />
            <Text fontSize="sm">Gender</Text>
          </HStack>
          <Text fontSize="md" color="brand.500">
            {profile.loginInfo.gender || "Unspecified"}
          </Text>
        </VStack>
      </HStack>
    </Flex>
  ) : (
    <StateComponent loading={false} text="There's nothing to show her" />
  );
};
