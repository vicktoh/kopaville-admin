import { FC } from 'react';
import {
    Avatar,
    Flex,
    Heading,
    HStack,
    VStack,
    Text,
    Button,
} from '@chakra-ui/react';
import { useAppSelector } from '../reducers/types';
import { BsChatSquare, BsClockHistory, BsCartCheck } from 'react-icons/bs';
import { MdSecurity } from 'react-icons/md';
import { Link, useMatch } from 'react-router-dom';

export const SideNav: FC = () => {
    const auth = useAppSelector(({ auth }) => auth);

    return (
        <Flex direction="column" px={10} height="100vh" bg="brand.200" pb={5}>
            <Heading fontSize="lg" my={3}>
                Welcome Admin
            </Heading>

            <HStack spacing={2} mt={4} mb={10}>
                <Avatar
                    name={auth?.displayName}
                    src={auth?.photoUrl}
                    size="lg"
                />
                <VStack spacing={1}>
                    <Text fontWeight="bold">{auth?.displayName}</Text>
                    <Text fontSize="xs">{`last seen: ${auth?.lastSeen}`}</Text>
                </VStack>
            </HStack>

            <VStack spacing={8} mt={14} alignItems="flex-start" px={5}>
                <Button
                    color={!!useMatch('/dashboard') ? 'brand.500' : 'black'}
                    fontWeight="normal"
                    size="md"
                    as={Link}
                    to="/dashboard"
                    leftIcon={<BsChatSquare />}
                    variant="ghost"
                >
                    {' '}
                    Post
                </Button>
                <Button
                    color={!!useMatch('/users') ? 'brand.500' : 'black'}
                    fontWeight="normal"
                    size="md"
                    as={Link}
                    to="/users"
                    leftIcon={<MdSecurity />}
                    variant="ghost"
                >
                    {' '}
                    Admin Users
                </Button>
                <Button
                    color={!!useMatch('/historyville') ? 'brand.500' : 'black'}
                    fontWeight="normal"
                    size="md"
                    as={Link}
                    to="/historyville"
                    leftIcon={<BsClockHistory />}
                    variant="ghost"
                >
                    {' '}
                    HistoryVille
                </Button>
                <Button
                    color={!!useMatch('/market') ? 'brand.500' : 'black'}
                    fontWeight="normal"
                    size="md"
                    as={Link}
                    to="/market"
                    leftIcon={<BsCartCheck />}
                    variant="ghost"
                >
                    {' '}
                    Kopaville Market
                </Button>
            </VStack>
            <Button variant="solid" colorScheme="brand" mt="auto" mb={5}>
                Logout
            </Button>
        </Flex>
    );
};
