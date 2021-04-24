import {
  Flex,
  Button,
  Box,
  Heading,
  Text,
  Link,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  AddIcon,
  ArrowForwardIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';
import {
  useMeQuery,
  useLogoutMutation,
  MeQuery,
  MeDocument,
} from '../generated/graphql';
import NextLink from 'next/link';
import { isServer } from '../utils/isServer';
import { AiOutlineUser } from 'react-icons/ai';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';

export const Header: React.FC = () => {
  const { data, loading } = useMeQuery({ skip: isServer() });
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const apolloClient = useApolloClient();

  const router = useRouter();
  // const apolloClient = useApolloClient();
  // const { me } = apolloClient.readQuery({
  //   query: MeDocument,
  // });

  let body = null;
  if (loading) {
    body = <Text>Loading...</Text>;
  } else if (!data?.me) {
    body = (
      <>
        <Box display={{ base: 'none', lg: 'block' }}>
          <Flex justify="center" align="center">
            <NextLink href="/login">
              <Button variant="outline" colorScheme="teal" mr="2" as={Link}>
                login
              </Button>
            </NextLink>
            <NextLink href="/register">
              <Button variant="solid" colorScheme="teal" as={Link}>
                register
              </Button>
            </NextLink>
          </Flex>
        </Box>
        <Box display={{ base: 'block', lg: 'none' }}>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              size="md"
              variant="outline"
            />
            <MenuList>
              <NextLink href="/login">
                <MenuItem icon={<ArrowForwardIcon />}>Login</MenuItem>
              </NextLink>
              <NextLink href="/register">
                <MenuItem icon={<AddIcon />}>Register</MenuItem>
              </NextLink>
            </MenuList>
          </Menu>
        </Box>
      </>
    );
  } else {
    body = (
      <>
        <Box display={{ base: 'none', lg: 'block' }}>
          <Flex justify="center" align="center">
            <Text fontSize="xl" mr="2">
              {data.me.username}
            </Text>
            <IconButton
              mr="4"
              colorScheme="teal"
              aria-label="user icon"
              fontSize="21px"
              icon={<AiOutlineUser />}
              onClick={() => {
                router.push('/userProfile');
              }}
            />
            <Button
              variant="outline"
              colorScheme="teal"
              isLoading={logoutLoading}
              onClick={async () => {
                await logout();
                await apolloClient.resetStore();
              }}
            >
              logout
            </Button>
          </Flex>
        </Box>
        <Box display={{ base: 'block', lg: 'none' }}>
          <Flex justify="center" align="center">
            <Text fontSize="xl" mr="4">
              {data.me.username}
            </Text>
            <IconButton
              aria-label="logout button"
              size="sm"
              icon={<ExternalLinkIcon />}
              isLoading={logoutLoading}
              onClick={async () => {
                await logout();
                await apolloClient.resetStore();
              }}
            />
          </Flex>
        </Box>
      </>
    );
  }

  return (
    <Box
      position="sticky"
      top="0"
      w="full"
      py="4"
      px={{ base: 2, md: 4 }}
      mb="4"
      borderTopWidth="thick"
      borderTopColor="teal.500"
      borderBottomWidth="thin"
      borderBottomStyle="ridge"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        maxW="4xl"
        mx="auto"
        px={{ base: 2, sm: 4, md: 0 }}
      >
        <Heading size="lg">Library Net</Heading>
        <Box>{body}</Box>
      </Flex>
    </Box>
  );
};
