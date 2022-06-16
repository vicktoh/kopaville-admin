import React, { FC, useEffect, useState } from "react";
import {
  Avatar,
  Flex,
  Icon,
  IconButton,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { BsTrash } from "react-icons/bs";
import { deleteComment, listenOnComment } from "../services/commentServices";
import { Comment, Post } from "../types/Post";
import { StateComponent } from "./StateComponent";

type CommentSideBarProps = {
  post: Post;
};
type UserCommentProps = {
  comment: Comment;
};
const UserComment: FC<UserCommentProps> = ({ comment }) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const toast = useToast();
  const deleteUserComment = async () => {
    try {
      setIsDeleting(true);
      await deleteComment(comment.id || comment.objectID);
    } catch (error) {
      const err: any = error;
      toast({
        title: "Could not delete comment",
        description: err?.message || "Unknown error ",
        status: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Flex direction="row" width="100%" alignItems="center">
      <Avatar src={comment.photoUrl} size="md" name={comment.fullname} />
      <VStack spacing={1} alignItems="flex-start" ml={2}>
        <Text fontSize="md" fontWeight="bold">
          {comment.username}
        </Text>
        <Text>{comment.comment}</Text>
      </VStack>
      <IconButton
        onClick={deleteUserComment}
        isLoading={isDeleting}
        ml="auto"
        icon={<Icon as={BsTrash} />}
        aria-label="trash button"
      />
    </Flex>
  );
};
export const CommentSideBar: FC<CommentSideBarProps> = ({ post }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<Comment[]>();

  useEffect(() => {
    const unsub = listenOnComment(post.postId || post.objectID, (data) => {
      setLoading(false);
      setComments(data);
    });

    return unsub;
  }, []);
  if (loading) {
    return <StateComponent loading={true} loadingText="fetching comments" />;
  }
  return (
    <Flex direction="column">
      {comments?.length ? (
        comments.map((comment, i) => (
          <UserComment key={`comments-${i}`} comment={comment} />
        ))
      ) : (
        <StateComponent description="There are no comments for this post" />
      )}
    </Flex>
  );
};
