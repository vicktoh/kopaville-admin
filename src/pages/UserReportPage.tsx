import React, { FC, useState } from "react";
import {
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
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { StateComponent } from "../components/StateComponent";
import { useSearchIndex } from "../hooks/useSearchIndex";
import { ReportedUser } from "../types/Report";
import { dismissUserReport } from "../services/reportServices";
import { disableUser } from "../services/userServices";
import { ReportedUserRow } from "../components/ReportedUserRow";
import { UserProfile } from "../components/UserProfile";

export const UserReportPage: FC = () => {
  const [isBlocking, setBlocking] = useState<boolean>(false);
  const [isDismissing, setDismissing] = useState<boolean>(false);
  const [searchField, setSearchField] = useState<string>("");
  const [selectedUserIndex, setSelectedUserIndex] = useState<number>();
  const [selectedUser, setSelectedUser] = useState<ReportedUser>();

  const {
    isOpen: isDismissOpen,
    onClose: onCloseDismiss,
    onOpen: openDismiss,
  } = useDisclosure();
  const {
    isOpen: isBlockModalOpen,
    onClose: onCloseBlockModal,
    onOpen: openBlockModal,
  } = useDisclosure();
  const {
    isOpen: isUserModalOpen,
    onClose: onCloseUserModal,
    onOpen: openUserModal,
  } = useDisclosure();

  const {
    data: users,
    loading,
    setData,
    setQuery,
  } = useSearchIndex<ReportedUser[]>("userReports");
  const toast = useToast();

  const onEnterQuery = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      setQuery(searchField);
    }
  };

  const onDismissPrompt = (index: number, post: ReportedUser) => {
    setSelectedUserIndex(index);
    setSelectedUser(post);
    openDismiss();
  };
  const onViewUser = (index: number, report: ReportedUser) => {
    setSelectedUserIndex(index);
    setSelectedUser(report);
    openUserModal();
  };
  const onBlockPrompt = (index: number, report: ReportedUser) => {
    setSelectedUserIndex(index);
    setSelectedUser(report);
    openBlockModal();
  };

  const blockUser = async () => {
    try {
      setBlocking(true);
      const response = await disableUser({
        userId: selectedUser?.user.userId || "",
      });
      if (response.data.status === "success") {
        toast({ title: "User has been blocked", status: "success" });
      } else {
        toast({
          title: response.data.message || "Unexpected Error",
          status: "error",
        });
      }
    } catch (error) {
      const err: any = error;
      toast({
        title: "Something went wrong",
        description: err?.message || "Unexpected error try again",
        status: "error",
      });
    } finally {
      setBlocking(false);
      onCloseBlockModal();
    }
  };
  const dismiss = async () => {
    if (!users || selectedUserIndex === undefined || !selectedUser) return;

    try {
      setDismissing(true);
      await dismissUserReport(selectedUser?.objectID);
      const newposts = [...users];
      newposts.splice(selectedUserIndex, 1);
      setData(newposts);
      toast({ title: "Report has been dismissed", status: "success" });
    } catch (error) {
      const err: any = error;
      toast({
        title: "Something went wrong",
        description: err?.message || "Unexpected error try again",
        status: "error",
      });
    } finally {
      setDismissing(false);
      onCloseDismiss();
    }
  };

  if (loading) {
    return <StateComponent loading={true} loadingText="fetching reports" />;
  }
  return (
    <Flex
      direction="column"
      position="relative"
      width="100%"
      height="100vh"
      overflow="scroll"
      px={5}
    >
      <Heading mt={5} ml={3} fontSize="xl">
        Reported Users
      </Heading>
      <HStack spacing={1} px={3} py={5}>
        <Icon as={BsSearch} fontSize="lg" />
        <Input
          onKeyUp={onEnterQuery}
          size="md"
          placeholder="search posts, reasons or usernames"
          onChange={(e) => setSearchField(e.target.value)}
          value={searchField}
          variant="outline"
        />
      </HStack>
      {/* Main content */}

      <Flex px={10} pl={10} direction="column">
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>User</Th>
                <Th>Reason for Report</Th>
                <Th>Reported by</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users?.length ? (
                users.map((report, i) => (
                  <ReportedUserRow
                    report={report}
                    onBlockUser={() => onBlockPrompt(i, report)}
                    onDismissReport={() => onDismissPrompt(i, report)}
                    onViewUser={() => onViewUser(i, report)}
                    key={`user-report-${i}`}
                  />
                ))
              ) : (
                <StateComponent description="There are no reported Users" />
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>

      {/* Dismiss Modal */}
      <Modal isOpen={isDismissOpen} onClose={onCloseDismiss}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Dismiss Report</ModalHeader>
          <ModalBody>
            <Text py={10}>Are you sure you want to dismiss this report</Text>
            <HStack spacing={10} alignItems="center" mt={3}>
              <Button
                colorScheme="red"
                onClick={dismiss}
                isLoading={isDismissing}
              >
                Yes
              </Button>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={onCloseDismiss}
                disabled={isDismissing}
              >
                No
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Enddelete modal */}
      {/* Block Modal */}
      <Modal isOpen={isBlockModalOpen} onClose={onCloseBlockModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Block User </ModalHeader>
          <ModalBody>
            <Text py={10}>
              {`Are you sure you want to block ${selectedUser?.user.loginInfo.username}`}
            </Text>
            <HStack spacing={10} alignItems="center" mt={3}>
              <Button
                colorScheme="red"
                onClick={blockUser}
                isLoading={isBlocking}
              >
                Yes
              </Button>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={onCloseBlockModal}
                disabled={isBlocking}
              >
                No
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* End Block modal */}
      {/* Post Modal */}
      {selectedUser ? (
        <Modal isOpen={isUserModalOpen} onClose={onCloseUserModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>User Details</ModalHeader>
            <ModalBody>
              <UserProfile profile={selectedUser.user} />
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : null}
      {/* End Post modal */}
    </Flex>
  );
};
