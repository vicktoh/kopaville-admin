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
import { Report } from "../types/Report";
import { ReportRow } from "../components/ReportRow";
import { deleteUserPost } from "../services/postServices";
import { dismissReport } from "../services/reportServices";
import { disableUser } from "../services/userServices";
import { PostComponent } from "../components/PostComponent";

export const PostReportPage: FC = () => {
  const [isDeleting, setDeleting] = useState<boolean>(false);
  const [isBlocking, setBlocking] = useState<boolean>(false);
  const [isDismissing, setDismissing] = useState<boolean>(false);
  const [searchField, setSearchField] = useState<string>("");
  const [selectedPostIndex, setSelectedPostIndex] = useState<number>();
  const [selectedPost, setSelectedPost] = useState<Report>();
  const {
    isOpen: isDeleteModalOpen,
    onClose: onCloseDeleteModal,
    onOpen: openDeleteModal,
  } = useDisclosure();
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
    isOpen: isPostModalOpen,
    onClose: onClosePostModal,
    onOpen: openPostModal,
  } = useDisclosure();

  const {
    data: posts,
    loading,
    setData,
    setQuery,
  } = useSearchIndex<Report[]>("reports");
  const toast = useToast();

  const onEnterQuery = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      setQuery(searchField);
    }
  };
  const onDeletePrompt = (index: number, post: Report) => {
    setSelectedPostIndex(index);
    setSelectedPost(post);
    openDeleteModal();
  };
  const onDismissPrompt = (index: number, post: Report) => {
    setSelectedPostIndex(index);
    setSelectedPost(post);
    openDismiss();
  };
  const onViewPost = (index: number, post: Report) => {
    setSelectedPostIndex(index);
    setSelectedPost(post);
    openPostModal();
  };
  const onBlockPrompt = (index: number, post: Report) => {
    setSelectedPostIndex(index);
    setSelectedPost(post);
    openBlockModal();
  };

  const removePost = async () => {
    if (!posts || selectedPostIndex === undefined || !selectedPost) return;
    try {
      setDeleting(true);
      await deleteUserPost(selectedPost.post.postId || "");
      await dismissReport(selectedPost.objectID);
      const newposts = [...posts];
      newposts.splice(selectedPostIndex, 1);
      setData(newposts);
      toast({
        title: "Successfully Removed Post",
        status: "success",
      });
    } catch (error) {
      console.log(error);
      const err: any = error;
      toast({
        title: "Could not delete post",
        description: err?.message || "Could not remove post",
        status: "error",
      });
    } finally {
      setDeleting(false);
      onCloseDeleteModal();
    }
  };
  const blockUser = async () => {
    try {
      setBlocking(true);
      const response = await disableUser({
        userId: selectedPost?.post.creatorId || "",
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
    if (!posts || selectedPostIndex === undefined || !selectedPost) return;

    try {
      setDismissing(true);
      await dismissReport(selectedPost?.objectID);
      const newposts = [...posts];
      newposts.splice(selectedPostIndex, 1);
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
        Reported Posts
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
                <Th>Post by</Th>
                <Th>Reason for Report</Th>
                <Th>Reported by</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {posts?.length ? (
                posts.map((report, i) => (
                  <ReportRow
                    onBlockUser={() => onBlockPrompt(i, report)}
                    onViewPost={() => onViewPost(i, report)}
                    onDismissReport={() => onDismissPrompt(i, report)}
                    onDeletePost={() => onDeletePrompt(i, report)}
                    report={report}
                    key={`report-${i}`}
                  />
                ))
              ) : (
                <StateComponent description="There are no jobs" />
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Remove Post ?</ModalHeader>
          <ModalBody p={5}>
            <Text>
              Are you sure you want delete the post associated with this report?
              Report will be be dismissed as well
            </Text>
            <HStack spacing={10} alignItems="center" mt={5}>
              <Button
                colorScheme="red"
                onClick={removePost}
                isLoading={isDeleting}
              >
                Yes
              </Button>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={onCloseDeleteModal}
                disabled={isDeleting}
              >
                No
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Enddelete modal */}
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
              {`Are you sure you want to block ${selectedPost?.post.avartar.username}`}
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
                disabled={isDeleting}
              >
                No
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* End Block modal */}
      {/* Post Modal */}
      {selectedPost ? (
        <Modal isOpen={isPostModalOpen} onClose={onClosePostModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>Post</ModalHeader>
            <ModalBody>
              <PostComponent
                post={selectedPost?.post}
                onDelete={() => null}
                onBlock={() => null}
                commentsPrompt={() => null}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : null}
      {/* End Post modal */}
    </Flex>
  );
};
