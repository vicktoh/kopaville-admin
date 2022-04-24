import React, { FC } from 'react';
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
} from '@chakra-ui/react';
import { Post } from '../types/Post';
import {
    
    BsChatDots,
    BsStopCircle,
    BsThreeDotsVertical,
    BsTrash,
} from 'react-icons/bs';

type PostCommentType = {
    post: Post;
};

const ImageScroller: FC<{ images: string[] }> = ({ images }) => {
    return (
        <Flex
            width="100%"
            position="relative"
            overflowX="scroll"
        >
            <Flex direction="row">
                {images.map((imageUrl) => (
                    <Image src={imageUrl} />
                ))}
            </Flex>
        </Flex>
    );
};

export const PostComponent: FC<PostCommentType> = ({
    post: { avartar, imageUrl, videoUrl, text, dateCreated },
}) => {
    return (
        <Flex width="100%" direction="column" mb={3} borderBottomWidth={1} >
            <Flex
                direction="row"
                alignItems="center"
                justifyContent={'space-between'}
                my={1}
            >
                <HStack spacing={3}>
                    <Avatar
                        size="md"
                        src={avartar?.photoUrl}
                        name={avartar?.username}
                    />
                    <Heading fontSize="sm">{avartar?.username}</Heading>
                </HStack>
                <Text fontSize="sm" color="brand.300">
                    {dateCreated.toDate().toDateString()}
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
                        <MenuItem  >
                           <HStack>
                           <BsTrash />
                           <Text>Delete</Text>
                           </HStack>
                        </MenuItem>
                        <MenuItem >
                            <HStack>
                              <BsChatDots />
                               <Text>Comments</Text>
                            </HStack>
                        </MenuItem>
                        <MenuItem >
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
