import {
  Container,
  Flex,
  Heading,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { PostComponent } from "../components/PostComponent";
import { listenOnPost } from "../services/postServices";
import { Post } from "../types/Post";

export const Dashboard: FC = () => {
  const [posts, setPosts] = useState<Post[]>();
  const [loadingPost, setLoadingPosts] = useState<boolean>();
  const toast = useToast();
  useEffect(() => {
    function observePosts() {
      try {
        setLoadingPosts(true);
        return listenOnPost((data) => {
          setLoadingPosts(false);
          setPosts(data);
        });
      } catch (error) {
        const err: any = error;
        toast({
          title: "Could not fetch Posts",
          description: err?.message || "Unknown Error",
        });
      }
    }
    const unsub = observePosts();
    return () => unsub && unsub();
  }, []);
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
      {/* Main content */}
      <Flex px={20} pl={10} direction="column">
        {loadingPost && !posts ? (
          <Container size="lg" centerContent h="2xl">
            <Spinner />
          </Container>
        ) : posts?.length ? (
          posts.map((post, i) => (
            <PostComponent post={post} key={`post-component-${i}`} />
          ))
        ) : (
          <Flex
            direction="column"
            width="100%"
            h="2xl"
            justifyContent="center"
            alignItems="center"
          >
            <Text>There are no Posts yet</Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
