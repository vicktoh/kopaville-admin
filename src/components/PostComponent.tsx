import React, { FC } from "react";
import {
  AspectRatio,
  Avatar,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Post } from "../types/Post";
import {
  BsChatDots,
  BsStopCircle,
  BsThreeDotsVertical,
  BsTrash,
} from "react-icons/bs";

type PostCommentType = {
  post: Post;
  onDelete: () => void;
  onBlock: () => void;
  commentsPrompt: () => void;
};

const ImageScroller: FC<{ images: string[] }> = ({ images }) => {
  return (
    <Flex width="100%" position="relative" overflowX="scroll">
      <Flex direction="row">
        {images.map((imageUrl, i) => (
          <Image src={imageUrl} key={`image-${i}`} />
        ))}
      </Flex>
    </Flex>
  );
};

export const PostComponent: FC<PostCommentType> = ({
  post: { avartar, imageUrl, videoUrl, text, dateCreated },
  onDelete,
  onBlock,
  commentsPrompt,
}) => {
  return (
    <Flex width="100%" direction="column" mb={3} borderBottomWidth={1}>
      <Flex
        direction="row"
        alignItems="center"
        justifyContent={"space-between"}
        my={1}
      >
        <HStack spacing={3}>
          <Avatar size="md" src={avartar?.photoUrl} name={avartar?.username} />
          <Heading fontSize="sm">{avartar?.username}</Heading>
        </HStack>
        <Text fontSize="sm" color="brand.300">
          {new Date(dateCreated as number).toLocaleDateString()}
        </Text>
      </Flex>
      {imageUrl?.length ? <ImageScroller images={imageUrl} /> : null}
      {videoUrl ? (
        <AspectRatio ratio={4 / 5} maxWidth="100%">
          <video controls>
            <source src={videoUrl} />
          </video>
        </AspectRatio>
      ) : null}
      <Flex width="100%" my={1} py={2}>
        {text ? <Text> {text}</Text> : null}
        <Menu>
          <MenuButton
            marginLeft="auto"
            as={IconButton}
            aria-label=""
            icon={<BsThreeDotsVertical />}
          />
          <MenuList>
            <MenuItem onClick={onDelete}>
              <HStack>
                <BsTrash />
                <Text>Delete</Text>
              </HStack>
            </MenuItem>
            <MenuItem onClick={commentsPrompt}>
              <HStack>
                <BsChatDots />
                <Text>Comments</Text>
              </HStack>
            </MenuItem>
            <MenuItem onClick={onBlock}>
              <HStack>
                <BsStopCircle />
                <Text>Block User</Text>
              </HStack>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};
