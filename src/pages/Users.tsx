import {
  Avatar,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { StateComponent } from "../components/StateComponent";
import { UserProfile } from "../components/UserProfile";
import { algoliaIndex } from "../services/algolia";
import { disableUser, enableUser, setAdmin } from "../services/userServices";
import { Profile } from "../types/Profile";
type UserRowProps = {
  profile: Profile;
  onBlockPress: (profile: Profile) => void;
  onViewProfile: (profile: Profile) => void;
  onAdminPrompt: (profile: Profile) => void;
};
const UserRow: FC<UserRowProps> = ({
  profile,
  onBlockPress,
  onViewProfile,
  onAdminPrompt,
}) => {
  const { loginInfo, profileUrl, profile: generalProfile, isAdmin } = profile;

  return (
    <Tr>
      <Td>
        <Avatar src={profileUrl} name={loginInfo?.fullname} />
      </Td>
      <Td>{loginInfo?.fullname}</Td>
      <Td>{loginInfo?.username}</Td>
      <Td>{generalProfile?.servingState || "-"}</Td>
      <Td>
        <HStack spacing={3}>
          <Button
            onClick={() => onBlockPress(profile)}
            colorScheme="red"
            variant="outline"
          >
            {profile?.blocked ? "Unblock" : "Block"}
          </Button>
          <Button colorScheme="green" onClick={() => onViewProfile(profile)}>
            View Profile
          </Button>
          <Button
            colorScheme="blue"
            variant="outline"
            onClick={() => onAdminPrompt(profile)}
          >
            {isAdmin ? "Revoke Admin" : "Make Admin"}
          </Button>
        </HStack>
      </Td>
    </Tr>
  );
};

export const Users: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<Profile>();
  const [isMakingAdmin, setMakingAdmin] = useState<boolean>(false);
  const [isBlocking, setBlocking] = useState<boolean>(false);
  const {
    isOpen: isBlockModalOpen,
    onClose: onCloseBlockModal,
    onOpen: onOpenBlockModal,
  } = useDisclosure();
  const {
    isOpen: isProfileModalOpen,
    onClose: onCloseProfileModal,
    onOpen: onOpenProfileModal,
  } = useDisclosure();
  const {
    isOpen: isAdminModalOpen,
    onClose: onCloseAdminModal,
    onOpen: onOpenAdminModal,
  } = useDisclosure();
  const [page, setPage] = useState<number>(0);
  const [pageStat, setpageStats] = useState<{
    total: number;
    pages: number;
    currentPage: number;
  }>();
  const [users, setUsers] = useState<Profile[]>();
  const toast = useToast();

  const onBlockPrompt = (user: Profile) => {
    setSelectedUser(user);
    onOpenBlockModal();
  };
  const onAdminPrompt = (user: Profile) => {
    setSelectedUser(user);
    onOpenAdminModal();
  };

  const onViewProfile = (user: Profile) => {
    setSelectedUser(user);
    onOpenProfileModal();
  };
  const makeUserAdmin = async () => {
    try {
      setMakingAdmin(true);
      const response = await setAdmin({
        userId: selectedUser?.userId || "",
        admin: !!!selectedUser?.isAdmin,
      });
      if (response.data.status === "success") {
        const newusers = users?.map(({ userId, ...rest }) => {
          if (userId === selectedUser?.userId) {
            return {
              ...rest,
              userId,
              isAdmin: !!!selectedUser.isAdmin,
            };
          }
          return {
            ...rest,
            userId,
          };
        });
        setUsers(newusers);
        toast({ title: "Successfully authorized", status: "success" });
        onCloseAdminModal();
        return;
      }
      toast({
        title: "Failed to make admin",
        description: response.data?.message || "Unknown error try again",
        status: "error",
      });
    } catch (error) {
      const err: any = error;
      toast({
        title: "Failed to make admin",
        description: err?.message || "Unknown error try again",
        status: "error",
      });
    } finally {
      setMakingAdmin(false);
    }
  };
  const blockUser = async () => {
    if (!selectedUser) return;
    try {
      setBlocking(true);
      const { userId, blocked } = selectedUser;
      const response = await (blocked
        ? enableUser({ userId })
        : disableUser({ userId }));
      console.log(response, "block");
      if (response.data.status === "success") {
        const newusers = users?.map(({ userId, ...rest }) => {
          if (userId === selectedUser?.userId) {
            return {
              ...rest,
              userId,
              blocked: !!!selectedUser?.blocked,
            };
          }
          return {
            ...rest,
            userId,
          };
        });
        setUsers(newusers);
        toast({
          title: `${selectedUser?.loginInfo?.username || "User"} has been ${
            blocked ? "unblocked" : "blocked"
          }`,
          status: "success",
        });
        onCloseBlockModal();
        return;
      }
      toast({
        title: "Failed to block",
        description: response.data?.message || "Unknown error try again",
        status: "error",
      });
    } catch (error) {
      const err: any = error;
      toast({
        title: "failed to block",
        description: err?.message || "Unknown error try again",
        status: "error",
      });
    } finally {
      setBlocking(false);
    }
  };
  const onEnterQuery = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      setQuery(searchField);
    }
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const usersIndex = algoliaIndex("users");
        const response = await usersIndex.search(query, {
          page,
          hitsPerPage: 10,
        });
        console.log({ response });
        const { hits, nbHits, page: currentPage, nbPages } = response;
        setUsers(hits as any);
        setpageStats({
          total: nbHits,
          pages: nbPages,
          currentPage: currentPage + 1,
        });
        setPage(currentPage);
      } catch (error) {
        const err: any = error;
        toast({
          title: "Unable to fetch the users",
          description: err?.message || "Unknown Error",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [page, query]);

  if (loading) {
    return <StateComponent loading={true} />;
  }
  return (
    <Flex direction="column" px={5}>
      <Heading fontSize="lg" mt={3} mb={5}>
        Users
      </Heading>

      <Heading fontSize="sm">SearchUser</Heading>
      <HStack spacing={1} px={3} py={5}>
        <Icon as={BsSearch} />
        <Input
          onKeyUp={onEnterQuery}
          size="md"
          placeholder="search users"
          onChange={(e) => setSearchField(e.target.value)}
          value={searchField}
          variant="outline"
        />
      </HStack>
      <Flex
        mt={5}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        px={3}
      >
        <Text>{`page ${pageStat?.currentPage || "-"} of ${
          pageStat?.pages || "-"
        }`}</Text>
        <Text>{`${pageStat?.total || "-"} records found`}</Text>
      </Flex>
      <TableContainer>
        <Table>
          <TableCaption>List of Users</TableCaption>
          <Thead>
            <Tr>
              <Th>Avatar</Th>
              <Th>Name</Th>
              <Th>Username</Th>
              <Th>Serving State</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users?.length ? (
              users.map((user) => (
                <UserRow
                  onAdminPrompt={onAdminPrompt}
                  onViewProfile={onViewProfile}
                  onBlockPress={onBlockPrompt}
                  profile={user}
                  key={user.userId}
                />
              ))
            ) : (
              <StateComponent />
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal size="sm" onClose={onCloseAdminModal} isOpen={isAdminModalOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            {selectedUser?.isAdmin ? "Revoke Admin" : "Make Admin"}
          </ModalHeader>
          <ModalBody>
            <Text fontSize="xl">Are you sure?</Text>
            <HStack spacing={8} my={5}>
              <Button
                isLoading={isMakingAdmin}
                colorScheme="red"
                onClick={makeUserAdmin}
              >
                Yes
              </Button>
              <Button variant="outline" onClick={onCloseAdminModal}>
                No
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal size="sm" onClose={onCloseBlockModal} isOpen={isBlockModalOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Heading fontSize="lg">
              {`${selectedUser?.blocked ? "Unblock" : "Block"} User ⛔️`}{" "}
            </Heading>
          </ModalHeader>
          <ModalBody>
            <Text fontSize="lg">{`Are you sure you want to
             ${selectedUser?.blocked ? "Unblock" : "Block"} User`}</Text>
            <HStack spacing={5} my={5}>
              <Button
                onClick={() => blockUser()}
                isLoading={isBlocking}
                colorScheme="red"
              >
                Yes
              </Button>
              <Button variant="outline" onClick={onCloseBlockModal}>
                No
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      {selectedUser ? (
        <Modal
          size="lg"
          onClose={onCloseProfileModal}
          isOpen={isProfileModalOpen}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>
              <Heading fontSize="lg">
                {selectedUser?.loginInfo.fullname || ""}
              </Heading>
            </ModalHeader>
            <ModalBody>
              <UserProfile profile={selectedUser} />
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : null}
    </Flex>
  );
};
