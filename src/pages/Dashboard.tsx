import React, { FC, useState } from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
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
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { PostComponent } from "../components/PostComponent";
import { StateComponent } from "../components/StateComponent";
import { useSearchIndex } from "../hooks/useSearchIndex";
import { Post } from "../types/Post";
import { deleteUserPost } from "../services/postServices";
import { disableUser } from "../services/userServices";
import { CommentSideBar } from "../components/CommentSideBar";

export const Dashboard: FC = () => {
  const [isDeleting, setDeleting] = useState<boolean>(false);
  const [isBlocking, setBlocking] = useState<boolean>(false);
  const [searchField, setSearchField] = useState<string>("");
  const [selectedPostIndex, setSelectedIndex] = useState<number>();
  const [selectedPost, setSelectedPost] = useState<Post>();
  const {
    isOpen: isDeleteModalOpen,
    onClose: onCloseDeleteModal,
    onOpen: openDeleteModal,
  } = useDisclosure();
  const {
    isOpen: isBlockModalOpen,
    onClose: onCloseBlockModal,
    onOpen: openBlockModal,
  } = useDisclosure();
  const {
    isOpen: isCommentDrawerOpen,
    onClose: onCloseCommentDrawer,
    onOpen: openCommentDrawer,
  } = useDisclosure();
  const {
    data: posts,
    loading,
    setData,
    setQuery,
  } = useSearchIndex<Post[]>("posts");
  const toast = useToast();

  const onEnterQuery = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      setQuery(searchField);
    }
  };
  const onDeletePrompt = (index: number, post: Post) => {
    setSelectedIndex(index);
    setSelectedPost(post);
    openDeleteModal();
  };
  const deletePost = async () => {
    if (!posts || selectedPostIndex === undefined || !selectedPost) return;
    try {
      setDeleting(true);
      await deleteUserPost(selectedPost.objectID);
      const newposts = [...posts];
      newposts.splice(selectedPostIndex, 1);
      setData(newposts);
      toast({ title: "Post has been successfully removed", status: "success" });
    } catch (error) {
      console.log(error);
      const err: any = error;
      toast({
        title: "Could not delete post",
        description: err?.message || "Could not remove user post",
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
        userId: selectedPost?.creatorId || "",
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
  const blockPrompt = (post: Post, i: number) => {
    setSelectedIndex(i);
    setSelectedPost(post);
    openBlockModal();
  };
  const commentPrompt = (post: Post) => {
    setSelectedPost(post);
    openCommentDrawer();
  };

  if (loading) {
    return <StateComponent loading={true} loadingText="fetching posts" />;
  }
  return (
    <Flex
      direction="column"
      position="relative"
      width="100%"
      height="100vh"
      overflow="scroll"
    >
      {/* Header */}
      <Flex
        width="100%"
        position="sticky"
        top={0}
        bg="secondary.300"
        py={5}
        px={3}
        zIndex={5}
      >
        <Heading fontSize="md">Posts Moderation</Heading>
      </Flex>
      <Heading fontSize="sm">Search User</Heading>
      <HStack spacing={1} px={3} py={5}>
        <Icon as={BsSearch} fontSize="lg" />
        <Input
          onKeyUp={onEnterQuery}
          size="md"
          placeholder="search posts, by usern, content, etc"
          onChange={(e) => setSearchField(e.target.value)}
          value={searchField}
          variant="outline"
        />
      </HStack>
      {/* Main content */}
      <Flex px={20} pl={10} direction="column">
        {posts?.length ? (
          posts.map((post, i) => (
            <PostComponent
              onDelete={() => onDeletePrompt(i, post)}
              post={post}
              key={`post-component-${i}`}
              onBlock={() => blockPrompt(post, i)}
              commentsPrompt={() => commentPrompt(post)}
            />
          ))
        ) : (
          <StateComponent description="There are no posts" />
        )}
      </Flex>
      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Remove Post ?</ModalHeader>
          <ModalBody>
            <Text py={10}>Are you sure you want to remove this post</Text>
            <HStack spacing={10} alignItems="center" mt={3}>
              <Button
                colorScheme="red"
                onClick={deletePost}
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
      {/* Block Modal */}
      <Modal isOpen={isBlockModalOpen} onClose={onCloseBlockModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Block User ?</ModalHeader>
          <ModalBody p={5}>
            <Text py={10}>
              {`Are you sure you want block the user: ${selectedPost?.avartar?.username}`}{" "}
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
      {isCommentDrawerOpen && selectedPost ? (
        <Drawer isOpen={isCommentDrawerOpen} onClose={onCloseCommentDrawer}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>
              {`Comments for post by ${selectedPost?.avartar.username}`}
            </DrawerHeader>
            <DrawerBody>
              <CommentSideBar post={selectedPost} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : null}
    </Flex>
  );
};
